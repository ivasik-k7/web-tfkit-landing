import { useMemo, useState } from 'react'
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
} from 'chart.js'
import { Doughnut, Bar, Pie, Radar } from 'react-chartjs-2'
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
    TrendingUpIcon,
    ActivityIcon,
} from 'lucide-react'

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
)

interface Node {
    id: string
    label: string
    type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider'
    state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning'
    dependencies_out: number
    dependencies_in: number
}

const sampleNodes: Node[] = [
    {
        id: '1',
        label: 'aws_vpc.main',
        type: 'resource',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 5,
    },
    {
        id: '2',
        label: 'aws_subnet.public',
        type: 'resource',
        state: 'healthy',
        dependencies_out: 1,
        dependencies_in: 3,
    },
    {
        id: '3',
        label: 'aws_instance.web',
        type: 'resource',
        state: 'warning',
        dependencies_out: 2,
        dependencies_in: 0,
    },
    {
        id: '4',
        label: 'module.networking',
        type: 'module',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 8,
    },
    {
        id: '5',
        label: 'var.region',
        type: 'variable',
        state: 'external',
        dependencies_out: 0,
        dependencies_in: 4,
    },
    {
        id: '6',
        label: 'aws_security_group.unused',
        type: 'resource',
        state: 'unused',
        dependencies_out: 0,
        dependencies_in: 0,
    },
    {
        id: '7',
        label: 'data.aws_ami.latest',
        type: 'data',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 2,
    },
    {
        id: '8',
        label: 'output.vpc_id',
        type: 'output',
        state: 'healthy',
        dependencies_out: 1,
        dependencies_in: 0,
    },
    {
        id: '9',
        label: 'module.database',
        type: 'module',
        state: 'healthy',
        dependencies_out: 2,
        dependencies_in: 4,
    },
    {
        id: '10',
        label: 'var.environment',
        type: 'variable',
        state: 'external',
        dependencies_out: 0,
        dependencies_in: 6,
    },
    {
        id: '11',
        label: 'aws_iam_role.app',
        type: 'resource',
        state: 'healthy',
        dependencies_out: 1,
        dependencies_in: 2,
    },
    {
        id: '12',
        label: 'provider.aws',
        type: 'provider',
        state: 'healthy',
        dependencies_out: 0,
        dependencies_in: 12,
    },
]

const sampleEdges = [
    { source: '2', target: '1' },
    { source: '3', target: '2' },
    { source: '3', target: '7' },
    { source: '4', target: '1' },
    { source: '4', target: '2' },
    { source: '8', target: '1' },
    { source: '9', target: '4' },
    { source: '11', target: '3' },
]

