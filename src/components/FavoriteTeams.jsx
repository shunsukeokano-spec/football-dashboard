import React, { useState, useEffect } from 'react';
import { Star, ChevronRight } from 'lucide-react';

export const FavoriteTeams = ({ onTeamClick }) => {
    const [favorites, setFavorites] = useState([]);
    const [teamData, setTeamData] = useState({});

    useEffect(() => {
        // Load favorites from localStorage
        const loadFavorites = () => {
            const favIds = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
            setFavorites(favIds);

            // Load cached team data
            const cached = JSON.parse(localStorage.getItem('favoriteTeamsData') || '{}');
            setTeamData(cached);
        };

        loadFavorites();

        // Listen for storage changes (when favorites are updated)
        const handleStorageChange = () => {
            loadFavorites();
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event from same window
        window.addEventListener('favoritesUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('favoritesUpdated', handleStorageChange);
        };
    }, []);

    if (favorites.length === 0) {
        return null; // Don't show section if no favorites
    }

    return (
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                    <Star size={20} className="text-yellow-500 mr-2 fill-yellow-500" />
                    Favorite Teams
                </h2>
                <span className="text-sm text-muted-foreground">{favorites.length} team{favorites.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {favorites.map((teamId) => {
                    const team = teamData[teamId];

                    return (
                        <div
                            key={teamId}
                            onClick={() => onTeamClick(teamId)}
                            className="group relative bg-card rounded-xl p-4 border border-border hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg hover:scale-105"
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {team?.logo ? (
                                        <img
                                            src={team.logo}
                                            alt={team.name || 'Team'}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                                            <Star size={24} className="text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-center w-full">
                                    <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                        {team?.name || 'Loading...'}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={16} className="text-primary" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
