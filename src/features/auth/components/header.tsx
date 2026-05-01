import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import Link from 'next/link';

export const Header = () => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.03] bg-white/[0.01] backdrop-blur-3xl backdrop-saturate-100">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
                {/* Logo */}
                <Link
                    href="/"
                    className="group flex cursor-pointer items-center gap-2.5 transition-all duration-200 hover:opacity-80"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[oklch(0.9856_0.0008_264.3)]/10 text-[oklch(0.9856_0.0008_264.3)] shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight text-[oklch(0.9856_0.0008_264.3)]">
                        Polaris
                    </span>
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
    );
};
