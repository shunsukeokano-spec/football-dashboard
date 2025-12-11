import React, { useState } from 'react';
import { LayoutDashboard, Trophy, Calendar, Settings, User, Menu, X, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { translations } from '../utils/translations';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
        title={label}
    >
        <Icon size={20} className="flex-shrink-0" />
        <span className="font-medium truncate">{label}</span>
    </div>
);

export const Layout = ({ children, activeTab, onNavigate, language = 'en' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebar_collapsed') === 'true';
    });
    const t = translations[language] || translations['en'];

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('sidebar_collapsed', newState);
    };

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
                fixed md:static inset-y-0 left-0 z-40 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                ${isSidebarCollapsed ? 'md:w-16' : 'md:w-64'}
                w-64
            `}>
                <div className="p-6 flex items-center justify-between hidden md:flex">
                    <div className={`flex items-center space-x-3 ${isSidebarCollapsed ? 'hidden' : ''}`}>
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Trophy className="text-primary-foreground" size={20} />
                        </div>
                        <span className="font-bold text-xl tracking-tight">FootyDash</span>
                    </div>
                    {isSidebarCollapsed && (
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
                            <Trophy className="text-primary-foreground" size={20} />
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
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

                    <div className="pt-4 pb-2">
                        <div className="h-px bg-border mx-4"></div>
                    </div>

                    <SidebarItem
                        icon={Globe}
                        label="World Cup 2026"
                        active={activeTab === 'world-cup'}
                        onClick={() => handleMobileNavigate('world-cup')}
                    />
                    <div className="pt-4">
                        {!isSidebarCollapsed && (
                            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Leagues
                            </p>
                        )}
                        <SidebarItem
                            icon={Trophy}
                            label={isSidebarCollapsed ? "PL" : "Premier League"}
                            active={false}
                            onClick={() => handleMobileNavigate('league', 39)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label={isSidebarCollapsed ? "LL" : "La Liga"}
                            active={false}
                            onClick={() => handleMobileNavigate('league', 140)}
                        />
                        <SidebarItem
                            icon={Trophy}
                            label={isSidebarCollapsed ? "JL" : "J League"}
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
