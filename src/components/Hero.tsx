import { motion } from 'framer-motion'
import { ChevronDownIcon } from 'lucide-react'
export function Hero() {
    return (
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>
            {/* Glowing orbs */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div
                className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"
                style={{
                    animationDelay: '1s',
                }}
            />
            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                >
                    <div className="inline-block px-4 py-2 mb-6 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
            <span className="text-cyan-400 text-sm font-medium">
              DIGITAL KNOWLEDGE HUB
            </span>
                    </div>
                    <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NEXUS
            </span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-8 text-gray-300">
                        The Future of Learning
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Access millions of digital resources, immersive learning
                        experiences, and cutting-edge knowledge systems
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
                            Explore Library
                        </button>
                        <button className="px-8 py-4 border border-cyan-500/30 rounded-lg font-semibold hover:bg-cyan-500/10 transition-all duration-300 backdrop-blur-sm">
                            Get Membership
                        </button>
                    </div>
                </motion.div>
            </div>
            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                animate={{
                    y: [0, 10, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                }}
            >
                <ChevronDownIcon className="w-8 h-8 text-cyan-400" />
            </motion.div>
        </div>
    )
}
