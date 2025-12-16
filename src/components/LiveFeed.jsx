import React from 'react';
import { Activity } from 'lucide-react';


export const LiveFeed = ({ matches, language = 'en' }) => {


    // Aggregate all events from all live matches
    const allEvents = matches
        .filter(m => m.status === 'LIVE')
        .flatMap(m => m.events.map(e => ({ ...e, match: m })))
        .sort((a, b) => b.id - a.id) // Sort by newest first
        .slice(0, 10); // Show last 10 events

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
                <Activity className="text-primary" size={20} />
                <h2 className="font-bold text-lg">{language === 'en' ? 'Live Feed' : 'ライブフィード'}</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {allEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        {language === 'en' ? 'No live events yet...' : 'ライブイベントはまだありません...'}
                    </div>
                ) : (
                    allEvents.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3 pb-3 border-b border-border/50 last:border-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="font-mono text-xs font-bold text-primary mt-1">
                                {event.minute}'
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">{event.type}</span>
                                    <span className="text-xs text-muted-foreground">{event.match.homeTeam.short} vs {event.match.awayTeam.short}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    <span className="font-medium text-foreground">{event.player}</span> ({event.match.homeTeam.id === event.teamId ? event.match.homeTeam.name : event.match.awayTeam.name})
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
