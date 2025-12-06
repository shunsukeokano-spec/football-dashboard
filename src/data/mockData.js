// Mock data for demo purposes when API returns no results
// This provides realistic sample data to showcase the dashboard functionality

export const mockMatches = [
    {
        id: 1001,
        type: 'live',
        league: 'Premier League',
        leagueId: 39,
        homeTeam: {
            id: 33,
            name: 'Manchester United',
            short: 'MUN',
            color: 'bg-red-600',
            logo: 'https://media.api-sports.io/football/teams/33.png'
        },
        awayTeam: {
            id: 40,
            name: 'Liverpool',
            short: 'LIV',
            color: 'bg-red-700',
            logo: 'https://media.api-sports.io/football/teams/40.png'
        },
        homeScore: 2,
        awayScore: 1,
        status: 'In Play',
        minute: 67,
        startTime: new Date(),
        events: [
            { id: 1, type: 'Goal', teamId: 33, minute: 23, player: 'B. Fernandes' },
            { id: 2, type: 'Goal', teamId: 40, minute: 45, player: 'M. Salah' },
            { id: 3, type: 'Goal', teamId: 33, minute: 58, player: 'M. Rashford' }
        ]
    },
    {
        id: 1002,
        type: 'upcoming',
        league: 'La Liga',
        leagueId: 140,
        homeTeam: {
            id: 529,
            name: 'Barcelona',
            short: 'BAR',
            color: 'bg-blue-600',
            logo: 'https://media.api-sports.io/football/teams/529.png'
        },
        awayTeam: {
            id: 541,
            name: 'Real Madrid',
            short: 'RMA',
            color: 'bg-white',
            logo: 'https://media.api-sports.io/football/teams/541.png'
        },
        homeScore: 0,
        awayScore: 0,
        status: 'Not Started',
        minute: 0,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        events: []
    },
    {
        id: 1003,
        type: 'finished',
        league: 'J League',
        leagueId: 98,
        homeTeam: {
            id: 286,
            name: 'Yokohama F. Marinos',
            short: 'YOK',
            color: 'bg-blue-500',
            logo: 'https://media.api-sports.io/football/teams/286.png'
        },
        awayTeam: {
            id: 285,
            name: 'Kashima Antlers',
            short: 'KAS',
            color: 'bg-red-600',
            logo: 'https://media.api-sports.io/football/teams/285.png'
        },
        homeScore: 3,
        awayScore: 2,
        status: 'Match Finished',
        minute: 90,
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        events: [
            { id: 1, type: 'Goal', teamId: 286, minute: 12, player: 'A. Matheus' },
            { id: 2, type: 'Goal', teamId: 285, minute: 28, player: 'S. Ueda' },
            { id: 3, type: 'Goal', teamId: 286, minute: 56, player: 'K. Mizunuma' },
            { id: 4, type: 'Goal', teamId: 285, minute: 72, player: 'Y. Naganuma' },
            { id: 5, type: 'Goal', teamId: 286, minute: 85, player: 'E. Junior' }
        ]
    },
    {
        id: 1004,
        type: 'live',
        league: 'Premier League',
        leagueId: 39,
        homeTeam: {
            id: 50,
            name: 'Manchester City',
            short: 'MCI',
            color: 'bg-sky-500',
            logo: 'https://media.api-sports.io/football/teams/50.png'
        },
        awayTeam: {
            id: 42,
            name: 'Arsenal',
            short: 'ARS',
            color: 'bg-red-600',
            logo: 'https://media.api-sports.io/football/teams/42.png'
        },
        homeScore: 1,
        awayScore: 1,
        status: 'In Play',
        minute: 78,
        startTime: new Date(),
        events: [
            { id: 1, type: 'Goal', teamId: 50, minute: 34, player: 'E. Haaland' },
            { id: 2, type: 'Goal', teamId: 42, minute: 61, player: 'B. Saka' }
        ]
    },
    {
        id: 1005,
        type: 'upcoming',
        league: 'La Liga',
        leagueId: 140,
        homeTeam: {
            id: 530,
            name: 'Atletico Madrid',
            short: 'ATM',
            color: 'bg-red-600',
            logo: 'https://media.api-sports.io/football/teams/530.png'
        },
        awayTeam: {
            id: 532,
            name: 'Valencia',
            short: 'VAL',
            color: 'bg-orange-500',
            logo: 'https://media.api-sports.io/football/teams/532.png'
        },
        homeScore: 0,
        awayScore: 0,
        status: 'Not Started',
        minute: 0,
        startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        events: []
    },
    {
        id: 1006,
        type: 'finished',
        league: 'J League',
        leagueId: 98,
        homeTeam: {
            id: 287,
            name: 'Urawa Red Diamonds',
            short: 'URA',
            color: 'bg-red-600',
            logo: 'https://media.api-sports.io/football/teams/287.png'
        },
        awayTeam: {
            id: 288,
            name: 'Kawasaki Frontale',
            short: 'KAW',
            color: 'bg-blue-600',
            logo: 'https://media.api-sports.io/football/teams/288.png'
        },
        homeScore: 2,
        awayScore: 2,
        status: 'Match Finished',
        minute: 90,
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        events: [
            { id: 1, type: 'Goal', teamId: 287, minute: 15, player: 'T. Koizumi' },
            { id: 2, type: 'Goal', teamId: 288, minute: 32, player: 'M. Yamane' },
            { id: 3, type: 'Goal', teamId: 288, minute: 68, player: 'K. Tachibanada' },
            { id: 4, type: 'Goal', teamId: 287, minute: 89, player: 'A. Scholz' }
        ]
    }
];
