import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    TerminalIcon,
    SearchIcon,
    FileSearchIcon,
    FileTextIcon,
    CheckCircleIcon,
    DownloadIcon,
} from 'lucide-react'
const commands = [
    {
        id: 'scan',
        name: 'Quick Scan',
        icon: SearchIcon,
        command: 'tfkit scan',
        description: 'Rapid analysis for quick insights',
    },
    {
        id: 'analyze',
        name: 'Deep Analysis',
        icon: FileSearchIcon,
        command: 'tfkit analyze --deep -D -S -C',
        description: 'Comprehensive analysis with all features',
    },
    {
        id: 'report',
        name: 'Generate Report',
        icon: FileTextIcon,
        command: 'tfkit report --interactive --open',
        description: 'Create interactive HTML reports',
    },
    {
        id: 'validate',
        name: 'Validate',
        icon: CheckCircleIcon,
        command: 'tfkit validate --all --strict',
        description: 'Run all validation checks',
    },
    {
        id: 'export',
        name: 'Export Data',
        icon: DownloadIcon,
        command: 'tfkit export --format json --format yaml',
        description: 'Export in multiple formats',
    },
]
export function CommandDemo() {
    const [activeCommand, setActiveCommand] = useState('scan')
    const active = commands.find((c) => c.id === activeCommand)
    return (
        <div className="w-full py-24 px-6 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-6xl mx-auto">
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
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Simple Yet Powerful
            </span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        Intuitive CLI commands for comprehensive infrastructure analysis
                    </p>
                </motion.div>
                {/* Command selector */}
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
                    className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                >
                    {commands.map((cmd) => (
                        <button
                            key={cmd.id}
                            onClick={() => setActiveCommand(cmd.id)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${activeCommand === cmd.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500/20 bg-gray-900/50 hover:border-cyan-500/40'}`}
                        >
                            <cmd.icon
                                className={`w-6 h-6 ${activeCommand === cmd.id ? 'text-cyan-400' : 'text-gray-400'}`}
                            />
                            <span
                                className={`text-sm font-semibold ${activeCommand === cmd.id ? 'text-cyan-400' : 'text-gray-400'}`}
                            >
                {cmd.name}
              </span>
                        </button>
                    ))}
                </motion.div>
                {/* Command display */}
                <motion.div
                    key={activeCommand}
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.4,
                    }}
                >
                    <div className="relative p-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                        <div className="bg-gray-900 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <TerminalIcon className="w-5 h-5 text-cyan-400" />
                                <span className="text-gray-400 text-sm font-medium">
                  Command Line
                </span>
                            </div>
                            <code className="text-cyan-400 font-mono text-lg block">
                                $ {active?.command}
                            </code>
                        </div>
                    </div>
                    <p className="text-gray-400 text-center">{active?.description}</p>
                </motion.div>
            </div>
        </div>
    )
}
