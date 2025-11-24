import { motion } from 'framer-motion';
import { ChevronDownIcon, TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      {/* Advanced Cyber Grid with Circuit Pattern */}
      <div className="hero-bg-grid" />

      {/* Particle Field */}
      <div className="hero-particles" />


      {/* Content */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            TFKit
          </h1>
          <h2 className="hero-subtitle">
            Terraform Intelligence & Analysis Suite
          </h2>
          <p className="hero-description">
            Comprehensive toolkit for analyzing, visualizing, and validating
            Terraform infrastructure code with advanced dependency tracking,
            security scanning, and interactive visualizations
          </p>
          <div className="hero-actions">
            <button
              onClick={() => navigate('/docs')}
              className="hero-button"
            >
              Get Started
            </button>
          </div>

          {/* Quick install command */}
          <div className="hero-install-command">
            <TerminalIcon className="hero-terminal-icon" />
            <code className="hero-code">
              pip install tfkit-py
            </code>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <ChevronDownIcon className="hero-scroll-icon" />
      </div>
    </div>
  );
}