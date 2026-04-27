import { SignInButton, SignUpButton } from "@clerk/nextjs";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    ArrowRight,
    Sparkles,
    Zap,
    Shield,
    Users,
} from "lucide-react";
import { SiGithub } from "react-icons/si";

import Link from "next/link";

export const UnauthenticatedView = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.1),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(120,119,198,0.1),transparent)]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group flex cursor-pointer items-center gap-3 transition-all duration-200 hover:opacity-80"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Polaris</span>
                    </Link>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <Link
                            href="https://github.com/H-1234-S/react-next-polaris"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex"
                        >
                            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                                <SiGithub className="h-5 w-5" />
                            </button>
                        </Link>
                        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
                        <SignInButton>
                            <button className="h-9 rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                                Sign In
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium text-sm h-9 px-5 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/10">
                                Sign Up
                            </button>
                        </SignUpButton>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 lg:py-20">
                    <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
                        {/* Left: Hero */}
                        <div className="flex flex-col gap-10 text-center lg:text-left">

                            {/* Heading */}
                            <div className="flex flex-col gap-6">
                                <h1 className="cursor-default text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl/tight">
                                    Build faster with{" "}
                                    <span className="cursor-default bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                                        Polaris
                                    </span>
                                </h1>
                                <p className="cursor-default mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0 lg:max-w-lg">
                                    A modern full-stack platform powered by Convex.
                                    Build real-time applications with type-safe database
                                    operations and seamless authentication.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <SignUpButton>
                                    <button className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold h-12 px-8 shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/10 hover:gap-3">
                                        Get Started
                                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                                    </button>
                                </SignUpButton>
                                <SignInButton>
                                    <button className="inline-flex items-center justify-center gap-2 border border-border bg-background/50 backdrop-blur-sm hover:bg-accent rounded-xl font-semibold h-12 px-8 transition-all duration-200 text-foreground/80 hover:text-foreground">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </div>

                        {/* Right: Feature Cards */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FeatureCard
                                icon={<Zap className="h-5 w-5" />}
                                title="Real-time Sync"
                                description="Data synchronizes instantly across all connected clients"
                            />
                            <FeatureCard
                                icon={<Shield className="h-5 w-5" />}
                                title="Secure Auth"
                                description="Enterprise-grade authentication powered by Clerk"
                            />
                            <FeatureCard
                                icon={<Users className="h-5 w-5" />}
                                title="Team Collaboration"
                                description="Work together with real-time updates and permissions"
                            />
                            <FeatureCard
                                icon={<Sparkles className="h-5 w-5" />}
                                title="TypeScript Native"
                                description="Full type safety from database to frontend"
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-background/30">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <p className="cursor-default select-none text-sm text-muted-foreground">
                        © 2026 Polaris. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Terms
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Card className="group relative cursor-default overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-card/80 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
            <CardContent className="relative z-10 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {icon}
                    </div>
                    <h3 className="cursor-default font-semibold">{title}</h3>
                </div>
                <p className="cursor-default text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Card>
    );
}
