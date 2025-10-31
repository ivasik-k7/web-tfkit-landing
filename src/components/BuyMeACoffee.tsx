import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Coffee, Heart, Sparkles, Zap, Star, Trophy, Crown, RotateCcw, Target, X, Clock, DollarSign, Terminal } from 'lucide-react';

// --- Type Definitions ---
interface BMCStats {
    total_coffees: number;
    total_supporters: number;
    recent_supporters: Array<{
        name: string;
        coffee_count: number;
    }>;
}

type GamePhase = 'intro' | 'active' | 'results';

interface GameReward {
    level: string;
    discount: number;
    icon: React.ReactNode;
}

// --- Constants (Updated for the NEW CYBER-GLOW Theme) ---
const GAME_DURATION_SECONDS = 10;
const API_MOCK_DELAY_MS = 1000;
const COFFEE_GOAL = 200;

// --- Mock API Call (Simulates fetching data) ---
const mockFetchStats = async (): Promise<BMCStats> => {
    await new Promise(resolve => setTimeout(resolve, API_MOCK_DELAY_MS));
    return {
        total_coffees: 3,
        total_supporters: 21,
        recent_supporters: [
            // Mock data for supporters could go here
        ]
    };
};

// --- Tailwind Classes for NEW CYBER-GLOW Theme (Based on provided CSS vars) ---
const THEME_COLORS = {
    // Backgrounds (using your Tailwind classes for the provided hexes)
    BG_DARK: 'bg-[#0f172a]',       // --bg-secondary
    BG_PANEL: 'bg-[#1e293b]',      // --bg-tertiary
    BORDER: 'border-white/20',     // A light, modern border for panels/separators
    BORDER_ACCENT: 'border-[#06b6d4]', // --color-cyan

    // Accents (Primary glow colors)
    ACCENT_CYAN: 'text-[#06b6d4]', // --color-cyan
    ACCENT_PURPLE: 'text-[#8b5cf6]', // --color-purple-alt (Used for highlights)
    TEXT_PRIMARY: 'text-[#f8fafc]', // --text-primary

    // Gradients (using your definitions)
    BUTTON_GRADIENT: 'bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]', // --gradient-button
    PROGRESS_GRADIENT: 'bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]', // --gradient-progress

    // Custom Glow (Translating your CSS var shadows)
    SHADOW_GLOW: 'shadow-[0_0_10px_rgba(6,182,212,0.7)]', // Cyan Glow (reduced size for button)
    PANEL_GLOW: 'shadow-[0_0_15px_rgba(139,92,246,0.4)]', // Purple Glow for panel
};

// --- Main Component ---

