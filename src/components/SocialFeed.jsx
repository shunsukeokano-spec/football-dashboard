import React, { useEffect } from 'react';
import { Youtube, MessageCircle, Twitter } from 'lucide-react';

export const SocialFeed = ({ homeTeam, awayTeam, matchDate }) => {
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

    // Load Twitter widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup
            const existingScript = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, []);

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

            {/* Twitter Feed */}
            <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center space-x-2">
                        <Twitter size={18} className="text-primary" />
                        <span className="font-medium text-sm">Live Tweets</span>
                    </div>
                </div>
                <div className="p-4 bg-background">
                    <a
                        className="twitter-timeline"
                        data-height="500"
                        data-theme="dark"
                        data-chrome="noheader nofooter noborders"
                        href={`https://twitter.com/search?q=%23${hashtag}%20OR%20${encodeURIComponent(homeTeam.name + ' ' + awayTeam.name)}&src=typed_query&f=live`}
                    >
                        Loading tweets about #{hashtag}...
                    </a>
                </div>
            </div>

            {/* Fallback message */}
            <p className="text-xs text-center text-muted-foreground">
                Can't see tweets? Try searching <a href={`https://twitter.com/search?q=%23${hashtag}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">#{hashtag} on Twitter</a>
            </p>
        </div>
    );
};
