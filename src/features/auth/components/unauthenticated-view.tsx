import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Link from "next/link";

export const UnauthenticatedView = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Atmospheric Background */}
            <div className="absolute inset-0 -z-10">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: "64px 64px",
                    }}
                />
                {/* Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(120,119,198,0.12),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_90%,rgba(120,119,198,0.08),transparent)]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-[oklch(0.2925_0.0157_264.3)]/20 bg-[oklch(0.2925_0.0157_264.3)]/60 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center gap-2.5 transition-all duration-200 hover:opacity-80"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.3404_0.0205_265.97)] text-[oklch(0.9856_0.0008_264.3)] shadow-[0_0_20px_rgba(120,119,198,0.3)]">
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
                            <button className="flex h-9 w-9 items-center justify-center rounded-md text-[oklch(0.5449_0.0123_264.3)] transition-colors hover:bg-[oklch(0.2925_0.0157_264.3)]/50 hover:text-[oklch(0.9856_0.0008_264.3)]">
                                <SiGithub className="h-4.5 w-4.5" />
                            </button>
                        </Link>
                        <div className="h-5 w-px bg-[oklch(0.2925_0.0157_264.3)]/50 mx-2" />
                        <SignInButton>
                            <button className="h-9 rounded-md px-4 text-sm font-medium text-[oklch(0.5449_0.0123_264.3)] transition-colors hover:bg-[oklch(0.2925_0.0157_264.3)]/50 hover:text-[oklch(0.9856_0.0008_264.3)]">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="h-9 rounded-md bg-[oklch(0.3404_0.0205_265.97)] px-5 text-sm font-semibold text-[oklch(0.9856_0.0008_264.3)] shadow-[0_0_30px_rgba(120,119,198,0.25)] transition-all hover:bg-[oklch(0.3404_0.0205_265.97)]/90 hover:shadow-[0_0_40px_rgba(120,119,198,0.35)]">
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
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.3404_0.0205_265.97)]/10 px-3 py-1 text-xs font-medium text-[oklch(0.3404_0.0205_265.97)]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.3404_0.0205_265.97)] animate-pulse" />
                                    AI-Native Cloud IDE
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="flex flex-col gap-5">
                                <h1 className="cursor-default text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-tight text-[oklch(0.9856_0.0008_264.3)] leading-[1.1]">
                                    Build faster.
                                    <br />
                                    <span className="text-[oklch(0.3404_0.0205_265.97)]">Think bigger.</span>
                                </h1>
                                <p className="cursor-default max-w-lg text-base text-[oklch(0.5449_0.0123_264.3)] leading-relaxed">
                                    A modern full-stack platform powered by Convex.
                                    Build real-time applications with type-safe database
                                    operations and seamless authentication.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <SignUpButton>
                                    <button className="group inline-flex items-center justify-center gap-2.5 bg-[oklch(0.3404_0.0205_265.97)] text-[oklch(0.9856_0.0008_264.3)] rounded-md font-semibold h-12 px-8 shadow-[0_0_30px_rgba(120,119,198,0.25)] transition-all duration-200 hover:bg-[oklch(0.3404_0.0205_265.97)]/90 hover:shadow-[0_0_40px_rgba(120,119,198,0.35)] hover:gap-3">
                                        Get Started
                                        <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </SignUpButton>
                                <SignInButton>
                                    <button className="inline-flex items-center justify-center gap-2 border border-[oklch(0.2925_0.0157_264.3)]/60 bg-[oklch(0.2925_0.0157_264.3)]/30 backdrop-blur-sm rounded-md font-semibold h-12 px-8 transition-all duration-200 text-[oklch(0.9856_0.0008_264.3)]/80 hover:text-[oklch(0.9856_0.0008_264.3)] hover:border-[oklch(0.2925_0.0157_264.3)]/80">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </div>

                        {/* Right: Code Preview Style */}
                        <div className="relative hidden lg:block">
                            <div className="absolute -inset-8 bg-[oklch(0.3404_0.0205_265.97)]/5 rounded-[30px] blur-3xl" />
                            <div className="relative rounded-xl border border-[oklch(0.2925_0.0157_264.3)]/40 bg-[oklch(0.1827_0.0157_264.3)]/40 backdrop-blur-xl overflow-hidden">
                                {/* Window Chrome */}
                                <div className="flex items-center gap-2 border-b border-[oklch(0.2925_0.0157_264.3)]/30 px-4 py-3">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.3404_0.0205_265.97)]/30" />
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.3404_0.0205_265.97)]/30" />
                                        <div className="h-3 w-3 rounded-full bg-[oklch(0.3404_0.0205_265.97)]/30" />
                                    </div>
                                    <div className="flex-1 flex justify-center">
                                        <div className="h-5 w-40 rounded-md bg-[oklch(0.2925_0.0157_264.3)]/40" />
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
        <div className={`flex items-center gap-1 ${indent ? "pl-6" : ""} ${highlight ? "text-[oklch(0.3404_0.0205_265.97)]" : "text-[oklch(0.5449_0.0123_264.3)]"}`}>
            <span className="text-[oklch(0.9856_0.0008_264.3)]/50">{prefix}</span>
            <span>{text}</span>
            <span className="text-[oklch(0.9856_0.0008_264.3)]/50">{suffix}</span>
        </div>
    );
}

function Cursor() {
    return (
        <div className="flex items-center gap-1">
            <div className="h-4 w-0.5 bg-[oklch(0.3404_0.0205_265.97)] animate-pulse" />
            <span className="text-[oklch(0.3404_0.0205_265.97)] animate-pulse">|</span>
        </div>
    );
}
