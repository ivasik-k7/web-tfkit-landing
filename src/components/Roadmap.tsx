import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    Terminal,
    Code,
    Globe,
    BarChart3,
    Users,
    Cloud,
    Zap,
    ChevronRight,
    Cpu,
    Layers,
    GitBranch,
    Rocket,
    Play,
    Pause,
    ArrowRight,
    ArrowLeft,
    Calendar,
    AlertCircle
} from "lucide-react";

// --- Types ---

type BrandColor = "emerald" | "cyan" | "primary" | "purple-alt";


interface StageDetails {
    timeline: string;
    progress: number;
    features: string[];
    achievements: string[];
    tech: string[];
}


interface DevelopmentStage {
    id: number;
    title: string;
    shortDesc: string;
    description: string;
    status: "completed" | "active" | "upcoming";
    icon: React.ElementType;
    color: BrandColor;
    details: StageDetails;
}

// --- Data ---

const DEVELOPMENT_STAGES: DevelopmentStage[] = [
    {
        id: 1,
        title: "Local Prototype",
        shortDesc: "Initial Concept",
        description: "Built the first local version using Python, Shell, and Jinja. Validated the core parsing and templating concepts.",
        status: "completed",
        icon: Terminal,
        color: "emerald",
        details: {
            timeline: "Autumn 2025",
            progress: 100,
            features: ["Initial Parser", "Basic CLI", "Template Rendering"],
            achievements: ["Proof of Concept Complete", "Core Features Validated"],
            tech: ["Python", "Shell", "Jinja"]
        }
    },
    {
        id: 2,
        title: "PyPI & VSCode",
        shortDesc: "Distribution",
        description: "Released the product as a PyPI package and developed a VSCode extension to simplify usage and reach more users.",
        status: "completed",
        icon: Code,
        color: "emerald",
        details: {
            timeline: "Autumn 2025",
            progress: 100,
            features: ["PyPI Package", "CLI Commands", "VSCode Extension"],
            achievements: ["First External Users", "Marketplace Publication"],
            tech: ["Python", "TypeScript", "React"]
        }
    },
    {
        id: 3,
        title: "Parser Enhancements",
        shortDesc: "Data Model",
        description: "Reworked parsing engine for richer data extraction, optimized performance, and improved output schemas.",
        status: "completed",
        icon: BarChart3,
        color: "emerald",
        details: {
            timeline: "Autumn 2025",
            progress: 100,
            features: ["Enhanced Parsing", "Optimized Performance", "Rich Data Output"],
            achievements: ["Faster Parsing", "More Accurate Results"],
            tech: ["Python", "Regex", "Data Structures"]
        }
    },
    {
        id: 4,
        title: "Landing & Documentation",
        shortDesc: "Branding",
        description: "Built landing page and comprehensive documentation to onboard users and explain key features.",
        status: "completed",
        icon: Globe,
        color: "emerald",
        details: {
            timeline: "October 2025",
            progress: 100,
            features: ["Landing Page", "Tutorials", "Documentation"],
            achievements: ["User Onboarding Ready", "Marketing Assets Prepared"],
            tech: ["HTML", "React", "Jinja", "CSS"]
        }
    },
    {
        id: 5,
        title: "Product Hunt Launch",
        shortDesc: "Community Kickoff",
        description: "Published the product on ProductHunt and created community channels on GitHub and Discord to gather feedback.",
        status: "completed",
        icon: Users,
        color: "cyan",
        details: {
            timeline: "1 November 2025",
            progress: 100,
            features: ["Community Channels", "Feedback Collection", "User Engagement"],
            achievements: ["ProductHunt Launch", "First Community Members"],
            tech: ["GitHub", "Discord", "Python"]
        }
    },
    {
        id: 6,
        title: "Community Growth & Feedback",
        shortDesc: "Active Engagement",
        description: "Focus on gathering feedback from early users, identifying key improvements, and building an active community.",
        status: "active",
        icon: Users,
        color: "cyan",
        details: {
            timeline: "November 2025 - Ongoing",
            progress: 50,
            features: ["Feedback Collection", "Community Polls", "Issue Tracking"],
            achievements: ["Active Users Engaged", "Improvement Priorities Identified"],
            tech: ["GitHub", "Discord"]
        }
    },
    {
        id: 7,
        title: "Export Strategy",
        shortDesc: "Integration",
        description: "Develop exporters for multiple diagram formats including Mermaid, PlantUML, D2, and others, making outputs widely usable.",
        status: "upcoming",
        icon: Cloud,
        color: "purple-alt",
        details: {
            timeline: "Late 2025",
            progress: 0,
            features: ["Mermaid Export", "PlantUML Export", "Generic Export Framework"],
            achievements: ["Planning Phase"],
            tech: ["Python", "Jinja", "Diagram Libraries"]
        }
    },
    {
        id: 8,
        title: "General Enrichment",
        shortDesc: "Feature Expansion",
        description: "Add advanced features, better data visualization, and custom template support to make the tool more versatile for users.",
        status: "upcoming",
        icon: BarChart3,
        color: "purple-alt",
        details: {
            timeline: "Early 2026",
            progress: 0,
            features: ["Custom Templates", "Enhanced Analytics", "Extended Parsing Capabilities"],
            achievements: ["Planning & Architecture Defined"],
            tech: ["Python", "Jinja", "Data Visualization Libraries"]
        }
    },
    {
        id: 9,
        title: "Enterprise Solution",
        shortDesc: "Scaling Up",
        description: "Develop enterprise-grade features including role-based access, multi-user collaboration, audit logs, and cloud-ready deployment.",
        status: "upcoming",
        icon: Cloud,
        color: "primary",
        details: {
            timeline: "Mid 2026",
            progress: 0,
            features: ["Multi-User Workspaces", "RBAC", "Audit Logs", "Cloud Deployment"],
            achievements: ["Enterprise Architecture Designed"],
            tech: ["Python", "PostgreSQL", "Kubernetes", "Docker"]
        }
    },
    {
        id: 10,
        title: "API & Integrations",
        shortDesc: "Extensibility",
        description: "Expose stable APIs for third-party integrations, enabling plugin development, automation, and external system connectivity.",
        status: "upcoming",
        icon: Code,
        color: "primary",
        details: {
            timeline: "Late 2026",
            progress: 0,
            features: ["REST & GraphQL APIs", "Webhook Support", "Plugin SDK"],
            achievements: ["API Spec Defined"],
            tech: ["Python", "FastAPI", "REST", "GraphQL"]
        }
    },
    {
        id: 11,
        title: "Cloud & SaaS",
        shortDesc: "Enterprise Cloud",
        description: "Offer a fully hosted SaaS version with automatic scaling, monitoring, and enterprise SLA support.",
        status: "upcoming",
        icon: Cloud,
        color: "purple-alt",
        details: {
            timeline: "2027",
            progress: 0,
            features: ["SaaS Hosting", "Auto-Scaling", "Monitoring & Alerts", "SLA Compliance"],
            achievements: ["SaaS Architecture Planning"],
            tech: ["Kubernetes", "AWS / Azure / GCP", "Python", "Terraform"]
        }
    },
    {
        id: 12,
        title: "Long-term Vision",
        shortDesc: "Ecosystem Expansion",
        description: "Explore collaborative web tools, cloud playgrounds, advanced analytics, and AI-assisted workflow improvements.",
        status: "upcoming",
        icon: Zap,
        color: "primary",
        details: {
            timeline: "2027+",
            progress: 0,
            features: ["Collaborative Web IDE", "AI Assistance", "Advanced Analytics", "Custom Diagram Packs"],
            achievements: ["Roadmap Defined"],
            tech: ["Python", "React", "AI / ML Models", "Cloud Platforms"]
        }
    }
];



