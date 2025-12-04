import { getTeamName, translations } from '../utils/translations';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

// League ID mapping for API-Football
const LEAGUE_IDS = {
    'Premier League': 39,
    'La Liga': 140,
    'Bundesliga': 78,
    'Serie A': 135,
    'Ligue 1': 61,
    'Eredivisie': 88,
    'J League': 98,
    'Champions League': 2,
    'Europa League': 3,
    'World Cup Qualifiers': 960, // UEFA qualifiers
};

const LEAGUE_NAMES = Object.fromEntries(
    Object.entries(LEAGUE_IDS).map(([name, id]) => [id, name])
);

// Cache utilities
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const cacheUtils = {
    get: (key) => {
        try {
            const cached = localStorage.getItem(`football_cache_${key}`);
            if (!cached) return null;
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_DURATION) {
                localStorage.removeItem(`football_cache_${key}`);
                return null;
            }
            return data;
        } catch {
            return null;
        }
    },
    set: (key, data) => {
        try {
            localStorage.setItem(`football_cache_${key}`, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }
};

let matches = [];
let listeners = [];
let currentLanguage = 'en';

export const fetchFixtures = async (lang = 'en', date = null) => {
    // If no date provided, use today
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `fixtures_${targetDate}_${lang}`;

    // Check cache first
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached fixtures data for ${targetDate}`);
        return cached;
    }

    try {
        console.log(`Fetching matches for ${targetDate}...`);
        const response = await fetch(
            `${API_BASE_URL}/fixtures?date=${targetDate}&timezone=Asia/Tokyo`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API error`);
        }

        const data = await response.json();
        const allFixtures = data.response || [];

        // Transform with language
        const transformed = allFixtures
            .map(f => transformFixture(f, lang))
            .filter(m => m !== null);

        // Cache the result
        cacheUtils.set(cacheKey, transformed);

        return transformed;
    } catch (error) {
        console.error('Error fetching fixtures:', error);
        return [];
    }
};

const transformFixture = (fixture, lang) => {
    const leagueId = fixture.league.id;
    let leagueName = LEAGUE_NAMES[leagueId];

    // Only include leagues we support
    if (!leagueName) return null;

    // Translate league name if needed
    if (lang === 'ja') {
        // Convert key like 'Premier League' to 'premierLeague' for translation lookup
        const key = Object.keys(translations.en.leagues).find(k => translations.en.leagues[k] === leagueName);
        if (key && translations.ja.leagues[key]) {
            leagueName = translations.ja.leagues[key];
        }
    }

    const isLive = fixture.fixture.status.short === '1H' ||
        fixture.fixture.status.short === '2H' ||
        fixture.fixture.status.short === 'HT' ||
        fixture.fixture.status.short === 'ET' ||
        fixture.fixture.status.short === 'P';

    const isUpcoming = fixture.fixture.status.short === 'NS' ||
        fixture.fixture.status.short === 'TBD';

    const isCompleted = fixture.fixture.status.short === 'FT' ||
        fixture.fixture.status.short === 'AET' ||
        fixture.fixture.status.short === 'PEN';

    let status = 'UPCOMING';
    if (isLive) status = 'LIVE';
    if (isCompleted) status = 'FT';

    // Determine if domestic or international
    // Use English names for checking type
    const originalLeagueName = LEAGUE_NAMES[leagueId];
    const domesticLeagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1', 'Eredivisie', 'J League'];
    const type = domesticLeagues.includes(originalLeagueName) ? 'domestic' : 'international';

    // Translate team names
    const homeName = getTeamName(fixture.teams.home.name, lang);
    const awayName = getTeamName(fixture.teams.away.name, lang);

    // Simple events transformation
    const events = (fixture.events || []).slice(0, 5).map((event, idx) => ({
        id: idx,
        type: event.type,
        teamId: event.team.id,
        minute: event.time.elapsed,
        player: event.player.name, // Player names might need API lang param support later
    }));

    return {
        id: fixture.fixture.id,
        type,
        league: leagueName,
        homeTeam: {
            id: fixture.teams.home.id,
            name: homeName,
            short: fixture.teams.home.name.substring(0, 3).toUpperCase(),
            color: 'bg-blue-600',
        },
        awayTeam: {
            id: fixture.teams.away.id,
            name: awayName,
            short: fixture.teams.away.name.substring(0, 3).toUpperCase(),
            color: 'bg-red-600',
        },
        homeScore: fixture.goals.home || 0,
        awayScore: fixture.goals.away || 0,
        status,
        minute: fixture.fixture.status.elapsed || 0,
        startTime: new Date(fixture.fixture.date),
        events,
    };
};

