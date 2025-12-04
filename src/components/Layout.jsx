import React, { useState } from 'react';
import { LayoutDashboard, Trophy, Calendar, Settings, User, Menu, X } from 'lucide-react';
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = translations[language] || translations['en'];

    const handleMobileNavigate = (view, id) => {
        onNavigate(view, id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Trophy className="text-primary-foreground" size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">FootyDash</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center space-x-3 hidden md:flex">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Trophy className="text-primary-foreground" size={20} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">FootyDash</span>
                </div>

                {/* Mobile Menu Header */}
                <div className="md:hidden p-6 flex items-center justify-between border-b border-border">
                    <span className="font-bold text-xl">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Matches"
                        active={activeTab === 'dashboard'}
                        onClick={() => handleMobileNavigate('dashboard')}
                    />
                    <SidebarItem
                        icon={Calendar}
                        label={t.schedule}
                        active={activeTab === 'schedule'}
                        onClick={() => handleMobileNavigate('schedule')}
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
                            onClick={() => handleMobileNavigate('league', 39)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="La Liga"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 140)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Bundesliga"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 78)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Serie A"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 135)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Ligue 1"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 61)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="Eredivisie"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 88)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label="J League"
                            active={false}
                            onClick={() => handleMobileNavigate('league', 98)}
                        />
                    </div>

                    <SidebarItem
                        icon={Settings}
                        label={t.settings}
                        active={false}
                        onClick={() => handleMobileNavigate('settings')}
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
            <div className="flex-1 flex flex-col overflow-hidden pt-16 md:pt-0">
                {children}
            </div>
        </div>
    );
};
