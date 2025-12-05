import { getTeamName, translations } from '../utils/translations';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

// Active leagues (visible to users) - to reduce API usage
const ACTIVE_LEAGUE_IDS = {
    'Premier League': 39,
    'La Liga': 140,
    'J League': 98,
};

// All leagues (kept for future use)
const ALL_LEAGUE_IDS = {
    'Premier League': 39,
    'La Liga': 140,
    'Bundesliga': 78,
    'Serie A': 135,
    'Ligue 1': 61,
    'Eredivisie': 88,
    'J League': 98,
    'Champions League': 2,
    'Europa League': 3,
    'World Cup Qualifiers': 960,
};

// Use active leagues by default
const LEAGUE_IDS = ACTIVE_LEAGUE_IDS;

const LEAGUE_NAMES = Object.fromEntries(
    Object.entries(LEAGUE_IDS).map(([name, id]) => [id, name])
);

// Helper to get current season year
// Football seasons run from August to July of the following year
// The season is named by the year it starts (e.g., 2024-2025 season = 2024)
// Examples:
// - December 2024: 2024-2025 season → return 2024
// - January 2025: 2024-2025 season → return 2024
// - August 2025: 2025-2026 season → return 2025
const getCurrentSeason = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11 (0=Jan, 11=Dec)

    // Season starts in August (month 7)
    // If we're in Jan-Jul (months 0-6), we're in the second half of the season
    // which started last year
    // If we're in Aug-Dec (months 7-11), we're in the first half of the season
    // which started this year
    if (month >= 7) {
        // Aug-Dec: season started this year
        return year;
    } else {
        // Jan-Jul: season started last year
        return year - 1;
    }
};

// Cache utilities with different durations for different data types
const CACHE_DURATIONS = {
    fixtures: 5 * 60 * 1000,        // 5 minutes (for live scores)
    matchDetails: 10 * 60 * 1000,   // 10 minutes
    standings: 6 * 60 * 60 * 1000,  // 6 hours (changes once per matchday)
    topScorers: 6 * 60 * 60 * 1000, // 6 hours
    teamInfo: 24 * 60 * 60 * 1000,  // 24 hours (rarely changes)
    playerStats: 24 * 60 * 60 * 1000, // 24 hours
};

// Default cache duration
const CACHE_DURATION = CACHE_DURATIONS.fixtures;

