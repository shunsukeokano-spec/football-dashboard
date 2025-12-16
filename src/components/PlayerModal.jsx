import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Search, Youtube, TrendingUp, Activity } from 'lucide-react';
import { fetchPlayerStats } from '../services/apiDataService';
import { PlayerStats } from './PlayerStats';

export const PlayerModal = ({ player, teamName, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            if (player?.id) {
                setLoading(true);
                const data = await fetchPlayerStats(player.id);
                if (data && data.statistics && data.statistics.length > 0) {
                    setStats(data.statistics[0]);
                }
                setLoading(false);
            }
        };

        loadStats();
    }, [player?.id]);

    if (!player) return null;

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${player.name} ${teamName} football player`)}`;
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${player.name} ${teamName} highlights`)}`;
    const transfermarktSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${player.name} ${teamName} transfermarkt`)}`;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-card w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border relative"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {/* Header / Photo */}
                <div className="h-48 bg-gradient-to-b from-primary/20 to-background relative flex items-end justify-center pb-6 shrink-0">
                    <div className="w-32 h-32 rounded-full border-4 border-background bg-muted shadow-xl overflow-hidden">
                        <img
                            src={player.photo}
                            alt={player.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-border px-6">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Overview
                        {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === 'stats' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Season Stats
                        {activeTab === 'stats' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-1">{player.name}</h2>
                        <div className="flex justify-center items-center space-x-2 text-muted-foreground">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-bold text-sm">#{player.number || '-'}</span>
                            <span>{player.position}</span>
                        </div>
                    </div>

                    {activeTab === 'overview' ? (
                        <div className="space-y-3 max-w-sm mx-auto">
                            <a
                                href={googleSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                                        <Search size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Google Search</div>
                                        <div className="text-xs text-muted-foreground">Profile, News, Stats</div>
                                    </div>
                                </div>
                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            </a>

                            <a
                                href={youtubeSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                        <Youtube size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">YouTube</div>
                                        <div className="text-xs text-muted-foreground">Highlights & Skills</div>
                                    </div>
                                </div>
                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            </a>

                            <a
                                href={transfermarktSearchUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between w-full p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">Transfermarkt</div>
                                        <div className="text-xs text-muted-foreground">Market Value & History</div>
                                    </div>
                                </div>
                                <ExternalLink size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            </a>
                        </div>
                    ) : (
                        <div className="w-full">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : stats ? (
                                <PlayerStats stats={stats} />
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <Activity size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No detailed statistics available for this season.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
