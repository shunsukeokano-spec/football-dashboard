import React, { useEffect, useState } from 'react';
import { X, Calendar, MapPin, User, Shirt, Activity, Clock } from 'lucide-react';
import { fetchMatchDetails } from '../services/apiDataService';
import { translations } from '../utils/translations';

export const MatchDetails = ({ matchId, onClose, onTeamClick, language = 'en' }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary'); // summary, lineups, stats
    const t = translations[language];

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            const data = await fetchMatchDetails(matchId, language);
            setDetails(data);
            setLoading(false);
        };

        if (matchId) {
            loadDetails();
        }
    }, [matchId, language]);

    if (!matchId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                {/* Header */}
                <div className="relative bg-muted/30 p-6 border-b border-border">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : !details ? (
                        <div className="flex justify-center py-10 text-muted-foreground">
                            Failed to load match details
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-sm text-muted-foreground flex items-center space-x-4">
                                    <span className="flex items-center"><Calendar size={14} className="mr-1" /> {details.startTime.toLocaleDateString()}</span>
                                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {details.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <span className="flex items-center"><MapPin size={14} className="mr-1" /> {details.venue}</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                    {details.league}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                {/* Home */}
                                <div
                                    className="flex flex-col items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => onTeamClick && onTeamClick(details.homeTeam.id)}
                                >
                                    <div className={`w-20 h-20 rounded-full mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg ${details.homeTeam.color}`}>
                                        {details.homeTeam.short}
                                    </div>
                                    <h2 className="text-xl font-bold text-center">{details.homeTeam.name}</h2>
                                </div>

                                {/* Score */}
                                <div className="flex flex-col items-center px-8">
                                    <div className="text-5xl font-bold tracking-tighter tabular-nums mb-2">
                                        {details.homeScore} - {details.awayScore}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${details.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                                        {details.status === 'LIVE' ? `${details.minute}'` : details.status}
                                    </div>
                                </div>

                                {/* Away */}
                                <div
                                    className="flex flex-col items-center flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => onTeamClick && onTeamClick(details.awayTeam.id)}
                                >
                                    <div className={`w-20 h-20 rounded-full mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg ${details.awayTeam.color}`}>
                                        {details.awayTeam.short}
                                    </div>
                                    <h2 className="text-xl font-bold text-center">{details.awayTeam.name}</h2>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Tabs */}
                {!loading && details && (
                    <>
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'summary' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.matchDetails.summary}
                                {activeTab === 'summary' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('lineups')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'lineups' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.matchDetails.lineups}
                                {activeTab === 'lineups' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                            </button>
                            <button
                                onClick={() => setActiveTab('stats')}
                                className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'stats' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                {t.matchDetails.stats}
                                {activeTab === 'stats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-background custom-scrollbar">
                            {activeTab === 'summary' && (
                                <div className="space-y-4 max-w-2xl mx-auto">
                                    {details.events.length > 0 ? (
                                        details.events.map((event, idx) => (
                                            <div key={idx} className={`flex items-center ${event.team.id === details.homeTeam.id ? 'flex-row' : 'flex-row-reverse'}`}>
                                                <div className={`w-1/2 flex items-center ${event.team.id === details.homeTeam.id ? 'justify-end pr-4' : 'justify-start pl-4'}`}>
                                                    <div className={`text-sm ${event.team.id === details.homeTeam.id ? 'text-right' : 'text-left'}`}>
                                                        <div className="font-bold flex items-center space-x-2">
                                                            {event.type === 'Goal' && <span className="text-xl">⚽</span>}
                                                            {event.type === 'Card' && event.detail === 'Yellow Card' && <div className="w-3 h-4 bg-yellow-400 rounded-sm inline-block"></div>}
                                                            {event.type === 'Card' && event.detail === 'Red Card' && <div className="w-3 h-4 bg-red-600 rounded-sm inline-block"></div>}
                                                            {event.type === 'subst' && <span className="text-lg">⇄</span>}
                                                            <span>{event.type === 'subst' ? 'Substitution' : event.type}</span>
                                                        </div>
                                                        <p className="text-muted-foreground">
                                                            {event.player.name}
                                                            {event.assist && event.assist.name && <span className="text-xs opacity-75"> (ast. {event.assist.name})</span>}
                                                            {event.type === 'subst' && event.assist.name && <span className="text-xs opacity-75"> ▶ {event.assist.name}</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border border-border font-mono text-sm font-bold z-10">
                                                    {event.time.elapsed}'
                                                </div>
                                                <div className="w-1/2"></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-muted-foreground py-10">{t.matchDetails.noEvents}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'lineups' && (
                                <div className="grid grid-cols-2 gap-8">
                                    {details.lineups && details.lineups.length >= 2 ? (
                                        <>
                                            {/* Home Lineup */}
                                            <div>
                                                <h3 className="font-bold mb-4 flex items-center"><Shirt size={16} className="mr-2" /> {details.homeTeam.name}</h3>
                                                {details.lineups[0].coach && (
                                                    <div className="mb-4 text-sm bg-muted/30 p-2 rounded-lg">
                                                        <span className="text-muted-foreground">Coach: </span>
                                                        <span className="font-medium">{details.lineups[0].coach.name}</span>
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground mb-2">{t.matchDetails.startingXI}</div>
                                                    {details.lineups[0].startXI.map((player, idx) => {
                                                        // Find rating
                                                        const playerStats = details.players.find(p => p.team.id === details.homeTeam.id)?.players.find(p => p.player.id === player.player.id);
                                                        const rating = playerStats?.statistics[0]?.games?.rating;

                                                        return (
                                                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                                                                        {player.player.number}
                                                                    </div>
                                                                    <span className="text-sm">{player.player.name}</span>
                                                                </div>
                                                                {rating && (
                                                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${parseFloat(rating) >= 7.0 ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                                                        {rating}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">{t.matchDetails.substitutes}</div>
                                                    {details.lineups[0].substitutes.map((player, idx) => (
                                                        <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 opacity-75">
                                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                                                                {player.player.number}
                                                            </div>
                                                            <span className="text-sm">{player.player.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Away Lineup */}
                                            <div>
                                                <h3 className="font-bold mb-4 flex items-center"><Shirt size={16} className="mr-2" /> {details.awayTeam.name}</h3>
                                                {details.lineups[1].coach && (
                                                    <div className="mb-4 text-sm bg-muted/30 p-2 rounded-lg">
                                                        <span className="text-muted-foreground">Coach: </span>
                                                        <span className="font-medium">{details.lineups[1].coach.name}</span>
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <div className="text-sm font-medium text-muted-foreground mb-2">{t.matchDetails.startingXI}</div>
                                                    {details.lineups[1].startXI.map((player, idx) => {
                                                        // Find rating
                                                        const playerStats = details.players.find(p => p.team.id === details.awayTeam.id)?.players.find(p => p.player.id === player.player.id);
                                                        const rating = playerStats?.statistics[0]?.games?.rating;

                                                        return (
                                                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                                                                        {player.player.number}
                                                                    </div>
                                                                    <span className="text-sm">{player.player.name}</span>
                                                                </div>
                                                                {rating && (
                                                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${parseFloat(rating) >= 7.0 ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                                                        {rating}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    <div className="text-sm font-medium text-muted-foreground mt-4 mb-2">{t.matchDetails.substitutes}</div>
                                                    {details.lineups[1].substitutes.map((player, idx) => (
                                                        <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 opacity-75">
                                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-mono">
                                                                {player.player.number}
                                                            </div>
                                                            <span className="text-sm">{player.player.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-2 text-center text-muted-foreground py-10">{t.matchDetails.noLineups}</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'stats' && (
                                <div className="max-w-2xl mx-auto space-y-6">
                                    {details.statistics && details.statistics.length >= 2 ? (
                                        details.statistics[0].statistics.map((stat, idx) => {
                                            const homeValue = stat.value || 0;
                                            const awayValue = details.statistics[1].statistics[idx].value || 0;
                                            const total = (parseInt(homeValue) || 0) + (parseInt(awayValue) || 0);
                                            const homePercent = total > 0 ? ((parseInt(homeValue) || 0) / total) * 100 : 50;

                                            return (
                                                <div key={idx} className="space-y-1">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>{homeValue}</span>
                                                        <span className="text-muted-foreground">{stat.type}</span>
                                                        <span>{awayValue}</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                                                        <div
                                                            className="h-full bg-primary transition-all duration-500"
                                                            style={{ width: `${homePercent}%` }}
                                                        ></div>
                                                        <div
                                                            className="h-full bg-red-500 transition-all duration-500"
                                                            style={{ width: `${100 - homePercent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center text-muted-foreground py-10">{t.matchDetails.noStats}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