const cacheUtils = {
    get: (key, duration = CACHE_DURATION) => {
        try {
            const cached = localStorage.getItem(`football_cache_${key}`);
            if (!cached) return null;
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > duration) {
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

export const fetchFixtures = async (lang = 'en', from = null, to = null) => {
    // If no dates provided, use today
    const fromDate = from || new Date().toISOString().split('T')[0];
    const toDate = to || fromDate;
    const cacheKey = `fixtures_${fromDate}_${toDate}_${lang}`;

    // Check cache first (5 minutes for live scores)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.fixtures);
    if (cached) {
        console.log(`Using cached fixtures data for ${fromDate} to ${toDate}`);
        return cached;
    }

    try {
        console.log(`Fetching matches from ${fromDate} to ${toDate}...`);
        const response = await fetch(
            `${API_BASE_URL}/fixtures?from=${fromDate}&to=${toDate}&timezone=Asia/Tokyo`,
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
        leagueId, // Store league ID for later use
        homeTeam: {
            id: fixture.teams.home.id,
            name: homeName,
            short: fixture.teams.home.name.substring(0, 3).toUpperCase(),
            color: 'bg-blue-600',
            logo: fixture.teams.home.logo,
        },
        awayTeam: {
            id: fixture.teams.away.id,
            name: awayName,
            short: fixture.teams.away.name.substring(0, 3).toUpperCase(),
            color: 'bg-red-600',
            logo: fixture.teams.away.logo,
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

    // Fetch a 7-day window: 3 days before, today, 3 days after
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - 3);
    const toDate = new Date(today);
    toDate.setDate(today.getDate() + 3);

    const fromStr = fromDate.toISOString().split('T')[0];
    const toStr = toDate.toISOString().split('T')[0];

    const transformed = await fetchFixtures(currentLanguage, fromStr, toStr);

    if (transformed.length > 0) {
        matches = transformed;
        console.log(`Loaded ${matches.length} matches from ${fromStr} to ${toStr}`);
        notifyListeners();
    } else {
        // Don't clear existing matches if API call fails
        if (matches.length === 0) {
            console.warn('No matches available in the 7-day window');
        } else {
            console.warn('API call failed or returned no data, keeping existing matches');
        }
        // Still notify listeners to update UI (in case language changed)
        notifyListeners();
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

    // Poll every 5 minutes for updates (reduced from 60s to save API calls)
    const intervalId = setInterval(loadMatches, 300000);

    return () => {
        console.log('Unsubscribing from updates...');
        listeners = listeners.filter((l) => l !== callback);
        clearInterval(intervalId);
    };
};

export const fetchMatchDetails = async (fixtureId, lang = 'en') => {
    const cacheKey = `match_${fixtureId}_${lang}`;

    // Check cache first (10 minutes for match details)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.matchDetails);
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

    // Check cache first (24 hours for team info)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.teamInfo);
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

        // Fetch league standings to get team's position
        // First, try to get cached league info from previous match views
        let standing = null;
        let leagueId = null;

        try {
            const teamLeagueCache = JSON.parse(localStorage.getItem('teamLeagueCache') || '{}');
            const cachedLeagueId = teamLeagueCache[teamId];

            if (cachedLeagueId && LEAGUE_IDS[Object.keys(LEAGUE_IDS).find(k => LEAGUE_IDS[k] === cachedLeagueId)]) {
                // Use cached league ID
                leagueId = cachedLeagueId;
                const currentSeason = getCurrentSeason();
                const standings = await fetchLeagueStandings(leagueId, currentSeason);
                if (standings) {
                    const teamStanding = standings.find(s => s.teamId === teamId);
                    if (teamStanding) {
                        const leagueName = Object.keys(LEAGUE_IDS).find(k => LEAGUE_IDS[k] === leagueId);
                        standing = {
                            position: teamStanding.position,
                            leagueName: leagueName,
                            played: teamStanding.played,
                            won: teamStanding.won,
                            drawn: teamStanding.drawn,
                            lost: teamStanding.lost,
                            points: teamStanding.points,
                            form: teamStanding.form
                        };
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to use cached league info:', e);
        }

        // If no cached league or standing not found, search through active leagues
        if (!standing) {
            const currentSeason = getCurrentSeason();
            for (const [leagueName, id] of Object.entries(LEAGUE_IDS)) {
                const standings = await fetchLeagueStandings(id, currentSeason);
                if (standings) {
                    const teamStanding = standings.find(s => s.teamId === teamId);
                    if (teamStanding) {
                        leagueId = id;
                        standing = {
                            position: teamStanding.position,
                            leagueName: leagueName,
                            played: teamStanding.played,
                            won: teamStanding.won,
                            drawn: teamStanding.drawn,
                            lost: teamStanding.lost,
                            points: teamStanding.points,
                            form: teamStanding.form
                        };

                        // Cache the league ID for this team
                        try {
                            const teamLeagueCache = JSON.parse(localStorage.getItem('teamLeagueCache') || '{}');
                            teamLeagueCache[teamId] = leagueId;
                            localStorage.setItem('teamLeagueCache', JSON.stringify(teamLeagueCache));
                        } catch (e) {
                            console.warn('Failed to cache team league:', e);
                        }

                        break; // Found the team's league
                    }
                }
            }
        }

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
            })),
            standing,
            leagueId
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
export const fetchLeagueStandings = async (leagueId, season = getCurrentSeason()) => {
    const cacheKey = `standings_${leagueId}_${season}`;

    // Check cache first (6 hours for standings)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.standings);
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
export const fetchTopScorers = async (leagueId, season = getCurrentSeason(), limit = 10) => {
    const cacheKey = `topscorers_${leagueId}_${season}`;

    // Check cache first (6 hours for top scorers)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.topScorers);
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
export const fetchPlayerStats = async (playerId, season = getCurrentSeason()) => {
    const cacheKey = `player_${playerId}_${season}`;

    // Check cache first (24 hours for player stats)
    const cached = cacheUtils.get(cacheKey, CACHE_DURATIONS.playerStats);
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
