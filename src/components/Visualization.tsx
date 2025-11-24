import { useEffect, useCallback, useState, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { LayoutGridIcon, BarChart3Icon, NetworkIcon, Loader2, PaintBucket } from 'lucide-react';

interface Visualization {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  functionality: string;
  file: string;
  scale: number;
  features: string[];
}

const allVisualizations: Visualization[] = [
  {
    "id": "graph",
    "name": "Graph Dependency Network",
    "icon": NetworkIcon,
    "description": "Advanced network visualization mapping complex dependencies between Terraform resources and modules with real-time analytics and interactive exploration.",
    "functionality": "Analyzes parsed Terraform resources to build comprehensive dependency graphs, identify failure domains, and visualize resource relationships. Enables impact analysis for changes and rapid incident response by tracing dependencies across your infrastructure through interactive force-directed graphs with state-based coloring and risk assessment.",
    "file": "/graph.html",
    "scale": 0.75,
    "features": [
      "Force-directed D3.js graph with zoom, pan, and physics simulation",
      "Global command interface with keyboard shortcuts and fuzzy search",
      "Detailed Terraform object viewer with hover tooltips and metadata display",
      "Visual state management with color-coded nodes and status indicators",
      "Multiple navigation methods with physics toggles and view management",
    ]
  }, {
    "id": "analytics",
    "name": "Analytics Dashboard",
    "icon": BarChart3Icon,
    "description": "Data-heavy view with charts, graphs, and metrics for understanding Terraform infrastructure at a glance",
    "functionality": "Displays infrastructure statistics through multiple visualization types - pie charts for distribution, bar graphs for comparisons, radar charts for dependencies, and real-time health metrics",
    "file": "/dashboard.html",
    "scale": 0.9,
    "features": [
      "Component distribution pie chart",
      "Health status breakdown",
      "Dependency analysis radar chart",
      "Resource type bar graphs",
      "Time-series activity tracking",
      "Stacked state visualization",
      "KPI donut charts",
      "Click-to-filter interactions",
      "Data export (JSON/PNG)",
      "Keyboard-driven command palette"
    ]
  },
  {
    "id": "classic",
    "name": "Classic Dashboard",
    "icon": LayoutGridIcon,
    "description": "Fine infrastructure visualization with modern UI components, advanced filtering, and interactive dependency management for Terraform projects.",
    "functionality": "Provides a complete overview of Terraform infrastructure with statistical insights, search-driven navigation, and 3D visualization capabilities. Features real-time filtering, command palette interface, and detailed component analysis with health scoring and dependency mapping.",
    "file": "/classic.html",
    "scale": 1.0,
    "features": [
      "Modern stats grid with health scoring and provider insights",
      "Advanced search interface with filter suggestions and keyboard shortcuts",
      "Interactive command palette with fuzzy search and quick actions",
      "3D dependency visualization with WebGL/Canvas fallback",
      "Real-time filtering with parsed query syntax and active tags",
      "Component cards with state badges, dependency counts, and actions",
      "Toast notification system with multiple alert types",
      "Quick actions bar for common operations",
      "Responsive design with mobile-friendly touch targets",
      "Export functionality for dashboard data"
    ]
  },
];
interface VisualizationContainerProps {
  children: ReactNode;
  isInteractive?: boolean;
  mobileBehavior?: 'hide' | 'message' | 'simplified' | 'full';
  breakpoint?: number;
  customMobileMessage?: {
    icon?: string | ReactNode;
    title?: string;
    message?: string;
  };
  containerClassName?: string;
  mobileClassName?: string;
  onMobileDetected?: (isMobile: boolean) => void;
  enableTouchInteractions?: boolean;
  simplifiedMobileView?: ReactNode;
}

export function VisualizationContainer({
  children,
  isInteractive = true,
  mobileBehavior = 'message',
  breakpoint = 768,
  customMobileMessage,
  containerClassName = '',
  mobileClassName = '',
  onMobileDetected,
  enableTouchInteractions = false,
  simplifiedMobileView
}: VisualizationContainerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
      onMobileDetected?.(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint, onMobileDetected]);

  const defaultMobileMessage = {
    icon: '📱',
    title: 'Interactive Visualization',
    message: 'This interactive visualization is optimized for desktop devices. Please visit from a larger screen to explore the full functionality.'
  };

  const mobileMessage = {
    ...defaultMobileMessage,
    ...customMobileMessage
  };

  const renderMobileContent = () => {
    switch (mobileBehavior) {
      case 'hide': return null;
      case 'simplified':
        return simplifiedMobileView || (
          <div className={`demo-container border-2 border-black ${containerClassName}`}>
            <div className="demo-placeholder">
              <div className="demo-placeholder-icon">📊</div>
              <div className="demo-placeholder-text">Simplified Mobile View</div>
            </div>
          </div>
        );
      case 'full':
        return (
          <div className={`demo-container border-2 border-black ${containerClassName}`}>
            {children}
          </div>
        );
      case 'message':
      default:
        return (
          <div className={`visualization-mobile-message ${mobileClassName}`}>
            <h3 className="mobile-message-title">{mobileMessage.title}</h3>
            <p className="mobile-message-text">{mobileMessage.message}</p>
          </div>
        );
    }
  };

  if (!isInteractive) {
    return <div className={`demo-container border-2 border-black ${containerClassName}`}>{children}</div>;
  }

  if (isMobile) {
    return renderMobileContent();
  }

  return (
    <div
      className={`demo-container border-2 border-black smooth-scroll ${containerClassName}`}
      style={enableTouchInteractions ? { touchAction: 'manipulation', userSelect: 'none' } : undefined}
    >
      {children}
    </div>
  );
}

