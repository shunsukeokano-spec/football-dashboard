export const translations = {
    en: {
        liveMatches: "Live Matches",
        europeanCompetitions: "European Competitions",
        internationalMatches: "International Matches",
        schedule: "Schedule",
        settings: "Settings",
        searchPlaceholder: "Search matches...",
        liveNow: "Live Now",
        upcoming: "Upcoming",
        completed: "Completed",
        viewAll: "View All",
        noLiveMatches: "No live matches currently",
        noUpcomingMatches: "No upcoming matches scheduled",
        noCompletedMatches: "No completed matches recently",
        leagues: {
            all: "All",
            premierLeague: "Premier League",
            laLiga: "La Liga",
            bundesliga: "Bundesliga",
            serieA: "Serie A",
            ligue1: "Ligue 1",
            eredivisie: "Eredivisie",
            jLeague: "J League",
            championsLeague: "Champions League",
            europaLeague: "Europa League",
            worldCupQualifiers: "World Cup Qualifiers"
        },
        matchDetails: {
            summary: "Summary",
            lineups: "Lineups",
            stats: "Stats",
            startingXI: "Starting XI",
            substitutes: "Substitutes",
            noEvents: "No events recorded",
            noLineups: "Lineups not available",
            noStats: "Statistics not available"
        }
    },
    ja: {
        liveMatches: "ライブ試合",
        europeanCompetitions: "欧州カップ戦",
        internationalMatches: "国際試合",
        schedule: "日程",
        settings: "設定",
        searchPlaceholder: "試合を検索...",
        liveNow: "ライブ中",
        upcoming: "今後の試合",
        completed: "終了した試合",
        viewAll: "すべて見る",
        noLiveMatches: "現在ライブ中の試合はありません",
        noUpcomingMatches: "予定されている試合はありません",
        noCompletedMatches: "最近終了した試合はありません",
        leagues: {
            all: "すべて",
            premierLeague: "プレミアリーグ",
            laLiga: "ラ・リーガ",
            bundesliga: "ブンデスリーガ",
            serieA: "セリエA",
            ligue1: "リーグ・アン",
            eredivisie: "エールディヴィジ",
            jLeague: "Jリーグ",
            championsLeague: "チャンピオンズリーグ",
            europaLeague: "ヨーロッパリーグ",
            worldCupQualifiers: "ワールドカップ予選"
        },
        matchDetails: {
            summary: "サマリー",
            lineups: "ラインナップ",
            stats: "スタッツ",
            startingXI: "スターティングXI",
            substitutes: "サブ",
            noEvents: "イベント記録なし",
            noLineups: "ラインナップ情報なし",
            noStats: "スタッツ情報なし"
        }
    }
};

// Manual mapping for J-League teams if API doesn't provide JP names
export const teamNameMapping = {
    "Kawasaki Frontale": "川崎フロンターレ",
    "Yokohama F. Marinos": "横浜F・マリノス",
    "Vissel Kobe": "ヴィッセル神戸",
    "Kashima Antlers": "鹿島アントラーズ",
    "Nagoya Grampus": "名古屋グランパス",
    "Urawa Red Diamonds": "浦和レッズ",
    "Sanfrecce Hiroshima": "サンフレッチェ広島",
    "Avispa Fukuoka": "アビスパ福岡",
    "Cerezo Osaka": "セレッソ大阪",
    "FC Tokyo": "FC東京",
    "Consadole Sapporo": "北海道コンサドーレ札幌",
    "Kyoto Sanga": "京都サンガF.C.",
    "Gamba Osaka": "ガンバ大阪",
    "Shonan Bellmare": "湘南ベルマーレ",
    "Sagan Tosu": "サガン鳥栖",
    "Albirex Niigata": "アルビレックス新潟",
    "Kashiwa Reysol": "柏レイソル",
    "Yokohama FC": "横浜FC",
    "Machida Zelvia": "FC町田ゼルビア",
    "Jubilo Iwata": "ジュビロ磐田",
    "Tokyo Verdy": "東京ヴェルディ"
};

export const getTeamName = (name, lang) => {
    if (lang === 'en') return name;
    return teamNameMapping[name] || name;
};
