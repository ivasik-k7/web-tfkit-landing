import { motion } from 'framer-motion';
import {
    GithubIcon,
    BookOpenIcon,
    DownloadIcon,
    ExternalLinkIcon,
    PackageIcon,
    CodeIcon,
    ShieldIcon,
    UsersIcon,
    MailIcon,
    ArrowUpIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function Footer() {
    const [currentYear] = useState(new Date().getFullYear());
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const links = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Installation', href: '#installation' },
            { name: 'Visualizations', href: '#visualizations' },
            { name: 'Themes', href: '#visualizations' }
        ],
        resources: [

            {
                name: 'Documentation',
                href: '/docs',
                icon: BookOpenIcon,
                external: false
            },
            {
                name: 'Security',
                href: 'https://github.com/ivasik-k7/tfkit/security',
                icon: ShieldIcon,
                external: true
            },
            {
                name: 'Releases',
                href: 'https://github.com/ivasik-k7/tfkit/releases',
                icon: DownloadIcon,
                external: true
            }
        ],
        community: [
            {
                name: 'Contributing',
                href: 'https://github.com/ivasik-k7/tfkit/blob/main/CONTRIBUTING.md',
                icon: CodeIcon,
                external: true
            },
            {
                name: 'Issues',
                href: 'https://github.com/ivasik-k7/tfkit/issues',
                icon: UsersIcon,
                external: true
            },
            {
                name: "Discussions",
                href: 'https://github.com/ivasik-k7/tfkit/discussions',
                icon: UsersIcon,
                external: true
            },
            {
                name: 'Contact',
                href: 'mailto:kovtun.ivan@proton.me',
                icon: MailIcon,
                external: false
            }
        ]
    };

    return (
        <footer className="footer-section">
            {/* Animated background elements */}
            <div className="footer-background">
                <div className="footer-orb orb-1" />
                <div className="footer-orb orb-2" />
                <div className="footer-grid" />
            </div>

            <div className="footer-container">
                {/* Main Footer Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="footer-content"
                >
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="brand-logo"
                        >
                            <h3 className="footer-logo gradient-text">TFKit</h3>
                            {/* <div className="logo-glow" /> */}
                        </motion.div>

                        <p className="footer-tagline">
                            Terraform Intelligence & Analysis Suite
                        </p>

                        <p className="footer-description">
                            Advanced static analysis and visualization for your infrastructure as code.
                            Built for developers who care about their Terraform configurations.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="footer-links-grid">
                        <div className="footer-column">
                            <h4 className="footer-column-title">Resources</h4>
                            <ul className="footer-column-list">
                                {links.resources.map((link) => (
                                    <li key={link.name}>
                                        <motion.a
                                            href={link.href}
                                            className="footer-link with-icon"
                                            target={link.external ? '_blank' : undefined}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <link.icon className="footer-link-icon" />
                                            <span className="link-text">{link.name}</span>
                                            {link.external && <ExternalLinkIcon className="external-link-icon" />}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4 className="footer-column-title">Community</h4>
                            <ul className="footer-column-list">
                                {links.community.map((link) => (
                                    <li key={link.name}>
                                        <motion.a
                                            href={link.href}
                                            className="footer-link with-icon"
                                            target={link.external ? '_blank' : undefined}
                                            rel={link.external ? 'noopener noreferrer' : undefined}
                                            whileHover={{ x: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <link.icon className="footer-link-icon" />
                                            <span className="link-text">{link.name}</span>
                                            {link.external && <ExternalLinkIcon className="external-link-icon" />}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="footer-bottom"
                >
                    <div className="footer-divider" />

                    <div className="footer-bottom-content">
                        <div className="footer-legal">
                            <span className="footer-copyright">
                                © {currentYear} TFKit. MIT License.
                            </span>
                            <span className="footer-version">
                                Version 0.4.44
                            </span>
                        </div>

                        <div className="footer-social">
                            <motion.a
                                href="https://github.com/ivasik-k7/tfkit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <GithubIcon className="social-icon" />
                                <div className="social-glow" />
                            </motion.a>

                            <motion.a
                                href="https://pypi.org/project/tfkit-py/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <PackageIcon className="social-icon" />
                                <div className="social-glow" />
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll to Top Button */}
            <motion.button
                className="scroll-top-button"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: showScrollTop ? 1 : 0,
                    scale: showScrollTop ? 1 : 0
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                transition={{ type: "spring", stiffness: 400 }}
            >
                <ArrowUpIcon className="scroll-top-icon" />
                <div className="scroll-top-glow" />
            </motion.button>
        </footer>
    );
}