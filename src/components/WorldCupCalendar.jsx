import React, { useState } from 'react';
import { schedule, groups } from '../data/worldCupData';
import { MapPin, Calendar as CalendarIcon, Filter, X } from 'lucide-react';

export const WorldCupCalendar = ({ onGroupClick }) => {
    const [selectedTeamId, setSelectedTeamId] = useState(null);

    // Flatten all teams for the filter list
    const allTeams = Object.values(groups).flat().sort((a, b) => a.name.localeCompare(b.name));

    // Filter matches
    const filteredSchedule = selectedTeamId
        ? schedule.filter(m => m.team1.id === selectedTeamId || m.team2.id === selectedTeamId)
        : schedule;

    // Group matches by date
    const matchesByDate = filteredSchedule.reduce((acc, match) => {
        const date = match.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
        return acc;
    }, {});

    const sortedDates = Object.keys(matchesByDate).sort();

    return (
        <div className="space-y-8">
            {/* Team Filter Bar */}
            <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-4 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Filter size={14} className="mr-2" />
                        Filter by Team
                    </h3>
                    {selectedTeamId && (
                        <button
                            onClick={() => setSelectedTeamId(null)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                        >
                            <X size={12} className="mr-1" />
                            Clear Filter
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 pb-2">
                    {allTeams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(selectedTeamId === team.id ? null : team.id)}
                            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-sm transition-all ${selectedTeamId === team.id
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
                                }`}
                        >
                            <span className="text-lg leading-none">{team.flag}</span>
                            <span className="font-medium">{team.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {sortedDates.length > 0 ? (
                sortedDates.map(date => {
                    const dateObj = new Date(date);
                    const day = dateObj.getDate();
                    const month = dateObj.getMonth() + 1; // 1-indexed
                    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                        <div key={date} id={`date-${date}`} className="rounded-xl overflow-hidden border border-slate-700/50 bg-[#1e293b]/50 scroll-mt-24">
                            {/* Premium Date Header */}
                            <div className="bg-[#0B1120] p-4 flex items-center space-x-4 border-l-4 border-yellow-500">
                                <CalendarIcon size={20} className="text-yellow-500" />
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-black text-white tracking-tight">{month}/{day}</span>
                                    <span className="text-yellow-500/80 font-bold uppercase tracking-widest text-sm">{weekday}</span>
                                </div>
                            </div>

                            {/* Matches Grid */}
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {matchesByDate[date].map(match => (
                                    <div key={match.id} className="bg-[#0f172a] p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-colors group">
                                        <div className="flex justify-between items-start mb-4">
                                            {match.group ? (
                                                <button
                                                    onClick={() => onGroupClick && onGroupClick(match.group)}
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 ${onGroupClick ? 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/50 transition-colors cursor-pointer' : ''}`}
                                                >
                                                    Group {match.group}
                                                </button>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                                                    {match.stage}
                                                </span>
                                            )}
                                            <div className="flex items-center text-xs text-slate-400">
                                                <MapPin size={12} className="mr-1" />
                                                {match.venue.city}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Home Team */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{match.team1.flag}</span>
                                                    <span className="font-semibold text-slate-200">{match.team1.name}</span>
                                                </div>
                                                <span className="text-slate-600 text-sm font-mono">-</span>
                                            </div>

                                            {/* Away Team */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{match.team2.flag}</span>
                                                    <span className="font-semibold text-slate-200">{match.team2.name}</span>
                                                </div>
                                                <span className="text-slate-600 text-sm font-mono">-</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                                            <span className="text-xs text-slate-500 font-medium">{match.venue.name}</span>
                                            <span className="text-sm font-bold text-blue-400">{match.time} <span className="text-[10px] opacity-70">JST</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="py-20 text-center text-slate-500 bg-[#1e293b]/50 rounded-xl border border-dashed border-slate-700">
                    <p className="text-lg mb-2">No matches found for this filter.</p>
                    <button onClick={() => setSelectedTeamId(null)} className="text-blue-400 hover:underline">Clear Filter</button>
                </div>
            )}
        </div>
    );
};
