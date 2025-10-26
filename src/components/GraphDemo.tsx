import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Mock data - replace with your actual graph data
const mockGraphData = {
    nodes: [
        { id: 'vpc-1', label: 'aws_vpc.main', type: 'resource', state: 'healthy', dependencies_in: 0, dependencies_out: 3 },
        { id: 'subnet-1', label: 'aws_subnet.public', type: 'resource', state: 'healthy', dependencies_in: 1, dependencies_out: 2 },
        { id: 'subnet-2', label: 'aws_subnet.private', type: 'resource', state: 'healthy', dependencies_in: 1, dependencies_out: 1 },
        { id: 'sg-1', label: 'aws_security_group.web', type: 'resource', state: 'healthy', dependencies_in: 1, dependencies_out: 1 },
        { id: 'var-1', label: 'var.region', type: 'variable', state: 'external', dependencies_in: 0, dependencies_out: 2 },
        { id: 'out-1', label: 'output.vpc_id', type: 'output', state: 'leaf', dependencies_in: 1, dependencies_out: 0 },
        { id: 'mod-1', label: 'module.networking', type: 'module', state: 'healthy', dependencies_in: 2, dependencies_out: 2 },
        { id: 'data-1', label: 'data.aws_ami.latest', type: 'data', state: 'healthy', dependencies_in: 0, dependencies_out: 1 },
        { id: 'unused-1', label: 'aws_instance.old', type: 'resource', state: 'unused', dependencies_in: 0, dependencies_out: 0 },
        { id: 'orphan-1', label: 'aws_s3_bucket.logs', type: 'resource', state: 'orphan', dependencies_in: 0, dependencies_out: 0 },
    ],
    edges: [
        { source: 'vpc-1', target: 'subnet-1' },
        { source: 'vpc-1', target: 'subnet-2' },
        { source: 'vpc-1', target: 'sg-1' },
        { source: 'subnet-1', target: 'mod-1' },
        { source: 'subnet-2', target: 'mod-1' },
        { source: 'var-1', target: 'vpc-1' },
        { source: 'var-1', target: 'mod-1' },
        { source: 'sg-1', target: 'out-1' },
        { source: 'data-1', target: 'subnet-1' },
        { source: 'mod-1', target: 'sg-1' },
    ]
};

