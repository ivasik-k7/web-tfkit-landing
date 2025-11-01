import React, { useState, useMemo, useEffect, useCallback, useRef, lazy, Suspense } from 'react';

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
    provider?: string;
    badges?: string[];
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

export interface ClassicLayoutEmbedProps {
    data: ClassicLayoutData;
    title?: string;
    theme?: 'dark' | 'light';
    height?: number;
    onNodeClick?: (node: Node) => void;
}

interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

// ============================================================================
// LAZY LOAD 3D VISUALIZATION
// ============================================================================

const ThreeDVisualization = lazy(() =>
    Promise.resolve({
        default: ({ nodeId }: { nodeId: string }) => (
            <div className="w-full h-full flex items-center justify-center bg-[#1a2347] rounded-lg">
                <div className="text-center text-[#a0a8c1]">
                    <svg className="w-16 h-16 mx-auto mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm">3D Visualization</p>
                    <p className="text-xs mt-2 opacity-70">Node: {nodeId}</p>
                </div>
            </div>
        )
    })
);

// ============================================================================
// INLINE CSS (exact replica from HTML)
// ============================================================================

const CSS_STYLES = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    .classic-embed-root {
        --bg-primary: #0a0e27;
        --bg-secondary: #141b3d;
        --bg-tertiary: #1a2347;
        --text-primary: #e0e6f7;
        --text-secondary: #a0a8c1;
        --border: #2d3a5f;
        --accent: #3b82f6;
        --accent-secondary: #8b5cf6;
        --success: #10b981;
        --warning: #f59e0b;
        --danger: #ef4444;
        --info: #06b6d4;
        
        font-family: 'Exo 2', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        background: var(--bg-primary);
        color: var(--text-primary);
        line-height: 1.6;
        overflow-x: hidden;
    }

    /* Stats Grid */
    .stats-grid {
        column-count: 4;
        column-gap: 24px;
        margin: 24px;
        margin-bottom: 32px;
    }
    @media (max-width: 1600px) { .stats-grid { column-count: 4; } }
    @media (max-width: 1200px) { .stats-grid { column-count: 2; } }
    @media (max-width: 768px) { .stats-grid { column-count: 1; } }

    .stat-card {
        break-inside: avoid;
        margin-bottom: 24px;
        width: 100%;
        background: var(--bg-secondary);
        border-radius: 16px;
        border: 1px solid var(--border);
        overflow: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        cursor: pointer;
        padding: 20px;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        border-color: var(--accent);
    }

    .stat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-secondary);
        font-size: 0.9em;
        font-weight: 600;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border);
    }

    .stat-header i { font-size: 1.1em; }

    .stat-body { padding: 16px 0; }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
    }

    .stat-row.major { padding: 12px 0; }
    .stat-row.major .stat-value { font-size: 1.8em; }
    .stat-row.warning .stat-value { color: var(--warning); }
    .stat-row.danger .stat-value { color: var(--danger); }

    .stat-title {
        color: var(--text-secondary);
        font-size: 0.9em;
    }

    .stat-value {
        font-weight: 600;
        font-size: 1.1em;
    }

    .stat-value.with-trend {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .trend {
        font-size: 0.7em;
        padding: 4px;
        border-radius: 4px;
    }

    .trend.positive { color: var(--success); }
    .trend.negative { color: var(--danger); }
    .trend.warning { color: var(--warning); }

    .stat-footer {
        padding-top: 16px;
        border-top: 1px solid var(--border);
        color: var(--text-secondary);
        font-size: 0.85em;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .stat-footer.clickable {
        cursor: pointer;
        justify-content: space-between;
        color: var(--accent);
        font-weight: 500;
    }

    .stat-footer.clickable:hover {
        color: var(--accent-secondary);
    }

    .provider-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
    }

    .provider-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px;
        border-radius: 8px;
        background: var(--bg-primary);
        font-size: 0.9em;
    }

    .provider-item i {
        font-size: 1.2em;
        color: var(--accent);
        width: 20px;
        text-align: center;
    }

    .provider-count {
        margin-left: auto;
        background: var(--bg-tertiary);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.85em;
        font-weight: 600;
    }

    /* Main Panel */
    .main-panel {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 16px;
        overflow: hidden;
        margin: 0 24px 24px 24px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .panel-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border);
        background: var(--bg-tertiary);
    }

    .panel-title {
        font-size: 1.25em;
        font-weight: 700;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Search Interface */
    .search-interface {
        padding: 24px;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border);
    }

    .search-wrapper {
        display: flex;
        gap: 12px;
        max-width: 800px;
        margin: 0 auto;
    }

    .search-field {
        position: relative;
        flex: 1;
    }

    .search-input-wrapper {
        display: flex;
        align-items: center;
        background: var(--bg-primary);
        border: 2px solid var(--border);
        border-radius: 16px;
        padding: 0 8px;
        transition: all 0.2s ease;
    }

    .search-input-wrapper i {
        padding: 12px;
        color: var(--text-secondary);
        font-size: 1.1em;
    }

    .search-input {
        flex: 1;
        border: none;
        background: none;
        padding: 16px 8px;
        font-size: 1em;
        color: var(--text-primary);
        min-width: 0;
        font-family: inherit;
    }

    .search-input:focus { outline: none; }

    .search-input::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
    }

    .search-field:focus-within .search-input-wrapper {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .search-shortcuts {
        padding: 0 12px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .search-shortcuts kbd {
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.75em;
        color: var(--text-secondary);
    }

    .search-tools {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .search-tool-btn {
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--border);
        border-radius: 12px;
        background: var(--bg-primary);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .search-tool-btn:hover {
        border-color: var(--accent);
        color: var(--accent);
        background: var(--bg-tertiary);
    }

    .search-divider {
        width: 1px;
        height: 24px;
        background: var(--border);
    }

    .search-suggestions {
        position: absolute;
        top: calc(100% + 12px);
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        padding: 12px;
        display: none;
        z-index: 1000;
        animation: suggestionsFade 0.2s ease;
    }

    .search-suggestions.show {
        display: block;
    }

    .suggestion-group {
        padding: 8px 0;
    }

    .suggestion-group:not(:last-child) {
        border-bottom: 1px solid var(--border);
    }

    .suggestion-header {
        padding: 8px 12px;
        color: var(--text-secondary);
        font-size: 0.85em;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .suggestion-item {
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.15s ease;
    }

    .suggestion-item:hover {
        background: var(--bg-tertiary);
        color: var(--accent);
    }

    .suggestion-item i {
        width: 20px;
        text-align: center;
        color: var(--text-secondary);
    }

    .suggestion-item:hover i {
        color: inherit;
    }

    @keyframes suggestionsFade {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Active Filters */
    .active-filters {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }

    .filter-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .filter-tag {
        background: var(--accent);
        color: white;
        padding: 6px 12px 6px 14px;
        border-radius: 25px;
        font-size: 0.85em;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        user-select: none;
    }

    .filter-tag .remove {
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.2s;
        padding: 4px;
        margin: -4px;
        border-radius: 50%;
    }

    .filter-tag .remove:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.1);
    }

    .clear-filters {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 0.85em;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
        font-family: inherit;
    }

    .clear-filters:hover {
        background: var(--bg-tertiary);
        color: var(--danger);
    }

    /* Graph Container */
    .graph-container {
        padding: 20px;
        max-height: 70vh;
        overflow-y: auto;
    }

    .graph-container::-webkit-scrollbar { width: 8px; }
    .graph-container::-webkit-scrollbar-track { background: var(--bg-primary); }
    .graph-container::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    .graph-container::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

    .graph-nodes {
        column-count: 4;
        column-gap: 20px;
        padding: 20px;
    }

    @media (max-width: 1600px) { .graph-nodes { column-count: 3; } }
    @media (max-width: 1200px) { .graph-nodes { column-count: 2; } }
    @media (max-width: 768px) { .graph-nodes { column-count: 1; } }

    .graph-node {
        break-inside: avoid;
        margin-bottom: 20px;
        display: inline-block;
        width: 100%;
        background: var(--bg-primary);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        cursor: pointer;
    }

    .graph-node:hover {
        border-color: var(--accent);
        transform: translateY(-2px) scale(1.01);
        box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .graph-node:hover .graph-node-icon {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .node-unused {
        background: linear-gradient(135deg, var(--danger) 0%, var(--bg-primary) 3%);
        border-color: var(--danger);
    }
    .node-external {
        background: linear-gradient(135deg, var(--info) 0%, var(--bg-primary) 3%);
        border-color: var(--info);
    }
    .node-leaf {
        background: linear-gradient(135deg, var(--success) 0%, var(--bg-primary) 3%);
        border-color: var(--success);
    }
    .node-orphan {
        background: linear-gradient(135deg, var(--warning) 0%, var(--bg-primary) 3%);
        border-color: var(--warning);
    }
    .node-warning {
        background: linear-gradient(135deg, var(--warning) 0%, var(--bg-primary) 3%);
        border-color: var(--warning);
    }
    .node-healthy {
        background: linear-gradient(135deg, var(--success) 0%, var(--bg-primary) 3%);
        border-color: var(--success);
    }

    .graph-node-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 16px;
        gap: 16px;
        position: relative;
    }

    .graph-node-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: var(--accent);
        flex-shrink: 0;
        font-size: 1.3em;
        color: var(--bg-primary);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
    }

    .graph-node-icon::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%);
    }

    .graph-node-title-container {
        flex: 1;
        min-width: 0;
    }

    .graph-node-title {
        font-weight: 700;
        font-size: 1.2em;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        color: var(--text-primary);
        line-height: 1.3;
    }

    .graph-node-type {
        color: var(--text-secondary);
        font-size: 0.9em;
        font-weight: 600;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .graph-node-type i {
        font-size: 1.1em;
        opacity: 0.7;
    }

    .graph-node-state {
        font-size: 0.8em;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 6px;
        display: inline-block;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .graph-node-actions {
        position: absolute;
        top: 16px;
        right: 16px;
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .graph-node:hover .graph-node-actions {
        opacity: 1;
    }

    .node-action {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .node-action:hover {
        background: var(--accent);
        color: white;
        border-color: var(--accent);
    }

    .graph-node-dependencies {
        display: flex;
        gap: 20px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--border);
    }

    .graph-node-deps-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9em;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .graph-node-deps-count {
        background: var(--info);
        color: white;
        border-radius: 12px;
        min-width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8em;
        font-weight: 700;
    }

    .graph-node-deps-count.outgoing {
        background: var(--success);
    }

    .graph-node-deps-count.incoming {
        background: var(--accent-secondary);
    }

    .graph-node-reason {
        font-size: 0.85em;
        color: var(--text-secondary);
        font-style: italic;
        margin-top: 12px;
        line-height: 1.4;
    }

    .empty-state {
        padding: 80px 20px;
        text-align: center;
        color: var(--text-secondary);
    }

    .empty-state-icon {
        font-size: 4em;
        margin-bottom: 20px;
        opacity: 0.5;
    }

    .empty-state h3 {
        font-size: 1.5em;
        margin-bottom: 12px;
        color: var(--text-primary);
    }

    /* Toast Notifications */
    .toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
        pointer-events: none;
    }

    .toast {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-left: 4px solid var(--accent);
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: auto;
    }

    .toast.show {
        transform: translateX(0);
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from { transform: translateX(400px); }
        to { transform: translateX(0); }
    }

    .toast.success { border-left-color: var(--success); }
    .toast.error { border-left-color: var(--danger); }
    .toast.warning { border-left-color: var(--warning); }
    .toast.info { border-left-color: var(--info); }

    .toast-icon {
        font-size: 1.2em;
        color: var(--accent);
    }

    .toast.success .toast-icon { color: var(--success); }
    .toast.error .toast-icon { color: var(--danger); }
    .toast.warning .toast-icon { color: var(--warning); }
    .toast.info .toast-icon { color: var(--info); }

    .toast-content {
        flex: 1;
    }

    .toast-title {
        font-weight: 600;
        margin-bottom: 4px;
    }

    .toast-message {
        font-size: 0.9em;
        color: var(--text-secondary);
    }

    .toast-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
    }

    .toast-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    /* Backdrop */
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
    }

    .backdrop.show {
        opacity: 1;
        visibility: visible;
    }

    /* Modal */
    .visualization-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 16px;
        box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        width: 90%;
        height: 80%;
        max-width: 1200px;
        z-index: 10002;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
    }

    .visualization-modal.show {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
    }

    .visualization-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .visualization-title {
        font-size: 1.3em;
        font-weight: 700;
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .visualization-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s ease;
    }

    .visualization-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .visualization-content {
        flex: 1;
        display: flex;
        position: relative;
        min-height: 400px;
    }

    /* Quick Actions */
    .quick-actions {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 50px;
        padding: 12px 20px;
        display: flex;
        gap: 8px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 9999;
        backdrop-filter: blur(10px);
    }

    .quick-action {
        background: var(--bg-primary);
        border: 1px solid var(--border);
        color: var(--text-primary);
        padding: 12px 16px;
        border-radius: 25px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
        font-size: 0.9em;
        font-weight: 500;
    }

    .quick-action:hover {
        background: var(--accent);
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--accent);
    }