export function DashboardDemo() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null)

    const stats = useMemo(() => {
        const typeCounts = {
            resources: sampleNodes.filter((n) => n.type === 'resource').length,
            modules: sampleNodes.filter((n) => n.type === 'module').length,
            variables: sampleNodes.filter((n) => n.type === 'variable').length,
            outputs: sampleNodes.filter((n) => n.type === 'output').length,
            data_sources: sampleNodes.filter((n) => n.type === 'data').length,
            providers: sampleNodes.filter((n) => n.type === 'provider').length,
        }
        const stateCounts = {
            healthy: sampleNodes.filter((n) => n.state === 'healthy').length,
            unused: sampleNodes.filter((n) => n.state === 'unused').length,
            external: sampleNodes.filter((n) => n.state === 'external').length,
            leaf: sampleNodes.filter((n) => n.state === 'leaf').length,
            orphan: sampleNodes.filter((n) => n.state === 'orphan').length,
            warning: sampleNodes.filter((n) => n.state === 'warning').length,
        }
        const resourceUnused = sampleNodes.filter(
            (n) => n.type === 'resource' && n.state === 'unused',
        ).length
        const moduleUnused = sampleNodes.filter(
            (n) => n.type === 'module' && n.state === 'unused',
        ).length
        const totalDependencies = sampleEdges.length
        const avgDependencies =
            sampleNodes.length > 0
                ? ((totalDependencies * 2) / sampleNodes.length).toFixed(1)
                : '0'
        const healthyPercentage =
            sampleNodes.length > 0
                ? Math.round((stateCounts.healthy / sampleNodes.length) * 100)
                : 0
        const coverageScore =
            sampleNodes.length > 0
                ? Math.round(
                    ((sampleNodes.length - stateCounts.unused) / sampleNodes.length) * 100,
                )
                : 0
        const nodeTypes: Array<
            'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider'
        > = ['resource', 'module', 'variable', 'output', 'data', 'provider']
        const avgDependenciesByType = nodeTypes.map((type) => {
            const nodesOfType = sampleNodes.filter((n) => n.type === type)
            if (nodesOfType.length === 0) return 0
            const totalDeps = nodesOfType.reduce(
                (sum, node) => sum + node.dependencies_out + node.dependencies_in,
                0,
            )
            return parseFloat((totalDeps / nodesOfType.length).toFixed(1))
        })
        return {
            typeCounts,
            stateCounts,
            resourceUnused,
            moduleUnused,
            totalDependencies,
            avgDependencies,
            healthyPercentage,
            coverageScore,
            avgDependenciesByType,
        }
    }, [])

    const chartColors = {
        success: '#10b981',
        accent_secondary: '#8b5cf6',
        warning: '#f59e0b',
        info: '#06b6d4',
        danger: '#ef4444',
        accent: '#06b6d4',
    }

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
                hoverOffset: 12,
            },
        ],
    }

    const overviewChartData = {
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
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    }

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
            },
        ],
    }

    const dependencyChartData = {
        labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
        datasets: [
            {
                label: 'Avg Dependencies per Node',
                data: stats.avgDependenciesByType,
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                borderColor: chartColors.accent,
                pointBackgroundColor: chartColors.accent,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: chartColors.accent,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#9ca3af',
                    padding: 20,
                    font: { size: 11 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#06b6d4',
                bodyColor: '#e5e7eb',
                borderColor: '#06b6d4',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: function(context: any) {
                        return `${context.label}: ${context.parsed || context.formattedValue}`
                    }
                }
            },
        },
    }

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#06b6d4',
                bodyColor: '#e5e7eb',
                borderColor: '#06b6d4',
                borderWidth: 1,
                padding: 12,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(75, 85, 99, 0.2)' },
                ticks: { color: '#9ca3af' },
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' },
            },
        },
    }

    const radarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                grid: { color: 'rgba(75, 85, 99, 0.3)' },
                angleLines: { color: 'rgba(75, 85, 99, 0.3)' },
                pointLabels: { color: '#9ca3af', font: { size: 11 } },
                ticks: { color: 'transparent', backdropColor: 'transparent' },
            },
        },
        plugins: {
            legend: { labels: { color: '#9ca3af' } },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                titleColor: '#06b6d4',
                bodyColor: '#e5e7eb',
                borderColor: '#06b6d4',
                borderWidth: 1,
                padding: 12,
            },
        },
    }

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
                            Infrastructure Dashboard
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <ActivityIcon className="w-4 h-4" />
                            Real-time analysis of your Terraform infrastructure
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <span className="text-green-400 font-semibold">● Live</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Resource Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Resources Card */}
                            <div
                                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1"
                                onMouseEnter={() => setHoveredCard('resources')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
                                            <LayersIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-white">Resources</div>
                                            <div className="text-xs text-gray-400">Infrastructure components</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.typeCounts.resources}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Total</div>
                                            </div>
                                        </div>
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-red-400 mb-1">{stats.resourceUnused}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Unused</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modules Card */}
                            <div
                                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
                                onMouseEnter={() => setHoveredCard('modules')}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
                                            <DatabaseIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-white">Modules</div>
                                            <div className="text-xs text-gray-400">Reusable components</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-purple-400 mb-1">{stats.typeCounts.modules}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Total</div>
                                            </div>
                                        </div>
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-red-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-red-400 mb-1">{stats.moduleUnused}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Unused</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dependencies Card */}
                            <div
                                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
                                            <NetworkIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-white">Dependencies</div>
                                            <div className="text-xs text-gray-400">Component relationships</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.totalDependencies}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Links</div>
                                            </div>
                                        </div>
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-cyan-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.avgDependencies}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Avg/Node</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Health Card */}
                            <div
                                className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
                                            <ShieldCheckIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-white">Health Status</div>
                                            <div className="text-xs text-gray-400">Infrastructure health</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-green-400 mb-1">{stats.healthyPercentage}%</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Healthy</div>
                                            </div>
                                        </div>
                                        <div className="relative p-4 bg-black/30 rounded-xl border border-gray-700/50 hover:border-green-500/30 transition-all group/stat overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="text-3xl font-bold text-green-400 mb-1">{stats.coverageScore}%</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">Coverage</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <LayersIcon className="w-5 h-5 text-cyan-400" />
                                    <div className="font-semibold text-white text-lg">Component Distribution</div>
                                </div>
                                <div className="h-64">
                                    <Doughnut data={distributionChartData} options={{ ...chartOptions, cutout: '65%' }} />
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <TrendingUpIcon className="w-5 h-5 text-cyan-400" />
                                    <div className="font-semibold text-white text-lg">Infrastructure Overview</div>
                                </div>
                                <div className="h-64">
                                    <Bar data={overviewChartData} options={barChartOptions} />
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                                    <div className="font-semibold text-white text-lg">Health Distribution</div>
                                </div>
                                <div className="h-64">
                                    <Pie data={healthChartData} options={chartOptions} />
                                </div>
                            </div>

                            <div className="group bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                                <div className="flex items-center gap-2 mb-6">
                                    <NetworkIcon className="w-5 h-5 text-cyan-400" />
                                    <div className="font-semibold text-white text-lg">Dependency Analysis</div>
                                </div>
                                <div className="h-64">
                                    <Radar data={dependencyChartData} options={radarChartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Health Status Panel */}
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="font-bold text-lg text-white">Health Status</div>
                            </div>
                            <div className="space-y-3">
                                <div className="group relative p-4 rounded-xl bg-black/20 border border-gray-700/50 hover:border-green-500/40 hover:bg-green-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            <span className="font-medium text-white">Healthy</span>
                                        </div>
                                        <div className="text-2xl font-bold text-green-400">{stats.stateCounts.healthy}</div>
                                    </div>
                                </div>

                                <div className="group relative p-4 rounded-xl bg-black/20 border border-gray-700/50 hover:border-red-500/40 hover:bg-red-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangleIcon className="w-5 h-5 text-red-400" />
                                            <span className="font-medium text-white">Unused</span>
                                        </div>
                                        <div className="text-2xl font-bold text-red-400">{stats.stateCounts.unused}</div>
                                    </div>
                                </div>

                                <div className="group relative p-4 rounded-xl bg-black/20 border border-gray-700/50 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ExternalLinkIcon className="w-5 h-5 text-cyan-400" />
                                            <span className="font-medium text-white">External</span>
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-400">{stats.stateCounts.external}</div>
                                    </div>
                                </div>

                                <div className="group relative p-4 rounded-xl bg-black/20 border border-gray-700/50 hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <BellIcon className="w-5 h-5 text-yellow-400" />
                                            <span className="font-medium text-white">Warnings</span>
                                        </div>
                                        <div className="text-2xl font-bold text-yellow-400">{stats.stateCounts.warning}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Type Breakdown Panel */}
                        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700/50">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                    <LayersIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="font-bold text-lg text-white">Type Breakdown</div>
                            </div>
                            <div className="space-y-3">
                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-green-500/30 hover:bg-green-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                                            <span className="text-sm font-medium text-gray-300">Resources</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.resources}</div>
                                    </div>
                                </div>

                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
                                            <span className="text-sm font-medium text-gray-300">Modules</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.modules}</div>
                                    </div>
                                </div>

                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <CodeIcon className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm font-medium text-gray-300">Variables</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.variables}</div>
                                    </div>
                                </div>

                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ArrowRightIcon className="w-4 h-4 text-cyan-400" />
                                            <span className="text-sm font-medium text-gray-300">Outputs</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.outputs}</div>
                                    </div>
                                </div>

                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-red-500/30 hover:bg-red-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <DatabaseIcon className="w-4 h-4 text-red-400" />
                                            <span className="text-sm font-medium text-gray-300">Data Sources</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.data_sources}</div>
                                    </div>
                                </div>

                                <div className="group relative p-3 rounded-xl bg-black/20 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <div className="relative flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <SettingsIcon className="w-4 h-4 text-cyan-400" />
                                            <span className="text-sm font-medium text-gray-300">Providers</span>
                                        </div>
                                        <div className="text-lg font-bold text-cyan-400">{stats.typeCounts.providers}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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