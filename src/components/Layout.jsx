import React from 'react';
import { LayoutDashboard, Trophy, Calendar, Settings, User } from 'lucide-react';
import { translations } from '../utils/translations';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </div>
);

export const Layout = ({ children, activeTab, onNavigate, language = 'en' }) => {
    const t = translations[language] || translations['en'];

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
                <div className="p-6 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Trophy className="text-primary-foreground" size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">FootyDash</span>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Matches"
                        active={activeTab === 'dashboard'}
                        onClick={() => onNavigate('dashboard')}
                    />
                    <SidebarItem
                        icon={Calendar}
                        label={t.schedule}
                        active={activeTab === 'schedule'}
                        onClick={() => onNavigate('schedule')}
                    />

                    {/* Leagues Section */}
                    <div className="pt-4">
                        <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Leagues
                        </p>
                        <SidebarItem
                            icon={Trophy}
                            label="Premier League"
                            active={false}
                            onClick={() => onNavigate('league', 39)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="La Liga"
                            active={false}
                            onClick={() => onNavigate('league', 140)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Bundesliga"
                            active={false}
                            onClick={() => onNavigate('league', 78)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Serie A"
                            active={false}
                            onClick={() => onNavigate('league', 135)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Ligue 1"
                            active={false}
                            onClick={() => onNavigate('league', 61)}
                        />
                    </div>

                    <SidebarItem
                        icon={Settings}
                        label={t.settings}
                        active={false}
                        onClick={() => onNavigate('settings')}
                    />
                </nav>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">User</p>
                            <p className="text-xs text-muted-foreground">Free Plan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};
