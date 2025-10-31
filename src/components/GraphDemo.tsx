import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type GraphNode = {
    id: string;
    label: string;
    type: 'resource' | 'module' | 'variable' | 'output' | 'data' | 'provider' | 'local' | 'terraform';
    subtype?: string;
    state?: 'external_data' | 'integrated' | 'active' | 'input' | 'orphaned' | 'configuration' | 'unused' | 'incomplete' | string;
    state_reason?: string;
    dependencies_in?: number;
    dependencies_out?: number;
    details?: Record<string, unknown>;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
};

type GraphEdge = {
    source: string | GraphNode;
    target: string | GraphNode;
    type?: string;
    strength?: number;
};

type GraphData = {
    nodes: GraphNode[];
    edges: GraphEdge[];
};

// ============================================================================
// SAMPLE DATA
// ============================================================================

const SAMPLE_DATA: GraphData = {
    nodes: [
        {
            id: '1',
            label: 'aws_vpc.main',
            type: 'resource',
            state: 'active',
            dependencies_in: 5,
            dependencies_out: 0,
            details: { provider: 'aws', resource_type: 'vpc', file: 'main.tf', line: 12 }
        },
        {
            id: '2',
            label: 'aws_subnet.public_1',
            type: 'resource',
            state: 'active',
            dependencies_in: 3,
            dependencies_out: 1,
            details: { provider: 'aws', resource_type: 'subnet', file: 'network.tf', line: 45 }
        },
        {
            id: '3',
            label: 'aws_subnet.public_2',
            type: 'resource',
            state: 'active',
            dependencies_in: 3,
            dependencies_out: 1,
            details: { provider: 'aws', resource_type: 'subnet', file: 'network.tf', line: 67 }
        },
        {
            id: '4',
            label: 'aws_instance.web',
            type: 'resource',
            state: 'active',
            dependencies_in: 1,
            dependencies_out: 3,
            details: { provider: 'aws', resource_type: 'instance', file: 'compute.tf', line: 23 }
        },
        {
            id: '5',
            label: 'module.networking',
            type: 'module',
            state: 'integrated',
            dependencies_in: 8,
            dependencies_out: 2,
            details: { file: 'modules.tf', line: 5 }
        },
        {
            id: '6',
            label: 'var.region',
            type: 'variable',
            state: 'external_data',
            dependencies_in: 4,
            dependencies_out: 0,
            details: { file: 'variables.tf', line: 1 }
        },
        {
            id: '7',
            label: 'var.environment',
            type: 'variable',
            state: 'external_data',
            dependencies_in: 6,
            dependencies_out: 0,
            details: { file: 'variables.tf', line: 8 }
        },
        {
            id: '8',
            label: 'aws_security_group.web',
            type: 'resource',
            state: 'active',
            dependencies_in: 2,
            dependencies_out: 2,
            details: { provider: 'aws', resource_type: 'security_group', file: 'security.tf', line: 15 }
        },
        {
            id: '9',
            label: 'aws_security_group.unused',
            type: 'resource',
            state: 'unused',
            dependencies_in: 0,
            dependencies_out: 0,
            details: { provider: 'aws', resource_type: 'security_group', file: 'security.tf', line: 89 }
        },
        {
            id: '10',
            label: 'data.aws_ami.latest',
            type: 'data',
            state: 'external_data',
            dependencies_in: 2,
            dependencies_out: 0,
            details: { provider: 'aws', resource_type: 'ami', file: 'data.tf', line: 3 }
        },
        {
            id: '11',
            label: 'output.vpc_id',
            type: 'output',
            state: 'active',
            dependencies_in: 0,
            dependencies_out: 1,
            details: { file: 'outputs.tf', line: 1 }
        },
        {
            id: '12',
            label: 'output.subnet_ids',
            type: 'output',
            state: 'active',
            dependencies_in: 0,
            dependencies_out: 2,
            details: { file: 'outputs.tf', line: 5 }
        },
        {
            id: '13',
            label: 'module.database',
            type: 'module',
            state: 'integrated',
            dependencies_in: 4,
            dependencies_out: 2,
            details: { file: 'modules.tf', line: 25 }
        },
        {
            id: '14',
            label: 'aws_db_instance.main',
            type: 'resource',
            state: 'active',
            dependencies_in: 2,
            dependencies_out: 3,
            details: { provider: 'aws', resource_type: 'db_instance', file: 'database.tf', line: 34 }
        },
        {
            id: '15',
            label: 'aws_iam_role.app',
            type: 'resource',
            state: 'active',
            dependencies_in: 2,
            dependencies_out: 1,
            details: { provider: 'aws', resource_type: 'iam_role', file: 'iam.tf', line: 12 }
        },
        {
            id: '16',
            label: 'provider.aws',
            type: 'provider',
            state: 'configuration',
            dependencies_in: 12,
            dependencies_out: 0,
            details: { file: 'provider.tf', line: 1 }
        },
        {
            id: '17',
            label: 'aws_route_table.orphaned',
            type: 'resource',
            state: 'orphaned',
            dependencies_in: 1,
            dependencies_out: 0,
            details: { provider: 'aws', resource_type: 'route_table', file: 'network.tf', line: 156 }
        },
        {
            id: '18',
            label: 'local.common_tags',
            type: 'local',
            state: 'active',
            dependencies_in: 8,
            dependencies_out: 0,
            details: { file: 'locals.tf', line: 1 }
        }
    ],
    edges: [
        { source: '2', target: '1' },
        { source: '3', target: '1' },
        { source: '4', target: '2' },
        { source: '4', target: '8' },
        { source: '4', target: '10' },
        { source: '5', target: '1' },
        { source: '5', target: '2' },
        { source: '8', target: '1' },
        { source: '8', target: '5' },
        { source: '11', target: '1' },
        { source: '12', target: '2' },
        { source: '12', target: '3' },
        { source: '13', target: '5' },
        { source: '13', target: '1' },
        { source: '14', target: '13' },
        { source: '14', target: '2' },
        { source: '14', target: '8' },
        { source: '15', target: '4' },
        { source: '17', target: '1' }
    ]
};