export function BuyMeACoffee() {
    const prefersReducedMotion = useReducedMotion();

    // UI/Interaction States
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // API Data States
    const [stats, setStats] = useState<BMCStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mini-Game States
    const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
    const [gameScore, setGameScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);

    // --- Data Fetching Logic (Only on Expand) ---
    useEffect(() => {
        if (isExpanded && !stats && !isLoading) {
            const fetchStats = async () => {
                setIsLoading(true);
                try {
                    const fetchedStats = await mockFetchStats();
                    setStats(fetchedStats);
                } catch (error) {
                    console.error("Failed to fetch BMC stats:", error);
                    setStats(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchStats();
        }
    }, [isExpanded, stats, isLoading]);

    // --- Game Timer Logic ---
    useEffect(() => {
        if (gamePhase !== 'active') return;

        if (timeLeft <= 0) {
            setGamePhase('results');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [gamePhase, timeLeft]);

    // --- Mini-game Functions ---
    const startCoffeeGame = () => {
        setGameScore(0);
        setTimeLeft(GAME_DURATION_SECONDS);
        setParticles([]);
        setGamePhase('active');
    };

    const handleCoffeeClick = (e: React.MouseEvent) => {
        if (gamePhase !== 'active') return;

        setGameScore(prev => prev + 1);

        // Particle effect logic (Uses clientX/Y relative to viewport for fixed position)
        const clickX = e.clientX;
        const clickY = e.clientY;

        const newParticle = {
            id: Date.now() + Math.random(),
            x: clickX,
            y: clickY,
            // Using icons that fit the Cyber-Glow theme
            type: ['✨', '⚡️', '💿', '💾', '🚀'][Math.floor(Math.random() * 5)]
        };

        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 2000);
    };

    const getGameReward: () => GameReward = useCallback(() => {
        // Updated colors for rewards
        if (gameScore >= 50) return { level: 'Legendary Glitch', discount: 25, icon: <Crown className="w-4 h-4 text-[#8b5cf6] fill-[#8b5cf6]" /> };
        if (gameScore >= 30) return { level: 'Turbo Hacker', discount: 15, icon: <Trophy className="w-4 h-4 text-[#06b6d4] fill-[#06b6d4]" /> };
        if (gameScore >= 20) return { level: 'Pixel Pro', discount: 10, icon: <Star className="w-4 h-4 text-[#10b981] fill-[#10b981]" /> }; // Using emerald
        if (gameScore >= 10) return { level: '8-Bit Supporter', discount: 5, icon: <Heart className="w-4 h-4 text-[#7c3aed] fill-[#7c3aed]" /> }; // Using primary
        return { level: 'Newbie Unit', discount: 0, icon: <Coffee className="w-4 h-4 text-white/50" /> };
    }, [gameScore]);

    // --- Component JSX ---
    return (
        <div className="fixed bottom-4 left-4 z-50">

            {/* Particle Layer (Global fixed positioning) */}
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="fixed text-xl pointer-events-none z-[100] font-mono"
                        initial={{ scale: 0, opacity: 1, x: particle.x, y: particle.y }}
                        animate={{
                            scale: [0, 1.2, 0],
                            opacity: [1, 0.8, 0],
                            y: particle.y - 80,
                            x: particle.x + (Math.random() - 0.5) * 40,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
                    >
                        {particle.type}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Main Floating Button */}
            <motion.button
                className="relative group w-12 h-12 z-50"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Close support panel" : "Open support panel"}
            >
                {/* Pulsing Ring (CYAN Glow) - Using a dynamic box shadow for the glow */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={prefersReducedMotion ? {} : {
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    style={{
                        boxShadow: '0 0 8px #06b6d4', // --color-cyan for pulse
                    }}
                />

                {/* Main Button with Cyber-Glow style */}
                <motion.div
                    className={`relative w-full h-full ${THEME_COLORS.BUTTON_GRADIENT} text-white p-3 rounded-full shadow-lg border-2 ${THEME_COLORS.BORDER_ACCENT} flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: isExpanded ? 0 : 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        boxShadow: isExpanded ? 'none' : '0 5px 10px -2px rgba(6, 182, 212, 0.6)', // Shadow from cyan
                    }}
                >
                    {isExpanded ? <X className="w-5 h-5" /> : <Terminal className={`w-5 h-5 ${THEME_COLORS.ACCENT_CYAN}`} />}
                </motion.div>

                {/* Interactive Tooltip (Styled for the new theme) */}
                <AnimatePresence>
                    {isHovered && !isExpanded && (
                        <motion.div
                            className={`absolute bottom-full left-0 mb-2 ${THEME_COLORS.BG_DARK}/95 backdrop-blur-md text-white px-3 py-1 rounded-lg border-2 ${THEME_COLORS.BORDER} shadow-lg whitespace-nowrap font-mono`}
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            style={{ boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }} // Purple glow for tooltip
                        >
                            <div className={`flex items-center gap-1 text-xs font-semibold ${THEME_COLORS.ACCENT_CYAN}`}>
                                <Sparkles className="w-3 h-3" />
                                <strong>ACCESS GRANTED</strong>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Expanded Donation Panel (Cyber-Glow Style) */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className={`absolute bottom-16 left-0 w-80 ${THEME_COLORS.BG_PANEL} backdrop-blur-xl border-2 ${THEME_COLORS.BORDER} rounded-md shadow-xl overflow-hidden ${THEME_COLORS.TEXT_PRIMARY} font-mono`} // Changed border, radius, and text color
                        initial={{ opacity: 0, scale: 0.8, y: 10, x: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10, x: -10 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        style={{ boxShadow: THEME_COLORS.PANEL_GLOW.replace('shadow-[', '').replace(']', '') }} // Apply purple glow
                    >
                        {/* Animated Header */}
                        <div
                            className={`p-3 border-b-2 ${THEME_COLORS.BORDER} relative overflow-hidden ${THEME_COLORS.BG_DARK}`}
                        >
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${THEME_COLORS.BUTTON_GRADIENT} shadow-md border ${THEME_COLORS.BORDER_ACCENT}`}>
                                        <Terminal className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`font-extrabold text-lg ${THEME_COLORS.ACCENT_CYAN}`}>
                                            // SYSTEM: UP-LINK
                                        </h3>
                                        <p className={`${THEME_COLORS.ACCENT_PURPLE} text-xs`}>INITIATE SUPPORT PROTOCOL 💾</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1 font-mono">
                                        <span className={THEME_COLORS.ACCENT_CYAN}>GOAL:</span>
                                        <span className={`${THEME_COLORS.ACCENT_PURPLE} font-semibold`}>
                                            {stats ? `${stats.total_coffees} / ${COFFEE_GOAL} DATA UNITS` : 'LOADING...'}
                                        </span>
                                    </div>
                                    <div className={`w-full bg-white/10 rounded-sm h-2 overflow-hidden border ${THEME_COLORS.BORDER_ACCENT} shadow-inner`}>
                                        <motion.div
                                            className={`h-2 rounded-sm shadow-lg ${THEME_COLORS.PROGRESS_GRADIENT}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stats ? (stats.total_coffees / COFFEE_GOAL) * 100 : 0}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Content */}
                        <div className="p-3">
                            {/* Coffee Clicker Mini-Game */}
                            <GamePanel
                                phase={gamePhase}
                                setGamePhase={setGamePhase}
                                startCoffeeGame={startCoffeeGame}
                                handleCoffeeClick={handleCoffeeClick}
                                gameScore={gameScore}
                                timeLeft={timeLeft}
                                getGameReward={getGameReward}
                                theme={THEME_COLORS} // Pass theme colors to subcomponent
                            />

                            {/* Donation Options (Restyled) */}
                            <h4 className={`text-[#06b6d4] text-xs font-semibold mb-2 border-b border-dashed ${THEME_COLORS.BORDER} pb-1`}>
                                // DIRECT DATA TRANSFER
                            </h4>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {[
                                    { amount: '3', emoji: '💾', label: 'FLOPPY', color: '#7c3aed' }, // Primary
                                    { amount: '5', emoji: '💿', label: 'CD-ROM', color: '#2563eb' }, // Secondary
                                    { amount: '10', emoji: '🚀', label: 'TURBO BOOST', color: '#06b6d4' }, // Cyan
                                    { amount: '25', emoji: '🌟', label: 'MATRIX ACCESS', color: '#8b5cf6' } // Purple-alt
                                ].map((option) => (
                                    <DonationOption key={option.amount} {...option} theme={THEME_COLORS} />
                                ))}
                            </div>

                            {/* Custom Support Button (Restyled) */}
                            <motion.button
                                className={`w-full p-2 rounded-sm text-white font-bold flex items-center justify-center gap-1 ${THEME_COLORS.BUTTON_GRADIENT} border-2 ${THEME_COLORS.BORDER_ACCENT} shadow-md uppercase text-sm`}
                                whileHover={{ scale: 1.02, boxShadow: '0 0 10px rgba(6, 182, 212, 1)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.open('https://buymeacoffee.com/ivasyk', '_blank')}
                            >
                                <DollarSign className="w-4 h-4 text-white" />
                                CUSTOM MEGABYTES
                            </motion.button>

                        </div>

                        {/* Footer with Recent Supporters */}
                        <div className={`border-t-2 ${THEME_COLORS.BORDER} p-2 flex items-center justify-center ${THEME_COLORS.BG_DARK}`}>
                            <div className={`flex items-center gap-1 ${THEME_COLORS.ACCENT_PURPLE} font-semibold text-xs`}>
                                <Heart className={`w-3 h-3 fill-[#8b5cf6]`} />
                                COMMUNITY CORE ONLINE
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- New Game Panel Component (Cyber-Glow Style) ---

interface GamePanelProps {
    phase: GamePhase;
    setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
    startCoffeeGame: () => void;
    handleCoffeeClick: (e: React.MouseEvent) => void;
    gameScore: number;
    timeLeft: number;
    getGameReward: () => GameReward;
    theme: typeof THEME_COLORS;
}

const GamePanel: React.FC<GamePanelProps> = ({ phase, setGamePhase, startCoffeeGame, handleCoffeeClick, gameScore, timeLeft, getGameReward, theme }) => {
    const reward = getGameReward();

    return (
        <div className="mb-4 font-mono">
            <h4 className={`text-[#06b6d4] text-xs font-semibold mb-2 border-b border-dashed ${theme.BORDER} pb-1 flex items-center gap-1`}>
                <Target className={`w-3 h-3 ${theme.ACCENT_CYAN}`} />
                // MINI-GAME: DATAFRAME SPEED TEST
            </h4>
            <div className={`p-2 rounded-sm border-2 ${theme.BORDER_ACCENT} relative overflow-hidden ${theme.BG_DARK} shadow-inner`}>
                <AnimatePresence mode="wait">
                    {/* 1. Intro Phase */}
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                            <h4 className={`text-base font-bold ${theme.ACCENT_CYAN} mb-2 uppercase`}>
                                INIT.EXE
                            </h4>
                            <p className={`${theme.ACCENT_PURPLE} text-xs mb-3`}>
                                RAPIDLY CLICK THE ICON {GAME_DURATION_SECONDS} SECONDS! THE FASTER YOU CLICK, THE BETTER THE REWARD.
                            </p>
                            <motion.button
                                className={`w-full p-2 rounded-sm text-white font-semibold flex items-center justify-center gap-1 group ${theme.BUTTON_GRADIENT} shadow-md border ${theme.BORDER_ACCENT} uppercase text-sm`}
                                whileHover={{ scale: 1.03, boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startCoffeeGame}
                            >
                                <Zap className="w-4 h-4" />
                                <strong className="font-extrabold">START UPLINK</strong>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* 2. Active Game Phase */}
                    {phase === 'active' && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                            {/* Timer */}
                            <motion.div
                                className={`absolute top-0 right-0 m-1 px-2 py-0.5 rounded-none text-xs font-bold flex items-center gap-0.5 border ${timeLeft <= 3 ? 'bg-red-800 text-white shadow-red border-red-500' : `${theme.BG_PANEL} ${theme.ACCENT_CYAN} border-[#8b5cf6]`}`}
                                key={timeLeft}
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: 1, ease: "easeOut" }}
                            >
                                <Clock className="w-3 h-3" />
                                <b>{timeLeft}s</b> LEFT
                            </motion.div>

                            <div className="text-xl font-black text-white mb-3 mt-1">SCORE: <span className={theme.ACCENT_PURPLE}>{gameScore}</span></div>

                            <motion.button
                                className={`p-4 rounded-md text-4xl cursor-pointer shadow-lg transition-all duration-100 ease-out border-2 ${theme.BORDER_ACCENT}`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95, boxShadow: 'none' }}
                                onClick={handleCoffeeClick}
                                style={{ background: 'radial-gradient(circle, #8b5cf6, #7c3aed)', boxShadow: '0 3px 10px -3px rgba(139, 92, 246, 0.7)' }} // Purple focus
                                disabled={timeLeft <= 0}
                            >
                                💾
                            </motion.button>
                        </motion.div>
                    )}

                    {/* 3. Results Phase */}
                    {phase === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-black text-white mb-3">
                                FINAL SCORE: <span className={theme.ACCENT_PURPLE}>{gameScore}</span>
                            </div>

                            <div className={`p-2 ${theme.BG_PANEL} rounded-sm border-2 ${theme.BORDER_ACCENT} mb-3 shadow-md`}>
                                <p className={`text-xs font-medium ${theme.ACCENT_CYAN} mb-1`}>
                                    TITLE ACQUIRED:
                                </p>
                                <div className="text-lg font-bold flex items-center justify-center gap-1">
                                    {reward.icon}
                                    <span className="text-white uppercase">{reward.level}</span>
                                </div>
                            </div>

                            <motion.button
                                className={`w-full p-2 rounded-sm text-white font-semibold flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 transition-colors border-2 ${theme.BORDER_ACCENT} uppercase text-sm`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setGamePhase('intro')}
                            >
                                <RotateCcw className={`w-4 h-4 ${theme.ACCENT_CYAN}`} />
                                RE-INITIATE
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


const DonationOption: React.FC<{ amount: string; emoji: string; label: string; color: string, theme: typeof THEME_COLORS }> = ({ amount, emoji, label, color, theme }) => (
    <motion.button
        className={`p-2 rounded-sm border ${theme.BORDER} text-center transition-all duration-300 group relative overflow-hidden ${theme.BG_DARK} shadow-sm uppercase`}
        whileHover={{ scale: 1.05, y: -2, boxShadow: `0 5px 10px ${color}60` }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open('https://buymeacoffee.com/ivasyk', '_blank')}
        style={{ border: `1px solid ${color}` }}
    >
        <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{ backgroundColor: color }}
        />

        <div className="relative z-10">
            <motion.div
                className="text-2xl mb-1"
                whileHover={{ scale: 1.2, rotate: 15 }}
            >
                {emoji}
            </motion.div>
            <div className="font-extrabold text-lg" style={{ color }}>
                ${amount}
            </div>
            <div className="text-gray-400 text-xs font-medium">
                {label}
            </div>
        </div>
    </motion.button>
);