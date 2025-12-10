import React from 'react';
import { Clock, EyeOff, Star } from 'lucide-react';
import { translations } from '../utils/translations';

export const MatchCard = ({ match, language = 'en', onClick, favoriteTeams = [] }) => {
    const isLive = match.status === 'LIVE';
    const t = translations[language] || translations['en'];

    const isHomeFavorite = favoriteTeams.includes(match.homeTeam.id);
    const isAwayFavorite = favoriteTeams.includes(match.awayTeam.id);
    const hasFavoriteTeam = isHomeFavorite || isAwayFavorite;

    // Hide score for completed matches with favorited teams
    const shouldHideScore = hasFavoriteTeam && match.status === 'FT';

    return (
        <div
            onClick={onClick}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md group cursor-pointer"
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <div className={`flex items-center space-x-2 text-xs font-bold px-2 py-1 rounded-full ${isLive ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                        <span>{isLive ? `${match.minute}'` : match.status}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground border border-border px-2 py-1 rounded-full">{match.league}</span>
                </div>
                {!isLive && match.status === 'UPCOMING' && (
                    <div className="text-xs text-muted-foreground flex items-center">
                        <Clock size={12} className="mr-1" />
                        {match.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
                {/* Home Team */}
                <div className="flex flex-col items-center w-1/3 relative">
                    {isHomeFavorite && <div className="absolute -top-1 -right-1 text-yellow-500"><Star size={12} fill="currentColor" /></div>}
                    <div className={`w-12 h-12 mb-2 flex items-center justify-center shadow-lg bg-white rounded-full p-1`}>
                        <img
                            src={match.homeTeam.logo}
                            alt={match.homeTeam.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add(match.homeTeam.color);
                                e.target.parentNode.innerText = match.homeTeam.short;
                                e.target.parentNode.classList.remove('bg-white', 'p-1');
                                e.target.parentNode.classList.add('text-white', 'font-bold', 'text-sm');
                            }}
                        />
                    </div>
                    <span className="font-semibold text-sm text-center line-clamp-2">{match.homeTeam.name}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center w-1/3">
                    {shouldHideScore ? (
                        <div className="flex flex-col items-center">
                            <EyeOff size={24} className="text-muted-foreground mb-1" />
                            <span className="text-xs text-muted-foreground text-center">Click to reveal</span>
                        </div>
                    ) : (
                        <>
                            <div className="text-3xl font-bold tracking-tighter tabular-nums">
                                {match.homeScore} - {match.awayScore}
                            </div>
                            {isLive && <span className="text-xs text-green-500 font-medium mt-1">{t.liveNow}</span>}
                        </>
                    )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center w-1/3 relative">
                    {isAwayFavorite && <div className="absolute -top-1 -right-1 text-yellow-500"><Star size={12} fill="currentColor" /></div>}
                    <div className={`w-12 h-12 mb-2 flex items-center justify-center shadow-lg bg-white rounded-full p-1`}>
                        <img
                            src={match.awayTeam.logo}
                            alt={match.awayTeam.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add(match.awayTeam.color);
                                e.target.parentNode.innerText = match.awayTeam.short;
                                e.target.parentNode.classList.remove('bg-white', 'p-1');
                                e.target.parentNode.classList.add('text-white', 'font-bold', 'text-sm');
                            }}
                        />
                    </div>
                    <span className="font-semibold text-sm text-center line-clamp-2">{match.awayTeam.name}</span>
                </div>
            </div>

            {/* Recent Events (Last event) */}
            {match.events.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-bold mr-2 text-primary">{match.events[0].minute}'</span>
                        <span>{match.events[0].type} - {match.events[0].player}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