// ============================================================================
// THEME CONFIGURATION
// ============================================================================

const THEMES = {
    dark: {
        bg_primary: '#0f172a',
        bg_secondary: '#1e293b',
        bg_tertiary: '#334155',
        text_primary: '#f1f5f9',
        text_secondary: '#94a3b8',
        accent: '#06b6d4',
        accent_secondary: '#8b5cf6',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
    },
    light: {
        bg_primary: '#ffffff',
        bg_secondary: '#f8fafc',
        bg_tertiary: '#e2e8f0',
        text_primary: '#0f172a',
        text_secondary: '#64748b',
        accent: '#0891b2',
        accent_secondary: '#7c3aed',
        border: '#cbd5e1',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#2563eb',
    },
};

// ============================================================================
// NODE & STATE CONFIGURATION
// ============================================================================

const NODE_CONFIG = {
    resource: { color: '#10b981', icon: '\uf1b3' },
    module: { color: '#8b5cf6', icon: '\uf1b3' },
    variable: { color: '#f59e0b', icon: '\uf121' },
    output: { color: '#06b6d4', icon: '\uf061' },
    data: { color: '#ef4444', icon: '\uf1c0' },
    provider: { color: '#3b82f6', icon: '\uf013' },
    local: { color: '#3b82f6', icon: '\uf121' },
    terraform: { color: '#06b6d4', icon: '\uf0e8' },
};

const STATE_CONFIG: Record<string, { stroke: string; glow: string }> = {
    external_data: { stroke: '#a855f7', glow: '#a855f740' },
    integrated: { stroke: '#84cc16', glow: '#84cc1640' },
    active: { stroke: '#22c55e', glow: '#22c55e40' },
    input: { stroke: '#3b82f6', glow: '#3b82f640' },
    orphaned: { stroke: '#fb923c', glow: '#fb923c40' },
    configuration: { stroke: '#8b5cf6', glow: '#8b5cf640' },
    unused: { stroke: '#f59e0b', glow: '#f59e0b40' },
    incomplete: { stroke: '#ef4444', glow: '#ef444440' },
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

function hexagonPath(size: number): string {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        points.push([size * Math.sin(angle), size * Math.cos(angle)]);
    }
    return `M${points.map(p => p.join(',')).join('L')}Z`;
}

