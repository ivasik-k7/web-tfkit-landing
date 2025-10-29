import React, { useState, useEffect } from 'react';
import {
    HomeIcon,
    DownloadIcon,
    ZapIcon,
    EyeIcon,
    TerminalIcon,
    ShieldCheckIcon,
    FileTextIcon,
    TrendingUpIcon,
    MonitorIcon,
    AlertCircleIcon,
    SettingsIcon,
    HelpCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    MenuIcon,
    XIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    children?: MenuItem[];
    expandable?: boolean;
}

const menuItems: MenuItem[] = [{
    id: 'overview',
    label: 'Overview',
    icon: HomeIcon
}, {
    id: 'quick-start',
    label: 'Quick Start',
    icon: ZapIcon
}, {
    id: 'installation',
    label: 'Installation',
    icon: DownloadIcon,
    expandable: true,
    children: [{
        id: 'quick-install',
        label: 'Quick Install',
        icon: ZapIcon
    }, {
        id: 'linux',
        label: 'Linux',
        icon: MonitorIcon
    }, {
        id: 'macos',
        label: 'macOS',
        icon: MonitorIcon
    }, {
        id: 'windows',
        label: 'Windows',
        icon: MonitorIcon
    }, {
        id: 'upgrading',
        label: 'Upgrading',
        icon: TrendingUpIcon
    }, {
        id: 'verifying',
        label: 'Verifying',
        icon: ShieldCheckIcon
    }, {
        id: 'uninstalling',
        label: 'Uninstalling',
        icon: AlertCircleIcon
    }]
}, {
    id: 'visualizations',
    label: 'Visualizations',
    icon: EyeIcon,
    expandable: true,
    children: [{
        id: 'themes',
        label: 'Available Themes',
        icon: EyeIcon
    }]
}, {
    id: 'commands',
    label: 'Command Reference',
    icon: TerminalIcon,
    expandable: true,
    children: [{
        id: 'scan',
        label: 'Scan Command',
        icon: TerminalIcon
    }, {
        id: 'validate',
        label: 'Validate Command',
        icon: ShieldCheckIcon
    }, {
        id: 'export',
        label: 'Export Command',
        icon: FileTextIcon
    }]
}, {
    id: 'advanced',
    label: 'Advanced Usage',
    icon: SettingsIcon,
    expandable: true,
    children: [{
        id: 'pipelines',
        label: 'Analysis Pipelines',
        icon: SettingsIcon
    }, {
        id: 'security',
        label: 'Security Workflow',
        icon: ShieldCheckIcon
    }, {
        id: 'ci-cd',
        label: 'CI/CD Integration',
        icon: SettingsIcon
    }]
}, {
    id: 'troubleshooting',
    label: 'Troubleshooting',
    icon: AlertCircleIcon
}, {
    id: 'support',
    label: 'Support',
    icon: HelpCircleIcon
}];

export function DocSidebar() {
    const navigate = useNavigate();
    const [expandedItems, setExpandedItems] = useState<string[]>(['installation']);
    const [activeItem, setActiveItem] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when screen size changes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setActiveItem(id);
            // Close mobile menu after navigation
            setIsMobileMenuOpen(false);
        }
    };

    const renderMenuItem = (item: MenuItem, level: number = 0) => {
        const isExpanded = expandedItems.includes(item.id);
        const isActive = activeItem === item.id;
        const hasChildren = item.children && item.children.length > 0;

        return (
            <div key={item.id}>
                <button
                    onClick={() => {
                        if (item.expandable) {
                            toggleExpand(item.id);
                        }
                        if (!hasChildren) {
                            scrollToSection(item.id);
                        }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${
                        isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    } ${level > 0 ? 'pl-12' : ''}`}
                >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded">
              {item.badge}
            </span>
                    )}
                    {item.expandable && (
                        isExpanded ? (
                            <ChevronDownIcon className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
                        )
                    )}
                </button>
                {hasChildren && isExpanded && (
                    <div>
                        {item.children?.map(child => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900/90 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <XIcon className="w-6 h-6" />
                ) : (
                    <MenuIcon className="w-6 h-6" />
                )}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed md:sticky top-0 left-0 z-40
          w-64 h-screen
          bg-gray-900/95 md:bg-gray-900/50 backdrop-blur-sm 
          border-r border-cyan-500/20
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
            >
                <div className="p-6 border-b border-cyan-500/20">
                    <button
                        onClick={() => {
                            navigate('/');
                            setIsMobileMenuOpen(false);
                        }}
                        className="hover:opacity-80 transition-opacity"
                    >
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            TFKit
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Documentation</p>
                    </button>
                </div>
                <nav className="pb-8">
                    {menuItems.map(item => renderMenuItem(item))}
                </nav>
            </aside>
        </>
    );
}