import { useMemo, useState } from 'react'
import {
    Search,
    Layers,
    Network,
    Database,
    Code,
    ArrowRight,
    Settings,
    CheckCircle,
    Ban,
    ExternalLink,
    Leaf,
    Unlink,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
    SortAsc,
    Filter,
    X,
    TrendingUp,
} from 'lucide-react'

interface Node {
    id: string
    label: string
    type: string
    subtype: string
    state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning'
    state_reason?: string
    dependencies_out: number
    dependencies_in: number
}

const sampleNodes: Node[] = [
    {
        id: '1',
        label: 'aws_vpc.main',
        type: 'resource',
        subtype: 'aws_vpc',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 5,
    },
    {
        id: '2',
        label: 'aws_subnet.public',
        type: 'resource',
        subtype: 'aws_subnet',
        state: 'healthy',
        dependencies_out: 1,
        dependencies_in: 3,
    },
    {
        id: '3',
        label: 'aws_instance.web',
        type: 'resource',
        subtype: 'aws_instance',
        state: 'warning',
        state_reason: 'Instance type t2.micro may be undersized for production',
        dependencies_out: 2,
        dependencies_in: 0,
    },
    {
        id: '4',
        label: 'module.networking',
        type: 'module',
        subtype: 'custom',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 8,
    },
    {
        id: '5',
        label: 'var.region',
        type: 'variable',
        subtype: 'string',
        state: 'external',
        dependencies_out: 0,
        dependencies_in: 4,
    },
    {
        id: '6',
        label: 'aws_security_group.unused',
        type: 'resource',
        subtype: 'aws_security_group',
        state: 'unused',
        state_reason: 'No resources reference this security group',
        dependencies_out: 0,
        dependencies_in: 0,
    },
    {
        id: '7',
        label: 'data.aws_ami.latest',
        type: 'data',
        subtype: 'aws_ami',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 2,
    },
    {
        id: '8',
        label: 'output.vpc_id',
        type: 'output',
        subtype: 'string',
        state: 'healthy',
        dependencies_out: 1,
        dependencies_in: 0,
    },
]

const nodeIcons = {
    resource: Layers,
    module: Network,
    variable: Code,
    output: ArrowRight,
    data: Database,
    provider: Settings,
}

const stateConfig = {
    healthy: {
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        glow: 'shadow-green-500/20',
    },
    unused: {
        icon: Ban,
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/30',
        glow: 'shadow-red-500/20',
    },
    external: {
        icon: ExternalLink,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/30',
        glow: 'shadow-cyan-500/20',
    },
    leaf: {
        icon: Leaf,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        glow: 'shadow-green-500/20',
    },
    orphan: {
        icon: Unlink,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        glow: 'shadow-yellow-500/20',
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        glow: 'shadow-yellow-500/20',
    },
}

