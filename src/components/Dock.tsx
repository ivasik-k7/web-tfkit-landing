import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    MessageCircle,
    Heart,
    Linkedin,
    MapPin,
    Calendar,
    Code,
    ChevronLeft,
    ChevronRight,
    Gamepad2,
    Copy,
    Check,
    TrendingUp,
    Sparkles,
    Bug,
    Lightbulb,
    MessageSquare,
    Send,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface TeamMember {
    name: string;
    role: string;
    linkedin: string;
    avatar: string;
    location: string;
    experience: string;
    expertise: string[];
    bio: string;
    isJoinCard?: boolean;
}

interface CryptoAddress {
    symbol: string;
    name: string;
    address: string;
    icon: string;
    color: string;
    network: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    emoji: string;
}

interface WidgetItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    color: string;
    component: React.ReactNode;
}


// ==========================================
// 2. SHARED STYLES & DATA
// ==========================================

const themeStyles = `
  :root {
    --color-primary: #7c3aed;
    --color-secondary: #2563eb;
    --color-cyan: #06b6d4;
    --color-emerald: #10b981;
    --color-purple-alt: #8b5cf6;
    --bg-primary: #000000;
    --bg-secondary: #0f172a;
    --bg-tertiary: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-tertiary: #94a3b8;
    --text-muted: #64748b;
    --border-color: rgba(6, 182, 212, 0.2);
    --gradient-hero: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%);
    --gradient-button: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
    --orb-1-color: #7c3aed;
    --orb-2-color: #2563eb;
  }

  /* Custom Scrollbar */
  .tarot-scrollbar::-webkit-scrollbar { width: 4px; }
  .tarot-scrollbar::-webkit-scrollbar-track { background: var(--bg-tertiary); border-radius: 4px; }
  .tarot-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 4px; }
  .tarot-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.6); }

  /* Utility Classes using Vars */
  .bg-theme-secondary { background-color: var(--bg-secondary); }
  .bg-theme-tertiary { background-color: var(--bg-tertiary); }
  .border-theme { border-color: var(--border-color); }
  .text-theme-cyan { color: var(--color-cyan); }
  .text-theme-purple { color: var(--color-purple-alt); }
  .gradient-text {
    background: var(--gradient-hero);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Ivan Kovtun",
        role: "Cloud Operation Architect",
        linkedin: "https://www.linkedin.com/in/ivankovtun7/",
        avatar: "https://media.licdn.com/dms/image/v2/D4D03AQHid_P5BtbO2w/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731103023918?e=1765411200&v=beta&t=0nZQluXoK0B_w8q3vpgLqaCfYEJCjLX-g_6uozkyFZ0",
        location: "Poland",
        experience: "8+ years",
        expertise: ["React/Next.js", "Python", "AWS", "DevOps/GitOps", "IaC (Terraform)", "CI/CD", "Security"],
        bio: "I'm just an usual guy. Coding sometimes... Sometimes walking my dog :)",
    },
    {
        name: "Taras Tarhanskiy",
        role: "Senior Java & Frontend Engineer",
        linkedin: "https://linkedin.com/",
        avatar: "☕",
        location: "Switzerland",
        experience: "Focus on Java backend & modern frontend",
        expertise: ["Java", "Spring Boot", "React", "TypeScript", "Frontend Architecture", "Analytics Integration"],
        bio: "Highly experienced engineer specializing in robust Java backend systems and dynamic frontend architectures. Leads project-related tasks, focusing on system optimization.",
    },
    {
        name: "Join Our Community!",
        role: "Open Source Contributor",
        linkedin: "#",
        avatar: "🌍",
        location: "Remote / Worldwide",
        experience: "Passion for open source",
        expertise: ["Your Skills", "Your Ideas", "Your Creativity", "Community Spirit"],
        bio: "This is a community-driven mission completely free and open to everyone. Whether you're a beginner or expert, your contributions matter.",
        isJoinCard: true,
    },

];

const CRYPTO_ADDRESSES: CryptoAddress[] = [
    { symbol: 'BTC', name: 'Bitcoin', address: 'bc1qx3a3qrtp3xpmukjx5rn8lt0ng25aujc58wuy5u', icon: '₿', color: '#F7931A', network: 'Bitcoin Network' },
    { symbol: 'ETH', name: 'Ethereum', address: '0x10F8D951316CfAd9329eE9dD7dE7762Ac46ae051', icon: 'Ξ', color: '#627EEA', network: 'Ethereum Network' },
    { symbol: 'BNB', name: 'BNB', address: '0x10F8D951316CfAd9329eE9dD7dE7762Ac46ae051', icon: '◆', color: '#F3BA2F', network: 'BNB Smart Chain' },
];

// ==========================================
// 3. SUB-COMPONENTS
// ==========================================

// --- Tarot Card ---
interface TarotCardProps {
    member: TeamMember;
    index: number;
    totalMembers: number;
    isActive: boolean;
}

const TarotCard: React.FC<TarotCardProps> = ({ member, index, totalMembers, isActive }) => {
    const offset = index * 2;
    const inactiveTransform = {
        rotate: `${(index - (totalMembers - 1) / 2) * 3}deg`,
        y: offset,
        x: offset,
        opacity: isActive ? 1 : 0.6,
        scale: 0.92,
    };
    const activeTransform = { rotate: 0, y: 0, x: 0, opacity: 1, scale: 1 };

    const isImageUrl = (avatar: string): boolean => {
        return avatar.startsWith('http') || avatar.startsWith('data:image') || avatar.includes('.') &&
            (avatar.includes('.jpg') || avatar.includes('.jpeg') || avatar.includes('.png') ||
                avatar.includes('.gif') || avatar.includes('.webp') || avatar.includes('.svg'));
    };

    const isJoinCard = member.name === "It Could Be You!" || member.isJoinCard;

    const renderAvatar = () => {
        if (isJoinCard) {
            return (
                <motion.div
                    className="text-4xl sm:text-5xl"
                    animate={{
                        rotate: isActive ? [0, -10, 10, 0] : 0,
                        scale: isActive ? [1, 1.2, 1] : 1,
                        y: isActive ? [0, -5, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: isActive ? Infinity : 0, repeatType: "reverse" }}
                >
                    {member.avatar}
                </motion.div>
            );
        }

        if (isImageUrl(member.avatar)) {
            return (
                <motion.div
                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#06b6d4] bg-[#1e293b] flex items-center justify-center"
                    animate={{
                        rotate: isActive ? [0, -5, 0] : 0,
                        scale: isActive ? [1, 1.05, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <img
                        src={member.avatar}
                        alt={`${member.name}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '👤';
                        }}
                    />
                </motion.div>
            );
        } else {
            return (
                <motion.div
                    className="text-4xl sm:text-5xl"
                    animate={{
                        rotate: isActive ? [0, -5, 0] : 0,
                        scale: isActive ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.5 }}
                >
                    {member.avatar}
                </motion.div>
            );
        }
    };

    return (
        <motion.div
            className={`absolute top-0 left-0 w-full h-full p-6 transition-colors duration-500 ease-in-out rounded-2xl border select-none ${isActive
                ? isJoinCard
                    ? 'border-[#10b981] shadow-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a]'
                    : 'border-[#8b5cf6] shadow-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a]'
                : 'border-[#06b6d4]/10 shadow-lg bg-[#0f172a]'
                }`}
            style={{
                zIndex: isActive ? 50 : 0,
                transformOrigin: 'bottom center',
            }}
            initial={inactiveTransform}
            animate={isActive ? activeTransform : inactiveTransform}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
            <div className="flex flex-col h-full">
                {/* Header Section */}
                <div className="flex items-start justify-between border-b border-[#06b6d4]/10 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                        {renderAvatar()}
                        <div className="flex flex-col">
                            <h4 className={`font-bold text-lg leading-tight ${isJoinCard ? 'text-[#10b981]' : 'text-white'
                                }`}>
                                {member.name}
                            </h4>
                            <p className={`text-xs mt-0.5 ${isJoinCard ? 'text-[#10b981]' : 'text-[#06b6d4]'
                                }`}>
                                {member.role}
                            </p>
                        </div>
                    </div>
                    {!isJoinCard && (
                        <motion.a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-full transition-colors ${isActive
                                ? 'text-[#8b5cf6] hover:bg-[#8b5cf6]/20'
                                : 'text-[#06b6d4]/50 hover:bg-[#06b6d4]/10'
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Linkedin className="w-5 h-5" />
                        </motion.a>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto pr-2 tarot-scrollbar">
                    {/* Bio */}
                    <p className={`text-sm leading-relaxed mb-5 ${isJoinCard ? 'text-[#10b981] italic' : 'text-gray-300'
                        }`}>
                        {member.bio}
                    </p>

                    {/* Location & Experience */}
                    <div className="space-y-2 text-xs mb-5">
                        <div className="flex items-center gap-2">
                            <MapPin className={`w-3 h-3 ${isJoinCard ? 'text-[#10b981]' : 'text-[#06b6d4]'
                                }`} />
                            <span className={isJoinCard ? 'text-[#10b981]' : 'text-[#94a3b8]'}>
                                {member.location}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-3 h-3 ${isJoinCard ? 'text-[#10b981]' : 'text-[#06b6d4]'
                                }`} />
                            <span className={isJoinCard ? 'text-[#10b981]' : 'text-[#94a3b8]'}>
                                {member.experience}
                            </span>
                        </div>
                    </div>

                    {/* Expertise */}
                    <div>
                        <h5 className={`text-xs font-semibold uppercase mb-2 flex items-center gap-1 ${isJoinCard ? 'text-[#10b981]' : 'text-[#8b5cf6]'
                            }`}>
                            <Code className="w-3 h-3" />
                            {isJoinCard ? "What We're Looking For" : "Expertise"}
                        </h5>
                        <div className="flex flex-wrap gap-2 pb-2">
                            {member.expertise.map((skill, skillIndex) => (
                                <motion.span
                                    key={skill}
                                    className={`px-2 py-1 border rounded-md text-[10px] ${isJoinCard
                                        ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                                        : 'bg-[#1e293b] border-[#8b5cf6]/20 text-gray-200'
                                        }`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: skillIndex * 0.1 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Decorative Line */}
                <div className={`h-0.5 rounded-full mt-3 opacity-50 ${isJoinCard
                    ? 'bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#10b981]'
                    : 'bg-gradient-to-r from-[#06b6d4] via-[#8b5cf6] to-[#06b6d4]'
                    }`} />
            </div>
        </motion.div>
    );
};

// --- Team Widget Content ---
const TeamWidgetContent: React.FC = () => {
    const [currentMember, setCurrentMember] = useState(0);
    const totalMembers = TEAM_MEMBERS.length;
    const nextMember = () => setCurrentMember((prev) => (prev + 1) % totalMembers);
    const prevMember = () => setCurrentMember((prev) => (prev - 1 + totalMembers) % totalMembers);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextMember();
            if (e.key === 'ArrowLeft') prevMember();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="w-[300px] h-[440px] sm:w-[340px] sm:h-[480px] relative">
            <div style={{ perspective: '1200px', position: 'relative', width: '100%', height: '100%' }}>
                {TEAM_MEMBERS.map((member, index) => (
                    <TarotCard key={member.name} member={member} index={index} totalMembers={totalMembers} isActive={index === currentMember} />
                ))}
                <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-6">
                    <button onClick={prevMember} className="p-2 rounded-full bg-[#0f172a] border border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4]/10">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        {TEAM_MEMBERS.map((_, idx) => (
                            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentMember ? 'w-6 bg-[#8b5cf6]' : 'w-1.5 bg-[#334155]'}`} />
                        ))}
                    </div>
                    <button onClick={nextMember} className="p-2 rounded-full bg-[#0f172a] border border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4]/10">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. FEEDBACK / COMMUNITY WIDGET (Reworked)
