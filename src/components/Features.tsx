import { motion } from 'framer-motion'
import {
    NetworkIcon,
    ShieldCheckIcon,
    BarChart3Icon,
    FileSearchIcon,
    GitBranchIcon,
    ZapIcon,
} from 'lucide-react'
const features = [
    {
        icon: NetworkIcon,
        title: 'Dependency Mapping',
        description:
            'Deep dependency tracking and resource relationship visualization across your entire infrastructure',
    },
    {
        icon: ShieldCheckIcon,
        title: 'Security Scanning',
        description:
            'Built-in security validation and compliance checks with SARIF output for CI/CD integration',
    },
    {
        icon: BarChart3Icon,
        title: 'Interactive Reports',
        description:
            'Rich HTML reports with multiple themes and layouts for comprehensive infrastructure insights',
    },
    {
        icon: FileSearchIcon,
        title: 'Multi-Format Export',
        description:
            'Export analysis data in JSON, YAML, CSV, XML, and TOML formats for seamless integration',
    },
    {
        icon: GitBranchIcon,
        title: 'Module Analysis',
        description:
            'Detailed inspection of Terraform modules, variables, outputs, and provider configurations',
    },
    {
        icon: ZapIcon,
        title: 'CI/CD Ready',
        description:
            'Automation-friendly CLI with validation checks and fail-on-warning capabilities',
    },
]
export function Features() {
    return (
        <div className="w-full py-24 px-6 bg-gradient-to-b from-black to-gray-900">
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
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        Everything you need to understand and optimize your Terraform
                        infrastructure
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
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
                                delay: index * 0.1,
                            }}
                            viewport={{
                                once: true,
                            }}
                            className="group"
                        >
                            <div className="relative p-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 h-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 rounded-2xl transition-all duration-300" />
                                <div className="relative">
                                    <div className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-7 h-7 text-cyan-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
