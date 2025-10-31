import React, { useMemo, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { Doughnut, Bar, Pie, Radar } from 'react-chartjs-2';
import {
    NetworkIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    ExternalLinkIcon,
    BellIcon,
    LayersIcon,
    CodeIcon,
    ArrowRightIcon,
    DatabaseIcon,
    SettingsIcon,
    ActivityIcon,
    BoxIcon,
    AlertCircleIcon,
} from 'lucide-react';

// Register Chart.js components once
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement
);

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Node {
    id: string;
    label: string;
    type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider';
    state?: 'active' | 'integrated' | 'external_data' | 'configuration' | 'orphaned' | 'unused' | 'isolated' | 'leaf' | 'healthy' | 'external' | 'warning' | 'orphan';
    dependencies_in?: number;
    dependencies_out?: number;
}

export interface Edge {
    source: string;
    target: string;
}

export interface Aggregates {
    typeCounts?: Record<string, number>;
    stateCounts?: Record<string, number>;
    totalDependencies?: number;
    avgDependencies?: number;
    healthyPercentage?: number;
    coverageScore?: number;
    avgDependenciesByType?: number[];
}

export type DashboardData = {
    nodes?: Node[];
    edges?: Edge[];
    aggregates?: Aggregates;
    meta?: Record<string, unknown>;
};

export interface DashboardDemoProps {
    data: DashboardData;
    title?: string;
    theme?: 'dark' | 'light';
    height?: number;
}

interface ProcessedStats {
    typeCounts: {
        resources: number;
        modules: number;
        variables: number;
        outputs: number;
        data_sources: number;
        providers: number;
    };
    stateCounts: {
        healthy: number;
        unused: number;
        external: number;
        leaf: number;
        orphan: number;
        warning: number;
        active: number;
        integrated: number;
    };
    totalDependencies: number;
    avgDependencies: string;
    healthyPercentage: number;
    coverageScore: number;
    avgDependenciesByType: number[];
}

// ============================================================================
// DATA ADAPTER UTILITIES
// ============================================================================

/**
 * Normalizes state names from Python output to standard categories
 */
function normalizeState(state?: string): string {
    if (!state) return 'unknown';

    const normalized = state.toLowerCase();

    // Map various state names to standard categories
    if (['active', 'integrated', 'leaf'].includes(normalized)) return 'healthy';
    if (['external_data', 'configuration', 'external'].includes(normalized)) return 'external';
    if (['orphaned', 'isolated', 'orphan'].includes(normalized)) return 'orphan';
    if (['unused'].includes(normalized)) return 'unused';
    if (['warning'].includes(normalized)) return 'warning';

    return normalized;
}

/**
 * Processes raw dashboard data into structured statistics
 */
