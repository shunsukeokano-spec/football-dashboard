import { addMinutes } from 'date-fns';

const TEAMS = [
    // Premier League
    { id: 1, name: 'Arsenal', short: 'ARS', color: 'bg-red-600' },
    { id: 2, name: 'Man City', short: 'MCI', color: 'bg-sky-400' },
    { id: 3, name: 'Liverpool', short: 'LIV', color: 'bg-red-700' },
    { id: 4, name: 'Chelsea', short: 'CHE', color: 'bg-blue-700' },
    { id: 5, name: 'Man Utd', short: 'MUN', color: 'bg-red-800' },
    { id: 6, name: 'Spurs', short: 'TOT', color: 'bg-slate-800' },
    { id: 7, name: 'Newcastle', short: 'NEW', color: 'bg-slate-900' },
    { id: 8, name: 'Aston Villa', short: 'AVL', color: 'bg-red-900' },

    // La Liga
    { id: 9, name: 'Real Madrid', short: 'RMA', color: 'bg-white text-black border border-gray-200' },
    { id: 10, name: 'Barcelona', short: 'BAR', color: 'bg-blue-800' },
    { id: 11, name: 'Atletico', short: 'ATM', color: 'bg-red-600' },
    { id: 12, name: 'Sevilla', short: 'SEV', color: 'bg-red-500' },

    // Bundesliga
    { id: 13, name: 'Bayern', short: 'BAY', color: 'bg-red-700' },
    { id: 14, name: 'Dortmund', short: 'DOR', color: 'bg-yellow-400 text-black' },
    { id: 15, name: 'RB Leipzig', short: 'RBL', color: 'bg-red-600' },
    { id: 16, name: 'Leverkusen', short: 'B04', color: 'bg-red-700' },

    // Serie A
    { id: 17, name: 'Inter', short: 'INT', color: 'bg-blue-900' },
    { id: 18, name: 'AC Milan', short: 'ACM', color: 'bg-red-800' },
    { id: 19, name: 'Juventus', short: 'JUV', color: 'bg-white text-black border border-gray-200' },
    { id: 20, name: 'Roma', short: 'ROM', color: 'bg-red-700' },

    // Ligue 1
    { id: 21, name: 'PSG', short: 'PSG', color: 'bg-blue-900' },
    { id: 22, name: 'Monaco', short: 'MON', color: 'bg-red-600' },
    { id: 23, name: 'Marseille', short: 'OMA', color: 'bg-sky-400' },
    { id: 24, name: 'Lyon', short: 'OLY', color: 'bg-blue-700' },

    // Eredivisie
    { id: 25, name: 'Ajax', short: 'AJA', color: 'bg-red-600' },
    { id: 26, name: 'PSV', short: 'PSV', color: 'bg-red-700' },
    { id: 27, name: 'Feyenoord', short: 'FEY', color: 'bg-red-800' },

    // J League
    { id: 28, name: 'Vissel Kobe', short: 'VIS', color: 'bg-red-800' },
    { id: 29, name: 'Yokohama', short: 'YOK', color: 'bg-blue-700' },
    { id: 30, name: 'Urawa Reds', short: 'URA', color: 'bg-red-600' },

    // National Teams (for internationals)
    { id: 31, name: 'Brazil', short: 'BRA', color: 'bg-yellow-400 text-green-800' },
    { id: 32, name: 'Argentina', short: 'ARG', color: 'bg-sky-300 text-white' },
    { id: 33, name: 'France', short: 'FRA', color: 'bg-blue-800' },
    { id: 34, name: 'Germany', short: 'GER', color: 'bg-white text-black border border-gray-200' },
];

const EVENTS = ['Goal', 'Yellow Card', 'Red Card', 'Corner', 'Substitution'];

let matches = [];
let listeners = [];