interface EmbeddedSectionProps {
  file: string;
  scale?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function EmbeddedSection({
  file,
  scale = 1,
  height = 800,
  onLoad,
  onError
}: EmbeddedSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const iframe = iframeRef.current;
    const container = containerRef.current;

    if (iframe) {
      iframe.addEventListener('wheel', preventScroll, { passive: false });
      iframe.addEventListener('touchmove', preventScroll, { passive: false });
    }

    if (container) {
      container.addEventListener('wheel', (e) => {
        if (e.ctrlKey) return; // Allow zoom
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }, { passive: false });
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('wheel', preventScroll);
        iframe.removeEventListener('touchmove', preventScroll);
      }
      if (container) {
        container.removeEventListener('wheel', preventScroll);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully:', file);
    setIsLoading(false);
    setHasError(false);

    setTimeout(() => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument) {
          const iframeBody = iframe.contentDocument.body;
          iframeBody.classList.add('smooth-scroll');

          // Prevent iframe internal scrolling
          iframeBody.style.overflow = 'hidden';
          iframeBody.style.height = '100%';

          // Apply to iframe document element as well
          iframe.contentDocument.documentElement.classList.add('smooth-scroll');
          iframe.contentDocument.documentElement.style.overflow = 'hidden';
          iframe.contentDocument.documentElement.style.height = '100%';
        }
      } catch (error) {
        // Cross-origin iframe, cannot access contentDocument
        console.log('Cannot access iframe content due to CORS');
      }
    }, 100);

    onLoad?.();
  };

  const handleIframeError = () => {
    console.error('Iframe failed to load:', file);
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);

    if (iframeRef.current) {
      iframeRef.current.src = file + '?retry=' + Date.now();
    }
  };

  return (
    <section
      className="w-full overflow-hidden shadow-2xl bg-gray-900/10 relative smooth-scroll"
      style={{ height }}
      ref={containerRef}
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-10 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mb-4"
            >
              <Loader2 size={48} className="text-cyan-400" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-cyan-300 text-lg font-medium"
            >
              Loading Visualization...
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-sm mt-2"
            >
              {file}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-900/20 z-10 flex items-center justify-center"
          >
            <div className="text-center p-8 max-w-md">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-red-300 text-xl font-semibold mb-2">
                Failed to Load Visualization
              </h3>
              <p className="text-red-200 mb-4">
                Could not load: {file}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Check if the file exists and your server is running
              </p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Retry Loading
              </button>
              <p className="text-gray-500 text-xs mt-3">
                Retry attempt: {retryCount + 1}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="overflow-hidden smooth-scroll"
        style={{
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        <iframe
          key={`${file}-${retryCount}`}
          ref={iframeRef}
          src={file}
          title="Embedded Section"
          className="w-full h-full border-0 smooth-scroll"
          style={{
            border: '0',
            pointerEvents: 'auto',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            overflow: 'hidden'
          }}
          sandbox="allow-scripts allow-same-origin"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          scrolling="no"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}


const baseMobileMessageProps = {
  isInteractive: true,
  mobileBehavior: "message" as const,
  customMobileMessage: {
    icon: '🖥️',
    message: 'This visualization is interactive and best viewed on a desktop. Please switch devices for the optimal experience.',
  },
  mobileClassName: "p-8 border-2 border-dashed border-indigo-400 bg-indigo-50/20 rounded-lg h-96 flex items-center justify-center text-center"
};
const VizSideDock = ({
  isVisible,
  allVisualizations,
  activeView,
  isTransitioning,
  loadedViews,
  handleViewChange
}: {
  isVisible: boolean;
  allVisualizations: Visualization[];
  activeView: string;
  isTransitioning: boolean;
  loadedViews: Set<string>;
  handleViewChange: (viewId: string) => void;
}) => (
  <motion.div
    initial={{ x: 100, opacity: 0 }}
    animate={{
      x: isVisible ? 0 : 100,
      opacity: isVisible ? 1 : 0
    }}
    transition={{ type: "spring", stiffness: 150, damping: 25 }}
    className="fixed z-50 right-0 bottom-6 left-1/2 transform -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:left-auto md:right-6 md:transform-none"
    style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
  >
    <div className="w-[90%] max-w-xs h-16 px-4 rounded-2xl bg-theme-tertiary/80 backdrop-blur-xl border border-theme shadow-2xl flex items-center justify-around md:w-20 md:h-auto md:py-8 md:px-2 md:rounded-3xl md:flex-col md:justify-center md:gap-6">
      {allVisualizations.map(viz => (
        <motion.button
          key={viz.id}
          onClick={() => handleViewChange(viz.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`group relative p-3 rounded-lg transition-all duration-200 ${activeView === viz.id
            ? 'bg-theme-cyan/30 text-theme-cyan border border-theme shadow-lg'
            : 'bg-transparent text-text-tertiary hover:bg-theme-tertiary hover:text-color-cyan'
            } ${isTransitioning ? 'opacity-50 pointer-events-none' : ''}`}
          title={viz.name}
          disabled={isTransitioning}
        >
          <viz.icon size={24} />

          {/* Loading indicator for loaded views */}
          {loadedViews.has(viz.id) && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-theme-tertiary"
            />
          )}

          <motion.div
            className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-3 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300"
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
          >
            <div className="bg-theme-secondary text-text-primary text-xs rounded py-1 px-3 shadow-xl whitespace-nowrap border border-theme">
              {viz.name}
            </div>
          </motion.div>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

export function InteractiveVizSelector() {
  const [activeView, setActiveView] = useState(allVisualizations[0].id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedViews, setLoadedViews] = useState<Set<string>>(new Set());
  const activeVisualization = allVisualizations.find(v => v.id === activeView)!;
  const sectionRef = useRef(null);
  const isVisible = useInView(sectionRef, { once: false, margin: "-500px 0px" });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleViewChange = useCallback((newView: string) => {
    if (newView === activeView) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(newView);
      setIsTransitioning(false);
    }, 300);
  }, [activeView]);

  const handleIframeLoad = useCallback((viewId: string) => {
    console.log('Iframe loaded for view:', viewId);
    setLoadedViews(prev => new Set([...prev, viewId]));
  }, []);

  const handleIframeError = useCallback((viewId: string) => {
    console.error('Iframe failed for view:', viewId);
  }, []);

  const MetricsSidebar = useCallback(() => (
    <motion.div
      key={`metrics-${activeView}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="lg:w-1/4 w-full p-4 lg:p-0 hidden lg:block"
    >
      <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-xl space-y-6">
        <div>
          <h4 className="text-xl font-bold text-indigo-400 mb-2">Description</h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {activeVisualization.description}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-700/50">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">How It Works</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            {activeVisualization.functionality}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-700/50">
          <h4 className="text-lg font-semibold text-green-400 mb-3">Key Features</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            {activeVisualization.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
            {activeVisualization.features.length > 4 && (
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>And much more...</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </motion.div>
  ), [activeView, activeVisualization]);

  const renderVisualizationPane = () => (
    <motion.div
      key={`viz-${activeView}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="lg:w-3/4 w-full h-full min-h-[600px] relative"
    >
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
        </motion.div>
      )}

      <VisualizationContainer
        {...baseMobileMessageProps}
        containerClassName="p-0 overflow-hidden smooth-scroll"
        breakpoint={1024}
      >
        <EmbeddedSection
          file={activeVisualization.file}
          scale={activeVisualization.scale}
          height={800}
          onLoad={() => handleIframeLoad(activeView)}
          onError={() => handleIframeError(activeView)}
        />
      </VisualizationContainer>
    </motion.div>
  );

  return (
    <section ref={sectionRef} className="visualization-section bg-grid bg-gray-900 text-white py-16 min-h-screen relative overflow-hidden">
      <div className="aurora-bg"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-cyan)' }}>
              <PaintBucket size={18} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">Interactive Tool</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Visual <span className="gradient-text">Explorer</span>
            </h1>

            <p className="text-sm md:text-base text-gray-400">
              Visualize every component, connection, and states dynamically. Switch between dashboard, graph and other views with ease.
            </p>
          </div>


        </motion.header>

        {/* Integrated Content and Visualization Area */}
        <div ref={containerRef} className="flex flex-col lg:flex-row gap-8 relative">
          <AnimatePresence mode="wait">
            {renderVisualizationPane()}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <MetricsSidebar key={`sidebar-${activeView}`} />
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Side Dock Navigation - Now using the external component */}
      <VizSideDock
        isVisible={isVisible && !isTransitioning}
        allVisualizations={allVisualizations}
        activeView={activeView}
        isTransitioning={isTransitioning}
        loadedViews={loadedViews}
        handleViewChange={handleViewChange}
      />
    </section>
  );
}