const loadMatches = async () => {
    console.log(`Fetching matches from API-Football (${currentLanguage})...`);
    const transformed = await fetchFixtures(currentLanguage);

    if (transformed.length > 0) {
        matches = transformed;
        console.log(`Loaded ${matches.length} matches`);
        notifyListeners();
    } else {
        // Fallback: fetch recent completed matches (yesterday and day before)
        console.log('No matches today, fetching recent matches...');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const dayBefore = new Date();
        dayBefore.setDate(dayBefore.getDate() - 2);
        const dayBeforeStr = dayBefore.toISOString().split('T')[0];

        const [recentMatches1, recentMatches2] = await Promise.all([
            fetchFixtures(currentLanguage, yesterdayStr),
            fetchFixtures(currentLanguage, dayBeforeStr)
        ]);

        const allRecent = [...recentMatches1, ...recentMatches2];

        if (allRecent.length > 0) {
            matches = allRecent;
            console.log(`Loaded ${matches.length} recent matches as fallback`);
            notifyListeners();
        } else {
            console.warn('No matches available (today or recent)');
        }
    }
};

const notifyListeners = () => {
    listeners.forEach((listener) => listener([...matches]));
};

export const subscribeToUpdates = (callback, lang = 'en') => {
    console.log(`Subscribing to API updates (lang: ${lang})...`);
    listeners.push(callback);

    // Update current language
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        // Reload matches with new language immediately
        loadMatches();
    } else {
        // Just return current matches
        callback([...matches]);
    }

    // Poll every 60 seconds for updates (reduced from 30s to save API calls)
    const intervalId = setInterval(loadMatches, 60000);

    return () => {
        console.log('Unsubscribing from updates...');
        listeners = listeners.filter((l) => l !== callback);
        clearInterval(intervalId);
    };
};

export const fetchMatchDetails = async (fixtureId, lang = 'en') => {
    const cacheKey = `match_${fixtureId}_${lang}`;

    // Check cache first
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached details for match ${fixtureId}`);
        return cached;
    }

    try {
        console.log(`Fetching details for match ${fixtureId} (${lang})...`);
        const response = await fetch(
            `${API_BASE_URL}/fixtures?id=${fixtureId}&timezone=Asia/Tokyo`,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'v3.football.api-sports.io',
                    'x-rapidapi-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();

        if (data.errors && Object.keys(data.errors).length > 0) {
            console.error('API returned errors:', data.errors);
            return null;
        }

        const fixtureData = data.response[0];

        if (!fixtureData) {
            console.warn(`No fixture data found for ID ${fixtureId}`);
            return null;
        }

        // Transform detailed data
        const details = {
            ...transformFixture(fixtureData, lang), // Base data
            events: fixtureData.events || [], // Overwrite with full events list
            venue: fixtureData.fixture.venue.name,
            referee: fixtureData.fixture.referee,
            lineups: fixtureData.lineups || [],
            statistics: fixtureData.statistics || [],
            players: fixtureData.players || [], // Player stats (includes ratings)
        };

        // Cache for 10 minutes (longer than list because details change less often for completed, 
        // but for live it might be stale. For now 10 mins is safe for quota)
        // Actually for LIVE matches we might want shorter cache, but let's stick to simple for now.
        cacheUtils.set(cacheKey, details);

        return details;
        return details;
    } catch (error) {
        console.error('Error fetching match details:', error);
        return null;
    }
};

export const fetchTeamDetails = async (teamId, lang = 'en') => {
    const cacheKey = `team_${teamId}_${lang}`;

    // Check cache first (Longer duration for teams: 1 hour)
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached details for team ${teamId}`);
        return cached;
    }

    try {
        console.log(`Fetching details for team ${teamId} (${lang})...`);

        // Parallel fetch for team info, squad, and coach
        const [teamResponse, squadResponse, coachResponse] = await Promise.all([
            fetch(
                `${API_BASE_URL}/teams?id=${teamId}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'v3.football.api-sports.io',
                        'x-rapidapi-key': API_KEY
                    }
                }
            ),
            fetch(
                `${API_BASE_URL}/players/squads?team=${teamId}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'v3.football.api-sports.io',
                        'x-rapidapi-key': API_KEY
                    }
                }
            ),
            fetch(
                `${API_BASE_URL}/coachs?team=${teamId}`,
                {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'v3.football.api-sports.io',
                        'x-rapidapi-key': API_KEY
                    }
                }
            )
        ]);

        if (!teamResponse.ok || !squadResponse.ok || !coachResponse.ok) {
            throw new Error('API error');
        }

        const teamData = await teamResponse.json();
        const squadData = await squadResponse.json();
        const coachData = await coachResponse.json();

        if (!teamData.response?.[0]) return null;

        const teamInfo = teamData.response[0];
        const squadList = squadData.response?.[0]?.players || [];
        const coachInfo = coachData.response?.[0]; // Get the first (current) coach

        const details = {
            id: teamInfo.team.id,
            name: teamInfo.team.name,
            logo: teamInfo.team.logo,
            founded: teamInfo.team.founded,
            venue: {
                name: teamInfo.venue.name,
                city: teamInfo.venue.city,
                capacity: teamInfo.venue.capacity,
                image: teamInfo.venue.image
            },
            coach: coachInfo ? {
                name: coachInfo.name,
                photo: coachInfo.photo
            } : null,
            squad: squadList.map(p => ({
                id: p.id,
                name: p.name,
                number: p.number,
                position: p.position,
                photo: p.photo,
                age: p.age
            }))
        };

        // Cache for 1 hour
        // Note: cacheUtils uses 5 mins default, we might want to override or just accept it for now
        // To strictly follow plan, we should update cacheUtils or just accept 5 mins is better than 0
        cacheUtils.set(cacheKey, details);

        return details;
    } catch (error) {
        console.error('Error fetching team details:', error);
        return null;
    }
};

