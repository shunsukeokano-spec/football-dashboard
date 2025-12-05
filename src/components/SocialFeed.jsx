import React, { useEffect } from 'react';
import { Youtube, MessageCircle, Twitter } from 'lucide-react';

export const SocialFeed = ({ homeTeam, awayTeam, matchDate, players = [] }) => {
    // Generate hashtag for Twitter (e.g., "ARSCHE" for Arsenal vs Chelsea)
    const generateHashtag = () => {
        const home = homeTeam.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        const away = awayTeam.name.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        return `${home}${away}`;
    };

    // Generate YouTube search query
    const generateYouTubeQuery = () => {
        const date = new Date(matchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return encodeURIComponent(`${homeTeam.name} vs ${awayTeam.name} highlights ${date}`);
    };

    // Generate Reddit search query
    const generateRedditQuery = () => {
        return encodeURIComponent(`Match Thread: ${homeTeam.name} ${awayTeam.name}`);
    };

    const hashtag = generateHashtag();
    const youtubeQuery = generateYouTubeQuery();
    const redditQuery = generateRedditQuery();



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Social Feed</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Twitter size={16} />
                    <span>#{hashtag}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YouTube Highlights */}
                <a
                    href={`https://www.youtube.com/results?search_query=${youtubeQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <Youtube size={24} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium">Watch Highlights</p>
                        <p className="text-xs text-muted-foreground">Search on YouTube</p>
                    </div>
                </a>

                {/* Reddit Match Thread */}
                <a
                    href={`https://www.reddit.com/r/soccer/search/?q=${redditQuery}&restrict_sr=1&sort=new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                        <MessageCircle size={24} className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium">Match Thread</p>
                        <p className="text-xs text-muted-foreground">Discuss on Reddit</p>
                    </div>
                </a>
            </div>

            {/* X (Twitter) Search Link */}
            <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center space-x-2">
                        <Twitter size={18} className="text-primary" />
                        <span className="font-medium text-sm">Live Discussion on X</span>
                    </div>
                </div>
                <div className="p-6 bg-background text-center">
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                            Join the conversation about this match on X (formerly Twitter)
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                            <span className="px-2 py-1 bg-muted rounded-full">#{hashtag}</span>
                            {players.slice(0, 3).map((player, idx) => (
                                <span key={idx} className="px-2 py-1 bg-muted rounded-full">{player}</span>
                            ))}
                        </div>
                    </div>
                    <a
                        href={`https://twitter.com/search?q=%23${hashtag}%20OR%20${encodeURIComponent(homeTeam.name + ' ' + awayTeam.name)}${players.length > 0 ? '%20OR%20' + encodeURIComponent(players.map(p => `"${p}"`).join(' OR ')) : ''}&src=typed_query&f=live`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        <Twitter size={20} />
                        <span>View Live Posts on X</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                    <p className="text-xs text-muted-foreground mt-4">
                        Opens in a new tab • No login required
                    </p>
                </div>
            </div>
        </div>
    );
};
