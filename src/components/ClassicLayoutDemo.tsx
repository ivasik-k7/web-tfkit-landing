import React, { useMemo, useState, useEffect } from 'react';
import {
    SearchIcon,
    LayersIcon,
    NetworkIcon,
    DatabaseIcon,
    CodeIcon,
    ArrowRightIcon,
    SettingsIcon,
    CheckCircleIcon,
    BanIcon,
    ExternalLinkIcon,
    LeafIcon,
    UnlinkIcon,
    AlertTriangleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    SortAscIcon,
    FilterIcon,
    XIcon,
    BoxIcon,
    ActivityIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    PlugIcon,
    ChevronRightIcon,
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Node {
    id: string;
    label: string;
    type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider';
    subtype?: string;
    state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning' | 'active' | 'integrated' | 'external_data' | 'configuration' | 'orphaned' | 'isolated';
    state_reason?: string;
    dependencies_out?: number;
    dependencies_in?: number;
    lifecycle?: 'create' | 'replace' | 'delete' | 'update' | 'none';
    details?: Record<string, any>;
}

export interface Edge {
    source: string;
    target: string;
}

export interface Resource {
    id: string;
    label: string;
    type: string;
    lifecycle: 'create' | 'replace' | 'delete' | 'update' | 'none';
    provider?: string;
}

export type ClassicLayoutData = {
    nodes?: Node[];
    edges?: Edge[];
    resources?: Resource[];
    meta?: {
        title?: string;
        timestamp?: string;
        environment?: string;
        [key: string]: any;
    };
};

export interface ClassicLayoutDemoProps {
    data: ClassicLayoutData;
    title?: string;
    theme?: 'dark' | 'light';
    height?: number;
    onNodeClick?: (node: Node) => void;
}

type SortOption = 'name' | 'type' | 'dependencies';

interface ProcessedStats {
    totalComponents: number;
    totalResources: number;
    liveResources: number;
    replaceResources: number;
    deleteResources: number;
    totalDependencies: number;
    connectedGroups: number;
    resourceTypes: number;
    healthScore: number;
    healthClass: 'positive' | 'warning' | 'danger';
    providerDistribution: Array<{ provider: string; count: number }>;
    stateCounts: Record<string, number>;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const nodeIcons: Record<string, any> = {
    resource: LayersIcon,
    module: NetworkIcon,
    variable: CodeIcon,
    output: ArrowRightIcon,
    data: DatabaseIcon,
    provider: SettingsIcon,
};

const stateConfig = {
    healthy: {
        icon: CheckCircleIcon,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        borderLeft: 'border-green-400',
    },
    active: {
        icon: CheckCircleIcon,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        borderLeft: 'border-green-400',
    },
    integrated: {
        icon: CheckCircleIcon,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        borderLeft: 'border-green-400',
    },
    unused: {
        icon: BanIcon,
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/30',
        borderLeft: 'border-red-400',
    },
    external: {
        icon: ExternalLinkIcon,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/30',
        borderLeft: 'border-cyan-400',
    },
    external_data: {
        icon: ExternalLinkIcon,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/30',
        borderLeft: 'border-cyan-400',
    },
    configuration: {
        icon: ExternalLinkIcon,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10',
        border: 'border-cyan-400/30',
        borderLeft: 'border-cyan-400',
    },
    leaf: {
        icon: LeafIcon,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        borderLeft: 'border-green-400',
    },
    orphan: {
        icon: UnlinkIcon,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        borderLeft: 'border-yellow-400',
    },
    orphaned: {
        icon: UnlinkIcon,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        borderLeft: 'border-yellow-400',
    },
    isolated: {
        icon: UnlinkIcon,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        borderLeft: 'border-yellow-400',
    },
    warning: {
        icon: AlertTriangleIcon,
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        borderLeft: 'border-yellow-400',
    },
};

// ============================================================================
// DATA PROCESSING UTILITIES
// ============================================================================

/**
 * Normalizes state names from various formats
 */
function normalizeState(state: string): string {
    const normalized = state.toLowerCase();

    if (['active', 'integrated', 'leaf'].includes(normalized)) return 'healthy';
    if (['external_data', 'configuration'].includes(normalized)) return 'external';
    if (['orphaned', 'isolated'].includes(normalized)) return 'orphan';

    return normalized;
}

/**
 * Processes raw data into structured statistics
 */
function processData(data: ClassicLayoutData): ProcessedStats {
    const nodes = data.nodes || [];
    const edges = data.edges || [];
    const resources = data.resources || [];

    // Resource lifecycle stats
    const totalResources = resources.length || nodes.filter(n => n.type === 'resource').length;
    const liveResources = resources.filter(r => r.lifecycle === 'create').length ||
        nodes.filter(n => n.type === 'resource' && ['healthy', 'active', 'integrated'].includes(n.state)).length;
    const replaceResources = resources.filter(r => r.lifecycle === 'replace').length ||
        nodes.filter(n => n.type === 'resource' && n.lifecycle === 'replace').length;
    const deleteResources = resources.filter(r => r.lifecycle === 'delete').length ||
        nodes.filter(n => n.type === 'resource' && n.lifecycle === 'delete').length;

    // Provider distribution
    const providerCounts: Record<string, number> = {};

    if (resources.length > 0) {
        resources.forEach(resource => {
            const provider = resource.provider || resource.type.split('_')[0];
            providerCounts[provider] = (providerCounts[provider] || 0) + 1;
        });
    } else {
        nodes.filter(n => n.type === 'resource').forEach(node => {
            const provider = node.subtype?.split('_')[0] || node.label.split('_')[0] || 'unknown';
            providerCounts[provider] = (providerCounts[provider] || 0) + 1;
        });
    }

    const providerDistribution = Object.entries(providerCounts)
        .map(([provider, count]) => ({ provider, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    // Health score calculation
    const healthScore = Math.max(0, Math.min(100, 100 - (deleteResources + replaceResources) * 5));
    const healthClass: 'positive' | 'warning' | 'danger' =
        healthScore >= 80 ? 'positive' : healthScore >= 50 ? 'warning' : 'danger';

    // State counts
    const stateCounts: Record<string, number> = {};
    nodes.forEach(node => {
        const state = normalizeState(node.state);
        stateCounts[state] = (stateCounts[state] || 0) + 1;
    });

    // Dependency stats
    const totalDependencies = edges.length;

    // Connected groups (simplified calculation)
    const connectedGroups = Math.max(1, Math.ceil(nodes.length / 3));

    // Resource types
    const typeSet = new Set(nodes.map(n => n.type));
    const resourceTypes = typeSet.size;

    return {
        totalComponents: nodes.length,
        totalResources,
        liveResources,
        replaceResources,
        deleteResources,
        totalDependencies,
        connectedGroups,
        resourceTypes,
        healthScore,
        healthClass,
        providerDistribution,
        stateCounts,
    };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ClassicLayoutDemo({
                                       data = {
                                           "nodes": [
                                               { "id": "n1",  "label": "aws_vpc.main",                 "type": "resource", "subtype": "aws_vpc",            "state": "healthy",       "dependencies_in": 4, "dependencies_out": 0, "lifecycle": "create", "details": { "loc": "network/main.tf:12" } },
                                               { "id": "n2",  "label": "aws_subnet.public_a",          "type": "resource", "subtype": "aws_subnet",         "state": "active",        "dependencies_in": 3, "dependencies_out": 1, "lifecycle": "none" },
                                               { "id": "n3",  "label": "aws_subnet.public_b",          "type": "resource", "subtype": "aws_subnet",         "state": "integrated",    "dependencies_in": 3, "dependencies_out": 1, "lifecycle": "none" },
                                               { "id": "n4",  "label": "aws_internet_gateway.igw",     "type": "resource", "subtype": "aws_internet_gateway","state": "healthy",      "dependencies_in": 2, "dependencies_out": 1, "lifecycle": "create" },
                                               { "id": "n5",  "label": "aws_route_table.public",       "type": "resource", "subtype": "aws_route_table",    "state": "healthy",       "dependencies_in": 2, "dependencies_out": 2, "lifecycle": "update" },
                                               { "id": "n6",  "label": "module.networking",            "type": "module",   "subtype": "custom",             "state": "integrated",    "dependencies_in": 5, "dependencies_out": 4, "lifecycle": "none" },
                                               { "id": "n7",  "label": "module.database",              "type": "module",   "subtype": "rds_cluster",        "state": "active",        "dependencies_in": 4, "dependencies_out": 2, "lifecycle": "none" },
                                               { "id": "n8",  "label": "data.aws_ami.ubuntu",          "type": "data",     "subtype": "aws_ami",            "state": "external_data", "dependencies_in": 0, "dependencies_out": 1, "lifecycle": "none" },
                                               { "id": "n9",  "label": "data.aws_availability_zones.available", "type": "data", "subtype": "aws_availability_zones", "state": "external_data", "dependencies_in": 0, "dependencies_out": 2, "lifecycle": "none" },
                                               { "id": "n10", "label": "var.region",                   "type": "variable", "subtype": "string",             "state": "configuration", "dependencies_in": 0, "dependencies_out": 5, "lifecycle": "none" },
                                               { "id": "n11", "label": "var.instance_type",            "type": "variable", "subtype": "string",             "state": "configuration", "dependencies_in": 0, "dependencies_out": 2, "lifecycle": "none" },
                                               { "id": "n12", "label": "output.vpc_id",                "type": "output",   "subtype": "string",             "state": "external",      "dependencies_in": 2, "dependencies_out": 0, "lifecycle": "none" },
                                               { "id": "n13", "label": "output.public_subnet_ids",     "type": "output",   "subtype": "list(string)",       "state": "external",      "dependencies_in": 2, "dependencies_out": 0, "lifecycle": "none" },
                                               { "id": "n14", "label": "provider.aws",                 "type": "provider", "subtype": "aws",                "state": "healthy",       "dependencies_in": 0, "dependencies_out": 10, "lifecycle": "none" },
                                               { "id": "n15", "label": "aws_security_group.web",       "type": "resource", "subtype": "aws_security_group", "state": "unused",        "dependencies_in": 1, "dependencies_out": 0, "lifecycle": "delete", "state_reason": "No attached instances" },
                                               { "id": "n16", "label": "aws_instance.web_a",           "type": "resource", "subtype": "aws_instance",       "state": "healthy",       "dependencies_in": 4, "dependencies_out": 0, "lifecycle": "create" },
                                               { "id": "n17", "label": "aws_instance.web_b",           "type": "resource", "subtype": "aws_instance",       "state": "warning",       "dependencies_in": 4, "dependencies_out": 0, "lifecycle": "replace", "state_reason": "Outdated AMI" },
                                               { "id": "n18", "label": "module.monitoring",            "type": "module",   "subtype": "cloudwatch",         "state": "orphaned",      "dependencies_in": 0, "dependencies_out": 1, "lifecycle": "none" },
                                               { "id": "n19", "label": "aws_lb.app",                   "type": "resource", "subtype": "aws_lb",             "state": "isolated",      "dependencies_in": 0, "dependencies_out": 0, "lifecycle": "none", "state_reason": "No target groups attached" }
                                           ],
                                           "edges": [
                                               { "source": "n10", "target": "n6" },
                                               { "source": "n10", "target": "n7" },
                                               { "source": "n10", "target": "n16" },
                                               { "source": "n10", "target": "n17" },
                                               { "source": "n11", "target": "n16" },
                                               { "source": "n11", "target": "n17" },
                                               { "source": "n9",  "target": "n6" },
                                               { "source": "n8",  "target": "n16" },
                                               { "source": "n14", "target": "n1" },
                                               { "source": "n14", "target": "n2" },
                                               { "source": "n14", "target": "n3" },
                                               { "source": "n14", "target": "n4" },
                                               { "source": "n6",  "target": "n1" },
                                               { "source": "n6",  "target": "n2" },
                                               { "source": "n6",  "target": "n3" },
                                               { "source": "n6",  "target": "n5" },
                                               { "source": "n5",  "target": "n4" },
                                               { "source": "n4",  "target": "n1" },
                                               { "source": "n6",  "target": "n12" },
                                               { "source": "n6",  "target": "n13" },
                                               { "source": "n7",  "target": "n16" },
                                               { "source": "n7",  "target": "n17" },
                                               { "source": "n18", "target": "n7" }
                                           ],
                                           "resources": [
                                               { "id": "r1",  "label": "aws_vpc.main",               "type": "aws_vpc",            "lifecycle": "create",  "provider": "aws" },
                                               { "id": "r2",  "label": "aws_subnet.public_a",        "type": "aws_subnet",         "lifecycle": "none",    "provider": "aws" },
                                               { "id": "r3",  "label": "aws_subnet.public_b",        "type": "aws_subnet",         "lifecycle": "none",    "provider": "aws" },
                                               { "id": "r4",  "label": "aws_internet_gateway.igw",   "type": "aws_internet_gateway","lifecycle": "create", "provider": "aws" },
                                               { "id": "r5",  "label": "aws_route_table.public",     "type": "aws_route_table",    "lifecycle": "update",  "provider": "aws" },
                                               { "id": "r6",  "label": "aws_security_group.web",     "type": "aws_security_group", "lifecycle": "delete",  "provider": "aws" },
                                               { "id": "r7",  "label": "aws_instance.web_a",         "type": "aws_instance",       "lifecycle": "create",  "provider": "aws" },
                                               { "id": "r8",  "label": "aws_instance.web_b",         "type": "aws_instance",       "lifecycle": "replace", "provider": "aws" },
                                               { "id": "r9",  "label": "aws_lb.app",                 "type": "aws_lb",             "lifecycle": "none",    "provider": "aws" }
                                           ],
                                           "meta": {
                                               "title": "Production Infrastructure",
                                               "timestamp": "2025-10-31T12:00:00Z",
                                               "environment": "production"
                                           }
                                       },
                                       title = 'Infrastructure Dashboard',
                                       theme = 'dark',
                                       height = 800,
                                       onNodeClick,
                                   }: ClassicLayoutDemoProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name');
    const [stateFilter, setStateFilter] = useState<string | null>(null);

    const stats = useMemo(() => processData(data), [data]);
    const nodes = data.nodes || [];

    // Theme configuration
    const isDark = theme === 'dark';
    const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
    const bgTertiary = isDark ? 'bg-gray-900' : 'bg-gray-100';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
    const border = isDark ? 'border-gray-700' : 'border-gray-200';

    // Filtered and sorted nodes
    const filteredAndSortedNodes = useMemo(() => {
        let filtered = [...nodes];

        // Apply state filter
        if (stateFilter) {
            filtered = filtered.filter(node => normalizeState(node.state) === stateFilter);
        }

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                node =>
                    node.label.toLowerCase().includes(query) ||
                    node.type.toLowerCase().includes(query) ||
                    (node.subtype && node.subtype.toLowerCase().includes(query)) ||
                    node.state.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.label.localeCompare(b.label);
                case 'type':
                    return a.type.localeCompare(b.type) || (a.subtype || '').localeCompare(b.subtype || '');
                case 'dependencies':
                    const aDeps = (a.dependencies_in || 0) + (a.dependencies_out || 0);
                    const bDeps = (b.dependencies_in || 0) + (b.dependencies_out || 0);
                    return bDeps - aDeps;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [nodes, searchQuery, sortBy, stateFilter]);

    const resetFilters = () => {
        setSearchQuery('');
        setSortBy('name');
        setStateFilter(null);
    };

    const hasActiveFilters = searchQuery || sortBy !== 'name' || stateFilter;

    const handleNodeClick = (node: Node) => {
        if (onNodeClick) {
            onNodeClick(node);
        }
    };

    // Empty state
    if (nodes.length === 0) {
        return (
            <div className={`w-full ${bgPrimary} rounded-xl p-8 ${textPrimary}`}>
                <div className={`${bgSecondary} rounded-lg p-12 border ${border} text-center`}>
                    <FilterIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                    <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
                    <p className={textSecondary}>
                        Please provide infrastructure data to visualize your components.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${bgPrimary} rounded-xl p-6 ${textPrimary} transition-colors duration-200`}>
            {/* Header */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-2xl font-bold mb-1">{title}</h1>
                <p className={textSecondary}>
                    Infrastructure component analysis and management
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Resource Overview Card - Highlighted */}
                <div
                    className={`${bgSecondary} rounded-lg p-5 border ${border} col-span-1 md:col-span-2 lg:col-span-1 animate-slide-up transform hover:scale-105 transition-all duration-200`}
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'
                            : 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                    }}
                >
                    <div className="flex items-center gap-2 mb-3 text-white">
                        <BoxIcon className="w-5 h-5" />
                        <span className="font-semibold text-sm">Resource Overview</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-white">
                            <span className="text-xs font-medium">Total Resources</span>
                            <span className="text-2xl font-bold">{stats.totalResources}</span>
                        </div>
                        <div className="flex justify-between items-center text-white/90">
                            <span className="text-xs">Live Resources</span>
                            <span className="text-lg font-semibold">{stats.liveResources}</span>
                        </div>
                        <div className="flex justify-between items-center text-yellow-200">
                            <span className="text-xs">To Replace</span>
                            <span className="text-lg font-semibold">{stats.replaceResources}</span>
                        </div>
                        <div className="flex justify-between items-center text-red-200">
                            <span className="text-xs">To Delete</span>
                            <span className="text-lg font-semibold">{stats.deleteResources}</span>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/20 text-white/80 text-xs flex items-center justify-between cursor-pointer hover:text-white transition-colors">
                        <span>View Resource Details</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </div>
                </div>

                {/* Project Health Card */}
                <div className={`${bgSecondary} rounded-lg p-5 border ${border} animate-slide-up transform hover:scale-105 transition-all duration-200`} style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <ActivityIcon className={`w-5 h-5 ${stats.healthClass === 'positive' ? 'text-green-400' : stats.healthClass === 'warning' ? 'text-yellow-400' : 'text-red-400'}`} />
                        <span className="font-semibold text-sm">Project Health</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${textSecondary}`}>Health Score</span>
                        <div className="flex items-center gap-2">
              <span className={`text-3xl font-bold ${
                  stats.healthClass === 'positive' ? 'text-green-400' :
                      stats.healthClass === 'warning' ? 'text-yellow-400' :
                          'text-red-400'
              }`}>
                {stats.healthScore}%
              </span>
                            {stats.healthClass === 'positive' ? (
                                <TrendingUpIcon className="w-5 h-5 text-green-400" />
                            ) : (
                                <TrendingDownIcon className="w-5 h-5 text-red-400" />
                            )}
                        </div>
                    </div>
                    <div className={`text-xs ${textSecondary} mt-3 pt-3 border-t ${border}`}>
                        Based on resource state and changes
                    </div>
                </div>

                {/* Provider Distribution Card */}
                <div className={`${bgSecondary} rounded-lg p-5 border ${border} animate-slide-up transform hover:scale-105 transition-all duration-200`} style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <PlugIcon className="w-5 h-5 text-purple-400" />
                        <span className="font-semibold text-sm">Provider Distribution</span>
                    </div>
                    <div className="space-y-2">
                        {stats.providerDistribution.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    <span className="text-xs capitalize">{item.provider}</span>
                                </div>
                                <span className="text-sm font-semibold text-cyan-400">{item.count}</span>
                            </div>
                        ))}
                    </div>
                    <div className={`text-xs ${textSecondary} mt-3 pt-3 border-t ${border}`}>
                        Showing top {stats.providerDistribution.length} providers by usage
                    </div>
                </div>

                {/* Total Components Card */}
                <div className={`${bgSecondary} rounded-lg p-5 border ${border} animate-slide-up transform hover:scale-105 transition-all duration-200`} style={{ animationDelay: '0.3s' }}>
                    <div className="text-center mb-3">
                        <div className="text-4xl font-bold text-cyan-400 mb-1">
                            {stats.totalComponents}
                        </div>
                        <div className={`text-xs ${textSecondary} uppercase font-semibold`}>
                            Components
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {Object.entries(stats.stateCounts).map(([state, count]) => {
                            const config = stateConfig[state as keyof typeof stateConfig] || stateConfig.healthy;
                            return (
                                <button
                                    key={state}
                                    onClick={() => setStateFilter(stateFilter === state ? null : state)}
                                    className={`text-xs px-2 py-1 rounded ${config.bg} ${config.color} ${config.border} border hover:scale-105 transition-transform`}
                                >
                                    {state}: {count}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className={`${bgSecondary} rounded-lg p-4 text-center border ${border} animate-fade-in`}>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.totalDependencies}</div>
                    <div className={`text-xs ${textSecondary} uppercase font-semibold`}>Dependencies</div>
                </div>
                <div className={`${bgSecondary} rounded-lg p-4 text-center border ${border} animate-fade-in`} style={{ animationDelay: '0.05s' }}>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.connectedGroups}</div>
                    <div className={`text-xs ${textSecondary} uppercase font-semibold`}>Connected Groups</div>
                </div>
                <div className={`${bgSecondary} rounded-lg p-4 text-center border ${border} animate-fade-in`} style={{ animationDelay: '0.1s' }}>
                    <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.resourceTypes}</div>
                    <div className={`text-xs ${textSecondary} uppercase font-semibold`}>Resource Types</div>
                </div>
            </div>

            {/* Controls Panel */}
            <div className={`${bgSecondary} rounded-lg border ${border} mb-6 animate-slide-up`}>
                <div className={`p-4 border-b ${border} flex flex-wrap justify-between items-center gap-3`}>
                    <div className="font-semibold text-gray-200">Components</div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSortBy('name')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                sortBy === 'name'
                                    ? 'bg-cyan-500 text-white'
                                    : `${bgTertiary} ${textSecondary} hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'} border ${border}`
                            }`}
                        >
                            <SortAscIcon className="w-4 h-4" />
                            Name
                        </button>
                        <button
                            onClick={() => setSortBy('type')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                sortBy === 'type'
                                    ? 'bg-cyan-500 text-white'
                                    : `${bgTertiary} ${textSecondary} hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'} border ${border}`
                            }`}
                        >
                            <LayersIcon className="w-4 h-4" />
                            Type
                        </button>
                        <button
                            onClick={() => setSortBy('dependencies')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                sortBy === 'dependencies'
                                    ? 'bg-cyan-500 text-white'
                                    : `${bgTertiary} ${textSecondary} hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'} border ${border}`
                            }`}
                        >
                            <NetworkIcon className="w-4 h-4" />
                            Dependencies
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${bgTertiary} ${textSecondary} hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'} border ${border} transition-all flex items-center gap-2`}
                            >
                                <XIcon className="w-4 h-4" />
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* Active Filters Info */}
                {hasActiveFilters && (
                    <div className={`p-4 border-b ${border} flex justify-between items-center ${bgTertiary}/50`}>
                        <div className="flex flex-wrap gap-2">
                            {searchQuery && (
                                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                  Search: "{searchQuery}"
                </span>
                            )}
                            {stateFilter && (
                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm border border-purple-500/30">
                  State: {stateFilter}
                </span>
                            )}
                            {sortBy !== 'name' && (
                                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                  Sorted by: {sortBy}
                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Search Box */}
                <div className={`p-4 border-b ${border}`}>
                    <div className="relative">
                        <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${textSecondary}`} />
                        <input
                            type="text"
                            placeholder="Search components by name, type, or state..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 ${bgTertiary} border ${border} rounded-lg ${textPrimary} placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors`}
                        />
                    </div>
                </div>

                {/* Component Grid */}
                <div className="p-4 max-h-96 overflow-y-auto">
                    {filteredAndSortedNodes.length === 0 ? (
                        <div className={`text-center py-12 ${textSecondary}`}>
                            <FilterIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <h3 className="text-lg font-semibold mb-1">No components found</h3>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredAndSortedNodes.map((node) => {
                                const NodeIcon = nodeIcons[node.type] || LayersIcon;
                                const config = stateConfig[node.state as keyof typeof stateConfig] || stateConfig.healthy;
                                const StateIcon = config.icon;
                                const isLeaf = (node.dependencies_out || 0) === 0 && (node.dependencies_in || 0) > 0;
                                const isHub = (node.dependencies_out || 0) > 5 || (node.dependencies_in || 0) > 5;

                                return (
                                    <div
                                        key={node.id}
                                        onClick={() => handleNodeClick(node)}
                                        className={`${bgTertiary} rounded-lg p-5 border-l-4 ${config.borderLeft} hover:border-cyan-500 transition-all hover:transform hover:-translate-y-1 border ${border} cursor-pointer animate-fade-in`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                                                <NodeIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-semibold ${textPrimary} truncate mb-1`} title={node.label}>
                                                    {node.label}
                                                </div>
                                                <div className={`text-sm ${textSecondary} mb-2`}>
                                                    {node.type} {node.subtype && `• ${node.subtype}`}
                                                </div>
                                                <div
                                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${config.bg} ${config.color} ${config.border} border`}
                                                >
                                                    <StateIcon className="w-3 h-3" />
                                                    {node.state.toUpperCase()}
                                                </div>
                                                {(isLeaf || isHub) && (
                                                    <div className="flex gap-2 mt-2">
                                                        {isLeaf && (
                                                            <span className="text-xs px-2 py-1 rounded bg-green-400/10 text-green-400 border border-green-400/30 font-semibold">
                                <LeafIcon className="w-3 h-3 inline mr-1" />
                                LEAF
                              </span>
                                                        )}
                                                        {isHub && (
                                                            <span className="text-xs px-2 py-1 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-semibold">
                                <NetworkIcon className="w-3 h-3 inline mr-1" />
                                HUB
                              </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`flex gap-4 pt-3 border-t ${border}`}>
                                            <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                                                <ArrowUpIcon className="w-4 h-4" />
                                                <span>Uses:</span>
                                                <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                          {node.dependencies_out || 0}
                        </span>
                                            </div>
                                            <div className={`flex items-center gap-2 text-sm ${textSecondary}`}>
                                                <ArrowDownIcon className="w-4 h-4" />
                                                <span>Used by:</span>
                                                <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                          {node.dependencies_in || 0}
                        </span>
                                            </div>
                                        </div>
                                        {node.state_reason && (
                                            <div className={`mt-3 text-xs ${textSecondary} italic`}>
                                                {node.state_reason}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS Animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}

export default ClassicLayoutDemo;

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*

Example usage:

import ClassicLayoutDemo from './ClassicLayoutDemo';
import data from './python-output.json';

// Basic usage with dark theme (default)
<ClassicLayoutDemo 
  data={data} 
  title="Infrastructure Dashboard" 
  theme="dark" 
  height={800}
  onNodeClick={(node) => console.log('Node clicked:', node)}
/>

// Light theme example
<ClassicLayoutDemo 
  data={data} 
  title="My Infrastructure" 
  theme="light" 
  height={900} 
/>

// Expected Python JSON output structure:
{
  "nodes": [
    {
      "id": "node1",
      "label": "aws_vpc.main",
      "type": "resource",
      "subtype": "aws_vpc",
      "state": "healthy",
      "state_reason": null,
      "dependencies_in": 5,
      "dependencies_out": 0,
      "lifecycle": "create",
      "details": {
        "loc": "main.tf:10"
      }
    },
    {
      "id": "node2",
      "label": "module.networking",
      "type": "module",
      "subtype": "custom",
      "state": "active",
      "dependencies_in": 8,
      "dependencies_out": 2,
      "lifecycle": "none"
    }
  ],
  "edges": [
    { "source": "node2", "target": "node1" }
  ],
  "resources": [
    {
      "id": "res1",
      "label": "aws_vpc.main",
      "type": "aws_vpc",
      "lifecycle": "create",
      "provider": "aws"
    }
  ],
  "meta": {
    "title": "Production Infrastructure",
    "timestamp": "2025-10-31T10:00:00Z",
    "environment": "production"
  }
}

*/