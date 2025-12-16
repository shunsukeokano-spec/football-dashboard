export const stadiums = [
    { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico' },
    { id: 'metlife', name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA' },
    { id: 'att', name: 'AT&T Stadium', city: 'Dallas', country: 'USA' },
    { id: 'arrowhead', name: 'Arrowhead Stadium', city: 'Kansas City', country: 'USA' },
    { id: 'nrg', name: 'NRG Stadium', city: 'Houston', country: 'USA' },
    { id: 'mercedes', name: 'Mercedes-Benz Stadium', city: 'Atlanta', country: 'USA' },
    { id: 'sofi', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA' },
    { id: 'lincoln', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA' },
    { id: 'lumen', name: 'Lumen Field', city: 'Seattle', country: 'USA' },
    { id: 'levis', name: 'Levi\'s Stadium', city: 'San Francisco', country: 'USA' },
    { id: 'gillette', name: 'Gillette Stadium', city: 'Boston', country: 'USA' },
    { id: 'hardrock', name: 'Hard Rock Stadium', city: 'Miami', country: 'USA' },
    { id: 'bcplace', name: 'BC Place', city: 'Vancouver', country: 'Canada' },
    { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada' },
    { id: 'akron', name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico' },
    { id: 'bbva', name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico' }
];

// Based on user provided image
export const groups = {
    A: [
        { id: 'mex', name: 'Mexico', flag: '🇲🇽' },
        { id: 'rsa', name: 'South Africa', flag: '🇿🇦' },
        { id: 'kor', name: 'Korea Republic', flag: '🇰🇷' },
        { id: 'po_d', name: 'Winner Play-off D', flag: '🏳️' }
    ],
    B: [
        { id: 'can', name: 'Canada', flag: '🇨🇦' },
        { id: 'po_a', name: 'Winner Play-off A', flag: '🏳️' },
        { id: 'qat', name: 'Qatar', flag: '🇶🇦' },
        { id: 'sui', name: 'Switzerland', flag: '🇨🇭' }
    ],
    C: [
        { id: 'bra', name: 'Brazil', flag: '🇧🇷' },
        { id: 'mar', name: 'Morocco', flag: '🇲🇦' },
        { id: 'hai', name: 'Haiti', flag: '🇭🇹' },
        { id: 'sco', name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }
    ],
    D: [
        { id: 'usa', name: 'USA', flag: '🇺🇸' },
        { id: 'par', name: 'Paraguay', flag: '🇵🇾' },
        { id: 'aus', name: 'Australia', flag: '🇦🇺' },
        { id: 'po_c', name: 'Winner Play-off C', flag: '🏳️' }
    ],
    E: [
        { id: 'ger', name: 'Germany', flag: '🇩🇪' },
        { id: 'cuw', name: 'Curaçao', flag: '🇨🇼' },
        { id: 'civ', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
        { id: 'ecu', name: 'Ecuador', flag: '🇪🇨' }
    ],
    F: [
        { id: 'ned', name: 'Netherlands', flag: '🇳🇱' },
        { id: 'jpn', name: 'Japan', flag: '🇯🇵' },
        { id: 'po_b', name: 'Winner Play-off B', flag: '🏳️' },
        { id: 'tun', name: 'Tunisia', flag: '🇹🇳' }
    ],
    G: [
        { id: 'bel', name: 'Belgium', flag: '🇧🇪' },
        { id: 'egy', name: 'Egypt', flag: '🇪🇬' },
        { id: 'irn', name: 'IR Iran', flag: '🇮🇷' },
        { id: 'nzl', name: 'New Zealand', flag: '🇳🇿' }
    ],
    H: [
        { id: 'esp', name: 'Spain', flag: '🇪🇸' },
        { id: 'cpv', name: 'Cabo Verde', flag: '🇨🇻' },
        { id: 'ksa', name: 'Saudi Arabia', flag: '🇸🇦' },
        { id: 'uru', name: 'Uruguay', flag: '🇺🇾' }
    ],
    I: [
        { id: 'fra', name: 'France', flag: '🇫🇷' },
        { id: 'sen', name: 'Senegal', flag: '🇸🇳' },
        { id: 'po_2', name: 'Winner Play-off 2', flag: '🏳️' },
        { id: 'nor', name: 'Norway', flag: '🇳🇴' }
    ],
    J: [
        { id: 'arg', name: 'Argentina', flag: '🇦🇷' },
        { id: 'alg', name: 'Algeria', flag: '🇩🇿' },
        { id: 'aut', name: 'Austria', flag: '🇦🇹' },
        { id: 'jor', name: 'Jordan', flag: '🇯🇴' }
    ],
    K: [
        { id: 'por', name: 'Portugal', flag: '🇵🇹' },
        { id: 'po_1', name: 'Winner Play-off 1', flag: '🏳️' },
        { id: 'uzb', name: 'Uzbekistan', flag: '🇺🇿' },
        { id: 'col', name: 'Colombia', flag: '🇨🇴' }
    ],
    L: [
        { id: 'eng', name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
        { id: 'cro', name: 'Croatia', flag: '🇭🇷' },
        { id: 'gha', name: 'Ghana', flag: '🇬🇭' },
        { id: 'pan', name: 'Panama', flag: '🇵🇦' }
    ]
};

// Generate Group Stage Matches (Round Robin)
// Each group has 4 teams (0,1,2,3).
// Matchday 1: 0v1, 2v3
// Matchday 2: 0v2, 1v3
// Matchday 3: 0v3, 1v2
const groupStageMatches = [];
let matchIdCounter = 1;

// Distribute matches across dates to avoid clumps
// We have 12 groups * 6 matches = 72 matches in group stage
// Spread over ~16 days = ~4.5 matches per day

Object.keys(groups).forEach((groupId, groupIndex) => {
    const teams = groups[groupId];

    // Matchday 1 Pairings
    const md1 = [
        { t1: teams[0], t2: teams[1] },
        { t1: teams[2], t2: teams[3] }
    ];
    // Matchday 2 Pairings
    const md2 = [
        { t1: teams[0], t2: teams[2] },
        { t1: teams[1], t2: teams[3] }
    ];
    // Matchday 3 Pairings
    const md3 = [
        { t1: teams[0], t2: teams[3] },
        { t1: teams[1], t2: teams[2] }
    ];

    const pairings = [...md1, ...md2, ...md3];

    pairings.forEach((pair, idx) => {
        // Calculate date logic
        // Base logic: Groups A-D start early, I-L start late
        // Match 1 & 2 (MD1) -> June 11-16
        // Match 3 & 4 (MD2) -> June 17-22
        // Match 5 & 6 (MD3) -> June 23-27

        let baseDay;
        if (idx < 2) baseDay = 11 + Math.floor(groupIndex / 2); // MD1
        else if (idx < 4) baseDay = 17 + Math.floor(groupIndex / 2); // MD2
        else baseDay = 23 + Math.floor(groupIndex / 3); // MD3 (Simultaneous KO logic essentially)

        const date = `2026-06-${baseDay}`;

        // Pick random venue
        const venue = stadiums[Math.floor(Math.random() * stadiums.length)];

        // Times (JST - typically early morning for North American games)
        const times = ['02:00', '05:00', '08:00', '10:00', '12:00'];
        let time = times[Math.floor(Math.random() * times.length)];

        // User specific request: Japan vs Netherlands at 5am
        if ((pair.t1.name === 'Japan' && pair.t2.name === 'Netherlands') ||
            (pair.t2.name === 'Japan' && pair.t1.name === 'Netherlands')) {
            time = '05:00';
        }

        groupStageMatches.push({
            id: `gm-${matchIdCounter++}`,
            date: date,
            time: time,
            team1: pair.t1,
            team2: pair.t2,
            venue: venue,
            group: groupId,
            stage: 'Group Stage'
        });
    });
});

// Sort Group Stage by Date
groupStageMatches.sort((a, b) => new Date(a.date) - new Date(b.date));


// Knockout Stage Placeholders
const knockoutMatches = [
    // Round of 32 (June 28 - July 3) - 16 matches
    { id: 'r32-1', date: '2026-06-28', time: '13:00', team1: { name: 'Winner A', flag: '🏆' }, team2: { name: 'Runner-up B', flag: '🥈' }, venue: stadiums[6], stage: 'Round of 32' },
    { id: 'r32-2', date: '2026-06-28', time: '16:00', team1: { name: 'Winner C', flag: '🏆' }, team2: { name: 'Runner-up D', flag: '🥈' }, venue: stadiums[2], stage: 'Round of 32' },
    { id: 'r32-3', date: '2026-06-29', time: '19:00', team1: { name: 'Winner E', flag: '🏆' }, team2: { name: 'Runner-up F', flag: '🥈' }, venue: stadiums[4], stage: 'Round of 32' },
    { id: 'r32-4', date: '2026-06-29', time: '22:00', team1: { name: 'Winner G', flag: '🏆' }, team2: { name: 'Runner-up H', flag: '🥈' }, venue: stadiums[5], stage: 'Round of 32' },
    { id: 'r32-5', date: '2026-06-30', time: '13:00', team1: { name: 'Winner I', flag: '🏆' }, team2: { name: 'Runner-up J', flag: '🥈' }, venue: stadiums[7], stage: 'Round of 32' },
    { id: 'r32-6', date: '2026-06-30', time: '16:00', team1: { name: 'Winner K', flag: '🏆' }, team2: { name: 'Runner-up L', flag: '🥈' }, venue: stadiums[8], stage: 'Round of 32' },
    { id: 'r32-7', date: '2026-07-01', time: '19:00', team1: { name: 'Runner-up A', flag: '🥈' }, team2: { name: 'Winner B', flag: '🏆' }, venue: stadiums[1], stage: 'Round of 32' },
    { id: 'r32-8', date: '2026-07-01', time: '22:00', team1: { name: 'Runner-up C', flag: '🥈' }, team2: { name: 'Winner D', flag: '🏆' }, venue: stadiums[3], stage: 'Round of 32' },
    { id: 'r32-9', date: '2026-07-02', time: '13:00', team1: { name: 'Runner-up E', flag: '🥈' }, team2: { name: 'Winner F', flag: '🏆' }, venue: stadiums[9], stage: 'Round of 32' },
    { id: 'r32-10', date: '2026-07-02', time: '16:00', team1: { name: 'Runner-up G', flag: '🥈' }, team2: { name: 'Winner H', flag: '🏆' }, venue: stadiums[11], stage: 'Round of 32' },
    { id: 'r32-11', date: '2026-07-03', time: '19:00', team1: { name: 'Runner-up I', flag: '🥈' }, team2: { name: 'Winner J', flag: '🏆' }, venue: stadiums[0], stage: 'Round of 32' },
    { id: 'r32-12', date: '2026-07-03', time: '22:00', team1: { name: 'Runner-up K', flag: '🥈' }, team2: { name: 'Winner L', flag: '🏆' }, venue: stadiums[12], stage: 'Round of 32' },
    // (Simplified for brevity, ensuring total is high)

    // Round of 16 (July 4 - July 7)
    { id: 'r16-1', date: '2026-07-04', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[2], stage: 'Round of 16' },
    { id: 'r16-2', date: '2026-07-04', time: '22:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[4], stage: 'Round of 16' },
    { id: 'r16-3', date: '2026-07-05', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[1], stage: 'Round of 16' },
    { id: 'r16-4', date: '2026-07-05', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[3], stage: 'Round of 16' },

    // Quarter Finals
    { id: 'qf-1', date: '2026-07-09', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[2], stage: 'Quarter Final' },
    { id: 'qf-2', date: '2026-07-10', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[4], stage: 'Quarter Final' },

    // Semi Finals
    { id: 'sf-1', date: '2026-07-14', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[2], stage: 'Semi Final' },
    { id: 'sf-2', date: '2026-07-15', time: '20:00', team1: { name: 'TBD', flag: '❓' }, team2: { name: 'TBD', flag: '❓' }, venue: stadiums[5], stage: 'Semi Final' },

    // Final
    { id: 'final', date: '2026-07-19', time: '20:00', team1: { name: 'TBD', flag: '🏆' }, team2: { name: 'TBD', flag: '🏆' }, venue: stadiums[1], stage: 'Final' }
];

export const schedule = [...groupStageMatches, ...knockoutMatches];

export const bracketData = {
    rounds: [
        {
            title: "Round of 32",
            matches: [
                { id: 1, team1: "Winner A", team2: "Runner-up B", score1: null, score2: null },
                { id: 2, team1: "Winner C", team2: "Runner-up D", score1: null, score2: null },
                { id: 3, team1: "Winner E", team2: "Runner-up F", score1: null, score2: null },
                { id: 4, team1: "Winner G", team2: "Runner-up H", score1: null, score2: null },
            ]
        },
        {
            title: "Round of 16",
            matches: [
                { id: 5, team1: "TBD", team2: "TBD", score1: null, score2: null },
                { id: 6, team1: "TBD", team2: "TBD", score1: null, score2: null },
            ]
        },
        {
            title: "Quarter Finals",
            matches: [
                { id: 7, team1: "TBD", team2: "TBD", score1: null, score2: null },
                { id: 8, team1: "TBD", team2: "TBD", score1: null, score2: null },
            ]
        },
        {
            title: "Semi Finals",
            matches: [
                { id: 9, team1: "TBD", team2: "TBD", score1: null, score2: null },
            ]
        },
        {
            title: "Final",
            matches: [
                { id: 10, team1: "TBD", team2: "TBD", score1: null, score2: null },
            ]
        }
    ]
};
