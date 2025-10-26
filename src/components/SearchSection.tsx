import { useState } from 'react'
import { motion } from 'framer-motion'
import { SearchIcon, TrendingUpIcon } from 'lucide-react'
const trendingSearches = [
    'Quantum Computing',
    'AI Ethics',
    'Climate Science',
    'Biotechnology',
    'Space Exploration',
]
export function SearchSection() {
    const [searchQuery, setSearchQuery] = useState('')
    return (
        <div className="w-full py-24 px-6 bg-black">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="text-center mb-12"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Discover Knowledge
            </span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        Search through millions of resources instantly
                    </p>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="relative mb-8"
                >
                    <div className="relative p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500">
                        <div className="bg-gray-900 rounded-xl p-2">
                            <div className="flex items-center gap-4">
                                <SearchIcon className="w-6 h-6 text-cyan-400 ml-4" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search books, journals, articles..."
                                    className="flex-1 bg-transparent text-white text-lg py-4 outline-none placeholder-gray-500"
                                />
                                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 mr-2">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    whileInView={{
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.4,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="flex items-center gap-3 flex-wrap justify-center"
                >
                    <div className="flex items-center gap-2 text-gray-400">
                        <TrendingUpIcon className="w-5 h-5" />
                        <span className="text-sm">Trending:</span>
                    </div>
                    {trendingSearches.map((search, index) => (
                        <button
                            key={index}
                            className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all duration-300"
                        >
                            {search}
                        </button>
                    ))}
                </motion.div>
                {/* Stats */}
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.6,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="grid grid-cols-3 gap-8 mt-20"
                >
                    {[
                        {
                            value: '10M+',
                            label: 'Resources',
                        },
                        {
                            value: '500K+',
                            label: 'Active Users',
                        },
                        {
                            value: '99.9%',
                            label: 'Uptime',
                        },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 text-sm md:text-base">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