// ==========================================

const CATEGORY_COLORS = {
    feature: { bg: 'bg-emerald-500/20', border: 'border-emerald-400', label: 'Feature Request', emoji: '✨', icon: Sparkles },
    bug: { bg: 'bg-rose-500/20', border: 'border-rose-400', label: 'Bug Report', emoji: '🐛', icon: Bug },
    idea: { bg: 'bg-violet-500/20', border: 'border-violet-400', label: 'Idea', emoji: '💡', icon: Lightbulb },
    general: { bg: 'bg-blue-500/20', border: 'border-blue-400', label: 'General Feedback', emoji: '💬', icon: MessageSquare },
};

const FeedbackWidgetContent: React.FC = () => {
    const [panelPhase, setPanelPhase] = useState<'intro' | 'feedback' | 'success' | 'error'>('intro');
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof CATEGORY_COLORS>('general');
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalFeedbacks, setTotalFeedbacks] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isLoadingCount, setIsLoadingCount] = useState(true);

    const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
    const DISCORD_INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL;

    useEffect(() => {
        if (!WEBHOOK_URL) {
            console.error('Discord webhook URL is not configured. Please check your environment variables.');
        }
        if (!DISCORD_INVITE_URL) {
            console.error('Discord invite URL is not configured. Please check your environment variables.');
        }
    }, []);

    const fetchMessageCount = async () => {
        setIsLoadingCount(true);
        try {
            const storedCount = localStorage.getItem('discord_feedback_count');
            if (storedCount) {
                setTotalFeedbacks(parseInt(storedCount));
            } else {
                const initialCount = 42;
                setTotalFeedbacks(initialCount);
                localStorage.setItem('discord_feedback_count', initialCount.toString());
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('Failed to fetch message count:', error);
            setTotalFeedbacks(42);
        } finally {
            setIsLoadingCount(false);
        }
    };

    const incrementFeedbackCount = () => {
        const newCount = totalFeedbacks + 1;
        setTotalFeedbacks(newCount);
        localStorage.setItem('discord_feedback_count', newCount.toString());
    };

    useEffect(() => {
        fetchMessageCount();
    }, []);

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        if (!WEBHOOK_URL) {
            console.error('Error submitting feedback:', 'Feedback system is not configured. Please contact support.');
            setPanelPhase('error');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);

        let ipAddress = 'Unknown';
        let country = 'Unknown';
        let city = 'Unknown';

        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geoData = await geoResponse.json();

            ipAddress = geoData.ip || 'Unknown';
            country = geoData.country_name || 'Unknown';
            city = geoData.city || 'Unknown';
        } catch (error) {
            console.warn('Could not fetch geolocation data:', error);
        }

        const categoryInfo = CATEGORY_COLORS[selectedCategory];
        const submissionDate = new Date();
        const timestamp = submissionDate.toISOString();
        const userAgent = navigator.userAgent;
        const threadName = `Feedback: ${categoryInfo.label} - ${submissionDate.toLocaleDateString()}`;

        const discordMessage = {
            username: '🚀 Feedback Bot',
            avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
            thread_name: threadName,
            embeds: [
                {
                    title: `${categoryInfo.emoji} New ${categoryInfo.label} Feedback Received`,
                    description: feedback,
                    color: parseInt(
                        selectedCategory === 'feature' ? '0x10b981' :
                            selectedCategory === 'bug' ? '0xf43f5e' :
                                selectedCategory === 'idea' ? '0x8b5cf6' : '0x3b82f6'
                    ),
                    fields: [
                        { name: '📂 Category', value: categoryInfo.label, inline: true },
                        { name: '⏰ Time (Local)', value: submissionDate.toLocaleTimeString(), inline: true },
                        { name: '🌎 Country', value: country, inline: true },
                        { name: '🏙️ City', value: city, inline: true },
                        { name: '🔗 IP Address', value: ipAddress, inline: true },
                        { name: '🌐 Source', value: 'Web Feedback Widget', inline: false },
                        { name: '💻 User Agent', value: userAgent.substring(0, 1024), inline: false },
                    ],
                    footer: {
                        text: 'Feedback System v2.1 | Submitted from Homepage Landing',
                        icon_url: 'https://cdn-icons-png.flaticon.com/512/3050/3050159.png',
                    },
                    timestamp: timestamp,
                },
            ],
        };

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordMessage),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Discord API: ${response.status} ${errorData.message}`);
            }

            // Success Handling
            const burstParticles = Array.from({ length: 12 }, (_, i) => ({
                id: Date.now() + i,
                x: Math.random() * 300 - 150, // Random spread relative to center
                y: Math.random() * 300 - 150,
                emoji: ['✨', '💜', '🎉', '⭐', '🚀', '💫', '🌟', '✨', '🔮', '⚡', '💎', '🌈'][i],
            }));
            setParticles(burstParticles);

            setTimeout(() => {
                setParticles(prev => prev.filter(p => !burstParticles.find(bp => bp.id === p.id)));
            }, 2000);

            setFeedback('');
            setMessageCount(prev => prev + 1);
            incrementFeedbackCount();
            setPanelPhase('success');
            setIsSubmitting(false);

            setTimeout(() => {
                setPanelPhase('intro');
            }, 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setPanelPhase('error');
            setIsSubmitting(false);
            setTimeout(() => {
                setPanelPhase('feedback');
            }, 3000);
        }
    };

    const CategoryIcon = CATEGORY_COLORS[selectedCategory].icon;

    return (
        <div className="w-[300px] h-[440px] sm:w-[340px] sm:h-[480px] relative">
            {/* Particles Layer */}
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="absolute left-1/2 top-1/2 text-2xl pointer-events-none z-[100]"
                        initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [1, 0.8, 0],
                            x: particle.x,
                            y: particle.y,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        {particle.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="w-full h-full p-1 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-[#06b6d4]/30 shadow-2xl flex flex-col relative overflow-hidden">

                {/* Header */}
                <div className="p-4 border-b border-[#06b6d4]/10 bg-[#0f172a]/80 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center shadow-lg">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white tracking-tight">Community</h3>
                            <p className="text-xs text-[#06b6d4] font-medium">Feedback & Support</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 tarot-scrollbar relative z-10">
                    <AnimatePresence mode="wait">

                        {/* INTRO PHASE */}
                        {panelPhase === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-4"
                            >
                                <div className="bg-[#1e293b]/50 border border-[#06b6d4]/20 rounded-xl p-4">
                                    <h4 className="text-white font-semibold mb-2 text-sm">Join the Conversation</h4>
                                    <p className="text-[#94a3b8] text-xs leading-relaxed mb-3">
                                        Connect with the team and other users. Drop a feature request or just say hi!
                                    </p>
                                    <button
                                        onClick={() => window.open(DISCORD_INVITE_URL, '_blank')}
                                        className="w-full py-2 rounded-lg bg-[#5865F2] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#4752C4] transition-colors"
                                    >
                                        <Gamepad2 className="w-4 h-4" /> Join Discord
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 text-center">
                                        <div className="text-xl font-black text-white">
                                            {isLoadingCount ? '...' : totalFeedbacks}
                                        </div>
                                        <div className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Total Feedback</div>
                                    </div>
                                    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 text-center">
                                        <div className="text-xl font-black text-[#06b6d4]">{messageCount}</div>
                                        <div className="text-[10px] text-[#94a3b8] uppercase tracking-wide">Sent by You</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setPanelPhase('feedback')}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    <Send className="w-4 h-4" /> Send Feedback
                                </button>
                            </motion.div>
                        )}

                        {/* FEEDBACK FORM PHASE */}
                        {panelPhase === 'feedback' && (
                            <motion.form
                                key="feedback"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSubmitFeedback}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-xs font-bold text-[#94a3b8] uppercase mb-2 block">Select Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(CATEGORY_COLORS) as Array<keyof typeof CATEGORY_COLORS>).map((cat) => {
                                            const C = CATEGORY_COLORS[cat];
                                            const isSel = selectedCategory === cat;
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${isSel ? `${C.bg} ${C.border} text-white` : 'bg-[#0f172a] border-[#1e293b] text-gray-400 hover:text-white'
                                                        }`}
                                                >
                                                    <span className="text-base">{C.emoji}</span> {C.label.split(' ')[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-[#94a3b8] uppercase mb-2 block">Your Message</label>
                                    <div className={`bg-[#0f172a] border rounded-xl p-3 flex items-start gap-2 ${CATEGORY_COLORS[selectedCategory].border}`}>
                                        <CategoryIcon className={`w-5 h-5 mt-1 ${selectedCategory === 'feature' ? 'text-emerald-400' : selectedCategory === 'bug' ? 'text-rose-400' : selectedCategory === 'idea' ? 'text-violet-400' : 'text-blue-400'}`} />
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Describe your thoughts..."
                                            rows={4}
                                            className="bg-transparent w-full text-sm text-white placeholder-gray-600 focus:outline-none resize-none custom-scrollbar"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPanelPhase('intro')}
                                        className="px-4 py-2 rounded-lg bg-[#1e293b] text-gray-400 text-xs font-bold hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {/* SUCCESS PHASE */}
                        {panelPhase === 'success' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">Received!</h4>
                                <p className="text-[#94a3b8] text-xs max-w-[200px]">
                                    Thanks for helping us improve. We'll review your feedback shortly.
                                </p>
                            </motion.div>
                        )}

                        {/* ERROR PHASE */}
                        {panelPhase === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                                    <AlertCircle className="w-8 h-8 text-rose-400" />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">Oops!</h4>
                                <p className="text-[#94a3b8] text-xs max-w-[200px]">
                                    Something went wrong sending your feedback. Please try again.
                                </p>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer Gradient */}
                <div className="h-1 bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] w-full absolute bottom-0" />
            </div>
        </div>
    );
};