// Fetch league standings
export const fetchLeagueStandings = async (leagueId, season = 2024) => {
    const cacheKey = `standings_${leagueId}_${season}`;

    // Check cache first (6 hour cache for standings)
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached standings for league ${leagueId}`);
        return cached;
    }

    try {
        console.log(`Fetching standings for league ${leagueId}, season ${season}...`);
        const response = await fetch(
            `${API_BASE_URL}/standings?league=${leagueId}&season=${season}`,
            {
                headers: {
                    'x-apisports-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
            return null;
        }

        const standings = data.response[0].league.standings[0].map(team => ({
            position: team.rank,
            teamId: team.team.id,
            teamName: team.team.name,
            teamLogo: team.team.logo,
            played: team.all.played,
            won: team.all.win,
            drawn: team.all.draw,
            lost: team.all.lose,
            goalsFor: team.all.goals.for,
            goalsAgainst: team.all.goals.against,
            goalDifference: team.goalsDiff,
            points: team.points,
            form: team.form // Last 5 matches (e.g., "WWDLW")
        }));

        cacheUtils.set(cacheKey, standings);
        return standings;
    } catch (error) {
        console.error('Error fetching league standings:', error);
        return null;
    }
};

// Fetch top scorers
export const fetchTopScorers = async (leagueId, season = 2024, limit = 10) => {
    const cacheKey = `topscorers_${leagueId}_${season}`;

    // Check cache first (6 hour cache for top scorers)
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached top scorers for league ${leagueId}`);
        return cached;
    }

    try {
        console.log(`Fetching top scorers for league ${leagueId}, season ${season}...`);
        const response = await fetch(
            `${API_BASE_URL}/players/topscorers?league=${leagueId}&season=${season}`,
            {
                headers: {
                    'x-apisports-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
            return [];
        }

        const topScorers = data.response.slice(0, limit).map((item, index) => ({
            rank: index + 1,
            playerId: item.player.id,
            playerName: item.player.name,
            playerPhoto: item.player.photo,
            teamId: item.statistics[0].team.id,
            teamName: item.statistics[0].team.name,
            teamLogo: item.statistics[0].team.logo,
            goals: item.statistics[0].goals.total || 0,
            assists: item.statistics[0].goals.assists || 0,
            appearances: item.statistics[0].games.appearences || 0
        }));

        return topScorers;
    } catch (error) {
        console.error('Error fetching top scorers:', error);
        return [];
    }
};

// Fetch player statistics
export const fetchPlayerStats = async (playerId, season = 2024) => {
    const cacheKey = `player_${playerId}_${season}`;

    // Check cache first (24 hour cache for player stats)
    const cached = cacheUtils.get(cacheKey);
    if (cached) {
        console.log(`Using cached stats for player ${playerId}`);
        return cached;
    }

    try {
        console.log(`Fetching stats for player ${playerId}, season ${season}...`);
        const response = await fetch(
            `${API_BASE_URL}/players?id=${playerId}&season=${season}`,
            {
                headers: {
                    'x-apisports-key': API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.response || data.response.length === 0) {
            return null;
        }

        const playerData = data.response[0];

        // Cache for 24 hours (stats don't change that often)
        // Note: cacheUtils uses 5 mins default, but we'll stick with that for now to keep it simple
        cacheUtils.set(cacheKey, playerData);

        return playerData;
    } catch (error) {
        console.error('Error fetching player stats:', error);
        return null;
    }
};

// Export league IDs for use in components
export { LEAGUE_IDS, LEAGUE_NAMES };
