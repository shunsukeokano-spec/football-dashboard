import React from 'react';
import { X, Moon, Sun, Globe, Bell } from 'lucide-react';
import { translations } from '../utils/translations';

export const SettingsModal = ({ onClose, language, setLanguage, theme, setTheme, isWorldCupMode, onToggleWorldCup }) => {
    const t = translations[language] || translations['en'];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-card w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative bg-muted/30 p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t.settings}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Theme */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</label>
                        <div className="bg-muted/30 rounded-xl p-1 flex">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Sun size={16} />
                                <span>Light</span>
                            </button>
                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Moon size={16} />
                                <span>Dark</span>
                            </button>
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Language</label>
                        <div className="space-y-2">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${language === 'en' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg">🇬🇧</div>
                                    <span className="font-medium">English</span>
                                </div>
                                {language === 'en' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                            </button>
                            <button
                                onClick={() => setLanguage('ja')}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${language === 'ja' ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-lg">🇯🇵</div>
                                    <span className="font-medium">日本語</span>
                                </div>
                                {language === 'ja' && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                            </button>
                        </div>
                    </div>

                    {/* Notifications (Mock) */}
                    <div className="space-y-3 relative">
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            {/* Removed overlay for WC toggle accessibility */}
                        </div>

                        {/* Notifications Section - Disabled */}
                        <div className="opacity-60 pointer-events-none">
                            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notifications</label>
                            <div className="flex items-center justify-between p-3 rounded-xl border border-border mt-2">
                                <div className="flex items-center space-x-3">
                                    <Bell size={20} />
                                    <span>Match Alerts</span>
                                </div>
                                <div className="w-10 h-6 bg-muted rounded-full relative">
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow-sm"></div>
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <span className="bg-muted px-2 py-1 rounded text-[10px] font-bold uppercase">Coming Soon</span>
                            </div>
                        </div>

                        {/* World Cup Mode Toggle - Enabled */}
                        <div className="pt-4 border-t border-border mt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Globe size={20} className="text-muted-foreground" />
                                    <div>
                                        <span className="block font-medium">World Cup Mode</span>
                                        <span className="text-xs text-muted-foreground">Enable tournament features</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onToggleWorldCup}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${isWorldCupMode ? 'bg-blue-600' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isWorldCupMode ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
