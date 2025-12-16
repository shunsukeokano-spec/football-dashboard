import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { LEAGUE_NAMES, getDisplaySeason } from '../services/apiDataService';
import { MatchCard } from './MatchCard';

export const LeaguePage = ({ leagueId, onMatchClick, matches, language = 'en' }) => {
    const [activeTab, setActiveTab] = useState('matches');

    const leagueName = LEAGUE_NAMES[leagueId] || 'League';
    const displaySeason = getDisplaySeason();

    // Filter matches for this league
    const leagueMatches = matches.filter(m => m.league === leagueName);
    const recentMatches = leagueMatches
        .filter(m => m.status === 'FT')
        .slice(0, 10);

    const tabs = [
        { id: 'matches', label: 'Recent Matches', icon: Calendar }
    ];

    return (
        <div className="flex-1 flex flex-col h-full bg-background animate-in fade-in duration-200">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-primary/20 to-primary/10 p-6 border-b border-border">
                <h2 className="text-2xl font-bold mb-2">{leagueName}</h2>
                <p className="text-sm text-muted-foreground">Season {displaySeason}/{displaySeason + 1}</p>
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
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
            </div>
        </div>
    );
};
