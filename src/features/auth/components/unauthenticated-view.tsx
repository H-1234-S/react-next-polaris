import { SignInButton, SignUpButton } from '@clerk/nextjs';

import { Background } from './background';
import { Header } from './header';
import { Footer } from './footer';
import { CodePreview } from './code-preview';

export const UnauthenticatedView = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />

            <Header />

            <main className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center py-16 lg:py-24">
                    <div className="grid gap-20 lg:grid-cols-2 lg:gap-16 items-center">
                        {/* Left: Hero */}
                        <div className="flex flex-col gap-8">
                            {/* Pre-heading */}
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/5 px-3 py-1 text-xs font-medium text-[oklch(0.9856_0.0008_264.3)]/70">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/40 animate-pulse" />
                                    Next Generation Platform
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="flex flex-col gap-5">
                                <h1 className="cursor-default text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight text-[oklch(0.9856_0.0008_264.3)] leading-[1.1]">
                                    Build with clarity.
                                    <br />
                                    <span className="text-[oklch(0.8500_0.0018_264.3)]">Ship with confidence.</span>
                                </h1>
                                <p className="cursor-default max-w-lg text-base text-[oklch(0.7500_0.0018_264.3)] leading-relaxed">
                                    A modern full-stack platform powered by Convex.
                                    Build real-time applications with type-safe database
                                    operations and seamless authentication.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <SignUpButton>
                                    <button className="group inline-flex items-center justify-center gap-2.5 bg-[oklch(0.9856_0.0008_264.3)] text-[oklch(0.1500_0.0018_264.3)] rounded-md font-semibold h-12 px-8 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-200 hover:bg-[oklch(0.9856_0.0008_264.3)]/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:gap-3">
                                        Get Started
                                        <svg
                                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </SignUpButton>
                                <SignInButton>
                                    <button className="inline-flex items-center justify-center gap-2 border border-[oklch(0.9856_0.0008_264.3)]/20 bg-[oklch(0.9856_0.0008_264.3)]/5 backdrop-blur-sm rounded-md font-semibold h-12 px-8 transition-all duration-200 text-[oklch(0.9856_0.0008_264.3)]/80 hover:text-[oklch(0.9856_0.0008_264.3)] hover:border-[oklch(0.9856_0.0008_264.3)]/40 hover:bg-[oklch(0.9856_0.0008_264.3)]/10">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </div>

                        {/* Right: Code Preview */}
                        <CodePreview />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
