import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { MatchCard } from './components/MatchCard';
import { MatchDetails } from './components/MatchDetails';
import { TeamDetails } from './components/TeamDetails';
import { Schedule } from './components/Schedule';
import { SettingsModal } from './components/SettingsModal';
import { FavoriteTeams } from './components/FavoriteTeams';
import { subscribeToUpdates } from './services/apiDataService';
import { translations } from './utils/translations';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'schedule'
  const [showSettings, setShowSettings] = useState(false);

  // Settings state
  const [language, setLanguage] = useState(() => localStorage.getItem('football_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('football_theme') || 'dark');

  // Persist settings
  useEffect(() => {
    localStorage.setItem('football_lang', language);
    localStorage.setItem('football_theme', theme);
    document.documentElement.className = theme;
  }, [language, theme]);

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((data) => {
      setMatches(data);
      setLoading(false);
    }, language);

    return () => unsubscribe();
  }, [language]);

  const t = translations[language] || translations['en'];

  const liveMatches = matches.filter(m => m.status === 'LIVE');
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING');
  const completedMatches = matches.filter(m => m.status === 'FT');

  const handleTeamClick = (teamId) => {
    setSelectedMatchId(null); // Close match details if open
    setSelectedTeamId(teamId);
  };

  const handleNavigation = (view) => {
    if (view === 'settings') {
      setShowSettings(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      <Layout
        activeTab={currentView}
        onNavigate={handleNavigation}
        language={language}
      >
        {currentView === 'dashboard' ? (
          <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">{t.dashboard}</h1>
                <p className="text-muted-foreground">{t.welcome}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-medium">{liveMatches.length} {t.live}</span>
                </div>
              </div>
            </div>

            {/* Favorite Teams */}
            <FavoriteTeams onTeamClick={handleTeamClick} language={language} />

            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="w-1.5 h-6 bg-red-500 rounded-full mr-3"></span>
                    {t.liveMatches}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => setSelectedMatchId(match.id)}
                      onTeamClick={handleTeamClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Matches */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="w-1.5 h-6 bg-primary rounded-full mr-3"></span>
                  {t.upcomingMatches}
                </h2>
                <div className="flex items-center space-x-2">
                  {matches.length > 0 && (
                    <select className="bg-card border border-border text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Leagues</option>
                      {[...new Set(matches.map(m => m.league))].map(league => (
                        <option key={league}>{league}</option>
                      ))}
                    </select>
                  )}
                  <button className="text-sm text-primary hover:underline">{t.viewAll}</button>
                </div>
              </div>
              {upcomingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => setSelectedMatchId(match.id)}
                      onTeamClick={handleTeamClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  No upcoming matches scheduled for today.
                </div>
              )}
            </div>

            {/* Completed Matches */}
            {completedMatches.length > 0 && (
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="w-1.5 h-6 bg-muted-foreground rounded-full mr-3"></span>
                    {t.completedMatches}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedMatches.map(match => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => setSelectedMatchId(match.id)}
                      onTeamClick={handleTeamClick}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Schedule
            language={language}
            onMatchClick={setSelectedMatchId}
          />
        )}
      </Layout>

      {/* Modals */}
      {selectedMatchId && (
        <MatchDetails
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
          onTeamClick={handleTeamClick}
          language={language}
        />
      )}

      {selectedTeamId && (
        <TeamDetails
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          language={language}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </div>
  );
}

export default App;