export function GraphDemo() {
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const [graphData] = useState(mockGraphData);
    const [physicsEnabled, setPhysicsEnabled] = useState(true);
    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });
    const [highlightedNodes, setHighlightedNodes] = useState(new Set());
    const [highlightedEdges, setHighlightedEdges] = useState(new Set());

    const simulationRef = useRef(null);
    const zoomRef = useRef(null);
    const animationTimerRef = useRef(null);

    // Theme colors
    const colors = {
        bgPrimary: '#0a0e1a',
        bgSecondary: '#0f1829',
        textPrimary: '#e2e8f0',
        textSecondary: '#94a3b8',
        accent: '#06b6d4',
        accentSecondary: '#8b5cf6',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        border: '#1e293b',
    };

    // Node configuration
    const nodeConfig = {
        resource: { color: colors.success, icon: '\uf1b3' },
        module: { color: colors.accentSecondary, icon: '\uf1b3' },
        variable: { color: colors.warning, icon: '\uf121' },
        output: { color: colors.accent, icon: '\uf061' },
        data: { color: colors.danger, icon: '\uf1c0' },
        provider: { color: colors.info, icon: '\uf013' }
    };

    // State configuration
    const stateConfig = {
        healthy: { stroke: colors.success, glow: colors.success + '40' },
        unused: { stroke: colors.danger, glow: colors.danger + '40' },
        external: { stroke: colors.info, glow: colors.info + '40' },
        leaf: { stroke: colors.success, glow: colors.success + '40' },
        orphan: { stroke: colors.warning, glow: colors.warning + '40' },
        warning: { stroke: colors.warning, glow: colors.warning + '40' }
    };

    // Calculate statistics
    const stats = {
        totalNodes: graphData.nodes.length,
        totalEdges: graphData.edges.length,
        stateCounts: graphData.nodes.reduce((acc, node) => {
            acc[node.state] = (acc[node.state] || 0) + 1;
            return acc;
        }, {}),
        components: calculateComponents()
    };

    function calculateComponents() {
        const visited = new Set();
        let components = 0;

        const adjacencyList = new Map();
        graphData.nodes.forEach(node => {
            adjacencyList.set(node.id, { in: [], out: [] });
        });

        graphData.edges.forEach(edge => {
            adjacencyList.get(edge.source)?.out.push(edge.target);
            adjacencyList.get(edge.target)?.in.push(edge.source);
        });

        function dfs(nodeId) {
            const stack = [nodeId];
            while (stack.length) {
                const current = stack.pop();
                if (!visited.has(current)) {
                    visited.add(current);
                    const neighbors = [...(adjacencyList.get(current)?.in || []), ...(adjacencyList.get(current)?.out || [])];
                    neighbors.forEach(n => !visited.has(n) && stack.push(n));
                }
            }
        }

        graphData.nodes.forEach(node => {
            if (!visited.has(node.id)) {
                dfs(node.id);
                components++;
            }
        });

        return components;
    }

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Clear previous
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Defs for patterns and markers
        const defs = svg.append('defs');

        // Grid pattern
        const gridSize = 50;
        defs.append('pattern')
            .attr('id', 'grid')
            .attr('width', gridSize)
            .attr('height', gridSize)
            .attr('patternUnits', 'userSpaceOnUse')
            .append('path')
            .attr('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`)
            .attr('fill', 'none')
            .attr('stroke', colors.textSecondary)
            .attr('stroke-opacity', 0.1)
            .attr('stroke-width', 1);

        svg.append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', 'url(#grid)');

        // Arrow markers
        Object.entries(nodeConfig).forEach(([type, config]) => {
            defs.append('marker')
                .attr('id', `arrow-${type}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 18)
                .attr('refY', 0)
                .attr('markerWidth', 8)
                .attr('markerHeight', 8)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .style('fill', config.color)
                .style('opacity', 0.7);
        });

        const g = svg.append('g');
        const graphG = g.append('g');

        // Zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.05, 8])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
        zoomRef.current = { zoom, svg };

        // Force simulation
        const simulation = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.edges)
                .id(d => d.id)
                .distance(120)
                .strength(0.2))
            .force('charge', d3.forceManyBody()
                .strength(d => {
                    const base = d.state === 'healthy' ? -400 : d.state === 'unused' ? -150 : -250;
                    return base * (1 + (d.dependencies_in + d.dependencies_out) * 0.1);
                })
                .distanceMax(400))
            .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
            .force('collision', d3.forceCollide()
                .radius(d => {
                    const base = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
                    return base + Math.min((d.dependencies_in + d.dependencies_out) * 0.6, 6);
                })
                .strength(0.8))
            .alphaDecay(0.0228)
            .velocityDecay(0.4);

        simulationRef.current = simulation;

        // Create links
        const link = graphG.append('g')
            .selectAll('line')
            .data(graphData.edges)
            .join('line')
            .attr('class', 'link')
            .attr('stroke', colors.textSecondary)
            .attr('stroke-opacity', 0.3)
            .attr('stroke-width', 1.5)
            .attr('marker-end', d => {
                const target = graphData.nodes.find(n => n.id === d.target);
                return target ? `url(#arrow-${target.type})` : '';
            });

        // Create nodes
        const node = graphG.append('g')
            .selectAll('g')
            .data(graphData.nodes)
            .join('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))
            .on('mouseover', (event, d) => handleMouseOver(event, d))
            .on('mouseout', handleMouseOut)
            .on('click', (event, d) => handleClick(event, d));

        // Node circles
        node.append('circle')
            .attr('r', d => {
                const base = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
                return base + Math.min((d.dependencies_in + d.dependencies_out) * 0.6, 6);
            })
            .style('fill', d => nodeConfig[d.type]?.color || '#666')
            .style('stroke', d => stateConfig[d.state]?.stroke || nodeConfig[d.type]?.color)
            .style('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('filter', d => `drop-shadow(0 0 8px ${stateConfig[d.state]?.glow})`);

        // Node labels
        node.append('text')
            .attr('dx', d => {
                const base = d.type === 'module' ? 14 : d.type === 'resource' ? 11 : 9;
                return base + Math.min((d.dependencies_in + d.dependencies_out) * 0.6, 6) + 4;
            })
            .attr('dy', 4)
            .text(d => {
                const maxLength = d.type === 'module' ? 25 : 18;
                return d.label.length > maxLength ? d.label.substring(0, maxLength) + '...' : d.label;
            })
            .style('fill', colors.textPrimary)
            .style('font-size', d => d.type === 'module' ? '12px' : '11px')
            .style('font-weight', '500')
            .style('pointer-events', 'none')
            .style('text-shadow', `0 1px 4px ${colors.bgPrimary}`);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
        }

        function handleMouseOver(event, d) {
            setTooltip({
                show: true,
                content: d,
                x: event.pageX + 15,
                y: event.pageY + 15
            });
        }

        function handleMouseOut() {
            setTooltip({ show: false, content: '', x: 0, y: 0 });
        }

        function handleClick(event, d) {
            event.stopPropagation();

            if (highlightedNodes.has(d.id)) {
                setHighlightedNodes(new Set());
                setHighlightedEdges(new Set());
                return;
            }

            const newHighlighted = new Set([d.id]);
            const newEdges = new Set();

            graphData.edges.forEach(edge => {
                if (edge.source.id === d.id || edge.source === d.id) {
                    const targetId = edge.target.id || edge.target;
                    newHighlighted.add(targetId);
                    newEdges.add(`${d.id}->${targetId}`);
                }
                if (edge.target.id === d.id || edge.target === d.id) {
                    const sourceId = edge.source.id || edge.source;
                    newHighlighted.add(sourceId);
                    newEdges.add(`${sourceId}->${d.id}`);
                }
            });

            setHighlightedNodes(newHighlighted);
            setHighlightedEdges(newEdges);
        }

        // Apply highlights
        if (highlightedNodes.size > 0) {
            node.transition().duration(300)
                .style('opacity', d => highlightedNodes.has(d.id) ? 1 : 0.2);

            link.transition().duration(300)
                .style('stroke-opacity', d => {
                    const sourceId = d.source.id || d.source;
                    const targetId = d.target.id || d.target;
                    return highlightedEdges.has(`${sourceId}->${targetId}`) ? 1 : 0.1;
                });
        } else {
            node.style('opacity', 1);
            link.style('stroke-opacity', 0.3);
        }

        return () => {
            simulation.stop();
        };
    }, [graphData, highlightedNodes, highlightedEdges]);

    const handleZoomIn = () => {
        if (zoomRef.current) {
            zoomRef.current.svg.transition().duration(300)
                .call(zoomRef.current.zoom.scaleBy, 1.2);
        }
    };

    const handleZoomOut = () => {
        if (zoomRef.current) {
            zoomRef.current.svg.transition().duration(300)
                .call(zoomRef.current.zoom.scaleBy, 1 / 1.2);
        }
    };

    const handleResetZoom = () => {
        if (zoomRef.current) {
            zoomRef.current.svg.transition().duration(500)
                .call(zoomRef.current.zoom.transform, d3.zoomIdentity);
        }
    };

    const handleTogglePhysics = () => {
        setPhysicsEnabled(prev => {
            const newState = !prev;
            if (simulationRef.current) {
                if (newState) {
                    simulationRef.current.alpha(0.3).restart();
                } else {
                    simulationRef.current.stop();
                }
            }
            return newState;
        });
    };

    const handleReset = () => {
        handleResetZoom();
        setHighlightedNodes(new Set());
        setHighlightedEdges(new Set());
        if (!physicsEnabled && simulationRef.current) {
            simulationRef.current.alpha(0.3).restart();
            setPhysicsEnabled(true);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Animated background effects */}
            <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Graph Container */}
            <div ref={containerRef} className="w-full h-full">
                <svg ref={svgRef} className="w-full h-full" />
            </div>

            {/* Nexus HUD Panel */}
            <div className="absolute top-5 left-5 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl min-w-[260px]">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-cyan-500/30 relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div className="text-xl font-bold text-white tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>DEPENDENCIES</div>
                    <div className="absolute bottom-0 left-0 w-2/5 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
                </div>

                <div className="space-y-3 mb-5">
                    {[
                        { label: 'NODES', value: stats.totalNodes },
                        { label: 'DEPENDENCIES', value: stats.totalEdges },
                        { label: 'COMPONENTS', value: stats.components }
                    ].map((stat, i) => (
                        <div key={i} className="flex justify-between items-center px-3 py-2 bg-black/15 rounded-lg border border-gray-700/30 hover:bg-black/25 hover:border-cyan-500/30 transition-all hover:translate-x-1">
                            <span className="text-gray-400 font-medium text-sm">{stat.label}</span>
                            <span className="text-white font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-5 border-t border-cyan-500/30">
                    {Object.entries(stats.stateCounts).map(([state, count]) => (
                        <button
                            key={state}
                            onClick={() => {
                                const filtered = new Set(graphData.nodes.filter(n => n.state === state).map(n => n.id));
                                setHighlightedNodes(filtered);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg border ${
                                state === 'healthy' || state === 'leaf' ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' :
                                    state === 'unused' ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' :
                                        state === 'external' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20' :
                                            state === 'orphan' || state === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' :
                                                'bg-gray-500/10 text-gray-400 border-gray-500/30'
                            }`}
                        >
                            {state}: {count}
                        </button>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="absolute top-5 right-5 bg-gray-900/90 border border-gray-700 rounded-xl p-4 backdrop-blur-xl shadow-2xl min-w-[180px]">
                <div className="text-white font-semibold mb-3 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Resource Types
                </div>
                <div className="space-y-2 text-sm">
                    {[
                        { label: 'Resources', color: colors.success },
                        { label: 'Modules', color: colors.accentSecondary },
                        { label: 'Variables', color: colors.warning },
                        { label: 'Outputs', color: colors.accent },
                        { label: 'Data Sources', color: colors.danger },
                        { label: 'Providers', color: colors.info }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-300">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-gray-700 rounded-xl px-5 py-3 flex gap-2 backdrop-blur-xl shadow-2xl">
                {[
                    { label: 'Reset', icon: '⊕', onClick: handleReset },
                    { label: physicsEnabled ? 'Physics' : 'Physics', icon: '⚡', onClick: handleTogglePhysics },
                    { label: 'Center', icon: '◎', onClick: handleResetZoom }
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 hover:text-black transition-all hover:-translate-y-0.5 flex items-center gap-2 text-sm font-medium"
                    >
                        <span>{btn.icon}</span>
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-5 right-5 bg-gray-900/90 border border-gray-700 rounded-xl p-3 flex flex-col gap-2 backdrop-blur-xl shadow-2xl">
                {[
                    { icon: '+', onClick: handleZoomIn },
                    { icon: '−', onClick: handleZoomOut },
                    { icon: '⤢', onClick: handleResetZoom }
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        className="w-9 h-9 bg-gray-800 border border-gray-700 text-white rounded-lg hover:bg-cyan-500 hover:border-cyan-500 hover:text-black transition-all hover:-translate-y-0.5 flex items-center justify-center text-lg font-bold"
                    >
                        {btn.icon}
                    </button>
                ))}
            </div>

            {/* Tooltip */}
            {tooltip.show && (
                <div
                    className="fixed bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-cyan-500/50 rounded-xl p-4 backdrop-blur-xl shadow-2xl text-sm pointer-events-none z-50 max-w-xs"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    <div className="font-bold text-cyan-400 mb-2 pb-2 border-b border-cyan-500/30" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {tooltip.content.label}
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 border ${
                        tooltip.content.state === 'healthy' || tooltip.content.state === 'leaf' ? 'bg-green-500/20 text-green-400 border-green-500/40' :
                            tooltip.content.state === 'unused' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                                tooltip.content.state === 'external' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    }`}>
                        {tooltip.content.state}
                    </div>
                    <div className="space-y-2 text-gray-300">
                        <div className="flex justify-between gap-4 border-t border-gray-700/50 pt-2">
                            <span className="text-gray-400">Type:</span>
                            <span className="font-semibold">{tooltip.content.type}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">In Dependencies:</span>
                            <span className="font-semibold">{tooltip.content.dependencies_in}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400">Out Dependencies:</span>
                            <span className="font-semibold">{tooltip.content.dependencies_out}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Watermark */}
            <div className="absolute bottom-3 left-5 text-xs text-gray-600 select-none">
                tfkit (v1.0.0) | <a href="https://github.com/ivasik-k7/tfkit" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-cyan-400 transition-colors">tfkit.com</a>
            </div>
        </div>
    );
}