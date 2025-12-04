import React from 'react';
import { Trophy, Target } from 'lucide-react';

export const TopScorers = ({ scorers, onTeamClick }) => {
    if (!scorers || scorers.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No top scorers data available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {scorers.map((scorer) => (
                <div
                    key={scorer.playerId}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => onTeamClick && onTeamClick(scorer.teamId)}
                >
                    {/* Left: Rank + Player Info */}
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Rank */}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${scorer.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                                scorer.rank === 2 ? 'bg-gray-400 text-gray-900' :
                                    scorer.rank === 3 ? 'bg-orange-600 text-orange-100' :
                                        'bg-muted text-muted-foreground'
                            }`}>
                            {scorer.rank === 1 ? <Trophy size={20} /> : scorer.rank}
                        </div>

                        {/* Player Photo */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                            {scorer.playerPhoto ? (
                                <img
                                    src={scorer.playerPhoto}
                                    alt={scorer.playerName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Target size={24} className="text-muted-foreground" />
                            )}
                        </div>

                        {/* Player Name + Team */}
                        <div className="flex-1">
                            <p className="font-semibold group-hover:text-primary transition-colors">
                                {scorer.playerName}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <img
                                    src={scorer.teamLogo}
                                    alt={scorer.teamName}
                                    className="w-4 h-4 object-contain"
                                />
                                <span>{scorer.teamName}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex items-center space-x-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">{scorer.goals}</p>
                            <p className="text-xs text-muted-foreground">Goals</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-lg font-semibold text-muted-foreground">{scorer.assists}</p>
                            <p className="text-xs text-muted-foreground">Assists</p>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm text-muted-foreground">{scorer.appearances}</p>
                            <p className="text-xs text-muted-foreground">Apps</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
