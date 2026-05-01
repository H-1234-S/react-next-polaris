import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

export const UnauthenticatedView = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 -z-10">
                {/* Starfield */}
                <div className="absolute inset-0" style={{
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
                    backgroundSize: '250px 250px'
                }} />

                {/* Grid Pattern - subtle */}
                <div
                    className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: "64px 64px",
                    }}
                />

                {/* Aurora Effect - Northern Lights */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Aurora 1 - subtle silver-white */}
                    <div
                        className="absolute -left-1/4 top-0 h-[60%] w-[80%] animate-aurora-1"
                        style={{
                            background: 'linear-gradient(180deg, rgba(200,200,210,0.08) 0%, rgba(180,180,190,0.03) 50%, transparent 100%)',
                            filter: 'blur(60px)',
                            transform: 'rotate(-15deg)',
                        }}
                    />
                    {/* Aurora 2 - silver-white with slight blue */}
                    <div
                        className="absolute -right-1/4 top-1/4 h-[50%] w-[70%] animate-aurora-2"
                        style={{
                            background: 'linear-gradient(180deg, rgba(190,195,210,0.06) 0%, rgba(170,175,190,0.02) 50%, transparent 100%)',
                            filter: 'blur(80px)',
                            transform: 'rotate(10deg)',
                        }}
                    />
                    {/* Aurora 3 - very subtle star glow */}
                    <div
                        className="absolute left-1/3 top-0 h-[40%] w-[60%] animate-aurora-3"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(220,220,230,0.05) 0%, transparent 70%)',
                            filter: 'blur(40px)',
                        }}
                    />
                </div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.2925_0.0157_264.3)]/20 bg-[oklch(0.2925_0.0157_264.3)]/60 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center gap-2.5 transition-all duration-200 hover:opacity-80"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.9856_0.0008_264.3)]/10 text-[oklch(0.9856_0.0008_264.3)] shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-[oklch(0.9856_0.0008_264.3)]">Polaris</span>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-1">
                        <Link
                            href="https://github.com/H-1234-S/react-next-polaris"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex"
                        >
                            <button className="flex h-9 w-9 items-center justify-center rounded-md text-[oklch(0.7500_0.0018_264.3)] transition-colors hover:bg-[oklch(0.9856_0.0008_264.3)]/10 hover:text-[oklch(0.9856_0.0008_264.3)]">
                                <SiGithub className="h-4.5 w-4.5" />
                            </button>
                        </Link>
                        <div className="h-5 w-px bg-[oklch(0.9856_0.0008_264.3)]/20 mx-2" />
                        <SignInButton>
                            <button className="h-9 rounded-md px-4 text-sm font-medium text-[oklch(0.7500_0.0018_264.3)] transition-colors hover:bg-[oklch(0.9856_0.0008_264.3)]/10 hover:text-[oklch(0.9856_0.0008_264.3)]">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="h-9 rounded-md bg-[oklch(0.9856_0.0008_264.3)] px-5 text-sm font-semibold text-[oklch(0.1500_0.0018_264.3)] shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all hover:bg-[oklch(0.9856_0.0008_264.3)]/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </header>

            {/* Main Content */}
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
                                        <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

                        {/* Right: Code Preview Style - 3D Tilted */}
                        <div className="relative hidden lg:block" style={{ perspective: '1000px' }}>
                            <div className="absolute -inset-12 bg-[oklch(0.9856_0.0008_264.3)]/[0.03] rounded-[40px] blur-3xl" />
                            <div
                                className="relative rounded-2xl border border-[oklch(0.9856_0.0008_264.3)]/[0.08] bg-[oklch(0.9856_0.0008_264.3)]/[0.02] backdrop-blur-xl overflow-hidden"
                                style={{
                                    transform: 'rotateX(8deg) rotateY(-8deg) scale(0.95)',
                                    transformStyle: 'preserve-3d',
                                    boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 0 60px -15px rgba(255,255,255,0.05)'
                                }}
                            >
                                {/* Window Chrome */}
                                <div className="flex items-center gap-2 border-b border-[oklch(0.9856_0.0008_264.3)]/[0.06] px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.15]" />
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.15]" />
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.15]" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="h-5 w-40 rounded-md bg-[oklch(0.9856_0.0008_264.3)]/[0.06]" />
                                    </div>
                                </div>
                                {/* Code Content */}
                                <div className="p-6 font-mono text-sm">
                                    <div className="space-y-3">
                                        <CodeLine highlight text="// Your next great idea starts here" />
                                        <CodeLine prefix="const" text="engine" suffix="=" />
                                        <CodeLine text="await polaris.init({" />
                                        <CodeLine indent text="realtime: true" />
                                        <CodeLine indent text="ai: native" />
                                        <CodeLine indent text="auth: clerk" />
                                        <CodeLine text="});" />
                                        <div className="h-3" />
                                        <CodeLine highlight text="// Ready to build" />
                                        <CodeLine text="engine.start();" />
                                        <div className="h-2" />
                                        <Cursor />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-[oklch(0.2925_0.0157_264.3)]/20 bg-[oklch(0.2925_0.0157_264.3)]/30">
                <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-6 lg:px-8">
                    <p className="cursor-default select-none text-xs text-[oklch(0.5449_0.0123_264.3)]">
                        © 2026 Polaris. All rights reserved.
                    </p>
                    <div className="flex gap-5">
                        <a
                            href="#"
                            className="cursor-pointer text-xs text-[oklch(0.5449_0.0123_264.3)] transition-colors hover:text-[oklch(0.9856_0.0008_264.3)]"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="cursor-pointer text-xs text-[oklch(0.5449_0.0123_264.3)] transition-colors hover:text-[oklch(0.9856_0.0008_264.3)]"
                        >
                            Terms
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

function CodeLine({
    prefix,
    text,
    suffix,
    indent = false,
    highlight = false,
}: {
    prefix?: string;
    text: string;
    suffix?: string;
    indent?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className={`flex items-center gap-1 ${indent ? "pl-6" : ""} ${highlight ? "text-[oklch(0.8500_0.0018_264.3)]" : "text-[oklch(0.6500_0.0018_264.3)]"}`}>
            <span className="text-[oklch(0.9856_0.0008_264.3)]/40">{prefix}</span>
            <span>{text}</span>
            <span className="text-[oklch(0.9856_0.0008_264.3)]/40">{suffix}</span>
        </div>
    );
}

function Cursor() {
    return (
        <div className="flex items-center gap-1">
            <div className="h-4 w-0.5 bg-[oklch(0.8500_0.0018_264.3)] animate-pulse" />
            <span className="text-[oklch(0.8500_0.0018_264.3)] animate-pulse">|</span>
        </div>
    );
}