function calculateMetrics(data: GraphData) {
    const nodeMap = new Map<string, GraphNode>();
    const adjacencyList = new Map<string, { in: string[]; out: string[] }>();

    data.nodes.forEach(node => {
        nodeMap.set(node.id, node);
        adjacencyList.set(node.id, { in: [], out: [] });
    });

    data.edges.forEach(edge => {
        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

        adjacencyList.get(sourceId)?.out.push(targetId);
        adjacencyList.get(targetId)?.in.push(sourceId);
    });

    // Calculate connected components
    const visited = new Set<string>();
    let components = 0;

    function dfs(nodeId: string) {
        const stack = [nodeId];
        while (stack.length) {
            const current = stack.pop()!;
            if (!visited.has(current)) {
                visited.add(current);
                const neighbors = [
                    ...(adjacencyList.get(current)?.in || []),
                    ...(adjacencyList.get(current)?.out || []),
                ];
                neighbors.forEach(neighbor => {
                    if (!visited.has(neighbor)) stack.push(neighbor);
                });
            }
        }
    }

    data.nodes.forEach(node => {
        if (!visited.has(node.id)) {
            dfs(node.id);
            components++;
        }
    });

    // Calculate average dependencies
    const totalDeps = data.nodes.reduce(
        (sum, node) => sum + (node.dependencies_in || 0) + (node.dependencies_out || 0),
        0
    );
    const avgDependencies = (totalDeps / (data.nodes.length * 2)).toFixed(1);

    // Calculate max depth
    function calculateMaxDepth(): number {
        const visited = new Set<string>();
        let maxDepth = 0;

        function dfs(nodeId: string, depth = 0): number {
            if (visited.has(nodeId)) return depth;
            visited.add(nodeId);
            maxDepth = Math.max(maxDepth, depth);

            const outgoing = adjacencyList.get(nodeId)?.out || [];
            outgoing.forEach(targetId => {
                dfs(targetId, depth + 1);
            });
            return depth;
        }

        data.nodes.forEach(node => {
            if (!visited.has(node.id)) {
                dfs(node.id);
            }
        });

        return maxDepth;
    }

    const maxDepth = calculateMaxDepth();
    const complexityScore = Math.min(
        Math.round((parseFloat(avgDependencies) * maxDepth) / 2),
        10
    );

    return {
        totalNodes: data.nodes.length,
        totalEdges: data.edges.length,
        components,
        avgDependencies,
        maxDepth,
        complexityScore,
        nodeMap,
        adjacencyList,
    };
}

function findCentralNodes(data: GraphData, limit = 5): string[] {
    return data.nodes
        .map(node => ({
            id: node.id,
            connections: (node.dependencies_in || 0) + (node.dependencies_out || 0),
        }))
        .sort((a, b) => b.connections - a.connections)
        .slice(0, limit)
        .map(n => n.id);
}

function findIsolatedNodes(data: GraphData): string[] {
    return data.nodes
        .filter(node => (node.dependencies_in || 0) === 0 && (node.dependencies_out || 0) === 0)
        .map(n => n.id);
}

