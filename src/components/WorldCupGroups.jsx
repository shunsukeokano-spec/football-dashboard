import React, { useState } from 'react';
import { groups, schedule } from '../data/worldCupData';
import { ChevronRight, Calendar, MapPin, X } from 'lucide-react';

export const WorldCupGroups = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);

    const [selectedGroupTeam, setSelectedGroupTeam] = useState(null);

    const groupKeys = Object.keys(groups).sort();

    // Helper to get matches for a group
    const getGroupMatches = (groupId) => {
        let matches = schedule.filter(m => m.group === groupId).sort((a, b) => new Date(a.date) - new Date(b.date));
        if (selectedGroupTeam) {
            matches = matches.filter(m => m.team1.id === selectedGroupTeam || m.team2.id === selectedGroupTeam);
        }
        return matches;
    };

    // Reset selected team when group changes (or closes)
    const handleCloseGroup = () => {
        setSelectedGroup(null);
        setSelectedGroupTeam(null);
    };

    if (selectedGroup) {
        const groupTeams = groups[selectedGroup];
        const groupMatches = getGroupMatches(selectedGroup);

        return (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <button
                    onClick={handleCloseGroup}
                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6 transition-colors"
                >
                    <X size={16} />
                    <span>Back to Groups</span>
                </button>

                <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-6 mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-3xl font-bold text-white flex items-center">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full mr-4"></span>
                            Group {selectedGroup}
                        </h2>
                        {selectedGroupTeam && (
                            <button
                                onClick={() => setSelectedGroupTeam(null)}
                                className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
                            >
                                <X size={14} className="mr-1" />
                                Clear Filter
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {groupTeams.map(team => (
                            <div
                                key={team.id}
                                onClick={() => setSelectedGroupTeam(selectedGroupTeam === team.id ? null : team.id)}
                                className={`p-4 rounded-lg flex items-center space-x-4 border cursor-pointer transition-all ${selectedGroupTeam === team.id
                                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-500'
                                    }`}
                            >
                                <span className="text-3xl">{team.flag}</span>
                                <span className={`font-bold ${selectedGroupTeam === team.id ? 'text-white' : 'text-slate-200'}`}>
                                    {team.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-300 mb-4">Group Schedule</h3>
                {groupMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupMatches.map(match => (
                            <div key={match.id} className="bg-[#0f172a] p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded">
                                        <Calendar size={12} className="mr-1.5" />
                                        {match.date}
                                    </div>
                                    <span className="text-xs text-slate-500">JST</span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">{match.team1.flag}</span>
                                        <span className="font-semibold text-slate-200">{match.team1.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-xl">{match.team2.flag}</span>
                                        <span className="font-semibold text-slate-200">{match.team2.name}</span>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                                    <div className="flex items-center">
                                        <MapPin size={12} className="mr-1" />
                                        {match.venue.city}
                                    </div>
                                    <span>{match.time} JST</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-800/20 rounded-xl border border-dashed border-slate-700 text-slate-500">
                        Matches for this group are being scheduled.
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupKeys.map(group => (
                <div
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className="bg-[#1e293b] rounded-xl border border-slate-700 p-5 cursor-pointer hover:bg-slate-800 hover:border-blue-500 transition-all duration-300 group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-500 group-hover:text-blue-500 transition-colors select-none">
                        {group}
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-white">Group {group}</h3>
                            <ChevronRight className="text-slate-500 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                        </div>

                        <div className="space-y-2">
                            {groups[group].map(team => (
                                <div key={team.id} className="flex items-center space-x-3 text-slate-300 text-sm">
                                    <span className="text-lg">{team.flag}</span>
                                    <span>{team.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