const Hexagon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor">
        <path d="M12 2l10 6v8l-10 6-10-6V8z" />
    </svg>
);

const TechBadge = ({ text, colorVar }: { text: string; colorVar: string }) => (
    <span
        className="px-2 py-1 rounded-md text-xs font-mono uppercase tracking-wider border"
        style={{
            backgroundColor: `rgba(var(${colorVar}-rgb), 0.1)`,
            borderColor: `var(${colorVar})`,
            color: `var(${colorVar})`,
            opacity: 0.9
        }}
    >
        {text}
    </span>
);

// --- Main Component ---

export default function RoadmapPipeline() {
    const [activeIndex, setActiveIndex] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Helper to get the CSS Variable string for a stage color
    const getColorVar = (color: BrandColor) => `--color-${color}`;

    // Auto-play logic
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % DEVELOPMENT_STAGES.length);
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    // Scroll active element into view
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const activeEl = container.children[activeIndex] as HTMLElement;
            if (activeEl) {
                const scrollLeft = activeEl.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
                container.scrollTo({ left: scrollLeft, behavior: "smooth" });
            }
        }
    }, [activeIndex]);

    const activeStage = DEVELOPMENT_STAGES[activeIndex];
    const activeColorVar = getColorVar(activeStage.color);

    return (
        <div className="visualization-section relative overflow-hidden">
            {/* Force-hide scrollbar utility for this specific component */}
            <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

            {/* --- Background Effects --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <motion.div
                    className="orb orb-1 w-[500px] h-[500px] top-[-100px] left-[-100px]"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="orb orb-2 w-[400px] h-[400px] bottom-[-100px] right-[-100px]"
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* --- Main Container --- */}
            <div className="visualization-container relative z-10">

                {/* --- Header --- */}
                <div className="visualization-header flex flex-col md:flex-row justify-between items-end border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-cyan)' }}>
                            <Rocket size={18} />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Product Roadmap</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Development <span className="gradient-text">Pipeline</span>
                        </h1>
                    </div>

                    <div className="flex gap-4 mt-6 md:mt-0">
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium"
                            style={{
                                backgroundColor: 'var(--bg-tertiary)',
                                borderColor: isPlaying ? 'var(--color-cyan)' : 'var(--border-color)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                            {isPlaying ? "Pause" : "Auto Play"}
                        </button>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                                className="p-2 rounded-full transition-colors"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <button
                                onClick={() => setActiveIndex(prev => Math.min(DEVELOPMENT_STAGES.length - 1, prev + 1))}
                                className="p-2 rounded-full transition-colors"
                                style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Horizontal Pipeline --- */}
                <div className="relative mb-16">
                    {/* Connecting Line Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        {/* Animated Pulse Line */}
                        <motion.div
                            className="h-full w-1/2 opacity-50"
                            style={{
                                background: `linear-gradient(90deg, transparent, var(${activeColorVar}), transparent)`
                            }}
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto no-scrollbar gap-12 md:gap-20 px-[40vw] py-12 snap-x snap-center items-center"
                    >
                        {DEVELOPMENT_STAGES.map((stage, idx) => {
                            const isActive = idx === activeIndex;
                            const isPast = idx < activeIndex;
                            const stageColorVar = getColorVar(stage.color);

                            return (
                                <div
                                    key={stage.id}
                                    onClick={() => { setActiveIndex(idx); setIsPlaying(false); }}
                                    className={`relative flex-shrink-0 cursor-pointer group snap-center transition-all duration-500 ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100 scale-90'}`}
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative">
                                            {/* Hexagon Background */}
                                            <Hexagon
                                                className="w-16 h-16 transition-colors duration-500"
                                                style={{ color: isActive ? `var(${stageColorVar})` : isPast ? 'var(--text-muted)' : 'var(--bg-tertiary)' }}
                                            />

                                            {/* Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {isPast ? (
                                                    <CheckCircle2 size={20} style={{ color: 'var(--color-emerald)' }} />
                                                ) : (
                                                    <stage.icon
                                                        size={20}
                                                        style={{ color: isActive ? 'var(--bg-primary)' : 'var(--text-muted)' }}
                                                    />
                                                )}
                                            </div>

                                            {/* Active Glow Ring */}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="glow-ring"
                                                    className="absolute -inset-2 border-2 rounded-full opacity-50 blur-sm"
                                                    style={{ borderColor: `var(${stageColorVar})` }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="text-center">
                                            <div
                                                className="text-xs font-bold tracking-wider uppercase mb-1"
                                                style={{ color: isActive ? `var(${stageColorVar})` : 'var(--text-muted)' }}
                                            >
                                                Phase 0{stage.id}
                                            </div>
                                            <div
                                                className="font-semibold whitespace-nowrap"
                                                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                                            >
                                                {stage.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- Detail HUD Panel --- */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStage.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 rounded-3xl overflow-hidden shadow-2xl border"
                        style={{
                            backgroundColor: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(10px)',
                            borderColor: 'var(--border-color)'
                        }}
                    >
                        {/* Left: Info & Narrative */}
                        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between lg:border-r relative overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                            {/* Decorative background specific to active card */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-10"
                                style={{ backgroundColor: `var(${activeColorVar})` }}
                            />

                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                                        style={{
                                            borderColor: `var(${activeColorVar})`,
                                            color: `var(${activeColorVar})`,
                                            backgroundColor: `var(--bg-tertiary)`
                                        }}
                                    >
                                        {activeStage.status === "completed" ? "Deploy Successful" : activeStage.status === "active" ? "System Active" : "In Queue"}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                        <Calendar size={14} />
                                        {activeStage.details.timeline}
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                    {activeStage.title}
                                </h2>
                                <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                                    {activeStage.description}
                                </p>
                            </div>

                            {/* Key Features Grid */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                                    <Layers size={14} /> Core Modules
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {activeStage.details.features.map((feat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.1) }}
                                            className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
                                            style={{
                                                backgroundColor: 'var(--bg-tertiary)',
                                                borderColor: 'var(--border-color)'
                                            }}
                                        >
                                            <ChevronRight size={14} style={{ color: `var(${activeColorVar})` }} />
                                            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{feat}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Tech Data & Metrics */}
                        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col gap-8" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>

                            {/* Progress Meter */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                                        <Cpu size={14} /> Compilation Status
                                    </h3>
                                    <span className="text-2xl font-mono font-bold" style={{ color: `var(${activeColorVar})` }}>
                                        {activeStage.details.progress}%
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${activeStage.details.progress}%` }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="h-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: `var(${activeColorVar})` }}
                                    />
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-tertiary)' }}>
                                    <GitBranch size={14} /> Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeStage.details.tech.map((t) => (
                                        <TechBadge key={t} text={t} colorVar={activeColorVar} />
                                    ))}
                                </div>
                            </div>

                            {/* Achievements / Goals */}
                            <div
                                className="mt-auto p-5 rounded-xl border"
                                style={{
                                    backgroundColor: 'var(--bg-tertiary)',
                                    borderColor: `var(${activeColorVar})`,
                                    opacity: 0.9
                                }}
                            >
                                <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: `var(${activeColorVar})` }}>
                                    {activeStage.status === "completed" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    {activeStage.status === "completed" ? "System Achievements" : "Target Objectives"}
                                </h4>
                                <ul className="space-y-2">
                                    {activeStage.details.achievements.map((item, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: `var(${activeColorVar})` }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </div>
    );
}