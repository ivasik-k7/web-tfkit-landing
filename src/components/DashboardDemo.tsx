import React, { useMemo, Component } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Pie, Radar } from 'react-chartjs-2';
import { NetworkIcon, ShieldCheckIcon, CheckCircleIcon, AlertTriangleIcon, ExternalLinkIcon, BellIcon, LayersIcon, CodeIcon, ArrowRightIcon, DatabaseIcon, SettingsIcon } from 'lucide-react';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement);
interface Node {
  id: string;
  label: string;
  type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider';
  state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning';
  dependencies_out: number;
  dependencies_in: number;
}
const sampleNodes: Node[] = [{
  id: '1',
  label: 'aws_vpc.main',
  type: 'resource',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 5
}, {
  id: '2',
  label: 'aws_subnet.public',
  type: 'resource',
  state: 'healthy',
  dependencies_out: 1,
  dependencies_in: 3
}, {
  id: '3',
  label: 'aws_instance.web',
  type: 'resource',
  state: 'warning',
  dependencies_out: 2,
  dependencies_in: 0
}, {
  id: '4',
  label: 'module.networking',
  type: 'module',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 8
}, {
  id: '5',
  label: 'var.region',
  type: 'variable',
  state: 'external',
  dependencies_out: 0,
  dependencies_in: 4
}, {
  id: '6',
  label: 'aws_security_group.unused',
  type: 'resource',
  state: 'unused',
  dependencies_out: 0,
  dependencies_in: 0
}, {
  id: '7',
  label: 'data.aws_ami.latest',
  type: 'data',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 2
}, {
  id: '8',
  label: 'output.vpc_id',
  type: 'output',
  state: 'healthy',
  dependencies_out: 1,
  dependencies_in: 0
}, {
  id: '9',
  label: 'module.database',
  type: 'module',
  state: 'healthy',
  dependencies_out: 2,
  dependencies_in: 4
}, {
  id: '10',
  label: 'var.environment',
  type: 'variable',
  state: 'external',
  dependencies_out: 0,
  dependencies_in: 6
}, {
  id: '11',
  label: 'aws_iam_role.app',
  type: 'resource',
  state: 'healthy',
  dependencies_out: 1,
  dependencies_in: 2
}, {
  id: '12',
  label: 'provider.aws',
  type: 'provider',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 12
}];
const sampleEdges = [{
  source: '2',
  target: '1'
}, {
  source: '3',
  target: '2'
}, {
  source: '3',
  target: '7'
}, {
  source: '4',
  target: '1'
}, {
  source: '4',
  target: '2'
}, {
  source: '8',
  target: '1'
}, {
  source: '9',
  target: '4'
}, {
  source: '11',
  target: '3'
}];
export function DashboardDemo() {
  const stats = useMemo(() => {
    const typeCounts = {
      resources: sampleNodes.filter(n => n.type === 'resource').length,
      modules: sampleNodes.filter(n => n.type === 'module').length,
      variables: sampleNodes.filter(n => n.type === 'variable').length,
      outputs: sampleNodes.filter(n => n.type === 'output').length,
      data_sources: sampleNodes.filter(n => n.type === 'data').length,
      providers: sampleNodes.filter(n => n.type === 'provider').length
    };
    const stateCounts = {
      healthy: sampleNodes.filter(n => n.state === 'healthy').length,
      unused: sampleNodes.filter(n => n.state === 'unused').length,
      external: sampleNodes.filter(n => n.state === 'external').length,
      leaf: sampleNodes.filter(n => n.state === 'leaf').length,
      orphan: sampleNodes.filter(n => n.state === 'orphan').length,
      warning: sampleNodes.filter(n => n.state === 'warning').length
    };
    const resourceUnused = sampleNodes.filter(n => n.type === 'resource' && n.state === 'unused').length;
    const moduleUnused = sampleNodes.filter(n => n.type === 'module' && n.state === 'unused').length;
    const totalDependencies = sampleEdges.length;
    const avgDependencies = sampleNodes.length > 0 ? (totalDependencies * 2 / sampleNodes.length).toFixed(1) : '0';
    const healthyPercentage = sampleNodes.length > 0 ? Math.round(stateCounts.healthy / sampleNodes.length * 100) : 0;
    const coverageScore = sampleNodes.length > 0 ? Math.round((sampleNodes.length - stateCounts.unused) / sampleNodes.length * 100) : 0;
    const nodeTypes: Array<'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider'> = ['resource', 'module', 'variable', 'output', 'data', 'provider'];
    const avgDependenciesByType = nodeTypes.map(type => {
      const nodesOfType = sampleNodes.filter(n => n.type === type);
      if (nodesOfType.length === 0) return 0;
      const totalDeps = nodesOfType.reduce((sum, node) => sum + node.dependencies_out + node.dependencies_in, 0);
      return parseFloat((totalDeps / nodesOfType.length).toFixed(1));
    });
    return {
      typeCounts,
      stateCounts,
      resourceUnused,
      moduleUnused,
      totalDependencies,
      avgDependencies,
      healthyPercentage,
      coverageScore,
      avgDependenciesByType
    };
  }, []);
  const chartColors = {
    success: '#10b981',
    accent_secondary: '#8b5cf6',
    warning: '#f59e0b',
    info: '#06b6d4',
    danger: '#ef4444',
    accent: '#06b6d4'
  };
  const distributionChartData = {
    labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
    datasets: [{
      data: [stats.typeCounts.resources, stats.typeCounts.modules, stats.typeCounts.variables, stats.typeCounts.outputs, stats.typeCounts.data_sources, stats.typeCounts.providers],
      backgroundColor: [chartColors.success, chartColors.accent_secondary, chartColors.warning, chartColors.info, chartColors.danger, chartColors.accent],
      borderWidth: 0,
      hoverOffset: 8
    }]
  };
  const overviewChartData = {
    labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
    datasets: [{
      data: [stats.typeCounts.resources, stats.typeCounts.modules, stats.typeCounts.variables, stats.typeCounts.outputs, stats.typeCounts.data_sources, stats.typeCounts.providers],
      backgroundColor: [chartColors.success, chartColors.accent_secondary, chartColors.warning, chartColors.info, chartColors.danger, chartColors.accent],
      borderWidth: 0,
      borderRadius: 6,
      borderSkipped: false
    }]
  };
  const healthChartData = {
    labels: ['Healthy', 'Unused', 'External', 'Leaf', 'Orphan', 'Warning'],
    datasets: [{
      data: [stats.stateCounts.healthy, stats.stateCounts.unused, stats.stateCounts.external, stats.stateCounts.leaf, stats.stateCounts.orphan, stats.stateCounts.warning],
      backgroundColor: [chartColors.success, chartColors.danger, chartColors.info, chartColors.success, chartColors.warning, chartColors.warning],
      borderWidth: 0
    }]
  };
  const dependencyChartData = {
    labels: ['Resources', 'Modules', 'Variables', 'Outputs', 'Data Sources', 'Providers'],
    datasets: [{
      label: 'Avg Dependencies per Node',
      data: stats.avgDependenciesByType,
      backgroundColor: 'rgba(6, 182, 212, 0.2)',
      borderColor: chartColors.accent,
      pointBackgroundColor: chartColors.accent,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: chartColors.accent
    }]
  };
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9ca3af',
          padding: 20,
          font: {
            size: 11
          }
        }
      }
    }
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        ticks: {
          color: '#9ca3af'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9ca3af'
        }
      }
    }
  };
  const radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        angleLines: {
          color: 'rgba(75, 85, 99, 0.2)'
        },
        pointLabels: {
          color: '#9ca3af'
        },
        ticks: {
          color: 'transparent',
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af'
        }
      }
    }
  };
  return <div className="w-full bg-gray-900 rounded-xl p-6 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Resource Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <div className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-lg">Resources</div>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Core infrastructure components and services
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">
                    {stats.typeCounts.resources}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Total
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">
                    {stats.resourceUnused}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Unused
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <div className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-lg">Modules</div>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Reusable infrastructure modules and components
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">
                    {stats.typeCounts.modules}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Total
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-purple-400">
                    {stats.moduleUnused}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Unused
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <NetworkIcon className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-lg">Dependencies</div>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Component relationships and connections
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">
                    {stats.totalDependencies}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Links
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">
                    {stats.avgDependencies}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Avg/Node
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <div className="font-semibold text-lg">Health Status</div>
              </div>
              <div className="text-gray-400 text-sm mb-4">
                Infrastructure health and usage analysis
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.healthyPercentage}%
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Healthy
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.coverageScore}%
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
                    Coverage
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LayersIcon className="w-5 h-5 text-cyan-400" />
                <div className="font-semibold">Component Distribution</div>
              </div>
              <div className="h-64">
                <Doughnut data={distributionChartData} options={{
                ...chartOptions,
                cutout: '65%'
              }} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <LayersIcon className="w-5 h-5 text-cyan-400" />
                <div className="font-semibold">Infrastructure Overview</div>
              </div>
              <div className="h-64">
                <Bar data={overviewChartData} options={barChartOptions} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="w-5 h-5 text-green-400" />
                <div className="font-semibold">Health Distribution</div>
              </div>
              <div className="h-64">
                <Pie data={healthChartData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheckIcon className="w-5 h-5 text-green-400" />
              <div className="font-semibold">Health Status</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Healthy</span>
                </div>
                <div className="text-xl font-bold text-green-400">
                  {stats.stateCounts.healthy}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="w-4 h-4" />
                  <span>Unused</span>
                </div>
                <div className="text-xl font-bold text-red-400">
                  {stats.stateCounts.unused}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <ExternalLinkIcon className="w-4 h-4" />
                  <span>External</span>
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  {stats.stateCounts.external}
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-4 h-4" />
                  <span>Warnings</span>
                </div>
                <div className="text-xl font-bold text-yellow-400">
                  {stats.stateCounts.warning}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <LayersIcon className="w-5 h-5 text-cyan-400" />
              <div className="font-semibold">Type Breakdown</div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 text-green-400" />
                  <span>Resources</span>
                </div>
                <div className="font-semibold text-cyan-400">
                  {stats.typeCounts.resources}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 text-purple-400" />
                  <span>Modules</span>
                </div>
                <div className="font-semibold text-cyan-400">
                  {stats.typeCounts.modules}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <CodeIcon className="w-4 h-4 text-yellow-400" />
                  <span>Variables</span>
                </div>
                <div className="font-semibold text-cyan-400">
                  {stats.typeCounts.variables}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="w-4 h-4 text-cyan-400" />
                  <span>Outputs</span>
                </div>
                <div className="font-semibold text-cyan-400">
                  {stats.typeCounts.outputs}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-700">
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
    </div>;
}