const generateInitialMatches = () => {
    matches = [
        // Premier League - Domestic
        {
            id: 1,
            type: 'domestic',
            league: 'Premier League',
            homeTeam: TEAMS[0], // Arsenal
            awayTeam: TEAMS[1], // Man City
            homeScore: 1,
            awayScore: 2,
            status: 'LIVE',
            minute: 67,
            events: [
                { id: 1, type: 'Goal', teamId: 1, minute: 23, player: 'Saka' },
                { id: 2, type: 'Goal', teamId: 2, minute: 45, player: 'Haaland' },
                { id: 3, type: 'Goal', teamId: 2, minute: 58, player: 'De Bruyne' },
            ],
        },
        {
            id: 2,
            type: 'domestic',
            league: 'Premier League',
            homeTeam: TEAMS[2], // Liverpool
            awayTeam: TEAMS[3], // Chelsea
            homeScore: 2,
            awayScore: 1,
            status: 'FT',
            minute: 90,
            events: [
                { id: 4, type: 'Goal', teamId: 3, minute: 15, player: 'Salah' },
                { id: 5, type: 'Goal', teamId: 4, minute: 22, player: 'Palmer' },
                { id: 6, type: 'Goal', teamId: 3, minute: 78, player: 'Diaz' },
            ],
        },
        {
            id: 3,
            type: 'domestic',
            league: 'Premier League',
            homeTeam: TEAMS[4], // Man Utd
            awayTeam: TEAMS[5], // Spurs
            homeScore: 0,
            awayScore: 0,
            status: 'UPCOMING',
            minute: 0,
            startTime: addMinutes(new Date(), 90),
            events: [],
        },

        // La Liga - Domestic
        {
            id: 4,
            type: 'domestic',
            league: 'La Liga',
            homeTeam: TEAMS[8], // Real Madrid
            awayTeam: TEAMS[9], // Barcelona
            homeScore: 1,
            awayScore: 1,
            status: 'LIVE',
            minute: 56,
            events: [
                { id: 7, type: 'Goal', teamId: 9, minute: 12, player: 'Vinicius Jr' },
                { id: 8, type: 'Goal', teamId: 10, minute: 34, player: 'Lewandowski' },
            ],
        },
        {
            id: 5,
            type: 'domestic',
            league: 'La Liga',
            homeTeam: TEAMS[10], // Atletico
            awayTeam: TEAMS[11], // Sevilla
            homeScore: 0,
            awayScore: 0,
            status: 'UPCOMING',
            minute: 0,
            startTime: addMinutes(new Date(), 120),
            events: [],
        },

        // Bundesliga - Domestic
        {
            id: 6,
            type: 'domestic',
            league: 'Bundesliga',
            homeTeam: TEAMS[12], // Bayern
            awayTeam: TEAMS[13], // Dortmund
            homeScore: 3,
            awayScore: 2,
            status: 'LIVE',
            minute: 82,
            events: [
                { id: 9, type: 'Goal', teamId: 13, minute: 8, player: 'Kane' },
                { id: 10, type: 'Goal', teamId: 14, minute: 15, player: 'Adeyemi' },
                { id: 11, type: 'Goal', teamId: 13, minute: 34, player: 'Musiala' },
                { id: 12, type: 'Goal', teamId: 14, minute: 56, player: 'Haaland' },
                { id: 13, type: 'Goal', teamId: 13, minute: 71, player: 'Sane' },
            ],
        },

        // Serie A - Domestic
        {
            id: 7,
            type: 'domestic',
            league: 'Serie A',
            homeTeam: TEAMS[16], // Inter
            awayTeam: TEAMS[17], // AC Milan
            homeScore: 1,
            awayScore: 0,
            status: 'FT',
            minute: 90,
            events: [
                { id: 14, type: 'Goal', teamId: 17, minute: 67, player: 'Lautaro' },
            ],
        },

        // Ligue 1 - Domestic
        {
            id: 8,
            type: 'domestic',
            league: 'Ligue 1',
            homeTeam: TEAMS[20], // PSG
            awayTeam: TEAMS[21], // Monaco
            homeScore: 2,
            awayScore: 1,
            status: 'LIVE',
            minute: 45,
            events: [
                { id: 15, type: 'Goal', teamId: 21, minute: 12, player: 'Mbappe' },
                { id: 16, type: 'Goal', teamId: 22, minute: 23, player: 'Ben Yedder' },
                { id: 17, type: 'Goal', teamId: 21, minute: 38, player: 'Dembele' },
            ],
        },

        // Eredivisie - Domestic
        {
            id: 9,
            type: 'domestic',
            league: 'Eredivisie',
            homeTeam: TEAMS[24], // Ajax
            awayTeam: TEAMS[25], // PSV
            homeScore: 0,
            awayScore: 0,
            status: 'UPCOMING',
            minute: 0,
            startTime: addMinutes(new Date(), 150),
            events: [],
        },

        // J League - Domestic
        {
            id: 10,
            type: 'domestic',
            league: 'J League',
            homeTeam: TEAMS[27], // Vissel Kobe
            awayTeam: TEAMS[28], // Yokohama
            homeScore: 1,
            awayScore: 1,
            status: 'LIVE',
            minute: 73,
            events: [
                { id: 18, type: 'Goal', teamId: 28, minute: 34, player: 'Furuhashi' },
                { id: 19, type: 'Goal', teamId: 29, minute: 56, player: 'Nakamura' },
            ],
        },

        // Champions League - International
        {
            id: 11,
            type: 'international',
            league: 'Champions League',
            homeTeam: TEAMS[8], // Real Madrid
            awayTeam: TEAMS[12], // Bayern
            homeScore: 2,
            awayScore: 1,
            status: 'LIVE',
            minute: 78,
            events: [
                { id: 20, type: 'Goal', teamId: 9, minute: 12, player: 'Vinicius Jr' },
                { id: 21, type: 'Goal', teamId: 13, minute: 45, player: 'Kane' },
                { id: 22, type: 'Goal', teamId: 9, minute: 67, player: 'Bellingham' },
            ],
        },
        {
            id: 12,
            type: 'international',
            league: 'Champions League',
            homeTeam: TEAMS[2], // Liverpool
            awayTeam: TEAMS[20], // PSG
            homeScore: 0,
            awayScore: 0,
            status: 'UPCOMING',
            minute: 0,
            startTime: addMinutes(new Date(), 180),
            events: [],
        },

        // Europa League - International
        {
            id: 13,
            type: 'international',
            league: 'Europa League',
            homeTeam: TEAMS[6], // Newcastle
            awayTeam: TEAMS[17], // AC Milan
            homeScore: 1,
            awayScore: 0,
            status: 'FT',
            minute: 90,
            events: [
                { id: 23, type: 'Goal', teamId: 7, minute: 88, player: 'Isak' },
            ],
        },
        {
            id: 14,
            type: 'international',
            league: 'Europa League',
            homeTeam: TEAMS[9], // Barcelona
            awayTeam: TEAMS[16], // Inter
            homeScore: 2,
            awayScore: 2,
            status: 'LIVE',
            minute: 89,
            events: [
                { id: 24, type: 'Goal', teamId: 10, minute: 23, player: 'Lewandowski' },
                { id: 25, type: 'Goal', teamId: 17, minute: 45, player: 'Lautaro' },
                { id: 26, type: 'Goal', teamId: 10, minute: 67, player: 'Raphinha' },
                { id: 27, type: 'Goal', teamId: 17, minute: 85, player: 'Thuram' },
            ],
        },

        // World Cup Qualifiers - International
        {
            id: 15,
            type: 'international',
            league: 'World Cup Qualifiers',
            homeTeam: TEAMS[30], // Brazil
            awayTeam: TEAMS[31], // Argentina
            homeScore: 0,
            awayScore: 0,
            status: 'UPCOMING',
            minute: 0,
            startTime: addMinutes(new Date(), 240),
            events: [],
        },
        {
            id: 16,
            type: 'international',
            league: 'World Cup Qualifiers',
            homeTeam: TEAMS[32], // France
            awayTeam: TEAMS[33], // Germany
            homeScore: 1,
            awayScore: 1,
            status: 'LIVE',
            minute: 62,
            events: [
                { id: 28, type: 'Goal', teamId: 33, minute: 34, player: 'Mbappe' },
                { id: 29, type: 'Goal', teamId: 34, minute: 52, player: 'Havertz' },
            ],
        },
    ];
    console.log('Initial matches generated:', matches);
};

