import React from 'react';
import { schedule } from '../data/worldCupData';
import { Calendar, ChevronDown } from 'lucide-react';

export const WorldCupOverview = () => {
    // Get all dates that have matches
    const matchDates = new Set(schedule.map(m => m.date));

    // Scroll to date function
    const scrollToDate = (dateStr) => {
        const element = document.getElementById(`date-${dateStr}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Render a single month
    const renderMonth = (year, month, monthName) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const days = [];

        // Padding for empty start days
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`pad-${i}`} className="h-8 md:h-10"></div>);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasMatches = matchDates.has(dateStr);


            days.push(
                <button
                    key={day}
                    disabled={!hasMatches}
                    onClick={() => scrollToDate(dateStr)}
                    className={`h-8 md:h-10 w-full rounded-md flex items-center justify-center text-xs md:text-sm font-medium transition-all ${hasMatches
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer'
                        : 'text-slate-700 cursor-default'
                        }`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="bg-[#1e293b] rounded-xl border border-slate-700 p-4">
                <h3 className="text-white font-bold mb-3 flex items-center justify-center">
                    {monthName} <span className="text-slate-500 ml-1 text-xs font-normal">2026</span>
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                        <div key={d} className="text-[10px] text-slate-500 font-bold mb-1">{d}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 md:p-8 mb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        FIFA WORLD CUP <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">2026</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        The biggest tournament in history. 48 teams, 3 nations, 104 matches.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Canada</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>Mexico</span>
                        <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>USA</span>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-slate-400 mb-4 text-sm font-medium">
                        <Calendar size={16} />
                        <span>Select a match day to view schedule</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderMonth(2026, 5, 'JUNE')}
                        {renderMonth(2026, 6, 'JULY')}
                    </div>

                    <div className="flex justify-center mt-8">
                        <ChevronDown className="text-slate-600 animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
};
