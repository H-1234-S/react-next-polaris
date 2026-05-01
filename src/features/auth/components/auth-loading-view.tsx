import { Background } from './background';
import { Header } from './header';

export const AuthLoadingView = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />

            <Header />

            <main className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
                    {/* Loading animation */}
                    <div className="relative flex flex-col items-center gap-8">
                        {/* Orbiting dots */}
                        <div className="relative h-20 w-20">
                            {/* Center pulse */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/60 animate-pulse" />
                            </div>
                            {/* Orbit ring 1 */}
                            <div className="absolute inset-2 animate-spin" style={{ animationDuration: '3s' }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/80 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                            </div>
                            {/* Orbit ring 2 */}
                            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                                <div className="absolute top-1/2 right-0 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[oklch(0.8500_0.0018_264.3)]/70 shadow-[0_0_8px_rgba(200,200,220,0.25)]" />
                            </div>
                            {/* Outer ring */}
                            <div
                                className="absolute inset-0 rounded-full border border-[oklch(0.9856_0.0008_264.3)]/[0.06]"
                                style={{ animation: 'pulse-ring 2s ease-in-out infinite' }}
                            />
                        </div>

                        {/* Loading text */}
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-sm font-medium text-[oklch(0.9856_0.0008_264.3)]/60 tracking-wide">
                                Loading
                            </p>
                            <div className="flex gap-1">
                                <span className="h-1 w-1 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="h-1 w-1 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="h-1 w-1 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
