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
        <div
            className={`flex items-center gap-1 ${indent ? 'pl-6' : ''} ${highlight ? 'text-[oklch(0.8500_0.0018_264.3)]' : 'text-[oklch(0.6500_0.0018_264.3)]'
                }`}
        >
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

export const CodePreview = () => {
    return (
        <div className="relative hidden lg:block">
            {/* Ambient glow behind */}
            <div
                className="absolute -inset-4 rounded-3xl"
                style={{
                    background:
                        'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)',
                    filter: 'blur(30px)',
                }}
            />

            {/* Main card with subtle tilt */}
            <div
                className="relative rounded-2xl border border-[oklch(0.9856_0.0008_264.3)]/[0.06] bg-[oklch(0.9856_0.0008_264.3)]/[0.015] backdrop-blur-xl overflow-hidden"
                style={{
                    transform: 'perspective(1200px) rotateY(-6deg) rotateX(4deg)',
                    transformOrigin: 'right center',
                    boxShadow: `
                        -25px 25px 50px -12px rgba(0,0,0,0.6),
                        0 0 0 1px rgba(255,255,255,0.03) inset,
                        0 2px 0 rgba(255,255,255,0.05) inset
                    `,
                }}
            >
                {/* Top highlight line */}
                <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                    }}
                />

                {/* Window Chrome */}
                <div className="flex items-center gap-2 border-b border-[oklch(0.9856_0.0008_264.3)]/[0.04] px-4 py-3">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.12]" />
                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.12]" />
                        <div className="h-3 w-3 rounded-full bg-[oklch(0.9856_0.0008_264.3)]/[0.12]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="h-5 w-40 rounded-md bg-[oklch(0.9856_0.0008_264.3)]/[0.04]" />
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

                {/* Bottom rim light */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
                    }}
                />
            </div>
        </div>
    );
};
