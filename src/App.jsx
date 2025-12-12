import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Bug } from 'lucide-react';
import { MatchCard } from './components/MatchCard';
import { MatchDetails } from './components/MatchDetails';
import { TeamDetails } from './components/TeamDetails';
import { Schedule } from './components/Schedule';
import { SettingsModal } from './components/SettingsModal';
import { FavoriteTeams } from './components/FavoriteTeams';
import { LeaguePage } from './components/LeaguePage';
import { WorldCupLayout } from './components/WorldCupLayout';
import { WorldCupCalendar } from './components/WorldCupCalendar';
import { WorldCupBracket } from './components/WorldCupBracket';
import { WorldCupGroups } from './components/WorldCupGroups';
import { PlayerModal } from './components/PlayerModal';
import { DebugView } from './components/DebugView';
import { subscribeToUpdates, getApiError } from './services/apiDataService';
import { translations } from './utils/translations';

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'schedule'
  const [showSettings, setShowSettings] = useState(false);

  // Settings state
  const [language, setLanguage] = useState(() => localStorage.getItem('football_lang') || 'en');
  const [theme, setTheme] = useState(() => localStorage.getItem('football_theme') || 'dark');
  const [isWorldCupMode, setIsWorldCupMode] = useState(() => localStorage.getItem('football_wc_mode') === 'true');
  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    const saved = localStorage.getItem('football_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [wcSelectedGroup, setWcSelectedGroup] = useState(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('football_lang', language);
    localStorage.setItem('football_theme', theme);
    localStorage.setItem('football_wc_mode', isWorldCupMode);
    localStorage.setItem('football_favorites', JSON.stringify(favoriteTeams));
    document.documentElement.className = theme;
  }, [language, theme, isWorldCupMode, favoriteTeams]);

  useEffect(() => {
    const unsubscribe = subscribeToUpdates((data) => {
      console.log(`[App] Received ${data.length} matches from service`);
      if (data.length > 0) {
        console.log('[App] First match:', data[0]);
        console.log('[App] Match statuses:', data.map(m => m.status));
      }
      setMatches(data);
      setLoading(false);
    }, language);

    return () => unsubscribe();
  }, [language]);

  const t = translations[language] || translations['en'];

  const toggleFavorite = (teamId) => {
    setFavoriteTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      }
      return [...prev, teamId];
    });
  };

  const filteredMatches = showFavoritesOnly
    ? matches.filter(m => favoriteTeams.includes(m.homeTeam.id) || favoriteTeams.includes(m.awayTeam.id))
    : matches;

  const liveMatches = filteredMatches.filter(m => m.status === 'LIVE');
  const upcomingMatches = filteredMatches.filter(m => m.status === 'UPCOMING');
  const completedMatches = filteredMatches.filter(m => m.status === 'FT');

  const handleTeamClick = (teamId) => {
    setSelectedMatchId(null); // Close match details if open
    setSelectedTeamId(teamId);
  };

  const handleNavigation = (view, leagueId) => {
    if (view === 'settings') {
      setShowSettings(true);
    } else if (view === 'league') {
      setSelectedLeagueId(leagueId);
      setCurrentView('league');
    } else if (view === 'world-cup') {
      setIsWorldCupMode(true);
      setCurrentView('world-cup');
    } else {
      setCurrentView(view);
      setSelectedLeagueId(null);
    }
  };

  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      {isWorldCupMode ? (
        <WorldCupLayout
          activeTab={selectedLeagueId || 'dashboard'} // Use selectedLeagueId, default to dashboard
          onNavigate={(view) => {
            if (view === 'exit') {
              setIsWorldCupMode(false); // Disable World Cup mode
              setCurrentView('dashboard');
              setSelectedLeagueId(null);
            } else {
              setSelectedLeagueId(view);
            }
          }}
          language={language}
        >
          {selectedLeagueId === 'schedule' && <WorldCupCalendar onGroupClick={(group) => {
            setWcSelectedGroup(group);
            setSelectedLeagueId('groups');
          }} />}
          {selectedLeagueId === 'bracket' && <WorldCupBracket />}
          {selectedLeagueId === 'groups' && <WorldCupGroups activeGroup={wcSelectedGroup} onSelectGroup={setWcSelectedGroup} />}
          {(selectedLeagueId === 'dashboard' || !selectedLeagueId) && (
            <div className="text-center py-10">
              <h2 className="text-3xl font-bold text-slate-200 mb-4">FIFA World Cup 2026</h2>
              <div className="max-w-3xl mx-auto text-slate-400 space-y-4">
                <p>Hosted by Canada, Mexico, and the United States.</p>
                <p>48 Teams. 104 Matches. The biggest World Cup ever.</p>
              </div>
              <div className="mt-8">
                <WorldCupCalendar onGroupClick={(group) => {
                  setWcSelectedGroup(group);
                  setSelectedLeagueId('groups');
                }} />
              </div>
            </div>
          )}
        </WorldCupLayout>
      ) : (
        <Layout
          activeTab={currentView}
          onNavigate={handleNavigation}
          language={language}
        >
          {currentView === 'dashboard' && (
            <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1">{t.dashboard}</h1>
                  <p className="text-muted-foreground">{t.welcome}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-colors ${showFavoritesOnly ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : 'bg-card border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="text-lg">{showFavoritesOnly ? '★' : '☆'}</span>
                    <span className="text-sm font-medium">Favorites</span>
                  </button>
                  <div className="hidden md:flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-sm font-medium">{liveMatches.length} {t.live}</span>
                  </div>
                  <button
                    onClick={() => setCurrentView('debug')}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                    title="Debug API"
                  >
                    <Bug size={20} />
                  </button>
                </div>
              </div>

              {/* API ERROR BANNER */}
              {getApiError() && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start space-x-3 text-red-500 animate-in slide-in-from-top-2">
                  <Bug className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold">API Error Detected</h3>
                    <pre className="text-xs mt-1 bg-red-500/5 p-2 rounded">{JSON.stringify(getApiError(), null, 2)}</pre>
                    <p className="text-sm mt-2">The API provider has rejected the request. Please wait or upgrade plan.</p>
                  </div>
                </div>
              )}

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
                        favoriteTeams={favoriteTeams}
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
                        favoriteTeams={favoriteTeams}
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
                        favoriteTeams={favoriteTeams}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State - when no matches at all */}
              {!loading && liveMatches.length === 0 && upcomingMatches.length === 0 && completedMatches.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-6xl mb-4">⚽</div>
                  <h3 className="text-xl font-bold mb-2">No Matches Available</h3>
                  <p className="text-muted-foreground mb-4">
                    The API isn't returning any matches right now. This could be due to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-6">
                    <li>• API rate limit reached (100 requests/day)</li>
                    <li>• No matches scheduled for recent dates</li>
                    <li>• Temporary API service issue</li>
                  </ul>
                  <p className="text-sm text-primary">
                    Try the <strong>Schedule</strong> view to browse specific dates
                  </p>
                </div>
              )}
            </div>
          )}

          {currentView === 'schedule' && (
            <Schedule
              language={language}
              onMatchClick={setSelectedMatchId}
            />
          )}

          {currentView === 'league' && selectedLeagueId && (
            <LeaguePage
              leagueId={selectedLeagueId}
              onClose={() => setCurrentView('dashboard')}
              onTeamClick={handleTeamClick}
              onMatchClick={(matchId) => setSelectedMatchId(matchId)}
              matches={matches}
              language={language}
            />
          )}

          {currentView === 'debug' && (
            <DebugView onClose={() => setCurrentView('dashboard')} />
          )}
        </Layout>
      )}

      {/* Modals */}
      {selectedMatchId && (
        <MatchDetails
          matchId={selectedMatchId}
          onClose={() => setSelectedMatchId(null)}
          onTeamClick={handleTeamClick}
          language={language}
          favoriteTeams={favoriteTeams}
          toggleFavorite={toggleFavorite}
        />
      )}

      {selectedTeamId && (
        <TeamDetails
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          onLeagueClick={(leagueId) => {
            setSelectedTeamId(null);
            setSelectedLeagueId(leagueId);
          }}
          language={language}
          favoriteTeams={favoriteTeams}
          toggleFavorite={toggleFavorite}
        />
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          isWorldCupMode={isWorldCupMode}
          onToggleWorldCup={() => setIsWorldCupMode(!isWorldCupMode)}
        />
      )}
      {currentView === 'debug' && (
        <div className="fixed inset-0 z-50 bg-background overflow-auto">
          <div className="p-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg"
            >
              Back to Dashboard
            </button>
            <DebugView />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
