// components/Visualization.jsx
import { useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LayoutGridIcon, NetworkIcon, BarChart3Icon } from 'lucide-react';
import { ClassicLayoutDemo } from './ClassicLayoutDemo.tsx';
import { DashboardDemo } from './DashboardDemo.tsx';
import GraphDemo from './GraphDemo.tsx';

const visualizations = [{
  id: 'graph',
  name: 'Graph Layout',
  icon: NetworkIcon,
  description: 'Force-directed graph showing resource relationships and dependencies with interactive node exploration',
  isInteractive: true
}, {
  id: 'dashboard',
  name: 'Dashboard Layout',
  icon: BarChart3Icon,
  description: 'Metrics-focused layout with comprehensive health status, resource breakdowns, and infrastructure insights',
  isInteractive: true
}, {
  id: 'classic',
  name: 'Classic Layout',
  icon: LayoutGridIcon,
  description: 'Traditional hierarchical card-based view with detailed component information and filtering capabilities',
  isInteractive: true
}];


interface VisualizationContainerProps {
  children: ReactNode;
  isInteractive?: boolean;
  // Configuration options
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
  // Configuration with defaults
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

    // Initial check
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint, onMobileDetected]);

  // Default mobile message content
  const defaultMobileMessage = {
    icon: '📱',
    title: 'Interactive Visualization',
    message: 'This interactive visualization is optimized for desktop devices. Please visit from a larger screen to explore the full functionality.'
  };

  const mobileMessage = {
    ...defaultMobileMessage,
    ...customMobileMessage
  };

  // Handle different mobile behaviors
  const renderMobileContent = () => {
    switch (mobileBehavior) {
      case 'hide':
        return null;

      case 'simplified':
        return simplifiedMobileView || (
          <div className={`demo-container ${containerClassName}`}>
            <div className="demo-placeholder">
              <div className="demo-placeholder-icon">📊</div>
              <div className="demo-placeholder-text">Simplified Mobile View</div>
              <p className="visualization-description-text">
                Basic view available on mobile
              </p>
            </div>
          </div>
        );

      case 'full':
        return (
          <div className={`demo-container ${containerClassName}`}>
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

  // If not interactive, always show children
  if (!isInteractive) {
    return (
      <div className={`demo-container ${containerClassName}`}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return renderMobileContent();
  }

  return (
    <div
      className={`demo-container ${containerClassName}`}
      style={enableTouchInteractions ? {
        touchAction: 'manipulation',
        userSelect: 'none'
      } : undefined}
    >
      {children}
    </div>
  );
}

export function Visualization() {
  const [activeView, setActiveView] = useState('graph');
  const activeVisualization = visualizations.find(v => v.id === activeView);

  const renderVisualization = () => {
    switch (activeView) {
      case 'graph':
        return (
          <VisualizationContainer
            isInteractive={true}
            mobileBehavior="message"
            customMobileMessage={{
              icon: '🖥️',
              title: 'Desktop Experience Required',
              message: 'This visualization includes complex interactions that work best on desktop computers with larger screens and mouse input.'
            }}
            mobileClassName="custom-mobile-style"
          >
            <GraphDemo />
          </VisualizationContainer>

        );
      case 'dashboard':
        return (
          <VisualizationContainer
            isInteractive={true}
            mobileBehavior="message"
            customMobileMessage={{
              icon: '🖥️',
              title: 'Desktop Experience Required',
              message: 'This visualization includes complex interactions that work best on desktop computers with larger screens and mouse input.'
            }}
            mobileClassName="custom-mobile-style"
          >
            <DashboardDemo />
          </VisualizationContainer>
        );
      case 'classic':
        return (
          <VisualizationContainer
            isInteractive={true}
            mobileBehavior="message"
            customMobileMessage={{
              icon: '🖥️',
              title: 'Desktop Experience Required',
              message: 'This visualization includes complex interactions that work best on desktop computers with larger screens and mouse input.'
            }}
            mobileClassName="custom-mobile-style"
          >
            <ClassicLayoutDemo />
          </VisualizationContainer>
        );
      default:
        return (
          <VisualizationContainer isInteractive={false}>
            <div className="demo-placeholder">
              <div className="demo-placeholder-icon">📊</div>
              <div className="demo-placeholder-text">Select a visualization layout</div>
            </div>
          </VisualizationContainer>
        );
    }
  };

  return (
    <section className="visualization-section">
      <div className="visualization-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="visualization-header"
        >
          <h2 className="visualization-title">
            Interactive Visualizations
          </h2>
          <p className="visualization-subtitle">
            Choose from multiple visualization layouts to explore your
            infrastructure from different perspectives
          </p>
        </motion.div>

        {/* Layout selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="visualization-selector"
        >
          {visualizations.map(viz => (
            <button
              key={viz.id}
              onClick={() => setActiveView(viz.id)}
              className={`visualization-button ${activeView === viz.id ? 'active' : 'inactive'
                }`}
            >
              <viz.icon className="visualization-button-icon" />
              <span>{viz.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Visualization display */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="visualization-display"
        >
          {renderVisualization()}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="visualization-description"
          >
            <p className="visualization-description-text">
              {activeVisualization?.description}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}