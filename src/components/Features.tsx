import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  NetworkIcon,
  SearchIcon,
  AlertTriangleIcon,
  LayersIcon,
  GitGraphIcon,
  ZapIcon,
  CpuIcon,
  ShieldIcon,
  GitBranchIcon,
  CloudIcon,
  CodeIcon,
  SettingsIcon,
  FileTextIcon,
} from 'lucide-react'

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile devices and disable parallax effects
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current || isMobile) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)

    setMousePosition({ x, y })
  }, [isMobile])

  const features = [
    {
      icon: NetworkIcon,
      title: 'Interactive Graph Visualization',
      description: 'Explore your infrastructure with interactive node graphs. Pan, zoom, and click to understand resource relationships.',
      gradient: 'from-purple-500 to-cyan-500',
    },
    {
      icon: SearchIcon,
      title: 'Deep State Analysis',
      description: 'Analyze your Terraform state files with detailed insights into resource configurations and dependencies.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: AlertTriangleIcon,
      title: 'Dependency Detection',
      description: 'Automatically detect circular dependencies and potential issues in your infrastructure code.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: LayersIcon,
      title: 'Module Visualization',
      description: 'Visualize module hierarchies and understand how your infrastructure is organized across environments.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: FileTextIcon,
      title: 'Data Integration',
      description: 'Get your analysis in JSON, YAML, CSV, DOT, MMD, etc - perfect for docs, dashboards, or CI/CD pipelines',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: ZapIcon,
      title: 'Fast & Lightweight',
      description: 'Built with performance in mind. Analyze large state files instantly with optimized algorithms.',
      gradient: 'from-cyan-500 to-blue-500',
    },

  ]

  const parallaxTransform = isMobile
    ? {}
    : {
      transform: `rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * 2}deg)`,
    }

  return (
    <section
      ref={containerRef}
      className="features-container"
      onMouseMove={handleMouseMove}
      aria-labelledby="features-heading"
    >
      <div className="features-parallax-scene" style={parallaxTransform}>
        <div
          className="features-background-layer"
          style={{
            transform: isMobile
              ? 'translateZ(-400px)'
              : `translateZ(-400px) translateX(${mousePosition.x * -100}px) translateY(${mousePosition.y * -100}px)`,
          }}
        />

        <div
          className="features-floating-elements"
          style={{ transform: `translateZ(-200px)` }}
        >
          <div
            className="floating-element element-1"
            style={{
              transform: isMobile
                ? 'none'
                : `translateX(${mousePosition.x * -60}px) translateY(${mousePosition.y * -60}px)`,
            }}
          />
          <div
            className="floating-element element-2"
            style={{
              transform: isMobile
                ? 'none'
                : `translateX(${mousePosition.x * -40}px) translateY(${mousePosition.y * -40}px)`,
            }}
          />
          <div
            className="floating-element element-3"
            style={{
              transform: isMobile
                ? 'none'
                : `translateX(${mousePosition.x * -50}px) translateY(${mousePosition.y * -50}px)`,
            }}
          />
        </div>

        <div className="features-content" style={{ transform: `translateZ(50px)` }}>
          <motion.header
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: '-50px' }}
            className="features-header"
          >
            <h2 id="features-heading" className="gradient-text">
              Powerful Features
            </h2>
            <p className="features-subtitle">
              Everything you need to understand and visualize your Terraform infrastructure across all cloud providers
            </p>
          </motion.header>

          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  feature: {
    icon: React.ComponentType<any>
    title: string
    description: string
    gradient?: string
  }
  index: number
  isMobile: boolean
}

function FeatureCard({ feature, index, isMobile }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || isMobile) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)

    setCardRotation({ x: y * 10, y: x * 10 })
  }, [isMobile])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setCardRotation({ x: 0, y: 0 })
    setIsHovered(false)
  }, [])

  const cardTransform = isMobile
    ? {}
    : {
      transform: `perspective(1000px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg) translateZ(20px)`,
    }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.1, 0.6),
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true, margin: '-50px' }}
      className="feature-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={cardTransform}
      whileHover={!isMobile ? { y: -8 } : {}}
    >
      <div className={`feature-icon ${feature.gradient || 'from-cyan-500 to-blue-500'}`}>
        <motion.div
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <feature.icon size={24} />
        </motion.div>
      </div>

      <h3>{feature.title}</h3>
      <p>{feature.description}</p>

      <motion.div
        className="feature-hover-indicator"
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
    </motion.article>
  )
}