export function ClassicLayoutDemo() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'dependencies'>('name')
    const [stateFilter, setStateFilter] = useState<string | null>(null)
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    const stateCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        sampleNodes.forEach((node) => {
            counts[node.state] = (counts[node.state] || 0) + 1
        })
        return counts
    }, [])

    const filteredAndSortedNodes = useMemo(() => {
        let nodes = [...sampleNodes]
        if (stateFilter) {
            nodes = nodes.filter((node) => node.state === stateFilter)
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            nodes = nodes.filter(
                (node) =>
                    node.label.toLowerCase().includes(query) ||
                    node.type.toLowerCase().includes(query) ||
                    node.subtype.toLowerCase().includes(query) ||
                    node.state.toLowerCase().includes(query),
            )
        }
        nodes.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.label.localeCompare(b.label)
                case 'type':
                    return a.type.localeCompare(b.type) || a.subtype.localeCompare(b.subtype)
                case 'dependencies':
                    return (
                        b.dependencies_in + b.dependencies_out -
                        (a.dependencies_in + a.dependencies_out)
                    )
                default:
                    return 0
            }
        })
        return nodes
    }, [searchQuery, sortBy, stateFilter])

    const resetFilters = () => {
        setSearchQuery('')
        setSortBy('name')
        setStateFilter(null)
    }

    const hasActiveFilters = searchQuery || sortBy !== 'name' || stateFilter

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6 overflow-hidden">
            {/* Animated background effects */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }}
            />

            <div className="relative z-10 max-w-[1800px] mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            Component Explorer
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Browse and analyze your infrastructure components
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                            <span className="text-cyan-400 font-semibold">{filteredAndSortedNodes.length} Components</span>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative text-center">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">{sampleNodes.length}</div>
                            <div className="text-xs text-gray-400 uppercase font-semibold mb-3">Components</div>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                                {Object.entries(stateCounts).map(([state, count]) => (
                                    <button
                                        key={state}
                                        onClick={() => setStateFilter(stateFilter === state ? null : state)}
                                        className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-all hover:scale-110 hover:shadow-lg ${stateConfig[state as keyof typeof stateConfig].bg} ${stateConfig[state as keyof typeof stateConfig].color} ${stateConfig[state as keyof typeof stateConfig].border} border ${stateFilter === state ? 'ring-2 ring-cyan-400' : ''}`}
                                    >
                                        {state}: {count}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="text-4xl font-bold text-purple-400 mb-2">24</div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Dependencies</div>
                        </div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-1 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="text-4xl font-bold text-green-400 mb-2">3</div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Connected Groups</div>
                        </div>
                    </div>

                    <div className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                            <div className="text-4xl font-bold text-cyan-400 mb-2">6</div>
                            <div className="text-xs text-gray-400 uppercase font-semibold">Resource Types</div>
                        </div>
                    </div>
                </div>

                {/* Controls Panel */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl border border-gray-700/50 backdrop-blur-xl overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700/50 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div className="font-bold text-xl text-white">Components</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSortBy('name')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    sortBy === 'name'
                                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/30 hover:text-cyan-400'
                                }`}
                            >
                                <SortAsc className="w-4 h-4" />
                                Name
                            </button>
                            <button
                                onClick={() => setSortBy('type')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    sortBy === 'type'
                                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/30 hover:text-cyan-400'
                                }`}
                            >
                                <Layers className="w-4 h-4" />
                                Type
                            </button>
                            <button
                                onClick={() => setSortBy('dependencies')}
                                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                    sortBy === 'dependencies'
                                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                        : 'bg-gray-900/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/30 hover:text-cyan-400'
                                }`}
                            >
                                <Network className="w-4 h-4" />
                                Dependencies
                            </button>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                                >
                                    <X className="w-4 h-4" />
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Active Filters Info */}
                    {hasActiveFilters && (
                        <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-black/20">
                            <div className="flex flex-wrap gap-2">
                                {searchQuery && (
                                    <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-sm border border-cyan-500/30 font-semibold backdrop-blur-sm">
                                        Search: "{searchQuery}"
                                    </span>
                                )}
                                {stateFilter && (
                                    <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 text-sm border border-purple-500/30 font-semibold backdrop-blur-sm">
                                        State: {stateFilter}
                                    </span>
                                )}
                                {sortBy !== 'name' && (
                                    <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 text-sm border border-cyan-500/30 font-semibold backdrop-blur-sm">
                                        Sorted by: {sortBy}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Search Box */}
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search components by name, type, or state..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-black/30 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                            />
                        </div>
                    </div>

                    {/* Component Grid */}
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                        {filteredAndSortedNodes.length === 0 ? (
                            <div className="text-center py-16 text-gray-400">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700/50 to-gray-800/50 mx-auto mb-4 flex items-center justify-center">
                                    <Filter className="w-10 h-10 opacity-50" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white">No components found</h3>
                                <p className="text-sm">Try adjusting your search or filter criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredAndSortedNodes.map((node) => {
                                    const NodeIcon = nodeIcons[node.type as keyof typeof nodeIcons] || Layers
                                    const StateIcon = stateConfig[node.state].icon
                                    const isLeaf = node.dependencies_out === 0 && node.dependencies_in > 0
                                    const isHub = node.dependencies_out > 5 || node.dependencies_in > 5

                                    return (
                                        <div
                                            key={node.id}
                                            onMouseEnter={() => setHoveredCard(node.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                            className={`group relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-5 border-l-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer overflow-hidden ${
                                                node.state === 'unused' ? 'border-red-400 hover:shadow-red-500/20' :
                                                    node.state === 'warning' ? 'border-yellow-400 hover:shadow-yellow-500/20' :
                                                        node.state === 'external' ? 'border-cyan-400 hover:shadow-cyan-500/20' :
                                                            'border-green-400 hover:shadow-green-500/20'
                                            } border-r border-t border-b border-gray-700/50 hover:border-cyan-500/30`}
                                        >
                                            {/* Animated gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                            <div className="relative">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
                                                        hoveredCard === node.id ? 'scale-110 shadow-cyan-500/50' : 'shadow-cyan-500/30'
                                                    }`}>
                                                        <NodeIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className="font-bold text-lg text-white truncate mb-1 group-hover:text-cyan-400 transition-colors"
                                                            title={node.label}
                                                        >
                                                            {node.label}
                                                        </div>
                                                        <div className="text-sm text-gray-400 mb-3">
                                                            <span className="font-semibold text-cyan-400">{node.type}</span> • {node.subtype}
                                                        </div>
                                                        <div
                                                            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg ${stateConfig[node.state].bg} ${stateConfig[node.state].color} ${stateConfig[node.state].border} border backdrop-blur-sm`}
                                                        >
                                                            <StateIcon className="w-3.5 h-3.5" />
                                                            {node.state.toUpperCase()}
                                                        </div>
                                                        {(isLeaf || isHub) && (
                                                            <div className="flex gap-2 mt-3">
                                                                {isLeaf && (
                                                                    <span className="text-xs px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 border border-green-400/30 font-bold backdrop-blur-sm flex items-center gap-1">
                                                                        <Leaf className="w-3.5 h-3.5" />
                                                                        LEAF
                                                                    </span>
                                                                )}
                                                                {isHub && (
                                                                    <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-bold backdrop-blur-sm flex items-center gap-1">
                                                                        <Network className="w-3.5 h-3.5" />
                                                                        HUB
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 pt-4 border-t border-gray-700/50">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/30">
                                                            <ArrowUp className="w-4 h-4 text-green-400" />
                                                        </div>
                                                        <span className="text-gray-400 font-medium">Uses:</span>
                                                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg px-2.5 py-1 text-xs font-bold shadow-lg shadow-green-500/30">
                                                            {node.dependencies_out}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
                                                            <ArrowDown className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <span className="text-gray-400 font-medium">Used by:</span>
                                                        <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg px-2.5 py-1 text-xs font-bold shadow-lg shadow-purple-500/30">
                                                            {node.dependencies_in}
                                                        </span>
                                                    </div>
                                                </div>
                                                {node.state_reason && (
                                                    <div className="mt-4 p-3 rounded-lg bg-black/30 border border-gray-700/50 text-xs text-gray-400 italic">
                                                        <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5 text-yellow-400" />
                                                        {node.state_reason}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-600">
                    tfkit (v1.0.0) | <a href="https://github.com/ivasik-k7/tfkit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-400 transition-colors">tfkit.com</a>
                </div>
            </div>
        </div>
    )
}