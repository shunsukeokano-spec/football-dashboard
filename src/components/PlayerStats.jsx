import React from 'react';
import { Activity, Shield, Target, Zap } from 'lucide-react';

export const PlayerStats = ({ stats }) => {
    if (!stats) return null;

    const { games, goals, tackles, duels, dribbles, fouls, cards, passes } = stats;

    // Helper to calculate rating color
    const getRatingColor = (rating) => {
        const num = parseFloat(rating);
        if (num >= 8.0) return 'text-green-500';
        if (num >= 7.0) return 'text-blue-500';
        if (num >= 6.0) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rating</div>
                    <div className={`text-3xl font-bold ${getRatingColor(games.rating)}`}>
                        {games.rating ? parseFloat(games.rating).toFixed(1) : '-'}
                    </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Apps</div>
                    <div className="text-3xl font-bold">{games.appearences || 0}</div>
                    <div className="text-xs text-muted-foreground mt-1">{games.minutes || 0} mins</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Goals</div>
                    <div className="text-3xl font-bold text-primary">{goals.total || 0}</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-xl text-center">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Assists</div>
                    <div className="text-3xl font-bold text-blue-500">{goals.assists || 0}</div>
                </div>
            </div>

            {/* Detailed Stats Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attack */}
                <div className="bg-muted/20 rounded-xl p-5 border border-border">
                    <h4 className="flex items-center font-bold mb-4 text-primary">
                        <Target size={18} className="mr-2" />
                        Attacking
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Shots (On Target)</span>
                            <span className="font-medium">{stats.shots.total || 0} ({stats.shots.on || 0})</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Dribbles Success</span>
                            <span className="font-medium">{dribbles.success || 0} / {dribbles.attempts || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Pass Accuracy</span>
                            <span className="font-medium">{passes.accuracy || 0}%</span>
                        </div>
                    </div>
                </div>

                {/* Defense */}
                <div className="bg-muted/20 rounded-xl p-5 border border-border">
                    <h4 className="flex items-center font-bold mb-4 text-green-500">
                        <Shield size={18} className="mr-2" />
                        Defending
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Tackles</span>
                            <span className="font-medium">{tackles.total || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Interceptions</span>
                            <span className="font-medium">{tackles.interceptions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Duels Won</span>
                            <span className="font-medium">{duels.won || 0} / {duels.total || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Discipline */}
                <div className="bg-muted/20 rounded-xl p-5 border border-border">
                    <h4 className="flex items-center font-bold mb-4 text-yellow-500">
                        <Activity size={18} className="mr-2" />
                        Discipline
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Yellow Cards</span>
                            <span className="font-medium text-yellow-500">{cards.yellow || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Red Cards</span>
                            <span className="font-medium text-red-500">{cards.red || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Fouls Committed</span>
                            <span className="font-medium">{fouls.committed || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Other */}
                <div className="bg-muted/20 rounded-xl p-5 border border-border">
                    <h4 className="flex items-center font-bold mb-4 text-purple-500">
                        <Zap size={18} className="mr-2" />
                        Other
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Key Passes</span>
                            <span className="font-medium">{passes.key || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Saves (GK)</span>
                            <span className="font-medium">{goals.saves || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Penalties Scored</span>
                            <span className="font-medium">{stats.penalty.scored || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
