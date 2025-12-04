import React, { useState, useEffect } from 'react';
import { X, Trophy, Target, Calendar } from 'lucide-react';
import { fetchLeagueStandings, fetchTopScorers, LEAGUE_NAMES } from '../services/apiDataService';
import { StandingsTable } from './StandingsTable';
import { TopScorers } from './TopScorers';
import { MatchCard } from './MatchCard';

export const LeaguePage = ({ leagueId, onClose, onTeamClick, onMatchClick, matches, language = 'en' }) => {
    const [activeTab, setActiveTab] = useState('standings');
    const [standings, setStandings] = useState(null);
    const [topScorers, setTopScorers] = useState(null);
    const [loading, setLoading] = useState(true);

    const leagueName = LEAGUE_NAMES[leagueId] || 'League';

    useEffect(() => {
        const loadLeagueData = async () => {
            setLoading(true);

            const [standingsData, scorersData] = await Promise.all([
                fetchLeagueStandings(leagueId),
                fetchTopScorers(leagueId, 2024, 10)
            ]);

            setStandings(standingsData);
            setTopScorers(scorersData);
            setLoading(false);
        };

        if (leagueId) {
            loadLeagueData();
        }
    }, [leagueId]);

    // Filter matches for this league
    const leagueMatches = matches.filter(m => m.league === leagueName);
    const recentMatches = leagueMatches
        .filter(m => m.status === 'FT')
        .slice(0, 10);

    const tabs = [
        { id: 'standings', label: 'Standings', icon: Trophy },
        { id: 'scorers', label: 'Top Scorers', icon: Target },
        { id: 'matches', label: 'Recent Matches', icon: Calendar }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-border">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <h2 className="text-2xl font-bold mb-2">{leagueName}</h2>
                    <p className="text-sm text-muted-foreground">Season 2024/2025</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border bg-muted/30">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                                        ? 'text-primary border-b-2 border-primary bg-background'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-background custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'standings' && (
                                <StandingsTable standings={standings} onTeamClick={onTeamClick} />
                            )}

                            {activeTab === 'scorers' && (
                                <TopScorers scorers={topScorers} onTeamClick={onTeamClick} />
                            )}

                            {activeTab === 'matches' && (
                                <div>
                                    {recentMatches.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {recentMatches.map((match) => (
                                                <MatchCard
                                                    key={match.id}
                                                    match={match}
                                                    onClick={() => onMatchClick(match.id)}
                                                    language={language}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-muted-foreground">
                                            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>No recent matches available for this league</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