const notifyListeners = () => {
    listeners.forEach((listener) => listener([...matches]));
};

export const subscribeToUpdates = (callback) => {
    console.log('Subscribing to updates...');
    listeners.push(callback);
    console.log('Sending initial data to new subscriber:', matches);
    callback([...matches]); // Initial data
    return () => {
        console.log('Unsubscribing from updates...');
        listeners = listeners.filter((l) => l !== callback);
    };
};

// Simulation Loop
setInterval(() => {
    let changed = false;
    matches = matches.map((match) => {
        if (match.status !== 'LIVE') return match;

        const newMinute = match.minute + 1;
        let newEvents = [...match.events];
        let newHomeScore = match.homeScore;
        let newAwayScore = match.awayScore;

        // Random event generation
        if (Math.random() < 0.1) {
            const eventType = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            const team = Math.random() > 0.5 ? match.homeTeam : match.awayTeam;

            if (eventType === 'Goal') {
                if (team.id === match.homeTeam.id) newHomeScore++;
                else newAwayScore++;
            }

            newEvents.unshift({
                id: Date.now(),
                type: eventType,
                teamId: team.id,
                minute: newMinute,
                player: 'Player Name', // Simplified
            });
            changed = true;
        }

        if (newMinute > 90) {
            return { ...match, status: 'FT', minute: 90, events: newEvents, homeScore: newHomeScore, awayScore: newAwayScore };
        }

        if (newMinute !== match.minute) changed = true;

        return {
            ...match,
            minute: newMinute,
            events: newEvents,
            homeScore: newHomeScore,
            awayScore: newAwayScore,
        };
    });

    if (changed) notifyListeners();
}, 3000); // Update every 3 seconds

generateInitialMatches();
