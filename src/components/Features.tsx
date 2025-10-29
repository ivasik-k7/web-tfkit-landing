import React from 'react';
import { motion } from 'framer-motion';
import { ZapIcon, ShieldCheckIcon, FileTextIcon, BarChart3Icon, GitBranchIcon, NetworkIcon } from 'lucide-react';
const features = [{
  icon: ZapIcon,
  title: 'Quick Scanning',
  description: 'Rapid project analysis with comprehensive metrics, health assessment, and resource statistics'
}, {
  icon: ShieldCheckIcon,
  title: 'Validation Suite',
  description: 'Built-in validation with syntax, reference, security, and best practice checks for comprehensive quality assurance'
}, {
  icon: FileTextIcon,
  title: 'Multi-Format Export',
  description: 'Flexible output in JSON, YAML, CSV, XML, and TOML formats for seamless integration with other tools'
}, {
  icon: BarChart3Icon,
  title: 'Interactive Visualizations',
  description: 'Rich graphical representations with multiple themes and layouts including Graph, Dashboard, and Classic views'
}, {
  icon: GitBranchIcon,
  title: 'CI/CD Ready',
  description: 'SARIF output format and automation-friendly interfaces with fail-on-warning capabilities'
}, {
  icon: NetworkIcon,
  title: 'Dependency Tracking',
  description: 'Deep insights into resource relationships, dependencies, and infrastructure component connections'
}];
export function Features() {
  return <div className="w-full py-24 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to understand, validate, and optimize your
            Terraform infrastructure
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="group">
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
            </motion.div>)}
        </div>
      </div>
    </div>;
}