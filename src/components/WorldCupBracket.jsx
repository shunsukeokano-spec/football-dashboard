import React from 'react';
import { bracketData } from '../data/worldCupData';

const BracketMatch = ({ home, away, isFinal }) => (
    <div className={`bg-[#1e293b] border border-slate-700 rounded-lg p-3 w-full mb-4 relative ${isFinal ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : ''}`}>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400">?</span>
                <span className="text-sm text-slate-300 font-medium">{home.name}</span>
            </div>
            <span className="text-slate-500 text-xs font-mono">-</span>
        </div>
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400">?</span>
                <span className="text-sm text-slate-300 font-medium">{away.name}</span>
            </div>
            <span className="text-slate-500 text-xs font-mono">-</span>
        </div>

        {/* Connector lines would be complex css, simplifying for now */}
    </div>
);

export const WorldCupBracket = () => {
    return (
        <div className="overflow-x-auto pb-8">
            <div className="flex space-x-12 min-w-[1200px] px-4">
                {bracketData.rounds.map((round, roundIndex) => (
                    <div key={roundIndex} className="flex-1 flex flex-col justify-around">
                        <div className="text-center mb-6">
                            <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm">{round.title}</h3>
                            <div className="h-0.5 w-12 bg-blue-500/30 mx-auto mt-2"></div>
                        </div>
                        <div className="flex flex-col justify-around h-full space-y-8">
                            {round.matches.map((match, matchIndex) => (
                                <BracketMatch
                                    key={matchIndex}
                                    home={match.team1}
                                    away={match.team2}
                                    isFinal={round.title === 'Final'}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
