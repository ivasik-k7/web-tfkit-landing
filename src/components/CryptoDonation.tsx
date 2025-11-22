import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Wallet, Zap, Copy, Check, X, Target, RotateCcw, TrendingUp } from 'lucide-react';

// --- Type Definitions ---
type GamePhase = 'intro' | 'active' | 'results';

interface GameReward {
    level: string;
    multiplier: string;
    icon: React.ReactNode;
}

interface CryptoAddress {
    symbol: string;
    name: string;
    address: string;
    icon: string;
    color: string;
    network?: string;
}

// --- Constants ---
const GAME_DURATION_SECONDS = 10;

// Real-world crypto addresses (replace with your actual addresses)
const CRYPTO_ADDRESSES: CryptoAddress[] = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        address: 'bc1qx3a3qrtp3xpmukjx5rn8lt0ng25aujc58wuy5u',
        icon: '₿',
        color: '#F7931A',
        network: 'Bitcoin Network'
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        address: '0x10F8D951316CfAd9329eE9dD7dE7762Ac46ae051',
        icon: 'Ξ',
        color: '#627EEA',
        network: 'Ethereum Network'
    },
    {
        symbol: 'BNB',
        name: 'BNB',
        address: '0x10F8D951316CfAd9329eE9dD7dE7762Ac46ae051',
        icon: '◆',
        color: '#F3BA2F',
        network: 'BNB Smart Chain'
    },
];

// --- Theme Colors ---
const THEME = {
    BG_DARK: 'bg-[#000000]',
    BG_PANEL: 'bg-[#0f172a]',
    BG_CARD: 'bg-[#1e293b]',
    BORDER: 'border-[rgba(6,182,212,0.2)]',
    BORDER_GLOW: 'border-[#06b6d4]',
    ACCENT_PRIMARY: 'text-[#06b6d4]',
    ACCENT_SECONDARY: 'text-[#8b5cf6]',
    ACCENT_GOLD: 'text-[#10b981]',
    TEXT_PRIMARY: 'text-[#f8fafc]',
    TEXT_MUTED: 'text-[#64748b]',
    GRADIENT_PRIMARY: 'bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4]',
    GRADIENT_BUTTON: 'bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6]',
};

