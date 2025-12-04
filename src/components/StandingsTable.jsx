import React from 'react';
import { ChevronUp, ChevronDown, Minus } from 'lucide-react';

export const StandingsTable = ({ standings, onTeamClick }) => {
    if (!standings || standings.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No standings data available
            </div>
        );
    }

    // Determine zone colors based on position
    const getZoneColor = (position) => {
        if (position <= 4) return 'border-l-4 border-l-green-500 bg-green-500/5'; // Champions League
        if (position <= 6) return 'border-l-4 border-l-orange-500 bg-orange-500/5'; // Europa League
        if (position >= standings.length - 2) return 'border-l-4 border-l-red-500 bg-red-500/5'; // Relegation
        return 'border-l-4 border-l-transparent';
    };

    // Parse form string to show last 5 matches
    const renderForm = (form) => {
        if (!form) return null;

        return (
            <div className="flex space-x-1">
                {form.split('').slice(-5).map((result, idx) => {
                    let bgColor = 'bg-muted';
                    let icon = <Minus size={12} />;

                    if (result === 'W') {
                        bgColor = 'bg-green-500';
                        icon = <ChevronUp size={12} />;
                    } else if (result === 'L') {
                        bgColor = 'bg-red-500';
                        icon = <ChevronDown size={12} />;
                    }

                    return (
                        <div
                            key={idx}
                            className={`w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-white`}
                            title={result === 'W' ? 'Win' : result === 'L' ? 'Loss' : 'Draw'}
                        >
                            {icon}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                    <tr>
                        <th className="text-left p-3 font-semibold">Pos</th>
                        <th className="text-left p-3 font-semibold">Team</th>
                        <th className="text-center p-3 font-semibold hidden md:table-cell">P</th>
                        <th className="text-center p-3 font-semibold hidden md:table-cell">W</th>
                        <th className="text-center p-3 font-semibold hidden md:table-cell">D</th>
                        <th className="text-center p-3 font-semibold hidden md:table-cell">L</th>
                        <th className="text-center p-3 font-semibold hidden lg:table-cell">GF</th>
                        <th className="text-center p-3 font-semibold hidden lg:table-cell">GA</th>
                        <th className="text-center p-3 font-semibold">GD</th>
                        <th className="text-center p-3 font-semibold font-bold">Pts</th>
                        <th className="text-center p-3 font-semibold hidden lg:table-cell">Form</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team) => (
                        <tr
                            key={team.teamId}
                            onClick={() => onTeamClick && onTeamClick(team.teamId)}
                            className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${getZoneColor(team.position)}`}
                        >
                            <td className="p-3 font-semibold text-muted-foreground">{team.position}</td>
                            <td className="p-3">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={team.teamLogo}
                                        alt={team.teamName}
                                        className="w-6 h-6 object-contain"
                                    />
                                    <span className="font-medium">{team.teamName}</span>
                                </div>
                            </td>
                            <td className="p-3 text-center hidden md:table-cell">{team.played}</td>
                            <td className="p-3 text-center hidden md:table-cell">{team.won}</td>
                            <td className="p-3 text-center hidden md:table-cell">{team.drawn}</td>
                            <td className="p-3 text-center hidden md:table-cell">{team.lost}</td>
                            <td className="p-3 text-center hidden lg:table-cell">{team.goalsFor}</td>
                            <td className="p-3 text-center hidden lg:table-cell">{team.goalsAgainst}</td>
                            <td className={`p-3 text-center font-semibold ${team.goalDifference > 0 ? 'text-green-500' : team.goalDifference < 0 ? 'text-red-500' : ''}`}>
                                {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                            </td>
                            <td className="p-3 text-center font-bold text-primary">{team.points}</td>
                            <td className="p-3 text-center hidden lg:table-cell">
                                {renderForm(team.form)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Champions League</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span>Europa League</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>Relegation</span>
                </div>
            </div>
        </div>
    );
};