// ==========================================
// 5. DONATION WIDGET CONTENT
// ==========================================


const DonationWidgetContent: React.FC = () => {
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
    const [particles, setParticles] = useState<Particle[]>([]);

    const handleCopy = async (address: string, symbol: string) => {
        try {
            // Using document.execCommand('copy') for reliable iframe copy functionality
            const textarea = document.createElement('textarea');
            textarea.value = address;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            setCopiedAddress(symbol);
            setTimeout(() => setCopiedAddress(null), 2000);
        } catch (err) { console.error('Failed to copy:', err); }
    };

    return (
        <div className="w-[300px] h-[440px] sm:w-[340px] sm:h-[485px] relative">
            <AnimatePresence>
                {/* Particle effect on copy (kept for visual flair) */}
                {particles.map(p => (
                    <motion.div
                        key={p.id}
                        className="fixed text-2xl pointer-events-none z-[9999]"
                        initial={{ scale: 0, opacity: 1, x: p.x, y: p.y }}
                        animate={{ scale: [0, 1.5, 0], opacity: [1, 0.8, 0], y: p.y - 100, x: p.x + (Math.random() - 0.5) * 60 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        style={{ left: 0, top: 0 }}
                    >
                        {p.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="w-full h-full p-1 rounded-2xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-theme shadow-2xl flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-theme bg-[var(--bg-secondary)]/80 backdrop-blur-md relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-button)' }}>
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white tracking-tight">Support Our Project</h3>
                            <p className="text-xs text-theme-cyan font-medium">Crypto Donations Only</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 tarot-scrollbar relative z-10">
                    <h4 className="text-xs font-bold text-theme-cyan mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <TrendingUp className="w-3 h-3" /> Wallet Addresses
                    </h4>

                    <div className="space-y-3">
                        {CRYPTO_ADDRESSES.map((crypto) => (
                            <motion.div
                                key={crypto.symbol}
                                className="p-3 rounded-xl bg-theme-secondary border border-theme transition-all duration-200 hover:border-[var(--color-cyan)] hover:shadow-lg group"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl" style={{ color: crypto.color }}>{crypto.icon}</span>
                                        <div>
                                            <div className="text-sm font-bold text-white">{crypto.name} ({crypto.symbol})</div>
                                            <div className="text-[10px] text-gray-500">{crypto.network}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            handleCopy(crypto.address, crypto.symbol);
                                            // Particle burst effect on copy success
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const newParticle: Particle = {
                                                id: Date.now() + Math.random(),
                                                x: rect.left + rect.width / 2,
                                                y: rect.top + rect.height / 2,
                                                emoji: '💖'
                                            };
                                            setParticles(prev => [...prev, newParticle]);
                                            setTimeout(() => setParticles(prev => prev.filter(p => p.id !== newParticle.id)), 2000);
                                        }}
                                        className="p-1.5 rounded-full bg-theme-tertiary text-gray-400 hover:text-theme-cyan hover:bg-theme-cyan/20 transition-colors shadow-md"
                                    >
                                        {copiedAddress === crypto.symbol ? <Check className="w-4 h-4 text-theme-emerald" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="text-[10px] font-mono text-gray-400 break-all bg-[var(--bg-secondary)] p-2 rounded border border-white/5 mt-2">
                                    {crypto.address}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

// ==========================================
// 6. DOCK CONFIGURATION
// ==========================================

const WIDGET_ITEMS: WidgetItem[] = [
    {
        id: 'feedback',
        icon: <MessageCircle size={20} />,
        label: 'Community',
        color: '#5865F2', // Discord Blue
        component: <FeedbackWidgetContent />
    },
    {
        id: 'team',
        icon: <Users size={20} />,
        label: 'Team',
        color: '#8b5cf6', // Purple
        component: <TeamWidgetContent />
    },

    {
        id: 'donation',
        icon: <Heart size={20} />,
        label: 'Support',
        color: '#ec4899', // Pink
        component: <DonationWidgetContent />
    }
];

// ==========================================
// 7. MAIN COMPONENT
// ==========================================

export default function ResponsiveDock() {
    const [activeTab, setActiveTab] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setActiveTab(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActiveTab(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] text-white font-sans absolute overflow-hidden flex items-center justify-center">
            <style>{themeStyles}</style>

            <nav
                ref={containerRef}
                className="
                    fixed z-50
                    bottom-6 left-1/2 transform -translate-x-1/2 
                    w-[90%] max-w-xs h-16 px-4 rounded-2xl
                    bg-theme-tertiary/80 backdrop-blur-xl border border-theme shadow-2xl
                    flex items-center justify-around
                    
                    md:bottom-auto md:left-6 md:top-1/2 md:-translate-y-1/2 md:-translate-x-0
                    md:w-20 md:h-auto md:py-8 md:px-2 md:rounded-3xl
                    md:flex-col md:justify-center md:gap-6
                "
            >
                {WIDGET_ITEMS.map((item, index) => {
                    const isActive = activeTab === index;

                    return (
                        <div key={item.id} className="relative">
                            <motion.button
                                onClick={() => setActiveTab(isActive ? null : index)}
                                className="relative group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 outline-none"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute inset-0 rounded-xl bg-white/10 blur-md"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div
                                    className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}
                                    style={{ color: isActive ? item.color : undefined }}
                                >
                                    {item.icon}
                                </div>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="absolute -bottom-2 w-1 h-1 rounded-full md:bottom-auto md:-left-3 md:w-1 md:h-8 md:rounded-r-md"
                                        style={{ backgroundColor: item.color }}
                                    />
                                )}

                                <div className="absolute left-full ml-4 px-2 py-1 bg-theme-secondary text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block whitespace-nowrap border border-theme shadow-xl z-50">
                                    {item.label}
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-theme-secondary rotate-45 border-l border-b border-theme" />
                                </div>
                            </motion.button>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        className="absolute z-[60] cursor-default"
                                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                    >
                                        <div className={`
                                            absolute
                                            bottom-[4.5rem]
                                            md:bottom-auto md:left-[5rem] 
                                        `}
                                            style={{
                                                left: window.innerWidth < 768 ? '-140px' : '',
                                                top: window.innerWidth >= 768 ? '-220px' : ''
                                            }}
                                        >
                                            {item.component}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}