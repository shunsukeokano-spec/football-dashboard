import React, { useEffect, useState } from 'react';
import { X, MapPin, Users, Shirt, Star } from 'lucide-react';
import { fetchTeamDetails } from '../services/apiDataService';
import { translations } from '../utils/translations';
import { PlayerModal } from './PlayerModal';

export const TeamDetails = ({ teamId, onClose, language = 'en' }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const t = translations[language] || translations['en'];

    // Load favorite status from localStorage
    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
        setIsFavorite(favorites.includes(teamId));
    }, [teamId]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favoriteTeams') || '[]');
        let newFavorites;

        if (isFavorite) {
            newFavorites = favorites.filter(id => id !== teamId);
        } else {
            newFavorites = [...favorites, teamId];
        }

        localStorage.setItem('favoriteTeams', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);

        // Dispatch custom event to notify FavoriteTeams component
        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            const data = await fetchTeamDetails(teamId, language);
            setDetails(data);
            setLoading(false);

            // Cache team data for favorites display
            if (data) {
                const cachedData = JSON.parse(localStorage.getItem('favoriteTeamsData') || '{}');
                cachedData[teamId] = {
                    name: data.name,
                    logo: data.logo
                };
                localStorage.setItem('favoriteTeamsData', JSON.stringify(cachedData));
            }
        };

        if (teamId) {
            loadDetails();
        }
    }, [teamId, language]);

    if (!teamId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
                {/* Header */}
                <div className="relative bg-muted/30 p-6 border-b border-border">
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                        <button
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' : 'hover:bg-muted text-muted-foreground hover:text-yellow-500'}`}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                            <Star size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : !details ? (
                        <div className="flex justify-center py-10 text-muted-foreground">
                            Failed to load team details
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <div className="w-24 h-24 bg-white rounded-xl p-4 shadow-sm flex items-center justify-center">
                                <img
                                    src={details.logo}
                                    alt={details.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="text-center md:text-left flex-1">
                                <h2 className="text-2xl font-bold mb-2">{details.name}</h2>
                                <div className="flex flex-col md:flex-row items-center md:items-start space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-1" />
                                        <span>{details.venue.name}, {details.venue.city}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Users size={16} className="mr-1" />
                                        <span>Capacity: {details.venue.capacity?.toLocaleString()}</span>
                                    </div>
                                    {details.coach && (
                                        <div className="flex items-center">
                                            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-muted">
                                                <img src={details.coach.photo} alt={details.coach.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-foreground">Coach: {details.coach.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                {!loading && details && (
                    <div className="flex-1 overflow-y-auto p-6 bg-background custom-scrollbar">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <Shirt size={20} className="mr-2" />
                            Squad
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {details.squad.map((player, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedPlayer(player)}
                                    className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                                        {player.photo ? (
                                            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Users size={20} className="text-muted-foreground" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm group-hover:text-primary transition-colors">{player.name}</div>
                                        <div className="text-xs text-muted-foreground flex items-center space-x-2">
                                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                                                {player.number || '-'}
                                            </span>
                                            <span>{player.position}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {details.squad.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                No squad information available.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Player Modal */}
            {selectedPlayer && (
                <PlayerModal
                    player={selectedPlayer}
                    teamName={details?.name}
                    onClose={() => setSelectedPlayer(null)}
                />
            )}
        </div>
    );
};
