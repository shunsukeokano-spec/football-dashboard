import React, { useState } from 'react';
import { LayoutDashboard, Trophy, Calendar, Settings, Globe, Shield, Menu, X, LogOut } from 'lucide-react';
import { translations } from '../utils/translations';

// eslint-disable-next-line no-unused-vars
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${active
            ? 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 shadow-md shadow-slate-500/20'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
    >
        <Icon size={20} className={active ? "text-slate-900" : "text-slate-400"} />
        <span className="font-medium tracking-wide">{label}</span>
    </div>
);

export const WorldCupLayout = ({ children, activeTab, onNavigate, language = 'en' }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = translations[language] || translations['en'];

    const handleMobileNavigate = (view, id) => {
        onNavigate(view, id);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#0f172a] text-slate-200 font-sans selection:bg-slate-500 selection:text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e293b] border-b border-slate-700/50 z-40 flex items-center justify-between px-4">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/20">
                        <Globe className="text-slate-900" size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-wider text-slate-100">WORLD CUP</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-200">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Header */}
                <div className="p-6 flex items-center space-x-3 border-b border-slate-700/50 hidden md:flex">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-500 rounded-lg flex items-center justify-center shadow-lg shadow-slate-500/20">
                        <Globe className="text-slate-900" size={24} />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-wider text-slate-100">WORLD CUP</span>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Official Hub</p>
                    </div>
                </div>

                {/* Mobile Menu Header */}
                <div className="md:hidden p-6 flex items-center justify-between border-b border-slate-700/50">
                    <span className="font-bold text-xl text-slate-100">Menu</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                        <X size={20} />
                    </button>
                </div>


                <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview" // Renamed from Matches/Dashboard per request
                        active={activeTab === 'dashboard' || !activeTab}
                        onClick={() => handleMobileNavigate('dashboard')}
                    />

                    <SidebarItem
                        icon={Shield} // Using Shield icon for Groups
                        label="Group Stage"
                        active={activeTab === 'groups'}
                        onClick={() => handleMobileNavigate('groups')}
                    />

                    <SidebarItem
                        icon={Trophy}
                        label="Knockout Stage" // Renamed from Bracket
                        active={activeTab === 'bracket'}
                        onClick={() => handleMobileNavigate('bracket')}
                    />

                    <SidebarItem
                        icon={Calendar}
                        label="Match Schedule"
                        active={activeTab === 'schedule'}
                        onClick={() => handleMobileNavigate('schedule')}
                    />

                    <div className="pt-6 pb-2">
                        <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-4"></div>
                    </div>

                    <SidebarItem
                        icon={LogOut}
                        label="Back to Dashboard"
                        active={false}
                        onClick={() => handleMobileNavigate('exit')}
                    />

                    <SidebarItem
                        icon={Settings}
                        label={t.settings}
                        active={false}
                        onClick={() => handleMobileNavigate('settings')}
                    />
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50 bg-[#1e293b]">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                            <span className="font-bold text-xs text-slate-900">WC</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-200">Tournament Mode</p>
                            <p className="text-xs text-slate-500">Active</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative pt-16 md:pt-0">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                {/* Top Bar (Mobile/Tablet only usually, but good for context) */}
                <div className="h-16 border-b border-slate-700/50 flex items-center justify-between px-8 bg-[#1e293b]/80 backdrop-blur-md z-10 hidden md:flex">
                    <h1 className="text-lg font-medium tracking-wide text-slate-200">
                        {activeTab === 'dashboard' && 'Tournament Overview'}
                        {activeTab === 'bracket' && 'Knockout Stage'}
                        {activeTab === 'groups' && 'Group Standings'}
                        {activeTab === 'schedule' && 'Match Schedule'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="px-3 py-1 rounded-full border border-slate-600 bg-slate-800/50 text-xs font-medium text-slate-400">
                            2026 Season
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};