`;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ClassicLayoutEmbed({
                                       data={
                                           "nodes": [
                                               {
                                                   "id": "vpc-main-001",
                                                   "label": "aws_vpc.main",
                                                   "type": "resource",
                                                   "subtype": "aws_vpc",
                                                   "state": "healthy",
                                                   "state_reason": null,
                                                   "dependencies_in": 12,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/main.tf:15",
                                                       "cidr": "10.0.0.0/16"
                                                   }
                                               },
                                               {
                                                   "id": "subnet-public-1a",
                                                   "label": "aws_subnet.public_1a",
                                                   "type": "resource",
                                                   "subtype": "aws_subnet",
                                                   "state": "healthy",
                                                   "dependencies_in": 5,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/subnets.tf:10",
                                                       "az": "us-east-1a"
                                                   }
                                               },
                                               {
                                                   "id": "subnet-public-1b",
                                                   "label": "aws_subnet.public_1b",
                                                   "type": "resource",
                                                   "subtype": "aws_subnet",
                                                   "state": "healthy",
                                                   "dependencies_in": 5,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/subnets.tf:25"
                                                   }
                                               },
                                               {
                                                   "id": "subnet-private-1a",
                                                   "label": "aws_subnet.private_1a",
                                                   "type": "resource",
                                                   "subtype": "aws_subnet",
                                                   "state": "healthy",
                                                   "dependencies_in": 8,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/subnets.tf:40"
                                                   }
                                               },
                                               {
                                                   "id": "subnet-private-1b",
                                                   "label": "aws_subnet.private_1b",
                                                   "type": "resource",
                                                   "subtype": "aws_subnet",
                                                   "state": "healthy",
                                                   "dependencies_in": 8,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/subnets.tf:55"
                                                   }
                                               },
                                               {
                                                   "id": "igw-main",
                                                   "label": "aws_internet_gateway.main",
                                                   "type": "resource",
                                                   "subtype": "aws_internet_gateway",
                                                   "state": "healthy",
                                                   "dependencies_in": 6,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/gateways.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "nat-1a",
                                                   "label": "aws_nat_gateway.nat_1a",
                                                   "type": "resource",
                                                   "subtype": "aws_nat_gateway",
                                                   "state": "healthy",
                                                   "dependencies_in": 4,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/gateways.tf:20"
                                                   }
                                               },
                                               {
                                                   "id": "eip-nat-1a",
                                                   "label": "aws_eip.nat_1a",
                                                   "type": "resource",
                                                   "subtype": "aws_eip",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "network/gateways.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "sg-alb",
                                                   "label": "aws_security_group.alb",
                                                   "type": "resource",
                                                   "subtype": "aws_security_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 3,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "security/sg_alb.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "sg-app",
                                                   "label": "aws_security_group.app",
                                                   "type": "resource",
                                                   "subtype": "aws_security_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 6,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "security/sg_app.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "sg-db",
                                                   "label": "aws_security_group.database",
                                                   "type": "resource",
                                                   "subtype": "aws_security_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "security/sg_db.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "alb-main",
                                                   "label": "aws_lb.main",
                                                   "type": "resource",
                                                   "subtype": "aws_lb",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 3,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "compute/alb.tf:10"
                                                   }
                                               },
                                               {
                                                   "id": "tg-app",
                                                   "label": "aws_lb_target_group.app",
                                                   "type": "resource",
                                                   "subtype": "aws_lb_target_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "compute/alb.tf:30"
                                                   }
                                               },
                                               {
                                                   "id": "listener-http",
                                                   "label": "aws_lb_listener.http",
                                                   "type": "resource",
                                                   "subtype": "aws_lb_listener",
                                                   "state": "healthy",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "compute/alb.tf:45"
                                                   }
                                               },
                                               {
                                                   "id": "asg-app",
                                                   "label": "aws_autoscaling_group.app",
                                                   "type": "resource",
                                                   "subtype": "aws_autoscaling_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 5,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "compute/asg.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "lt-app",
                                                   "label": "aws_launch_template.app",
                                                   "type": "resource",
                                                   "subtype": "aws_launch_template",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "compute/launch_template.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "rds-main",
                                                   "label": "aws_db_instance.main",
                                                   "type": "resource",
                                                   "subtype": "aws_db_instance",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 3,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "database/rds.tf:10",
                                                       "engine": "postgres"
                                                   }
                                               },
                                               {
                                                   "id": "rds-subnet-group",
                                                   "label": "aws_db_subnet_group.main",
                                                   "type": "resource",
                                                   "subtype": "aws_db_subnet_group",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "database/rds.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "s3-assets",
                                                   "label": "aws_s3_bucket.assets",
                                                   "type": "resource",
                                                   "subtype": "aws_s3_bucket",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "storage/s3.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "s3-logs",
                                                   "label": "aws_s3_bucket.logs",
                                                   "type": "resource",
                                                   "subtype": "aws_s3_bucket",
                                                   "state": "healthy",
                                                   "dependencies_in": 3,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "storage/s3.tf:20"
                                                   }
                                               },
                                               {
                                                   "id": "cloudwatch-alarms",
                                                   "label": "aws_cloudwatch_metric_alarm.cpu_high",
                                                   "type": "resource",
                                                   "subtype": "aws_cloudwatch_metric_alarm",
                                                   "state": "healthy",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "monitoring/alarms.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "route53-zone",
                                                   "label": "aws_route53_zone.main",
                                                   "type": "resource",
                                                   "subtype": "aws_route53_zone",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "dns/route53.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "route53-record",
                                                   "label": "aws_route53_record.app",
                                                   "type": "resource",
                                                   "subtype": "aws_route53_record",
                                                   "state": "healthy",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "dns/route53.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "iam-role-ec2",
                                                   "label": "aws_iam_role.ec2_role",
                                                   "type": "resource",
                                                   "subtype": "aws_iam_role",
                                                   "state": "healthy",
                                                   "dependencies_in": 2,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "iam/roles.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "iam-policy-s3",
                                                   "label": "aws_iam_policy.s3_access",
                                                   "type": "resource",
                                                   "subtype": "aws_iam_policy",
                                                   "state": "healthy",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "iam/policies.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "iam-attachment",
                                                   "label": "aws_iam_role_policy_attachment.s3",
                                                   "type": "resource",
                                                   "subtype": "aws_iam_role_policy_attachment",
                                                   "state": "healthy",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 2,
                                                   "lifecycle": "create",
                                                   "details": {
                                                       "loc": "iam/attachments.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "module-networking",
                                                   "label": "module.networking",
                                                   "type": "module",
                                                   "state": "active",
                                                   "dependencies_in": 15,
                                                   "dependencies_out": 6,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "main.tf:20",
                                                       "source": "terraform-aws-modules/vpc/aws"
                                                   }
                                               },
                                               {
                                                   "id": "module-security",
                                                   "label": "module.security_groups",
                                                   "type": "module",
                                                   "state": "active",
                                                   "dependencies_in": 11,
                                                   "dependencies_out": 3,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "main.tf:35",
                                                       "source": "terraform-aws-modules/security-group/aws"
                                                   }
                                               },
                                               {
                                                   "id": "module-rds",
                                                   "label": "module.database",
                                                   "type": "module",
                                                   "state": "active",
                                                   "dependencies_in": 3,
                                                   "dependencies_out": 4,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "main.tf:50",
                                                       "source": "terraform-aws-modules/rds/aws"
                                                   }
                                               },
                                               {
                                                   "id": "var-env",
                                                   "label": "var.environment",
                                                   "type": "variable",
                                                   "state": "active",
                                                   "dependencies_in": 18,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "variables.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "var-region",
                                                   "label": "var.aws_region",
                                                   "type": "variable",
                                                   "state": "active",
                                                   "dependencies_in": 12,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "variables.tf:10"
                                                   }
                                               },
                                               {
                                                   "id": "var-vpc-cidr",
                                                   "label": "var.vpc_cidr",
                                                   "type": "variable",
                                                   "state": "active",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "variables.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "output-vpc-id",
                                                   "label": "output.vpc_id",
                                                   "type": "output",
                                                   "state": "active",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "outputs.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "output-alb-dns",
                                                   "label": "output.alb_dns_name",
                                                   "type": "output",
                                                   "state": "active",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "outputs.tf:10"
                                                   }
                                               },
                                               {
                                                   "id": "output-db-endpoint",
                                                   "label": "output.database_endpoint",
                                                   "type": "output",
                                                   "state": "active",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "outputs.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "data-ami",
                                                   "label": "data.aws_ami.ubuntu",
                                                   "type": "data",
                                                   "state": "external",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "data.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "data-azs",
                                                   "label": "data.aws_availability_zones.available",
                                                   "type": "data",
                                                   "state": "external",
                                                   "dependencies_in": 4,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "data.tf:15"
                                                   }
                                               },
                                               {
                                                   "id": "provider-aws",
                                                   "label": "provider.aws",
                                                   "type": "provider",
                                                   "state": "configuration",
                                                   "dependencies_in": 35,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "providers.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "unused-sg-old",
                                                   "label": "aws_security_group.old_unused",
                                                   "type": "resource",
                                                   "subtype": "aws_security_group",
                                                   "state": "unused",
                                                   "state_reason": "No resources reference this security group",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 1,
                                                   "lifecycle": "delete",
                                                   "details": {
                                                       "loc": "security/deprecated.tf:10"
                                                   }
                                               },
                                               {
                                                   "id": "orphan-eip",
                                                   "label": "aws_eip.orphaned",
                                                   "type": "resource",
                                                   "subtype": "aws_eip",
                                                   "state": "orphan",
                                                   "state_reason": "Elastic IP not attached to any resource",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "network/elastic_ips.tf:50"
                                                   }
                                               },
                                               {
                                                   "id": "warning-bucket",
                                                   "label": "aws_s3_bucket.old_format",
                                                   "type": "resource",
                                                   "subtype": "aws_s3_bucket",
                                                   "state": "warning",
                                                   "state_reason": "Using deprecated bucket configuration",
                                                   "dependencies_in": 1,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "replace",
                                                   "details": {
                                                       "loc": "storage/legacy.tf:5"
                                                   }
                                               },
                                               {
                                                   "id": "isolated-lambda",
                                                   "label": "aws_lambda_function.isolated",
                                                   "type": "resource",
                                                   "subtype": "aws_lambda_function",
                                                   "state": "isolated",
                                                   "state_reason": "Function has no triggers or dependencies",
                                                   "dependencies_in": 0,
                                                   "dependencies_out": 0,
                                                   "lifecycle": "none",
                                                   "details": {
                                                       "loc": "compute/lambda.tf:25"
                                                   }
                                               }
                                           ],
                                           "edges": [
                                               { "source": "subnet-public-1a", "target": "vpc-main-001" },
                                               { "source": "subnet-public-1b", "target": "vpc-main-001" },
                                               { "source": "subnet-private-1a", "target": "vpc-main-001" },
                                               { "source": "subnet-private-1b", "target": "vpc-main-001" },
                                               { "source": "igw-main", "target": "vpc-main-001" },
                                               { "source": "nat-1a", "target": "subnet-public-1a" },
                                               { "source": "nat-1a", "target": "eip-nat-1a" },
                                               { "source": "sg-alb", "target": "vpc-main-001" },
                                               { "source": "sg-app", "target": "vpc-main-001" },
                                               { "source": "sg-db", "target": "vpc-main-001" },
                                               { "source": "alb-main", "target": "subnet-public-1a" },
                                               { "source": "alb-main", "target": "subnet-public-1b" },
                                               { "source": "alb-main", "target": "sg-alb" },
                                               { "source": "tg-app", "target": "vpc-main-001" },
                                               { "source": "listener-http", "target": "alb-main" },
                                               { "source": "listener-http", "target": "tg-app" },
                                               { "source": "asg-app", "target": "lt-app" },
                                               { "source": "asg-app", "target": "subnet-private-1a" },
                                               { "source": "asg-app", "target": "subnet-private-1b" },
                                               { "source": "asg-app", "target": "tg-app" },
                                               { "source": "asg-app", "target": "sg-app" },
                                               { "source": "lt-app", "target": "sg-app" },
                                               { "source": "lt-app", "target": "data-ami" },
                                               { "source": "rds-main", "target": "rds-subnet-group" },
                                               { "source": "rds-main", "target": "sg-db" },
                                               { "source": "rds-main", "target": "subnet-private-1a" },
                                               { "source": "rds-subnet-group", "target": "subnet-private-1a" },
                                               { "source": "rds-subnet-group", "target": "subnet-private-1b" },
                                               { "source": "cloudwatch-alarms", "target": "asg-app" },
                                               { "source": "route53-record", "target": "route53-zone" },
                                               { "source": "route53-record", "target": "alb-main" },
                                               { "source": "iam-attachment", "target": "iam-role-ec2" },
                                               { "source": "iam-attachment", "target": "iam-policy-s3" },
                                               { "source": "module-networking", "target": "var-env" },
                                               { "source": "module-networking", "target": "var-region" },
                                               { "source": "module-networking", "target": "var-vpc-cidr" },
                                               { "source": "module-networking", "target": "data-azs" },
                                               { "source": "vpc-main-001", "target": "module-networking" },
                                               { "source": "subnet-public-1a", "target": "module-networking" },
                                               { "source": "subnet-public-1b", "target": "module-networking" },
                                               { "source": "subnet-private-1a", "target": "module-networking" },
                                               { "source": "subnet-private-1b", "target": "module-networking" },
                                               { "source": "igw-main", "target": "module-networking" },
                                               { "source": "module-security", "target": "var-env" },
                                               { "source": "module-security", "target": "vpc-main-001" },
                                               { "source": "sg-alb", "target": "module-security" },
                                               { "source": "sg-app", "target": "module-security" },
                                               { "source": "sg-db", "target": "module-security" },
                                               { "source": "module-rds", "target": "subnet-private-1a" },
                                               { "source": "module-rds", "target": "subnet-private-1b" },
                                               { "source": "module-rds", "target": "sg-db" },
                                               { "source": "rds-main", "target": "module-rds" },
                                               { "source": "output-vpc-id", "target": "vpc-main-001" },
                                               { "source": "output-alb-dns", "target": "alb-main" },
                                               { "source": "output-db-endpoint", "target": "rds-main" },
                                               { "source": "unused-sg-old", "target": "vpc-main-001" },
                                               { "source": "warning-bucket", "target": "s3-logs" }
                                           ],
                                           "resources": [
                                               {
                                                   "id": "vpc-main-001",
                                                   "label": "aws_vpc.main",
                                                   "type": "aws_vpc",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "subnet-public-1a",
                                                   "label": "aws_subnet.public_1a",
                                                   "type": "aws_subnet",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "subnet-public-1b",
                                                   "label": "aws_subnet.public_1b",
                                                   "type": "aws_subnet",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "subnet-private-1a",
                                                   "label": "aws_subnet.private_1a",
                                                   "type": "aws_subnet",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "subnet-private-1b",
                                                   "label": "aws_subnet.private_1b",
                                                   "type": "aws_subnet",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "igw-main",
                                                   "label": "aws_internet_gateway.main",
                                                   "type": "aws_internet_gateway",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "nat-1a",
                                                   "label": "aws_nat_gateway.nat_1a",
                                                   "type": "aws_nat_gateway",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "eip-nat-1a",
                                                   "label": "aws_eip.nat_1a",
                                                   "type": "aws_eip",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "sg-alb",
                                                   "label": "aws_security_group.alb",
                                                   "type": "aws_security_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "sg-app",
                                                   "label": "aws_security_group.app",
                                                   "type": "aws_security_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "sg-db",
                                                   "label": "aws_security_group.database",
                                                   "type": "aws_security_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "alb-main",
                                                   "label": "aws_lb.main",
                                                   "type": "aws_lb",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "tg-app",
                                                   "label": "aws_lb_target_group.app",
                                                   "type": "aws_lb_target_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "listener-http",
                                                   "label": "aws_lb_listener.http",
                                                   "type": "aws_lb_listener",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "asg-app",
                                                   "label": "aws_autoscaling_group.app",
                                                   "type": "aws_autoscaling_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "lt-app",
                                                   "label": "aws_launch_template.app",
                                                   "type": "aws_launch_template",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "rds-main",
                                                   "label": "aws_db_instance.main",
                                                   "type": "aws_db_instance",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "rds-subnet-group",
                                                   "label": "aws_db_subnet_group.main",
                                                   "type": "aws_db_subnet_group",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "s3-assets",
                                                   "label": "aws_s3_bucket.assets",
                                                   "type": "aws_s3_bucket",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "s3-logs",
                                                   "label": "aws_s3_bucket.logs",
                                                   "type": "aws_s3_bucket",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "cloudwatch-alarms",
                                                   "label": "aws_cloudwatch_metric_alarm.cpu_high",
                                                   "type": "aws_cloudwatch_metric_alarm",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "route53-zone",
                                                   "label": "aws_route53_zone.main",
                                                   "type": "aws_route53_zone",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "route53-record",
                                                   "label": "aws_route53_record.app",
                                                   "type": "aws_route53_record",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "iam-role-ec2",
                                                   "label": "aws_iam_role.ec2_role",
                                                   "type": "aws_iam_role",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "iam-policy-s3",
                                                   "label": "aws_iam_policy.s3_access",
                                                   "type": "aws_iam_policy",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "iam-attachment",
                                                   "label": "aws_iam_role_policy_attachment.s3",
                                                   "type": "aws_iam_role_policy_attachment",
                                                   "lifecycle": "create",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "unused-sg-old",
                                                   "label": "aws_security_group.old_unused",
                                                   "type": "aws_security_group",
                                                   "lifecycle": "delete",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "orphan-eip",
                                                   "label": "aws_eip.orphaned",
                                                   "type": "aws_eip",
                                                   "lifecycle": "none",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "warning-bucket",
                                                   "label": "aws_s3_bucket.old_format",
                                                   "type": "aws_s3_bucket",
                                                   "lifecycle": "replace",
                                                   "provider": "aws"
                                               },
                                               {
                                                   "id": "isolated-lambda",
                                                   "label": "aws_lambda_function.isolated",
                                                   "type": "aws_lambda_function",
                                                   "lifecycle": "none",
                                                   "provider": "aws"
                                               }
                                           ],
                                           "meta": {
                                               "title": "Production AWS Infrastructure",
                                               "timestamp": "2025-11-01T14:30:00Z",
                                               "environment": "production",
                                               "region": "us-east-1",
                                               "terraform_version": "1.6.0",
                                               "total_resources": 30,
                                               "provider": "aws"
                                           }
                                       },
                                       title = 'Terraform Project Visualization',
                                       theme = 'dark',
                                       height = 800,
                                       onNodeClick,
                                   }: ClassicLayoutEmbedProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
    const [sortBy, setSortBy] = useState<'name' | 'type' | 'deps'>('name');
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [show3DModal, setShow3DModal] = useState(false);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const nodes = data.nodes || [];
    const edges = data.edges || [];
    const resources = data.resources || [];

    // Calculate stats
    const stats = useMemo(() => {
        const totalNodes = nodes.length;
        const totalEdges = edges.length;
        const resourceNodes = nodes.filter(n => n.type === 'resource');
        const moduleNodes = nodes.filter(n => n.type === 'module');
        const healthyNodes = nodes.filter(n => ['active', 'integrated', 'leaf', 'input', 'configuration', 'healthy'].includes(n.state));
        const warnings = nodes.filter(n => n.state === 'warning');
        const unused = nodes.filter(n => n.state === 'unused');

        const healthScore = totalNodes > 0 ? Math.round((healthyNodes.length / totalNodes) * 100) : 100;

        const providerStats: Record<string, number> = {};

        // Get providers from resources first
        resources.forEach(resource => {
            const provider = (resource.provider || resource.type.split('_')[0]).toLowerCase();
            if (provider) {
                providerStats[provider] = (providerStats[provider] || 0) + 1;
            }
        });

        // If no resources, try to extract from nodes
        if (resources.length === 0) {
            nodes.forEach(node => {
                if (node.type === 'resource') {
                    const provider = (node.provider || node.subtype?.split('_')[0] || node.details?.provider || '').toString().toLowerCase();
                    if (provider) {
                        providerStats[provider] = (providerStats[provider] || 0) + 1;
                    }
                }
            });
        }

        const totalDeps = nodes.reduce((sum, n) => sum + (n.dependencies_out || 0) + (n.dependencies_in || 0), 0);
        const avgDeps = totalNodes > 0 ? (totalDeps / totalNodes).toFixed(1) : '0.0';

        const topProviders = Object.entries(providerStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3);

        return {
            totalNodes,
            totalEdges,
            resourceCount: resourceNodes.length,
            moduleCount: moduleNodes.length,
            healthyNodes: healthyNodes.length,
            warnings: warnings.length,
            unused: unused.length,
            healthScore,
            avgDeps,
            topProviders,
        };
    }, [nodes, edges, resources]);

    // Filter and sort nodes
    const filteredNodes = useMemo(() => {
        let filtered = nodes.filter(node => {
            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();

                // Parse advanced search syntax
                const typeMatch = query.match(/type:(\w+)/);
                const stateMatch = query.match(/state:(\w+)/);
                const providerMatch = query.match(/provider:(\w+)/);

                if (typeMatch && node.type !== typeMatch[1]) return false;
                if (stateMatch && node.state !== stateMatch[1]) return false;
                if (providerMatch && !node.provider?.toLowerCase().includes(providerMatch[1])) return false;

                // Free text search (exclude advanced syntax)
                const freeText = query
                    .replace(/type:\w+/g, '')
                    .replace(/state:\w+/g, '')
                    .replace(/provider:\w+/g, '')
                    .trim();

                if (freeText) {
                    const searchableText = [
                        node.label,
                        node.type,
                        node.subtype || '',
                        node.state,
                        node.state_reason || '',
                    ].join(' ').toLowerCase();

                    if (!searchableText.includes(freeText)) return false;
                }
            }

            // Active filters (chip-based)
            if (activeFilters.type && node.type !== activeFilters.type) return false;
            if (activeFilters.state && node.state !== activeFilters.state) return false;
            if (activeFilters.provider && !node.provider?.toLowerCase().includes(activeFilters.provider.toLowerCase())) return false;

            return true;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.label.localeCompare(b.label);
                case 'type':
                    return a.type.localeCompare(b.type);
                case 'deps':
                    return (
                        (b.dependencies_in || 0) + (b.dependencies_out || 0) -
                        ((a.dependencies_in || 0) + (a.dependencies_out || 0))
                    );
                default:
                    return 0;
            }
        });

        return filtered;
    }, [nodes, searchQuery, activeFilters, sortBy]);

    // Toast management
    const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, title, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !showCommandPalette) {
                e.preventDefault();
                searchInputRef.current?.focus();
                setShowSearchSuggestions(true);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowCommandPalette(prev => !prev);
            }
            if (e.key === 'Escape') {
                setShow3DModal(false);
                setShowCommandPalette(false);
                setShowSearchSuggestions(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showCommandPalette]);

    const handleSuggestionClick = useCallback((filterType: string, filterValue: string) => {
        if (filterType === 'sort') {
            setSortBy(filterValue as 'name' | 'type' | 'deps');
            showToast('Sort Applied', `Sorted by ${filterValue}`, 'info');
        } else if (filterType === 'search') {
            setSearchQuery(filterValue);
        } else {
            setActiveFilters(prev => ({ ...prev, [filterType]: filterValue }));
            showToast('Filter Applied', `${filterType}: ${filterValue}`, 'info');
        }
        setShowSearchSuggestions(false);
    }, [showToast]);

    const addFilterChip = useCallback((key: string, value: string) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
        showToast('Filter Added', `${key}: ${value}`, 'info');
    }, [showToast]);

    const removeFilterChip = useCallback((key: string) => {
        const newFilters = { ...activeFilters };
        delete newFilters[key];
        setActiveFilters(newFilters);
    }, [activeFilters]);

    const handleNodeClick = useCallback((node: Node) => {
        setSelectedNode(node);
        onNodeClick?.(node);
        showToast('Node Selected', `${node.label} - ${node.type}`, 'info');
    }, [onNodeClick, showToast]);

    const handleVisualize = useCallback((node: Node) => {
        setSelectedNode(node);
        setShow3DModal(true);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setActiveFilters({});
    }, []);

    const resetFilters = useCallback(() => {
        setActiveFilters({});
        showToast('Filters Cleared', 'All filters have been reset', 'info');
    }, [showToast]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    const getNodeIcon = (type: string) => {
        const icons: Record<string, string> = {
            resource: 'fa-cube',
            module: 'fa-cubes',
            variable: 'fa-code',
            output: 'fa-arrow-right',
            data: 'fa-database',
            provider: 'fa-plug',
        };
        return icons[type] || 'fa-cube';
    };

    const getStateClass = (state: string) => {
        const mapping: Record<string, string> = {
            healthy: 'node-healthy',
            active: 'node-healthy',
            integrated: 'node-healthy',
            leaf: 'node-leaf',
            unused: 'node-unused',
            external: 'node-external',
            external_data: 'node-external',
            configuration: 'node-external',
            orphan: 'node-orphan',
            orphaned: 'node-orphan',
            isolated: 'node-orphan',
            warning: 'node-warning',
        };
        return mapping[state] || '';
    };

    return (
        <>
            <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

            <style>{CSS_STYLES}</style>

            <div className="classic-embed-root" style={{ height: `${height}px`, overflow: 'auto' }}>
                {/* Toast Notifications */}
                <div className="toast-container">
                    {toasts.map(toast => (
                        <div key={toast.id} className={`toast show ${toast.type}`}>
                            <i className={`toast-icon fas fa-${toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'times-circle' : toast.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}`}></i>
                            <div className="toast-content">
                                <div className="toast-title">{toast.title}</div>
                                <div className="toast-message">{toast.message}</div>
                            </div>
                            <button className="toast-close" onClick={() => removeToast(toast.id)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <i className="fas fa-cloud"></i>
                            <span>Cloud Providers</span>
                        </div>
                        <div className="stat-body">
                            {stats.topProviders.length > 0 ? (
                                <div className="provider-list">
                                    {stats.topProviders.map(([provider, count]) => (
                                        <div key={provider} className="provider-item">
                                            <i className={`fab fa-${provider.includes('aws') ? 'aws' : provider.includes('azure') ? 'microsoft' : provider.includes('google') ? 'google' : 'cloud'}`}></i>
                                            <span>{provider.toUpperCase()}</span>
                                            <span className="provider-count">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9em' }}>
                                    <i className="fas fa-cloud" style={{ fontSize: '2em', opacity: 0.3, marginBottom: '10px', display: 'block' }}></i>
                                    No provider data available
                                </div>
                            )}
                        </div>
                        <div className="stat-footer clickable">
                            View distribution
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <i className="fas fa-heart-pulse"></i>
                            <span>Health Overview</span>
                        </div>
                        <div className="stat-body">
                            <div className="stat-row major">
                                <span className="stat-title">Health Score</span>
                                <div className="stat-value with-trend">
                                    {stats.healthScore}%
                                    <span className={`trend ${stats.healthScore > 80 ? 'positive' : 'negative'}`}>
                                        <i className={`fas fa-${stats.healthScore > 80 ? 'arrow-up' : 'arrow-down'}`}></i>
                                    </span>
                                </div>
                            </div>
                            <div className="stat-row warning">
                                <span className="stat-title">Warnings</span>
                                <span className="stat-value">{stats.warnings}</span>
                            </div>
                            <div className="stat-row danger">
                                <span className="stat-title">Unused</span>
                                <span className="stat-value">{stats.unused}</span>
                            </div>
                        </div>
                        <div className="stat-footer clickable">
                            View health details
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <i className="fas fa-diagram-project"></i>
                            <span>Dependencies</span>
                        </div>
                        <div className="stat-body">
                            <div className="stat-row major">
                                <span className="stat-title">Total Relations</span>
                                <span className="stat-value">{stats.totalEdges}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-title">Avg Dependencies</span>
                                <div className="stat-value with-trend">
                                    {stats.avgDeps}
                                    <span className={`trend ${parseFloat(stats.avgDeps) < 4 ? 'positive' : 'warning'}`}>
                                        <i className="fas fa-chart-line"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="stat-footer clickable">
                            Analyze dependencies
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <i className="fas fa-cubes"></i>
                            <span>Components</span>
                        </div>
                        <div className="stat-body">
                            <div className="stat-row major">
                                <span className="stat-title">Total Components</span>
                                <span className="stat-value">{stats.totalNodes}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-title">Resources</span>
                                <span className="stat-value">{stats.resourceCount}</span>
                            </div>
                            <div className="stat-row">
                                <span className="stat-title">Modules</span>
                                <span className="stat-value">{stats.moduleCount}</span>
                            </div>
                        </div>
                        <div className="stat-footer clickable">
                            View all components
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </div>
                </div>

                {/* Main Panel */}
                <div className="main-panel">
                    <div className="panel-header">
                        <div className="panel-title">
                            <i className="fas fa-cubes"></i> Infrastructure Components
                        </div>
                    </div>

                    {/* Search Interface */}
                    <div className="search-interface">
                        <div className="search-wrapper">
                            <div className="search-field">
                                <div className="search-input-wrapper">
                                    <i className="fas fa-search"></i>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="search-input"
                                        placeholder="Search infrastructure components..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSearchSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                                    />
                                    <div className="search-shortcuts">
                                        <kbd>/</kbd>
                                    </div>
                                </div>

                                {/* Search Suggestions Panel */}
                                <div className={`search-suggestions ${showSearchSuggestions ? 'show' : ''}`}>
                                    <div className="suggestion-group">
                                        <div className="suggestion-header">Common Filters</div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('type', 'resource')}>
                                            <i className="fas fa-cube"></i>
                                            <span>Resources</span>
                                        </div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('state', 'unused')}>
                                            <i className="fas fa-ban"></i>
                                            <span>Unused Components</span>
                                        </div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('state', 'warning')}>
                                            <i className="fas fa-exclamation-triangle"></i>
                                            <span>With Warnings</span>
                                        </div>
                                    </div>
                                    {stats.topProviders.length > 0 && (
                                        <div className="suggestion-group">
                                            <div className="suggestion-header">Providers</div>
                                            {stats.topProviders.map(([provider]) => (
                                                <div key={provider} className="suggestion-item" onClick={() => handleSuggestionClick('provider', provider)}>
                                                    <i className={`fab fa-${provider.includes('aws') ? 'aws' : provider.includes('azure') ? 'microsoft' : provider.includes('google') ? 'google' : 'cloud'}`}></i>
                                                    <span>{provider.toUpperCase()} Resources</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="suggestion-group">
                                        <div className="suggestion-header">Sort Options</div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('sort', 'name')}>
                                            <i className="fas fa-sort-alpha-down"></i>
                                            <span>Sort by Name</span>
                                        </div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('sort', 'deps')}>
                                            <i className="fas fa-project-diagram"></i>
                                            <span>By Dependencies</span>
                                        </div>
                                        <div className="suggestion-item" onClick={() => handleSuggestionClick('sort', 'type')}>
                                            <i className="fas fa-layer-group"></i>
                                            <span>By Type</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="search-tools">
                                <button className="search-tool-btn" onClick={clearSearch}>
                                    <i className="fas fa-times"></i>
                                </button>
                                <div className="search-divider"></div>
                                <button className="search-tool-btn" onClick={() => setShowCommandPalette(true)}>
                                    <i className="fas fa-terminal"></i>
                                </button>
                            </div>
                        </div>

                        {Object.keys(activeFilters).length > 0 && (
                            <div className="active-filters">
                                <div className="filter-tags">
                                    {Object.entries(activeFilters).map(([key, value]) => (
                                        <div key={key} className="filter-tag">
                                            {key}: {value}
                                            <span className="remove" onClick={() => removeFilterChip(key)}>
                                                <i className="fas fa-times"></i>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <button className="clear-filters" onClick={resetFilters}>
                                    <i className="fas fa-times"></i>
                                    <span>Clear filters</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Graph Container */}
                    <div className="graph-container">
                        {filteredNodes.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h3>No components found</h3>
                                <p>Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            <div className="graph-nodes">
                                {filteredNodes.map(node => (
                                    <div
                                        key={node.id}
                                        className={`graph-node ${getStateClass(node.state)}`}
                                        onClick={() => handleNodeClick(node)}
                                    >
                                        <div className="graph-node-header">
                                            <div className="graph-node-icon">
                                                <i className={`fas ${getNodeIcon(node.type)}`}></i>
                                            </div>
                                            <div className="graph-node-title-container">
                                                <div className="graph-node-title">{node.label}</div>
                                                <div className="graph-node-type">
                                                    <i className={`fas ${getNodeIcon(node.type)}`}></i>
                                                    {node.subtype || node.type}
                                                </div>
                                                <span className="graph-node-state" style={{
                                                    background: node.state === 'unused' ? '#ef4444' :
                                                        node.state === 'warning' ? '#f59e0b' :
                                                            node.state === 'external' || node.state === 'external_data' || node.state === 'configuration' ? '#06b6d4' :
                                                                '#10b981',
                                                    color: 'white'
                                                }}>
                                                    {node.state}
                                                </span>
                                            </div>
                                            <div className="graph-node-actions">
                                                <div className="node-action" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVisualize(node);
                                                }}>
                                                    <i className="fas fa-cube"></i>
                                                </div>
                                                <div className="node-action">
                                                    <i className="fas fa-info"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="graph-node-dependencies">
                                            <div className="graph-node-deps-item">
                                                <i className="fas fa-arrow-up"></i>
                                                <span>Uses:</span>
                                                <span className="graph-node-deps-count outgoing">{node.dependencies_out || 0}</span>
                                            </div>
                                            <div className="graph-node-deps-item">
                                                <i className="fas fa-arrow-down"></i>
                                                <span>Used by:</span>
                                                <span className="graph-node-deps-count incoming">{node.dependencies_in || 0}</span>
                                            </div>
                                        </div>
                                        {node.state_reason && (
                                            <div className="graph-node-reason">{node.state_reason}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3D Visualization Modal */}
                {show3DModal && (
                    <>
                        <div className={`backdrop ${show3DModal ? 'show' : ''}`} onClick={() => setShow3DModal(false)}></div>
                        <div className={`visualization-modal ${show3DModal ? 'show' : ''}`}>
                            <div className="visualization-header">
                                <div className="visualization-title">
                                    <i className="fas fa-cube"></i>
                                    <span>3D Dependency Visualization: {selectedNode?.label}</span>
                                </div>
                                <button className="visualization-close" onClick={() => setShow3DModal(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="visualization-content">
                                <Suspense fallback={
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0a8c1' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2em', marginBottom: '10px' }}></i>
                                            <p>Loading visualization...</p>
                                        </div>
                                    </div>
                                }>
                                    <ThreeDVisualization nodeId={selectedNode?.id || ''} />
                                </Suspense>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default ClassicLayoutEmbed;