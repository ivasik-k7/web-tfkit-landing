import { GithubIcon, TwitterIcon, BookOpenIcon, MailIcon } from 'lucide-react'
export function Footer() {
    return (
        <footer className="w-full py-12 px-6 bg-gradient-to-b from-gray-900 to-black border-t border-cyan-500/20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            TFKit
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Advanced Terraform intelligence and analysis suite. Built with
                            Rich and Click for beautiful terminal experiences.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Commands</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Scan
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Analyze
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Inspect
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Validate
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Installation Guide
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    Examples
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-cyan-400 transition-colors">
                                    API Reference
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <GithubIcon className="w-5 h-5 text-cyan-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <TwitterIcon className="w-5 h-5 text-cyan-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <BookOpenIcon className="w-5 h-5 text-cyan-400" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                            >
                                <MailIcon className="w-5 h-5 text-cyan-400" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2024 TFKit. Licensed under MIT License.
                    </p>
                    <div className="flex gap-6 text-gray-400 text-sm">
                        <a href="#" className="hover:text-cyan-400 transition-colors">
                            Documentation
                        </a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">
                            GitHub
                        </a>
                        <a href="#" className="hover:text-cyan-400 transition-colors">
                            License
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
