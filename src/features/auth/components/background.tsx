export const Background = () => {
    return (
        <div className="absolute inset-0 -z-10">
            {/* Starfield */}
            <div
                className="absolute inset-0"
                style={{
                    background: `
                        radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 100%),
                        radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 50% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
                        radial-gradient(1px 1px at 60% 50%, rgba(255,255,255,0.5) 0%, transparent 100%),
                        radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 80% 10%, rgba(255,255,255,0.8) 0%, transparent 100%),
                        radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
                        radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,0.7) 0%, transparent 100%),
                        radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.6) 0%, transparent 100%),
                        radial-gradient(1px 1px at 85% 65%, rgba(255,255,255,0.5) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 15% 45%, rgba(255,255,255,0.9) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 55% 85%, rgba(255,255,255,0.8) 0%, transparent 100%),
                        radial-gradient(1.5px 1.5px at 75% 25%, rgba(255,255,255,0.85) 0%, transparent 100%),
                        radial-gradient(2px 2px at 25% 15%, rgba(255,255,255,1) 0%, transparent 100%),
                        radial-gradient(2px 2px at 65% 35%, rgba(255,255,255,0.95) 0%, transparent 100%)
                    `,
                    backgroundSize: '250px 250px',
                }}
            />

            {/* Grid Pattern - subtle */}
            <div
                className="absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Aurora Effect - Northern Lights */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Aurora 1 - subtle silver-white */}
                <div
                    className="absolute -left-1/4 top-0 h-[60%] w-[80%] animate-aurora-1"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(200,200,210,0.08) 0%, rgba(180,180,190,0.03) 50%, transparent 100%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(-15deg)',
                    }}
                />
                {/* Aurora 2 - silver-white with slight blue */}
                <div
                    className="absolute -right-1/4 top-1/4 h-[50%] w-[70%] animate-aurora-2"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(190,195,210,0.06) 0%, rgba(170,175,190,0.02) 50%, transparent 100%)',
                        filter: 'blur(80px)',
                        transform: 'rotate(10deg)',
                    }}
                />
                {/* Aurora 3 - very subtle star glow */}
                <div
                    className="absolute left-1/3 top-0 h-[40%] w-[60%] animate-aurora-3"
                    style={{
                        background:
                            'radial-gradient(ellipse at center, rgba(220,220,230,0.05) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
            </div>
        </div>
    );
};