function findCriticalPath(
    data: GraphData,
    adjacencyList: Map<string, { in: string[]; out: string[] }>
): string[] {
    const visited = new Set<string>();
    let criticalPath: string[] = [];
    let maxLength = 0;

    function dfs(nodeId: string, path: string[] = []) {
        if (visited.has(nodeId)) return;
        visited.add(nodeId);
        path.push(nodeId);

        if (path.length > maxLength) {
            maxLength = path.length;
            criticalPath = [...path];
        }

        const outgoing = adjacencyList.get(nodeId)?.out || [];
        outgoing.forEach(targetId => {
            dfs(targetId, [...path]);
        });
    }

    data.nodes.forEach(node => {
        if (!visited.has(node.id)) {
            dfs(node.id);
        }
    });

    return criticalPath;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GraphDemo: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
    const [physicsEnabled, setPhysicsEnabled] = useState(true);
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());
    const [highlightedEdges, setHighlightedEdges] = useState<Set<string>>(new Set());

    // Use hardcoded values
    const data = SAMPLE_DATA;
    const title = 'Infrastructure Dependency Graph';
    const theme = 'dark';
    const height = 600;

    const colors = THEMES[theme];

    const metrics = useMemo(() => calculateMetrics(data), []);

    // Initialize graph
    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Clear existing
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Defs
        const defs = svg.append('defs');

        // Grid pattern
        const gridSize = 50;
        defs
            .append('pattern')
            .attr('id', `grid-${theme}`)
            .attr('width', gridSize)
            .attr('height', gridSize)
            .attr('patternUnits', 'userSpaceOnUse')
            .append('path')
            .attr('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`)
            .attr('fill', 'none')
            .attr('stroke', colors.text_secondary)
            .attr('stroke-opacity', 0.1)
            .attr('stroke-width', 1);

        svg
            .append('rect')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', `url(#grid-${theme})`);

        // Glow filter
        const glowFilter = defs.append('filter').attr('id', 'glow-filter');
        glowFilter
            .append('feGaussianBlur')
            .attr('stdDeviation', '3')
            .attr('result', 'coloredBlur');
        const feMerge = glowFilter.append('feMerge');
        feMerge.append('feMergeNode').attr('in', 'coloredBlur');
        feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Arrow markers
        Object.entries(NODE_CONFIG).forEach(([type, config]) => {
            defs
                .append('marker')
                .attr('id', `arrow-${type}-${theme}`)
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 20)
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

        // Zoom behavior with wheel prevention
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.05, 8])
            .wheelDelta(function (event) {
                // Prevent page scroll
                event.preventDefault();
                const delta = -event.deltaY * (event.deltaMode ? 120 : 1) / 500;
                return delta * 0.2;
            })
            .on('zoom', event => {
                g.attr('transform', event.transform.toString());
            });

        svg.call(zoom);

        // Prevent default wheel behavior on the SVG
        svg.on('wheel', (event: any) => {
            event.preventDefault();
        }, { passive: false });

        // Copy data
        const nodes = data.nodes.map(d => ({ ...d }));
        const edges = data.edges.map(d => ({ ...d }));

        // Create simulation
        const simulation = d3
            .forceSimulation(nodes)
            .force(
                'link',
                d3
                    .forceLink(edges)
                    .id((d: any) => d.id)
                    .distance(100)
                    .strength(0.2)
            )
            .force('charge', d3.forceManyBody().strength(-400).distanceMax(400))
            .force('center', d3.forceCenter(width / 2, height / 2).strength(0.1))
            .force(
                'collision',
                d3
                    .forceCollide()
                    .radius((d: any) => {
                        const baseRadius = d.type === 'module' ? 16 : d.type === 'resource' ? 13 : 11;
                        const depCount = (d.dependencies_out || 0) + (d.dependencies_in || 0);
                        return baseRadius + Math.min(depCount * 0.6, 6);
                    })
                    .strength(0.8)
            )
            .alphaDecay(0.0228)
            .velocityDecay(0.4);

        simulationRef.current = simulation;

        // Create links
        const link = graphG
            .append('g')
            .selectAll('line')
            .data(edges)
            .join('line')
            .attr('class', 'link')
            .attr('stroke', colors.text_secondary)
            .attr('stroke-opacity', 0.4)
            .attr('stroke-width', 1.5)
            .attr('marker-end', (d: any) => {
                const target = nodes.find(n => n.id === (typeof d.target === 'object' ? d.target.id : d.target));
                return target ? `url(#arrow-${target.type}-${theme})` : '';
            })
            .style('stroke-linecap', 'round');

        // Create nodes
        const node = graphG
            .append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .attr('class', 'node')
            .style('cursor', 'pointer')
            .on('mouseenter', function (event, d) {
                setHoveredNode(d);
                const rect = containerRef.current!.getBoundingClientRect();
                setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });

                d3.select(this)
                    .select('path')
                    .transition()
                    .duration(200)
                    .style('filter', 'url(#glow-filter)');
            })
            .on('mousemove', function (event) {
                const rect = containerRef.current!.getBoundingClientRect();
                setTooltipPos({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                });
            })
            .on('mouseleave', function (event, d) {
                setHoveredNode(null);
                const state = d.state || 'active';
                const stateGlow = STATE_CONFIG[state]?.glow || '#66666640';

                d3.select(this)
                    .select('path')
                    .transition()
                    .duration(200)
                    .style('filter', `drop-shadow(0 0 8px ${stateGlow})`);
            })
            .on('click', function (event, d) {
                event.stopPropagation();
                const newHighlighted = new Set<string>();
                const newEdges = new Set<string>();

                newHighlighted.add(d.id);

                edges.forEach(edge => {
                    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

                    if (sourceId === d.id || targetId === d.id) {
                        newHighlighted.add(sourceId);
                        newHighlighted.add(targetId);
                        newEdges.add(`${sourceId}->${targetId}`);
                    }
                });

                setHighlightedNodes(newHighlighted);
                setHighlightedEdges(newEdges);
            })
            .call(
                d3
                    .drag<any, GraphNode>()
                    .on('start', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on('drag', (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on('end', (event, d) => {
                        if (!event.active) simulation.alphaTarget(0);
                    })
            );

        // Node shapes (hexagons)
        node
            .append('path')
            .attr('class', 'node-shape')
            .attr('d', (d: any) => {
                const baseSize = d.type === 'module' ? 16 : d.type === 'resource' ? 13 : 11;
                const depCount = (d.dependencies_out || 0) + (d.dependencies_in || 0);
                const size = baseSize + Math.min(depCount * 0.6, 6);
                return hexagonPath(size);
            })
            .style('fill', (d: any) => NODE_CONFIG[d.type]?.color || '#666')
            .style('stroke', (d: any) => {
                const state = d.state || 'active';
                return STATE_CONFIG[state]?.stroke || '#666';
            })
            .style('stroke-width', 2)
            .style('fill-opacity', 0.9)
            .style('filter', (d: any) => {
                const state = d.state || 'active';
                const stateGlow = STATE_CONFIG[state]?.glow || '#66666640';
                return `drop-shadow(0 0 8px ${stateGlow})`;
            })
            .style('transition', 'all 0.3s ease');

        // Node labels
        node
            .append('text')
            .attr('dx', (d: any) => {
                const baseRadius = d.type === 'module' ? 16 : d.type === 'resource' ? 13 : 11;
                const depCount = (d.dependencies_out || 0) + (d.dependencies_in || 0);
                return baseRadius + Math.min(depCount * 0.6, 6) + 4;
            })
            .attr('dy', 4)
            .text((d: any) => {
                const maxLength = d.type === 'module' ? 25 : 18;
                return d.label.length > maxLength ? d.label.substring(0, maxLength) + '...' : d.label;
            })
            .style('fill', colors.text_primary)
            .style('font-size', (d: any) => (d.type === 'module' ? '12px' : '11px'))
            .style('font-weight', '500')
            .style('pointer-events', 'none')
            .style('text-shadow', `0 1px 4px ${colors.bg_primary}`);

        // Tick function
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        // Store zoom functions
        (window as any).graphZoomIn = () => {
            svg.transition().duration(300).call(zoom.scaleBy, 1.2);
        };
        (window as any).graphZoomOut = () => {
            svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.2);
        };
        (window as any).graphReset = () => {
            svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
            setHighlightedNodes(new Set());
            setHighlightedEdges(new Set());
        };
        (window as any).graphCenter = () => {
            const transform = d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(1)
                .translate(-width / 2, -height / 2);
            svg.transition().duration(500).call(zoom.transform, transform);
        };

        return () => {
            simulation.stop();
        };
    }, [data, theme, colors]);

    // Apply highlights
    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);

        svg
            .selectAll('.node')
            .transition()
            .duration(300)
            .style('opacity', (d: any) =>
                highlightedNodes.size === 0 || highlightedNodes.has(d.id) ? 1 : 0.2
            );

        svg
            .selectAll('.link')
            .transition()
            .duration(300)
            .style('stroke-opacity', (edge: any) => {
                if (highlightedEdges.size === 0) return 0.4;
                const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
                const edgeKey = `${sourceId}->${targetId}`;
                return highlightedEdges.has(edgeKey) ? 1 : 0.1;
            })
            .style('stroke', (edge: any) => {
                if (highlightedEdges.size === 0) return colors.text_secondary;
                const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
                const edgeKey = `${sourceId}->${targetId}`;
                const target = data.nodes.find(n => n.id === targetId);
                return highlightedEdges.has(edgeKey)
                    ? NODE_CONFIG[target?.type || 'resource']?.color || colors.accent
                    : colors.text_secondary;
            })
            .attr('stroke-dasharray', (edge: any) => {
                if (highlightedEdges.size === 0) return 'none';
                const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
                const edgeKey = `${sourceId}->${targetId}`;
                return highlightedEdges.has(edgeKey) ? '5,8' : 'none';
            });
    }, [highlightedNodes, highlightedEdges, colors, data.nodes]);

    // Toggle physics
    useEffect(() => {
        if (simulationRef.current) {
            if (physicsEnabled) {
                simulationRef.current.alpha(0.3).restart();
            } else {
                simulationRef.current.stop();
            }
        }
    }, [physicsEnabled]);

    const handleClearHighlight = () => {
        setHighlightedNodes(new Set());
        setHighlightedEdges(new Set());
    };

    const handleHighlightCentral = () => {
        const centralIds = findCentralNodes(data);
        const newHighlighted = new Set<string>(centralIds);
        const newEdges = new Set<string>();

        centralIds.forEach(nodeId => {
            data.edges.forEach(edge => {
                const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
                const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;

                if (sourceId === nodeId || targetId === nodeId) {
                    newHighlighted.add(sourceId);
                    newHighlighted.add(targetId);
                    newEdges.add(`${sourceId}->${targetId}`);
                }
            });
        });

        setHighlightedNodes(newHighlighted);
        setHighlightedEdges(newEdges);
    };

    const handleHighlightIsolated = () => {
        const isolatedIds = findIsolatedNodes(data);
        setHighlightedNodes(new Set(isolatedIds));
        setHighlightedEdges(new Set());
    };

    const handleHighlightCriticalPath = () => {
        const path = findCriticalPath(data, metrics.adjacencyList);
        const newHighlighted = new Set<string>(path);
        const newEdges = new Set<string>();

        path.forEach((nodeId, idx) => {
            if (idx < path.length - 1) {
                newEdges.add(`${nodeId}->${path[idx + 1]}`);
            }
        });

        setHighlightedNodes(newHighlighted);
        setHighlightedEdges(newEdges);
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: `${height}px`,
                backgroundColor: colors.bg_primary,
                borderRadius: '12px',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            <style>{`
        @keyframes flow {
          to {
            stroke-dashoffset: -20;
          }
        }
        .link.highlight {
          animation: flow 1.5s linear infinite;
        }
      `}</style>

            <svg
                ref={svgRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* HUD */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: `${colors.bg_secondary}e6`,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    minWidth: '280px',
                }}
            >
                <div
                    style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: colors.text_primary,
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}
                >
                    {title}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div
                        style={{
                            backgroundColor: `${colors.bg_primary}40`,
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '24px', fontWeight: 700, color: colors.accent }}>
                            {metrics.totalNodes}
                        </div>
                        <div style={{ fontSize: '10px', color: colors.text_secondary, textTransform: 'uppercase' }}>
                            Nodes
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: `${colors.bg_primary}40`,
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '24px', fontWeight: 700, color: colors.accent }}>
                            {metrics.totalEdges}
                        </div>
                        <div style={{ fontSize: '10px', color: colors.text_secondary, textTransform: 'uppercase' }}>
                            Links
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundColor: `${colors.bg_primary}40`,
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '24px', fontWeight: 700, color: colors.accent }}>
                            {metrics.components}
                        </div>
                        <div style={{ fontSize: '10px', color: colors.text_secondary, textTransform: 'uppercase' }}>
                            Groups
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    backgroundColor: `${colors.bg_secondary}e6`,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '16px',
                    backdropFilter: 'blur(10px)',
                    minWidth: '280px',
                    maxHeight: 'calc(100% - 40px)',
                    overflowY: 'auto',
                }}
            >
                <div
                    style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: colors.text_secondary,
                        marginBottom: '12px',
                        textTransform: 'uppercase',
                    }}
                >
                    Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: `${colors.bg_primary}20`, borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.text_primary }}>
                            {metrics.avgDependencies}
                        </div>
                        <div style={{ fontSize: '9px', color: colors.text_secondary }}>Avg Deps</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: `${colors.bg_primary}20`, borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.text_primary }}>
                            {metrics.maxDepth}
                        </div>
                        <div style={{ fontSize: '9px', color: colors.text_secondary }}>Max Depth</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '8px', backgroundColor: `${colors.bg_primary}20`, borderRadius: '6px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: colors.text_primary }}>
                            {metrics.complexityScore}
                        </div>
                        <div style={{ fontSize: '9px', color: colors.text_secondary }}>Complexity</div>
                    </div>
                </div>

            </div>

            {/* Controls */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: `${colors.bg_secondary}e6`,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '50px',
                    padding: '12px 20px',
                    display: 'flex',
                    gap: '8px',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <button
                    onClick={() => (window as any).graphReset?.()}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        padding: '8px 16px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    Reset
                </button>
                <button
                    onClick={() => setPhysicsEnabled(!physicsEnabled)}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        padding: '8px 16px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    {physicsEnabled ? 'Physics On' : 'Physics Off'}
                </button>
                <button
                    onClick={() => (window as any).graphCenter?.()}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        padding: '8px 16px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    Center
                </button>
                <button
                    onClick={handleClearHighlight}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        padding: '8px 16px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    Clear
                </button>
            </div>

            {/* Zoom Controls */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    backgroundColor: `${colors.bg_secondary}e6`,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <button
                    onClick={() => (window as any).graphZoomIn?.()}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    +
                </button>
                <button
                    onClick={() => (window as any).graphZoomOut?.()}
                    style={{
                        backgroundColor: colors.bg_primary,
                        border: `1px solid ${colors.border}`,
                        color: colors.text_primary,
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = colors.accent;
                        e.currentTarget.style.color = colors.bg_primary;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = colors.bg_primary;
                        e.currentTarget.style.color = colors.text_primary;
                    }}
                >
                    −
                </button>
            </div>

            {/* Tooltip */}
            {hoveredNode && (
                <div
                    style={{
                        position: 'absolute',
                        left: `${tooltipPos.x + 15}px`,
                        top: `${tooltipPos.y + 15}px`,
                        backgroundColor: `${colors.bg_secondary}f0`,
                        border: `1px solid ${colors.accent}60`,
                        borderRadius: '12px',
                        padding: '16px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: `0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 ${colors.accent}15`,
                        maxWidth: '320px',
                        pointerEvents: 'none',
                        zIndex: 1001,
                        color: colors.text_primary,
                        fontSize: '13px',
                        animation: 'fadeIn 0.3s ease',
                    }}
                >
                    <div
                        style={{
                            fontWeight: 700,
                            color: colors.accent,
                            marginBottom: '8px',
                            fontSize: '15px',
                            borderBottom: `1px solid ${colors.accent}30`,
                            paddingBottom: '6px',
                        }}
                    >
                        {hoveredNode.label}
                    </div>

                    {hoveredNode.state && (
                        <div
                            style={{
                                fontSize: '11px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                marginTop: '8px',
                                display: 'inline-block',
                                fontWeight: 600,
                                border: `1px solid ${STATE_CONFIG[hoveredNode.state]?.stroke || '#666'}40`,
                                background: `${STATE_CONFIG[hoveredNode.state]?.stroke || '#666'}15`,
                                color: STATE_CONFIG[hoveredNode.state]?.stroke || '#666',
                            }}
                        >
                            {hoveredNode.state.replace('_', ' ').toUpperCase()}
                        </div>
                    )}

                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.border}40` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: colors.text_secondary }}>Type:</span>
                            <span style={{ fontWeight: 600 }}>{hoveredNode.type}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: colors.text_secondary }}>Incoming:</span>
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: colors.success,
                                    backgroundColor: `${colors.success}20`,
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                }}
                            >
                {hoveredNode.dependencies_in || 0}
              </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: colors.text_secondary }}>Outgoing:</span>
                            <span
                                style={{
                                    fontWeight: 600,
                                    color: colors.warning,
                                    backgroundColor: `${colors.warning}20`,
                                    padding: '2px 6px',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                }}
                            >
                {hoveredNode.dependencies_out || 0}
              </span>
                        </div>
                    </div>

                    {hoveredNode.details && Object.keys(hoveredNode.details).length > 0 && (
                        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${colors.border}40` }}>
                            <div style={{ fontSize: '11px', color: colors.text_secondary, marginBottom: '6px', fontWeight: 600 }}>
                                DETAILS
                            </div>
                            {Object.entries(hoveredNode.details).slice(0, 3).map(([key, value]) => (
                                <div key={key} style={{ fontSize: '11px', marginBottom: '2px' }}>
                                    <span style={{ color: colors.text_secondary }}>{key}:</span>{' '}
                                    <span style={{ color: colors.text_primary }}>{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GraphDemo;

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*
import GraphEmbed from './GraphEmbed';

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <GraphEmbed />
    </div>
  );
}

// That's it! The component comes with built-in sample data showing:
// - 18 nodes (resources, modules, variables, outputs, data sources, providers)
// - Various states (active, unused, orphaned, external_data, integrated, configuration)
// - Realistic dependency relationships
// - Complete with file locations and metadata

// The graph is fully interactive:
// - Hover nodes to see detailed tooltips
// - Click nodes to highlight connections
// - Use mouse wheel to zoom (without scrolling the page!)
// - Drag nodes to rearrange
// - Toggle physics simulation on/off
// - Analyze critical paths, central nodes, and isolated nodes
// - All within a beautiful dark theme
*/