function processData(data: DashboardData): ProcessedStats {
    const nodes = data?.nodes || [];
    const edges = data?.edges || [];

    // Type counts
    const typeCounts = {
        resources: nodes.filter(n => n.type === 'resource').length,
        modules: nodes.filter(n => n.type === 'module').length,
        variables: nodes.filter(n => n.type === 'variable').length,
        outputs: nodes.filter(n => n.type === 'output').length,
        data_sources: nodes.filter(n => n.type === 'data').length,
        providers: nodes.filter(n => n.type === 'provider').length,
    };

    // State counts with normalization
    const stateCounts = {
        healthy: nodes.filter(n => {
            const norm = normalizeState(n.state);
            return norm === 'healthy' || ['active', 'integrated', 'leaf'].includes(n.state || '');
        }).length,
        unused: nodes.filter(n => normalizeState(n.state) === 'unused').length,
        external: nodes.filter(n => normalizeState(n.state) === 'external').length,
        leaf: nodes.filter(n => n.state === 'leaf').length,
        orphan: nodes.filter(n => normalizeState(n.state) === 'orphan').length,
        warning: nodes.filter(n => normalizeState(n.state) === 'warning').length,
        active: nodes.filter(n => n.state === 'active').length,
        integrated: nodes.filter(n => n.state === 'integrated').length,
    };

    // Dependency calculations
    const totalDependencies = edges.length;
    const avgDependencies = nodes.length > 0
        ? ((totalDependencies * 2) / nodes.length).toFixed(1)
        : '0';

    // Health metrics
    const healthyPercentage = nodes.length > 0
        ? Math.round((stateCounts.healthy / nodes.length) * 100)
        : 0;

    const coverageScore = nodes.length > 0
        ? Math.round(((nodes.length - stateCounts.unused) / nodes.length) * 100)
        : 0;

    // Average dependencies by type
    const nodeTypes: Node['type'][] = ['resource', 'module', 'variable', 'output', 'data', 'provider'];
    const avgDependenciesByType = nodeTypes.map(type => {
        const nodesOfType = nodes.filter(n => n.type === type);
        if (nodesOfType.length === 0) return 0;

        const totalDeps = nodesOfType.reduce(
            (sum, node) => sum + (node.dependencies_out || 0) + (node.dependencies_in || 0),
            0
        );
        return parseFloat((totalDeps / nodesOfType.length).toFixed(1));
    });

    return {
        typeCounts,
        stateCounts,
        totalDependencies,
        avgDependencies,
        healthyPercentage,
        coverageScore,
        avgDependenciesByType,
    };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function DashboardDemo({
                                   data = {
                                       "nodes": [
                                           { "id": "n1", "label": "aws_vpc.main", "type": "resource", "state": "active", "dependencies_in": 3, "dependencies_out": 1 },
                                           { "id": "n2", "label": "aws_subnet.public", "type": "resource", "state": "integrated", "dependencies_in": 2, "dependencies_out": 2 },
                                           { "id": "n3", "label": "aws_instance.web", "type": "resource", "state": "active", "dependencies_in": 4, "dependencies_out": 0 },
                                           { "id": "n4", "label": "module.networking", "type": "module", "state": "integrated", "dependencies_in": 5, "dependencies_out": 3 },
                                           { "id": "n5", "label": "module.database", "type": "module", "state": "active", "dependencies_in": 4, "dependencies_out": 2 },
                                           { "id": "n6", "label": "var.region", "type": "variable", "state": "configuration", "dependencies_in": 0, "dependencies_out": 4 },
                                           { "id": "n7", "label": "var.instance_type", "type": "variable", "state": "configuration", "dependencies_in": 0, "dependencies_out": 2 },
                                           { "id": "n8", "label": "output.vpc_id", "type": "output", "state": "external_data", "dependencies_in": 2, "dependencies_out": 0 },
                                           { "id": "n9", "label": "output.subnet_ids", "type": "output", "state": "external_data", "dependencies_in": 3, "dependencies_out": 0 },
                                           { "id": "n10", "label": "data.aws_ami.ubuntu", "type": "data", "state": "external_data", "dependencies_in": 0, "dependencies_out": 1 },
                                           { "id": "n11", "label": "provider.aws", "type": "provider", "state": "active", "dependencies_in": 0, "dependencies_out": 10 },
                                           { "id": "n12", "label": "aws_security_group.web", "type": "resource", "state": "unused", "dependencies_in": 1, "dependencies_out": 0 },
                                           { "id": "n13", "label": "module.monitoring", "type": "module", "state": "warning", "dependencies_in": 3, "dependencies_out": 1 },
                                           { "id": "n14", "label": "data.aws_availability_zones.available", "type": "data", "state": "active", "dependencies_in": 0, "dependencies_out": 2 },
                                           { "id": "n15", "label": "var.env", "type": "variable", "state": "active", "dependencies_in": 0, "dependencies_out": 1 }
                                       ],
                                       "edges": [
                                           { "source": "n6", "target": "n4" },
                                           { "source": "n7", "target": "n3" },
                                           { "source": "n10", "target": "n3" },
                                           { "source": "n14", "target": "n4" },
                                           { "source": "n11", "target": "n1" },
                                           { "source": "n11", "target": "n2" },
                                           { "source": "n11", "target": "n3" },
                                           { "source": "n4", "target": "n1" },
                                           { "source": "n4", "target": "n2" },
                                           { "source": "n5", "target": "n3" },
                                           { "source": "n4", "target": "n8" },
                                           { "source": "n4", "target": "n9" },
                                           { "source": "n13", "target": "n5" },
                                           { "source": "n15", "target": "n13" }
                                       ],
                                       "aggregates": {
                                           "typeCounts": {
                                               "resource": 4,
                                               "module": 3,
                                               "variable": 3,
                                               "output": 2,
                                               "data": 2,
                                               "provider": 1
                                           },
                                           "stateCounts": {
                                               "active": 5,
                                               "integrated": 2,
                                               "external_data": 3,
                                               "configuration": 2,
                                               "unused": 1,
                                               "warning": 1
                                           },
                                           "totalDependencies": 14,
                                           "avgDependencies": 1.9,
                                           "healthyPercentage": 73,
                                           "coverageScore": 87,
                                           "avgDependenciesByType": [2.1, 2.3, 1.5, 1.0, 1.5, 3.0]
                                       },
                                       "meta": {
                                           "timestamp": "2025-10-31T11:00:00Z",
                                           "environment": "staging",
                                           "generated_by": "graph_metrics.py"
                                       }
                                   },
                                   title = 'Infrastructure Dashboard',
                                   theme = 'dark',
                                   height = 700,
                               }: DashboardDemoProps) {
    const stats = useMemo(() => processData(data), [data]);

    // Prevent chart re-registration issues
    useEffect(() => {
        return () => {
            // Cleanup on unmount
        };
    }, []);

    // Theme configuration
    const isDark = theme === 'dark';
    const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-50';
    const bgSecondary = isDark ? 'bg-gray-800' : 'bg-white';
    const textPrimary = isDark ? 'text-white' : 'text-gray-900';
    const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
    const border = isDark ? 'border-gray-700' : 'border-gray-200';

    // Chart colors
    const chartColors = {
        success: '#10b981',
        accent_secondary: '#8b5cf6',
        warning: '#f59e0b',
        info: '#06b6d4',
        danger: '#ef4444',
        accent: '#06b6d4',
    };

    // Chart configuration
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: isDark ? '#9ca3af' : '#4b5563',
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#ffffff' : '#000000',
                bodyColor: isDark ? '#d1d5db' : '#374151',
                borderColor: isDark ? '#374151' : '#d1d5db',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || context.raw || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
    };

    const barChartOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    precision: 0,
                },
                grid: {
                    color: isDark ? '#374151' : '#e5e7eb',
                },
            },
            x: {
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    const radarChartOptions = {
        ...chartOptions,
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    backdropColor: 'transparent',
                },
                grid: {
                    color: isDark ? '#374151' : '#e5e7eb',
                },
                pointLabels: {
                    color: isDark ? '#9ca3af' : '#6b7280',
                    font: {
                        size: 11,
                    },
                },
            },
        },
    };

    // Chart data
    const distributionChartData = {
        labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
        datasets: [
            {
                data: [
                    stats.typeCounts.resources,
                    stats.typeCounts.modules,
                    stats.typeCounts.variables,
                    stats.typeCounts.outputs,
                    stats.typeCounts.data_sources,
                    stats.typeCounts.providers,
                ],
                backgroundColor: [
                    chartColors.success,
                    chartColors.accent_secondary,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.danger,
                    chartColors.accent,
                ],
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    const overviewChartData = {
        labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
        datasets: [
            {
                label: 'Count',
                data: [
                    stats.typeCounts.resources,
                    stats.typeCounts.modules,
                    stats.typeCounts.variables,
                    stats.typeCounts.outputs,
                    stats.typeCounts.data_sources,
                    stats.typeCounts.providers,
                ],
                backgroundColor: [
                    chartColors.success,
                    chartColors.accent_secondary,
                    chartColors.warning,
                    chartColors.info,
                    chartColors.danger,
                    chartColors.accent,
                ],
                borderWidth: 0,
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    };

    const healthChartData = {
        labels: ['Healthy', 'Unused', 'External', 'Leaf', 'Orphan', 'Warning'],
        datasets: [
            {
                data: [
                    stats.stateCounts.healthy,
                    stats.stateCounts.unused,
                    stats.stateCounts.external,
                    stats.stateCounts.leaf,
                    stats.stateCounts.orphan,
                    stats.stateCounts.warning,
                ],
                backgroundColor: [
                    chartColors.success,
                    chartColors.danger,
                    chartColors.info,
                    chartColors.success,
                    chartColors.warning,
                    chartColors.warning,
                ],
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    const dependencyChartData = {
        labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
        datasets: [
            {
                label: 'Avg Dependencies',
                data: stats.avgDependenciesByType,
                backgroundColor: chartColors.accent + '33',
                borderColor: chartColors.accent,
                borderWidth: 2,
                pointBackgroundColor: chartColors.accent,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.accent,
            },
        ],
    };

    // Handle empty data gracefully
    const hasData = (data?.nodes?.length || 0) > 0;

    if (!hasData) {
        return (
            <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-8`}>
                <div className={`max-w-7xl mx-auto ${bgSecondary} rounded-lg p-12 border ${border} text-center`}>
                    <AlertCircleIcon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-2xl font-bold mb-2">No Data Available</h2>
                    <p className={textSecondary}>
                        Please provide dashboard data to visualize your infrastructure metrics.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${bgPrimary} ${textPrimary} p-8 transition-colors duration-200`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className={textSecondary}>
                        Real-time infrastructure analysis and metrics
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Total Resources Card */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} transform hover:scale-105 transition-all duration-200 animate-slide-up`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                                        <NetworkIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg">Total Components</div>
                                </div>
                                <div className={`${textSecondary} text-sm mb-4`}>
                                    Infrastructure resource overview
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-green-400">
                                            {stats.typeCounts.resources}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Resources
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-purple-400">
                                            {stats.typeCounts.modules}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Modules
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-cyan-400">
                                            {stats.typeCounts.variables + stats.typeCounts.outputs}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            I/O
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dependencies Card */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} transform hover:scale-105 transition-all duration-200 animate-slide-up`} style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                                        <ActivityIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg">Dependencies</div>
                                </div>
                                <div className={`${textSecondary} text-sm mb-4`}>
                                    Connection and relationship metrics
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-purple-400">
                                            {stats.totalDependencies}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Links
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-cyan-400">
                                            {stats.avgDependencies}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Avg/Node
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Health Status Card */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} transform hover:scale-105 transition-all duration-200 animate-slide-up`} style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                                        <ShieldCheckIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg">Health Status</div>
                                </div>
                                <div className={`${textSecondary} text-sm mb-4`}>
                                    Infrastructure health and usage analysis
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-green-400">
                                            {stats.healthyPercentage}%
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Healthy
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-green-400">
                                            {stats.coverageScore}%
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Coverage
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Issues Card */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} transform hover:scale-105 transition-all duration-200 animate-slide-up`} style={{ animationDelay: '0.3s' }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center">
                                        <AlertTriangleIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="font-semibold text-lg">Attention Required</div>
                                </div>
                                <div className={`${textSecondary} text-sm mb-4`}>
                                    Items requiring review or optimization
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-red-400">
                                            {stats.stateCounts.unused}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Unused
                                        </div>
                                    </div>
                                    <div className={`text-center p-3 ${isDark ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg border ${border}`}>
                                        <div className="text-2xl font-bold text-yellow-400">
                                            {stats.stateCounts.warning}
                                        </div>
                                        <div className={`text-xs ${textSecondary} uppercase tracking-wide`}>
                                            Warnings
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Distribution Doughnut Chart */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-fade-in`}>
                                <div className="flex items-center gap-2 mb-4">
                                    <LayersIcon className="w-5 h-5 text-cyan-400" />
                                    <div className="font-semibold">Component Distribution</div>
                                </div>
                                <div className="h-64">
                                    <Doughnut
                                        data={distributionChartData}
                                        options={{
                                            ...chartOptions,
                                            cutout: '65%',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Overview Bar Chart */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-fade-in`} style={{ animationDelay: '0.1s' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <BoxIcon className="w-5 h-5 text-purple-400" />
                                    <div className="font-semibold">Infrastructure Overview</div>
                                </div>
                                <div className="h-64">
                                    <Bar data={overviewChartData} options={barChartOptions} />
                                </div>
                            </div>

                            {/* Health Pie Chart */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                                    <div className="font-semibold">Health Distribution</div>
                                </div>
                                <div className="h-64">
                                    <Pie data={healthChartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Dependency Radar Chart */}
                            <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-fade-in`} style={{ animationDelay: '0.3s' }}>
                                <div className="flex items-center gap-2 mb-4">
                                    <NetworkIcon className="w-5 h-5 text-cyan-400" />
                                    <div className="font-semibold">Dependency Analysis</div>
                                </div>
                                <div className="h-64">
                                    <Radar data={dependencyChartData} options={radarChartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Health Status Breakdown */}
                        <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-slide-in`}>
                            <div className="flex items-center gap-2 mb-6">
                                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                                <div className="font-semibold">Health Status</div>
                            </div>
                            <div className="space-y-4">
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                        <span>Healthy</span>
                                    </div>
                                    <div className="text-xl font-bold text-green-400">
                                        {stats.stateCounts.healthy}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangleIcon className="w-4 h-4 text-red-400" />
                                        <span>Unused</span>
                                    </div>
                                    <div className="text-xl font-bold text-red-400">
                                        {stats.stateCounts.unused}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <ExternalLinkIcon className="w-4 h-4 text-cyan-400" />
                                        <span>External</span>
                                    </div>
                                    <div className="text-xl font-bold text-cyan-400">
                                        {stats.stateCounts.external}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <div className="flex items-center gap-2">
                                        <BellIcon className="w-4 h-4 text-yellow-400" />
                                        <span>Warnings</span>
                                    </div>
                                    <div className="text-xl font-bold text-yellow-400">
                                        {stats.stateCounts.warning}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Type Breakdown */}
                        <div className={`${bgSecondary} rounded-lg p-6 border ${border} animate-slide-in`} style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 mb-6">
                                <LayersIcon className="w-5 h-5 text-cyan-400" />
                                <div className="font-semibold">Type Breakdown</div>
                            </div>
                            <div className="space-y-4">
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <span>Resources</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.resources}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                                        <span>Modules</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.modules}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <CodeIcon className="w-4 h-4 text-yellow-400" />
                                        <span>Variables</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.variables}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <ArrowRightIcon className="w-4 h-4 text-cyan-400" />
                                        <span>Outputs</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.outputs}
                                    </div>
                                </div>
                                <div className={`flex justify-between items-center py-3 border-b ${border}`}>
                                    <div className="flex items-center gap-2">
                                        <DatabaseIcon className="w-4 h-4 text-red-400" />
                                        <span>Data Sources</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.data_sources}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <div className="flex items-center gap-2">
                                        <SettingsIcon className="w-4 h-4 text-cyan-400" />
                                        <span>Providers</span>
                                    </div>
                                    <div className="font-semibold text-cyan-400">
                                        {stats.typeCounts.providers}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
}

export default DashboardDemo;

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*

Example usage:

import DashboardDemo from './DashboardDemo';
import data from './python-output.json';

// Basic usage with dark theme (default)
<DashboardDemo
  data={data}
  title="Infrastructure Overview"
  theme="dark"
  height={720}
/>

// Light theme example
<DashboardDemo
  data={data}
  title="My Dashboard"
  theme="light"
  height={800}
/>

// Expected Python JSON output structure:
{
  "nodes": [
    {
      "id": "node1",
      "label": "aws_vpc.main",
      "type": "resource",
      "state": "active",
      "dependencies_in": 5,
      "dependencies_out": 0
    },
    {
      "id": "node2",
      "label": "module.networking",
      "type": "module",
      "state": "integrated",
      "dependencies_in": 8,
      "dependencies_out": 2
    }
  ],
  "edges": [
    { "source": "node2", "target": "node1" }
  ],
  "aggregates": {
    "typeCounts": {
      "resource": 45,
      "module": 12,
      "variable": 23,
      "output": 8,
      "data": 5,
      "provider": 3
    },
    "stateCounts": {
      "active": 67,
      "unused": 8,
      "external": 15,
      "warning": 2
    }
  },
  "meta": {
    "timestamp": "2025-10-31T10:00:00Z",
    "environment": "production"
  }
}

*/