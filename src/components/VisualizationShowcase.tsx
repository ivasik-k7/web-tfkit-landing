import { useState } from 'react'
import { motion } from 'framer-motion'
import { LayoutGridIcon, NetworkIcon, BarChart3Icon } from 'lucide-react'
import { ClassicLayoutDemo } from './ClassicLayoutDemo'
import { DashboardDemo } from './DashboardDemo'
import { GraphDemo } from './GraphDemo'
const visualizations = [
    {
        id: 'graph',
        name: 'Graph Layout',
        icon: NetworkIcon,
        description:
            'Force-directed graph showing resource relationships and dependencies',
        isInteractive: true,
    },
    {
        id: 'dashboard',
        name: 'Dashboard Layout',
        icon: BarChart3Icon,
        description:
            'Comprehensive metrics, health status, and infrastructure insights',
        isInteractive: true,
    },
    {
        id: 'classic',
        name: 'Classic Layout',
        icon: LayoutGridIcon,
        description:
            'Traditional card-based view with detailed component information',
        isInteractive: true,
    },
]
export function VisualizationShowcase() {
    const [activeView, setActiveView] = useState('graph')
    const activeVisualization = visualizations.find((v) => v.id === activeView)
    return (
        <div className="w-full py-24 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
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
              Interactive Visualizations
            </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Choose from multiple visualization layouts to explore your
                        infrastructure from different perspectives
                    </p>
                </motion.div>
                {/* Layout selector */}
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
                        delay: 0.2,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    {visualizations.map((viz) => (
                        <button
                            key={viz.id}
                            onClick={() => setActiveView(viz.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all duration-300 ${activeView === viz.id ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-cyan-500/20 bg-gray-900/50 text-gray-400 hover:border-cyan-500/40 hover:bg-gray-900/70'}`}
                        >
                            <viz.icon className="w-5 h-5" />
                            <span className="font-semibold">{viz.name}</span>
                        </button>
                    ))}
                </motion.div>
                {/* Visualization display */}
                <motion.div
                    key={activeView}
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        duration: 0.5,
                    }}
                    className="relative"
                >
                    {activeView === 'graph' ? (
                        <GraphDemo />
                    ) : activeView === 'dashboard' ? (
                        <DashboardDemo />
                    ) : (
                        <ClassicLayoutDemo />
                    )}
                    {/* Description */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.2,
                        }}
                        className="mt-6 text-center"
                    >
                        <p className="text-gray-400 text-lg">
                            {activeVisualization?.description}
                        </p>
                    </motion.div>
                </motion.div>
                {/* Theme options */}
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
                        delay: 0.4,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-400 mb-4">Available themes:</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Dark', 'Light', 'Cyber', 'Nord'].map((theme) => (
                            <span
                                key={theme}
                                className="px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm"
                            >
                {theme}
              </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
