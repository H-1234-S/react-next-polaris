export const Footer = () => {
    return (
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
    );
};
