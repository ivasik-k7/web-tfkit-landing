import React, { useMemo, useState, Component } from 'react';
import { SearchIcon, LayersIcon, NetworkIcon, DatabaseIcon, CodeIcon, ArrowRightIcon, SettingsIcon, CheckCircleIcon, BanIcon, ExternalLinkIcon, LeafIcon, UnlinkIcon, AlertTriangleIcon, ArrowUpIcon, ArrowDownIcon, SortAscIcon, FilterIcon, XIcon } from 'lucide-react';
interface Node {
  id: string;
  label: string;
  type: string;
  subtype: string;
  state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning';
  state_reason?: string;
  dependencies_out: number;
  dependencies_in: number;
}
const sampleNodes: Node[] = [{
  id: '1',
  label: 'aws_vpc.main',
  type: 'resource',
  subtype: 'aws_vpc',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 5
}, {
  id: '2',
  label: 'aws_subnet.public',
  type: 'resource',
  subtype: 'aws_subnet',
  state: 'healthy',
  dependencies_out: 1,
  dependencies_in: 3
}, {
  id: '3',
  label: 'aws_instance.web',
  type: 'resource',
  subtype: 'aws_instance',
  state: 'warning',
  state_reason: 'Instance type t2.micro may be undersized for production',
  dependencies_out: 2,
  dependencies_in: 0
}, {
  id: '4',
  label: 'module.networking',
  type: 'module',
  subtype: 'custom',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 8
}, {
  id: '5',
  label: 'var.region',
  type: 'variable',
  subtype: 'string',
  state: 'external',
  dependencies_out: 0,
  dependencies_in: 4
}, {
  id: '6',
  label: 'aws_security_group.unused',
  type: 'resource',
  subtype: 'aws_security_group',
  state: 'unused',
  state_reason: 'No resources reference this security group',
  dependencies_out: 0,
  dependencies_in: 0
}, {
  id: '7',
  label: 'data.aws_ami.latest',
  type: 'data',
  subtype: 'aws_ami',
  state: 'healthy',
  dependencies_out: 0,
  dependencies_in: 2
}, {
  id: '8',
  label: 'output.vpc_id',
  type: 'output',
  subtype: 'string',
  state: 'healthy',
  dependencies_out: 1,
  dependencies_in: 0
}];
const nodeIcons = {
  resource: LayersIcon,
  module: NetworkIcon,
  variable: CodeIcon,
  output: ArrowRightIcon,
  data: DatabaseIcon,
  provider: SettingsIcon
};
const stateConfig = {
  healthy: {
    icon: CheckCircleIcon,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/30'
  },
  unused: {
    icon: BanIcon,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30'
  },
  external: {
    icon: ExternalLinkIcon,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30'
  },
  leaf: {
    icon: LeafIcon,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/30'
  },
  orphan: {
    icon: UnlinkIcon,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30'
  },
  warning: {
    icon: AlertTriangleIcon,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30'
  }
};
export function ClassicLayoutDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'dependencies'>('name');
  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    sampleNodes.forEach(node => {
      counts[node.state] = (counts[node.state] || 0) + 1;
    });
    return counts;
  }, []);
  const filteredAndSortedNodes = useMemo(() => {
    let nodes = [...sampleNodes];
    if (stateFilter) {
      nodes = nodes.filter(node => node.state === stateFilter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(node => node.label.toLowerCase().includes(query) || node.type.toLowerCase().includes(query) || node.subtype.toLowerCase().includes(query) || node.state.toLowerCase().includes(query));
    }
    nodes.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.label.localeCompare(b.label);
        case 'type':
          return a.type.localeCompare(b.type) || a.subtype.localeCompare(b.subtype);
        case 'dependencies':
          return b.dependencies_in + b.dependencies_out - (a.dependencies_in + a.dependencies_out);
        default:
          return 0;
      }
    });
    return nodes;
  }, [searchQuery, sortBy, stateFilter]);
  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('name');
    setStateFilter(null);
  };
  const hasActiveFilters = searchQuery || sortBy !== 'name' || stateFilter;
  return <div className="w-full bg-gray-900 rounded-xl p-6 text-white">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {sampleNodes.length}
          </div>
          <div className="text-xs text-gray-400 uppercase font-semibold">
            Components
          </div>
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {Object.entries(stateCounts).map(([state, count]) => <button key={state} onClick={() => setStateFilter(stateFilter === state ? null : state)} className={`text-xs px-2 py-1 rounded ${stateConfig[state as keyof typeof stateConfig].bg} ${stateConfig[state as keyof typeof stateConfig].color} ${stateConfig[state as keyof typeof stateConfig].border} border hover:scale-105 transition-transform`}>
                {state}: {count}
              </button>)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-cyan-400 mb-1">24</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">
            Dependencies
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-cyan-400 mb-1">3</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">
            Connected Groups
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
          <div className="text-3xl font-bold text-cyan-400 mb-1">6</div>
          <div className="text-xs text-gray-400 uppercase font-semibold">
            Resource Types
          </div>
        </div>
      </div>
      {/* Controls Panel */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6">
        <div className="p-4 border-b border-gray-700 flex flex-wrap justify-between items-center gap-3">
          <div className="font-semibold text-gray-200">Components</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSortBy('name')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${sortBy === 'name' ? 'bg-cyan-500 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700 border border-gray-600'}`}>
              <SortAscIcon className="w-4 h-4" />
              Name
            </button>
            <button onClick={() => setSortBy('type')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${sortBy === 'type' ? 'bg-cyan-500 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700 border border-gray-600'}`}>
              <LayersIcon className="w-4 h-4" />
              Type
            </button>
            <button onClick={() => setSortBy('dependencies')} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${sortBy === 'dependencies' ? 'bg-cyan-500 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-700 border border-gray-600'}`}>
              <NetworkIcon className="w-4 h-4" />
              Dependencies
            </button>
            {hasActiveFilters && <button onClick={resetFilters} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-900 text-gray-400 hover:bg-gray-700 border border-gray-600 transition-all flex items-center gap-2">
                <XIcon className="w-4 h-4" />
                Reset
              </button>}
          </div>
        </div>
        {/* Active Filters Info */}
        {hasActiveFilters && <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
            <div className="flex flex-wrap gap-2">
              {searchQuery && <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                  Search: "{searchQuery}"
                </span>}
              {stateFilter && <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm border border-purple-500/30">
                  State: {stateFilter}
                </span>}
              {sortBy !== 'name' && <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm border border-cyan-500/30">
                  Sorted by: {sortBy}
                </span>}
            </div>
          </div>}
        {/* Search Box */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search components by name, type, or state..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors" />
          </div>
        </div>
        {/* Component Grid */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredAndSortedNodes.length === 0 ? <div className="text-center py-12 text-gray-400">
              <FilterIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">
                No components found
              </h3>
              <p className="text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAndSortedNodes.map(node => {
            const NodeIcon = nodeIcons[node.type as keyof typeof nodeIcons] || LayersIcon;
            const StateIcon = stateConfig[node.state].icon;
            const isLeaf = node.dependencies_out === 0 && node.dependencies_in > 0;
            const isHub = node.dependencies_out > 5 || node.dependencies_in > 5;
            return <div key={node.id} className={`bg-gray-900 rounded-lg p-5 border-l-4 ${node.state === 'unused' ? 'border-red-400' : node.state === 'warning' ? 'border-yellow-400' : node.state === 'external' ? 'border-cyan-400' : 'border-green-400'} hover:border-cyan-500 transition-all hover:transform hover:-translate-y-1 border border-gray-700`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0">
                        <NodeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate mb-1" title={node.label}>
                          {node.label}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">
                          {node.type} • {node.subtype}
                        </div>
                        <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${stateConfig[node.state].bg} ${stateConfig[node.state].color} ${stateConfig[node.state].border} border`}>
                          <StateIcon className="w-3 h-3" />
                          {node.state.toUpperCase()}
                        </div>
                        {(isLeaf || isHub) && <div className="flex gap-2 mt-2">
                            {isLeaf && <span className="text-xs px-2 py-1 rounded bg-green-400/10 text-green-400 border border-green-400/30 font-semibold">
                                <LeafIcon className="w-3 h-3 inline mr-1" />
                                LEAF
                              </span>}
                            {isHub && <span className="text-xs px-2 py-1 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 font-semibold">
                                <NetworkIcon className="w-3 h-3 inline mr-1" />
                                HUB
                              </span>}
                          </div>}
                      </div>
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ArrowUpIcon className="w-4 h-4" />
                        <span>Uses:</span>
                        <span className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                          {node.dependencies_out}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <ArrowDownIcon className="w-4 h-4" />
                        <span>Used by:</span>
                        <span className="bg-purple-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                          {node.dependencies_in}
                        </span>
                      </div>
                    </div>
                    {node.state_reason && <div className="mt-3 text-xs text-gray-400 italic">
                        {node.state_reason}
                      </div>}
                  </div>;
          })}
            </div>}
        </div>
      </div>
    </div>;
}