// --- Main Component ---
export function CryptoDonation() {
    const prefersReducedMotion = useReducedMotion();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

    // Mini-Game States
    const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
    const [gameScore, setGameScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; type: string }>>([]);

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

    // --- Copy to Clipboard ---
    const handleCopy = async (address: string, symbol: string) => {
        try {
            await navigator.clipboard.writeText(address);
            setCopiedAddress(symbol);
            setTimeout(() => setCopiedAddress(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // --- Mini-game Functions ---
    const startCryptoGame = () => {
        setGameScore(0);
        setTimeLeft(GAME_DURATION_SECONDS);
        setParticles([]);
        setGamePhase('active');
    };

    const handleBlockClick = (e: React.MouseEvent) => {
        if (gamePhase !== 'active') return;

        setGameScore(prev => prev + 1);

        const clickX = e.clientX;
        const clickY = e.clientY;

        const newParticle = {
            id: Date.now() + Math.random(),
            x: clickX,
            y: clickY,
            type: ['₿', 'Ξ', '◆', '🚀', '⚡', '💎'][Math.floor(Math.random() * 6)]
        };

        setParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 2000);
    };


    return (
        <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 font-mono">
            {/* Particle Layer */}
            <AnimatePresence>
                {particles.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="fixed text-2xl pointer-events-none z-[100]"
                        initial={{ scale: 0, opacity: 1, x: particle.x, y: particle.y }}
                        animate={{
                            scale: [0, 1.5, 0],
                            opacity: [1, 0.8, 0],
                            y: particle.y - 100,
                            x: particle.x + (Math.random() - 0.5) * 60,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.8, ease: "easeOut" }}
                        style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
                    >
                        {particle.type}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Floating Button - App Color Scheme */}
            <motion.button
                className="relative group w-14 h-14 z-50"
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "Close crypto panel" : "Open crypto panel"}
            >
                {/* Animated gradient rings using your app colors */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7c3aed]/40 to-[#2563eb]/40"
                    animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                />
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563eb]/30 to-[#06b6d4]/30"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: 1
                    }}
                />

                {/* Main Button - Glass morphism with your brand colors */}
                <motion.div
                    className="relative w-full h-full bg-[#0f172a]/80 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-[#06b6d4]/30 flex items-center justify-center"
                    whileHover={{
                        scale: 1.05,
                        rotate: isExpanded ? 0 : 8,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderColor: 'rgba(6, 182, 212, 0.6)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                        boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.3),
                    0 0 20px rgba(6, 182, 212, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                `,
                    }}
                >
                    <motion.div
                        animate={{
                            scale: isExpanded ? 0.9 : 1,
                            rotate: isExpanded ? 90 : 0
                        }}
                        transition={{ duration: 0.4, ease: 'backOut' }}
                    >
                        {isExpanded ? (
                            <X className="w-5 h-5 text-white/90" />
                        ) : (
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.9, 1, 0.9]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <Wallet className="w-5 h-5 text-[#06b6d4]" />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Subtle glow effect with your cyan color */}
                    {!isExpanded && (
                        <motion.div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06b6d4]/20 to-[#8b5cf6]/20"
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                    )}
                </motion.div>

                {/* Enhanced Tooltip with better positioning for left side */}
                <AnimatePresence>
                    {isHovered && !isExpanded && (
                        <motion.div
                            className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-[#0f172a]/95 backdrop-blur-xl text-white px-3 py-2 rounded-xl border border-[#06b6d4]/30 shadow-2xl whitespace-nowrap z-[60]"
                            initial={{ opacity: 0, x: -5, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -5, scale: 0.9 }}
                            style={{
                                boxShadow: `
                            0 20px 40px rgba(0, 0, 0, 0.4),
                            0 0 20px rgba(6, 182, 212, 0.3),
                            0 0 0 1px rgba(255, 255, 255, 0.1)
                        `,
                            }}
                        >
                            <div className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] bg-clip-text text-transparent">
                                <Zap className="w-3 h-3 text-[#06b6d4]" />
                                Support Development
                            </div>
                            <div className="text-xs text-[#94a3b8] mt-1">
                                Crypto donations welcome
                            </div>

                            {/* Tooltip arrow - positioned to center vertically */}
                            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#0f172a] border-l border-t border-[#06b6d4]/30 rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Additional ambient glow */}
                {!isExpanded && (
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#06b6d4]/10 to-[#8b5cf6]/10"
                        animate={{
                            opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                        }}
                    />
                )}
            </motion.button>

            {/* Expanded Panel - Now opens to the right from left center position */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className={`absolute left-20 top-1/2 transform -translate-y-1/2 w-96 ${THEME.BG_PANEL} backdrop-blur-2xl border-2 border-[#06b6d4] rounded-2xl shadow-2xl overflow-hidden ${THEME.TEXT_PRIMARY}`}
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                        style={{
                            boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)',
                            borderColor: 'rgba(6, 182, 212, 0.6)'
                        }}
                    >
                        {/* Header */}
                        <div className={`p-4 border-b-2 ${THEME.BORDER} relative overflow-hidden ${THEME.BG_DARK}`}>
                            {/* Animated Background */}
                            <motion.div
                                className="absolute inset-0 opacity-10"
                                animate={{
                                    background: [
                                        'linear-gradient(90deg, #7c3aed 0%, transparent 50%, #06b6d4 100%)',
                                        'linear-gradient(90deg, #06b6d4 0%, transparent 50%, #7c3aed 100%)',
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                            />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${THEME.GRADIENT_BUTTON} shadow-lg`}>
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`font-black text-xl ${THEME.ACCENT_PRIMARY} tracking-wider`}>
                                            CRYPTO DONATIONS
                                        </h3>
                                        <p className={`${THEME.TEXT_MUTED} text-xs tracking-wide`}>
                                            SUPPORT DEVELOPMENT
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                            {/* Crypto Addresses */}
                            <h4 className={`${THEME.ACCENT_PRIMARY} text-sm font-black mb-3 flex items-center gap-2 tracking-wider`}>
                                <TrendingUp className="w-4 h-4" />
                                WALLET ADDRESSES
                            </h4>
                            <div className="space-y-2 mb-4">
                                {CRYPTO_ADDRESSES.map((crypto, index) => (
                                    <motion.div
                                        key={crypto.symbol}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CryptoCard
                                            crypto={crypto}
                                            onCopy={handleCopy}
                                            isCopied={copiedAddress === crypto.symbol}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer - Dynamic Animations (Flicker & Heartbeat) */}
                        <motion.div
                            className={`border-t-2 ${THEME.BORDER} p-3 ${THEME.BG_DARK} flex items-center justify-center gap-2`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* Staggered/Flicker Effect for "THANK YOU!" */}
                            <span className="flex">
                                {"THANK YOU!".split("").map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        className={`text-sm font-extrabold ${THEME.ACCENT_PRIMARY} tracking-widest uppercase`}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.15,
                                            delay: index * 0.05, // Stagger delay
                                            repeat: Infinity,
                                            repeatType: "reverse",
                                            repeatDelay: 3.5, // Long pause before repeating the flicker
                                        }}
                                    >
                                        {letter === " " ? "\u00A0" : letter} {/* Preserve space */}
                                    </motion.span>
                                ))}
                            </span>

                            {/* Heartbeat Effect for the Red Heart Emoji */}
                            <motion.span
                                className={`text-sm font-extrabold ${THEME.ACCENT_PRIMARY} tracking-widest uppercase`}
                                animate={{ scale: [1, 1.15, 0.9, 1] }} // Heartbeat pulse
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5 // Start after the text has appeared
                                }}
                            >
                                ❤️
                            </motion.span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Crypto Card Component ---
const CryptoCard: React.FC<{
    crypto: CryptoAddress;
    onCopy: (address: string, symbol: string) => void;
    isCopied: boolean;
}> = ({ crypto, onCopy, isCopied }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`${THEME.BG_CARD} border-2 ${THEME.BORDER} rounded-xl p-3 cursor-pointer transition-all duration-300`}
            whileHover={{ scale: 1.02, borderColor: crypto.color }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onCopy(crypto.address, crypto.symbol)}
            style={{
                boxShadow: isHovered ? `0 0 20px ${crypto.color}40` : 'none'
            }}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl border-2"
                        style={{
                            backgroundColor: `${crypto.color}20`,
                            borderColor: crypto.color,
                            color: crypto.color
                        }}
                        animate={isHovered ? { rotate: 360 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        {crypto.icon}
                    </motion.div>
                    <div>
                        <div className="font-bold text-white text-sm">{crypto.name}</div>
                        <div className="text-xs" style={{ color: crypto.color }}>
                            {crypto.symbol} • {crypto.network}
                        </div>
                    </div>
                </div>
                <motion.button
                    className={`p-2 rounded-lg ${THEME.BG_DARK} border ${THEME.BORDER} transition-colors`}
                    whileHover={{ scale: 1.1, backgroundColor: crypto.color + '20' }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isCopied ? (
                        <Check className="w-4 h-4" style={{ color: crypto.color }} />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                    )}
                </motion.button>
            </div>
            <div className={`${THEME.BG_DARK} p-2 rounded-lg font-mono text-xs break-all ${THEME.TEXT_MUTED} border ${THEME.BORDER}`}>
                {crypto.address}
            </div>
        </motion.div>
    );
};

// --- Game Panel Component ---
const GamePanel: React.FC<{
    phase: GamePhase;
    setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
    startGame: () => void;
    handleClick: (e: React.MouseEvent) => void;
    score: number;
    timeLeft: number;
    getReward: () => GameReward;
}> = ({ phase, setGamePhase, startGame, handleClick, score, timeLeft, getReward }) => {
    const reward = getReward();

    return (
        <div className="mb-4">
            <h4 className={`${THEME.ACCENT_PRIMARY} text-sm font-black mb-3 flex items-center gap-2 tracking-wider`}>
                <Target className="w-4 h-4" />
                BLOCK MINING GAME
            </h4>
            <div className={`${THEME.BG_CARD} border-2 ${THEME.BORDER_GLOW} rounded-xl p-4 relative overflow-hidden`}>
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <h4 className={`text-lg font-black ${THEME.ACCENT_PRIMARY} mb-2 tracking-wider`}>
                                MINE BLOCKS
                            </h4>
                            <p className={`${THEME.TEXT_MUTED} text-xs mb-4`}>
                                Click the block as fast as possible for {GAME_DURATION_SECONDS} seconds!<br />
                                Higher scores unlock better multipliers.
                            </p>
                            <motion.button
                                className={`w-full py-3 rounded-lg text-white font-black ${THEME.GRADIENT_BUTTON} shadow-lg border-2 ${THEME.BORDER_GLOW} text-sm tracking-wider`}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startGame}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    START MINING
                                </div>
                            </motion.button>
                        </motion.div>
                    )}

                    {phase === 'active' && (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className={`text-2xl font-black ${THEME.ACCENT_PRIMARY}`}>
                                    BLOCKS: {score}
                                </div>
                                <motion.div
                                    className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${timeLeft <= 3
                                        ? 'bg-red-900 text-red-200 border-red-500'
                                        : `${THEME.BG_DARK} ${THEME.ACCENT_SECONDARY} ${THEME.BORDER_GLOW}`
                                        }`}
                                    animate={{ scale: timeLeft <= 3 ? [1, 1.1, 1] : 1 }}
                                    transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
                                >
                                    ⏱️ {timeLeft}s
                                </motion.div>
                            </div>

                            <motion.button
                                className="w-32 h-32 mx-auto rounded-2xl text-6xl cursor-pointer shadow-2xl border-4"
                                style={{
                                    background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                                    borderColor: '#06b6d4',
                                    boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)'
                                }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClick}
                            >
                                ⬛
                            </motion.button>
                        </motion.div>
                    )}

                    {phase === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <div className="text-4xl font-black text-white mb-4">
                                {score} BLOCKS
                            </div>

                            <div className={`${THEME.BG_DARK} p-4 rounded-xl border-2 ${THEME.BORDER_GLOW} mb-4`}>
                                <p className={`text-xs ${THEME.TEXT_MUTED} mb-2`}>RANK ACHIEVED</p>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {reward.icon}
                                    <span className={`text-xl font-black ${THEME.ACCENT_PRIMARY}`}>
                                        {reward.level}
                                    </span>
                                </div>
                                <div className={`text-lg font-black ${THEME.ACCENT_GOLD}`}>
                                    {reward.multiplier} MULTIPLIER
                                </div>
                            </div>

                            <motion.button
                                className={`w-full py-3 rounded-lg font-bold border-2 ${THEME.BORDER} ${THEME.BG_DARK} text-white hover:bg-white/10 transition-colors text-sm tracking-wider`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setGamePhase('intro')}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <RotateCcw className={`w-4 h-4 ${THEME.ACCENT_PRIMARY}`} />
                                    MINE AGAIN
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};