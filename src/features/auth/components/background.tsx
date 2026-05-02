export const Background = () => {
    return (
        <div className="fixed inset-0 -z-10">
            {/* Deep void-black space background #040508 */}
            <div
                className="absolute inset-0"
                style={{ background: '#040508' }}
            />

            {/* Subtle cosmic dust layer */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(ellipse 100% 100% at 50% 0%, rgba(30, 30, 50, 0.3) 0%, transparent 50%),
                        radial-gradient(ellipse 80% 80% at 20% 80%, rgba(20, 20, 35, 0.2) 0%, transparent 40%),
                        radial-gradient(ellipse 60% 60% at 80% 20%, rgba(25, 25, 45, 0.15) 0%, transparent 35%)
                    `,
                }}
            />

            {/* Starfield - with floating animation */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Star layer 1 - tiny distant stars, very subtle */}
                <div
                    className="absolute inset-0 animate-star-drift-1"
                    style={{
                        background: `
                            radial-gradient(0.8px 0.8px at 10% 20%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 25% 45%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 40% 15%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 55% 70%, rgba(255,255,255,0.15) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 70% 35%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 85% 60%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 95% 85%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 5% 90%, rgba(255,255,255,0.15) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 15% 5%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 35% 80%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 50% 40%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 65% 95%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 80% 10%, rgba(255,255,255,0.15) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 90% 50%, rgba(255,255,255,0.2) 0%, transparent 100%),
                            radial-gradient(0.8px 0.8px at 30% 25%, rgba(255,255,255,0.25) 0%, transparent 100%)
                        `,
                        backgroundSize: '400px 400px',
                    }}
                />
                {/* Star layer 2 - faint stars */}
                <div
                    className="absolute inset-0 animate-star-drift-2"
                    style={{
                        background: `
                            radial-gradient(1px 1px at 12% 32%, rgba(255,255,255,0.35) 0%, transparent 100%),
                            radial-gradient(1px 1px at 38% 68%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 62% 22%, rgba(255,255,255,0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 78% 55%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(1px 1px at 92% 78%, rgba(255,255,255,0.35) 0%, transparent 100%),
                            radial-gradient(1px 1px at 8% 58%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 28% 88%, rgba(255,255,255,0.25) 0%, transparent 100%),
                            radial-gradient(1px 1px at 48% 5%, rgba(255,255,255,0.4) 0%, transparent 100%),
                            radial-gradient(1px 1px at 72% 42%, rgba(255,255,255,0.3) 0%, transparent 100%),
                            radial-gradient(1px 1px at 88% 18%, rgba(255,255,255,0.35) 0%, transparent 100%)
                        `,
                        backgroundSize: '350px 350px',
                    }}
                />
                {/* Star layer 3 - slightly brighter stars, slow pulse */}
                <div
                    className="absolute inset-0 animate-star-pulse"
                    style={{
                        background: `
                            radial-gradient(1.2px 1.2px at 20% 18%, rgba(255,255,255,0.5) 0%, transparent 100%),
                            radial-gradient(1.2px 1.2px at 55% 42%, rgba(255,255,255,0.45) 0%, transparent 100%),
                            radial-gradient(1.5px 1.5px at 75% 72%, rgba(255,255,255,0.55) 0%, transparent 100%),
                            radial-gradient(1.2px 1.2px at 42% 88%, rgba(255,255,255,0.4) 0%, transparent 100%),
                            radial-gradient(1.2px 1.2px at 90% 35%, rgba(255,255,255,0.5) 0%, transparent 100%),
                            radial-gradient(1px 1px at 5% 72%, rgba(255,255,255,0.45) 0%, transparent 100%),
                            radial-gradient(1.5px 1.5px at 32% 52%, rgba(255,255,255,0.5) 0%, transparent 100%),
                            radial-gradient(1px 1px at 68% 8%, rgba(255,255,255,0.4) 0%, transparent 100%)
                        `,
                        backgroundSize: '300px 300px',
                    }}
                />
            </div>

            {/* Subtle aurora glow at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none"
                style={{
                    background: 'linear-gradient(0deg, rgba(15, 15, 25, 0.4) 0%, transparent 100%)',
                }}
            />
        </div>
    );
};
