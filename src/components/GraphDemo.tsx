import React, { useEffect, useMemo, useState, useRef } from 'react';
import * as d3 from 'd3';
import { CodeIcon, ArrowRightIcon, DatabaseIcon, SettingsIcon, NetworkIcon, CheckCircleIcon, BanIcon, ExternalLinkIcon, LeafIcon, UnlinkIcon, AlertTriangleIcon, LayersIcon, MaximizeIcon, CrosshairIcon, ZapIcon, SparklesIcon, TargetIcon, BoxIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
interface Node {
  id: string;
  label: string;
  type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider';
  state: 'healthy' | 'unused' | 'external' | 'leaf' | 'orphan' | 'warning';
  dependencies_out: number;
  dependencies_in: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}
interface Edge {
  source: string | Node;
  target: string | Node;
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
const sampleEdges: Edge[] = [{
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
const nodeConfig = {
  resource: {
    color: '#10b981',
    icon: BoxIcon
  },
  module: {
    color: '#8b5cf6',
    icon: BoxIcon
  },
  variable: {
    color: '#f59e0b',
    icon: CodeIcon
  },
  output: {
    color: '#06b6d4',
    icon: ArrowRightIcon
  },
  data: {
    color: '#ef4444',
    icon: DatabaseIcon
  },
  provider: {
    color: '#06b6d4',
    icon: SettingsIcon
  }
};
const stateConfig = {
  healthy: {
    stroke: '#10b981',
    glow: '#10b98140'
  },
  unused: {
    stroke: '#ef4444',
    glow: '#ef444440'
  },
  external: {
    stroke: '#06b6d4',
    glow: '#06b6d440'
  },
  leaf: {
    stroke: '#10b981',
    glow: '#10b98140'
  },
  orphan: {
    stroke: '#f59e0b',
    glow: '#f59e0b40'
  },
  warning: {
    stroke: '#f59e0b',
    glow: '#f59e0b40'
  }
};
export function GraphDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<Node, Edge> | null>(null);
  const stats = useMemo(() => {
    const stateCounts: Record<string, number> = {};
    sampleNodes.forEach(node => {
      stateCounts[node.state] = (stateCounts[node.state] || 0) + 1;
    });
    const nodeMap = new Map<string, Node>();
    const adjacencyList = new Map<string, {
      in: string[];
      out: string[];
    }>();
    sampleNodes.forEach(node => {
      nodeMap.set(node.id, node);
      adjacencyList.set(node.id, {
        in: [],
        out: []
      });
    });
    sampleEdges.forEach(edge => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
      adjacencyList.get(sourceId)?.out.push(targetId);
      adjacencyList.get(targetId)?.in.push(sourceId);
    });
    const visited = new Set<string>();
    let components = 0;
    const dfs = (nodeId: string) => {
      const stack = [nodeId];
      while (stack.length) {
        const current = stack.pop()!;
        if (!visited.has(current)) {
          visited.add(current);
          const neighbors = [...(adjacencyList.get(current)?.in || []), ...(adjacencyList.get(current)?.out || [])];
          neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) stack.push(neighbor);
          });
        }
      }
    };
    sampleNodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id);
        components++;
      }
    });
    return {
      totalNodes: sampleNodes.length,
      totalEdges: sampleEdges.length,
      components,
      stateCounts
    };
  }, []);
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    d3.select(svgRef.current).selectAll('*').remove();
    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);
    const defs = svg.append('defs');
    // Grid pattern
    const gridSize = 50;
    defs.append('pattern').attr('id', 'grid').attr('width', gridSize).attr('height', gridSize).attr('patternUnits', 'userSpaceOnUse').append('path').attr('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`).attr('fill', 'none').attr('stroke', '#9ca3af').attr('stroke-opacity', 0.1).attr('stroke-width', 1);
    svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'url(#grid)');
    // Glow filters for nodes
    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    // Arrow markers
    Object.entries(nodeConfig).forEach(([type, config]) => {
      defs.append('marker').attr('id', `arrow-${type}`).attr('viewBox', '0 -5 10 10').attr('refX', 18).attr('refY', 0).attr('markerWidth', 8).attr('markerHeight', 8).attr('orient', 'auto').append('path').attr('d', 'M0,-5L10,0L0,5').style('fill', config.color).style('opacity', 0.7);
    });
    const g = svg.append('g');
    const graphG = g.append('g');
    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.05, 8]).on('zoom', event => {
      g.attr('transform', event.transform.toString());
    });
    svg.call(zoom);
    // Create copies of data
    const nodes = sampleNodes.map(d => ({
      ...d
    }));
    const edges = sampleEdges.map(d => ({
      ...d
    }));
    // Create simulation
    const simulation = d3.forceSimulation(nodes).force('link', d3.forceLink(edges).id((d: any) => d.id).distance(100).strength(0.2)).force('charge', d3.forceManyBody().strength(-400)).force('center', d3.forceCenter(width / 2, height / 2).strength(0.1)).force('collision', d3.forceCollide().radius(20));
    simulationRef.current = simulation;
    // Create links
    const link = graphG.append('g').selectAll('line').data(edges).join('line').attr('class', 'link').attr('stroke', '#9ca3af').attr('stroke-opacity', 0.3).attr('stroke-width', 1.5).attr('marker-end', (d: any) => {
      const target = nodes.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
      return target ? `url(#arrow-${target.type})` : '';
    });
    // Create nodes
    const node = graphG.append('g').selectAll('g').data(nodes).join('g').attr('class', 'node').style('cursor', 'pointer').on('mouseenter', function (event, d) {
      if (animationsEnabled) {
        d3.select(this).select('circle').transition().duration(200).attr('r', (d: any) => {
          const baseRadius = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
          const depCount = d.dependencies_out + d.dependencies_in;
          return baseRadius + Math.min(depCount * 0.6, 6) + 3;
        }).style('filter', 'url(#glow)');
      }
    }).on('mouseleave', function (event, d) {
      if (animationsEnabled) {
        d3.select(this).select('circle').transition().duration(200).attr('r', (d: any) => {
          const baseRadius = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
          const depCount = d.dependencies_out + d.dependencies_in;
          return baseRadius + Math.min(depCount * 0.6, 6);
        }).style('filter', (d: any) => `drop-shadow(0 0 8px ${stateConfig[d.state].glow})`);
      }
    }).on('click', function (event, d) {
      setHighlightedNode(highlightedNode === d.id ? null : d.id);
    }).call(d3.drag<any, Node>().on('start', (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }).on('drag', (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    }).on('end', (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
    }));
    node.append('circle').attr('r', d => {
      const baseRadius = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
      const depCount = d.dependencies_out + d.dependencies_in;
      return baseRadius + Math.min(depCount * 0.6, 6);
    }).style('fill', d => nodeConfig[d.type].color).style('stroke', d => stateConfig[d.state].stroke).style('stroke-width', 2).style('filter', d => `drop-shadow(0 0 8px ${stateConfig[d.state].glow})`);
    // Add pulse animation to nodes with warnings
    if (animationsEnabled) {
      node.filter((d: any) => d.state === 'warning' || d.state === 'unused').select('circle').style('animation', 'pulse 2s ease-in-out infinite');
    }
    node.append('text').attr('dx', d => {
      const baseRadius = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
      const depCount = d.dependencies_out + d.dependencies_in;
      return baseRadius + Math.min(depCount * 0.6, 6) + 4;
    }).attr('dy', 4).text(d => {
      const maxLength = d.type === 'module' ? 25 : 18;
      return d.label.length > maxLength ? d.label.substring(0, maxLength) + '...' : d.label;
    }).style('fill', '#fff').style('font-size', d => d.type === 'module' ? '12px' : '11px').style('font-weight', '500').style('pointer-events', 'none').style('text-shadow', '0 1px 4px #000');
    simulation.on('tick', () => {
      link.attr('x1', (d: any) => d.source.x).attr('y1', (d: any) => d.source.y).attr('x2', (d: any) => d.target.x).attr('y2', (d: any) => d.target.y);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
    // Zoom controls
    const zoomIn = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1.2);
    };
    const zoomOut = () => {
      svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.2);
    };
    const resetZoom = () => {
      svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    };
    const centerGraph = () => {
      const transform = d3.zoomIdentity.translate(width / 2, height / 2).scale(1).translate(-width / 2, -height / 2);
      svg.transition().duration(500).call(zoom.transform, transform);
    };
    (window as any).graphZoomIn = zoomIn;
    (window as any).graphZoomOut = zoomOut;
    (window as any).graphResetZoom = resetZoom;
    (window as any).graphCenter = centerGraph;
    return () => {
      simulation.stop();
    };
  }, [animationsEnabled, highlightedNode]);
  const togglePhysics = () => {
    setPhysicsEnabled(!physicsEnabled);
    if (simulationRef.current) {
      if (!physicsEnabled) {
        simulationRef.current.alpha(0.3).restart();
      } else {
        simulationRef.current.stop();
      }
    }
  };
  return <div ref={containerRef} className="relative w-full h-[600px] bg-gray-900 rounded-xl overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      {/* HUD Panel */}
      <div className="absolute top-5 left-5 bg-gray-800/90 backdrop-blur-md border border-cyan-500/60 rounded-2xl p-6 min-w-[260px]">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-cyan-500/30">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <NetworkIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-xl font-bold text-white">DEPENDENCIES</div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 font-medium">NODES</span>
            <span className="text-xl font-bold text-cyan-400">
              {stats.totalNodes}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 font-medium">DEPENDENCIES</span>
            <span className="text-xl font-bold text-cyan-400">
              {stats.totalEdges}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
            <span className="text-gray-400 font-medium">COMPONENTS</span>
            <span className="text-xl font-bold text-cyan-400">
              {stats.components}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-cyan-500/30">
          {Object.entries(stats.stateCounts).map(([state, count]) => <div key={state} className={`px-3 py-2 rounded-lg text-xs font-semibold text-center cursor-pointer transition-all border ${state === 'healthy' ? 'bg-green-400/10 text-green-400 border-green-400/40' : state === 'unused' ? 'bg-red-400/10 text-red-400 border-red-400/40' : state === 'external' ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/40' : state === 'warning' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/40' : 'bg-gray-400/10 text-gray-400 border-gray-400/40'}`}>
              {state}: {count}
            </div>)}
        </div>
      </div>
      {/* Legend */}
      <div className="absolute top-5 right-5 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 min-w-[180px]">
        <div className="flex items-center gap-2 text-white font-semibold mb-3 text-sm">
          <LayersIcon className="w-4 h-4" />
          Resource Types
        </div>
        <div className="space-y-2">
          {Object.entries(nodeConfig).map(([type, config]) => <div key={type} className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-2.5 h-2.5 rounded-full" style={{
            backgroundColor: config.color
          }} />
              <span className="capitalize">{type}s</span>
            </div>)}
        </div>
      </div>
      {/* Controls */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl px-5 py-3 flex gap-2">
        <button onClick={() => (window as any).graphResetZoom?.()} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all text-sm font-medium flex items-center gap-2">
          <CrosshairIcon className="w-4 h-4" />
          Reset
        </button>
        <button onClick={togglePhysics} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all text-sm font-medium flex items-center gap-2">
          {physicsEnabled ? <ZapIcon className="w-4 h-4" /> : <ZapIcon className="w-4 h-4 opacity-50" />}
          Physics
        </button>
        <button onClick={() => (window as any).graphCenter?.()} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all text-sm font-medium flex items-center gap-2">
          <TargetIcon className="w-4 h-4" />
          Center
        </button>
        <button onClick={() => setAnimationsEnabled(!animationsEnabled)} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all text-sm font-medium flex items-center gap-2">
          <SparklesIcon className="w-4 h-4" />
          Animations
        </button>
      </div>
      {/* Scale Controls */}
      <div className="absolute bottom-5 right-5 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-3 flex flex-col gap-2">
        <button onClick={() => (window as any).graphZoomIn?.()} className="w-9 h-9 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all flex items-center justify-center">
          <ZoomInIcon className="w-5 h-5" />
        </button>
        <button onClick={() => (window as any).graphZoomOut?.()} className="w-9 h-9 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all flex items-center justify-center">
          <ZoomOutIcon className="w-5 h-5" />
        </button>
        <button onClick={() => (window as any).graphResetZoom?.()} className="w-9 h-9 bg-gray-900 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all flex items-center justify-center">
          <MaximizeIcon className="w-5 h-5" />
        </button>
      </div>
    </div>;
}