import React, { useState } from 'react';
import { Trophy, Calendar, AlertCircle } from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const API_BASE_URL = 'https://v3.football.api-sports.io';

export const DebugView = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rawMatches, setRawMatches] = useState([]);

    const addLog = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    const runDebugFetch = async () => {
        setLoading(true);
        setLogs([]);
        setRawMatches([]);
        addLog('Starting debug fetch...');

        try {
            // Fetch last 5 days
            const today = new Date();
            const dates = [];
            for (let i = 0; i < 5; i++) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                dates.push(d.toISOString().split('T')[0]);
            }

            addLog(`Checking dates: ${dates.join(', ')}`);

            const allMatches = [];

            for (const date of dates) {
                addLog(`Fetching ${date}...`);
                const response = await fetch(`${API_BASE_URL}/fixtures?date=${date}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`, {
                    headers: {
                        'x-rapidapi-key': API_KEY,
                        'x-rapidapi-host': 'v3.football.api-sports.io'
                    }
                });

                const data = await response.json();

                if (data.errors && Object.keys(data.errors).length > 0) {
                    addLog(`ERROR for ${date}: ${JSON.stringify(data.errors)}`);
                } else {
                    const count = data.response ? data.response.length : 0;
                    addLog(`Success ${date}: Found ${count} total matches`);

                    if (data.response) {
                        // Filter for our leagues just to see
                        const ourLeagues = data.response.filter(m => [39, 140, 98].includes(m.league.id));
                        addLog(`  -> ${ourLeagues.length} matches in PL/LaLiga/JLeague`);
                        if (ourLeagues.length > 0) {
                            allMatches.push(...ourLeagues);
                        }
                    }
                }
            }

            setRawMatches(allMatches);
            addLog('Debug fetch complete.');

        } catch (err) {
            addLog(`CRITICAL ERROR: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-background min-h-screen text-foreground">
            <h1 className="text-2xl font-bold mb-4 flex items-center">
                <AlertCircle className="mr-2 text-yellow-500" />
                Debug Mode
            </h1>

            <button
                onClick={runDebugFetch}
                disabled={loading}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg mb-6 disabled:opacity-50"
            >
                {loading ? 'Running Diagnostics...' : 'Run API Diagnostics'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-4 rounded-lg border border-border">
                    <h2 className="font-semibold mb-2">Console Logs</h2>
                    <div className="bg-muted p-2 rounded h-64 overflow-y-auto font-mono text-xs">
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1">{log}</div>
                        ))}
                        {logs.length === 0 && <span className="text-muted-foreground">Ready to run...</span>}
                    </div>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border">
                    <h2 className="font-semibold mb-2">Found Matches ({rawMatches.length})</h2>
                    <div className="bg-muted p-2 rounded h-64 overflow-y-auto">
                        {rawMatches.map(m => (
                            <div key={m.fixture.id} className="mb-2 p-2 bg-background rounded border border-border text-xs">
                                <div className="font-bold text-primary">{m.league.name}</div>
                                <div>{m.teams.home.name} vs {m.teams.away.name}</div>
                                <div className="text-muted-foreground">{m.fixture.date}</div>
                            </div>
                        ))}
                        {rawMatches.length === 0 && <span className="text-muted-foreground">No matches found yet...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
