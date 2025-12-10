import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { fetchByDate } from '../services/apiDataService';
import { translations } from '../utils/translations';

export const Schedule = ({ language = 'en', onMatchClick }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const t = translations[language] || translations['en'];

    useEffect(() => {
        const loadMatches = async () => {
            setLoading(true);
            // Use fetchByDate because from/to range endpoints are unreliable on free tier
            const data = await fetchByDate(date, language);
            setMatches(data);
            setLoading(false);
        };
        loadMatches();
    }, [date, language]);

    const handleDateChange = (days) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        setDate(newDate.toISOString().split('T')[0]);
    };

    const handleToday = () => {
        setDate(new Date().toISOString().split('T')[0]);
    };

    // Group matches by league
    const matchesByLeague = matches.reduce((acc, match) => {
        if (!acc[match.league]) {
            acc[match.league] = [];
        }
        acc[match.league].push(match);
        return acc;
    }, {});

    return (
        <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
            {/* Header / Controls */}
            <div className="flex flex-col space-y-4 mb-8">
                <h1 className="text-2xl font-bold">{t.schedule}</h1>

                {/* Coming 7 Days Selector */}
                <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                    {[...Array(7)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const dayStr = d.toISOString().split('T')[0];
                        const dayName = d.toLocaleDateString(language, { weekday: 'short' });
                        const dayNum = d.getDate();
                        const isSelected = date === dayStr;
                        const isToday = i === 0;

                        return (
                            <button
                                key={i}
                                onClick={() => setDate(dayStr)}
                                className={`flex flex-col items-center min-w-[60px] p-2 rounded-xl transition-all ${isSelected
                                    ? 'bg-primary text-primary-foreground shadow-md scale-105'
                                    : 'bg-card border border-border text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                <span className={`text-xs font-medium ${isSelected ? 'text-primary-foreground/80' : ''}`}>
                                    {isToday ? 'Today' : dayName}
                                </span>
                                <span className="text-lg font-bold">{dayNum}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : matches.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <div className="mb-4 flex justify-center">
                        <CalendarIcon size={48} className="opacity-20" />
                    </div>
                    <p className="text-lg font-medium">No matches found for this date</p>
                    <p className="text-sm">Try selecting a different day</p>
                    <p className="text-xs mt-2 text-red-400/50">Free Tier limits historical data access</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(matchesByLeague).map(([league, leagueMatches]) => (
                        <div key={league} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-lg font-bold mb-4 flex items-center">
                                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                                {league}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {leagueMatches.map((match) => (
                                    <div
                                        key={match.id}
                                        onClick={() => onMatchClick(match.id)}
                                        className="bg-card rounded-xl p-4 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] group"
                                    >
                                        <div className="flex justify-between items-center mb-4 text-xs text-muted-foreground">
                                            <span className={`px-2 py-0.5 rounded-full font-bold ${match.status === 'LIVE' ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-muted'}`}>
                                                {match.status === 'LIVE' ? `${match.minute}'` : match.status}
                                            </span>
                                            <span>{match.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 flex items-center justify-center p-0.5 bg-white rounded-full shadow-sm`}>
                                                        <img
                                                            src={match.homeTeam.logo}
                                                            alt={match.homeTeam.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentNode.classList.add(match.homeTeam.color);
                                                                e.target.parentNode.classList.remove('bg-white', 'p-0.5');
                                                                e.target.parentNode.innerText = match.homeTeam.short;
                                                                e.target.parentNode.classList.add('text-white', 'text-xs', 'font-bold');
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-medium">{match.homeTeam.name}</span>
                                                </div>
                                                <span className="font-bold text-lg">{match.homeScore}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 flex items-center justify-center p-0.5 bg-white rounded-full shadow-sm`}>
                                                        <img
                                                            src={match.awayTeam.logo}
                                                            alt={match.awayTeam.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.parentNode.classList.add(match.awayTeam.color);
                                                                e.target.parentNode.classList.remove('bg-white', 'p-0.5');
                                                                e.target.parentNode.innerText = match.awayTeam.short;
                                                                e.target.parentNode.classList.add('text-white', 'text-xs', 'font-bold');
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="font-medium">{match.awayTeam.name}</span>
                                                </div>
                                                <span className="font-bold text-lg">{match.awayScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
