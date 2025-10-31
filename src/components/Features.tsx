import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, type MouseEvent } from 'react';
import {
  ZapIcon,
  ShieldCheckIcon,
  FileTextIcon,
  BarChart3Icon,
  GitBranchIcon,
  NetworkIcon,
  SparklesIcon,
  ArrowRightIcon,
  type LucideIcon,
  SearchIcon
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  command: string;
  useCase: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const features: Feature[] = [
  {
    icon: ZapIcon,
    title: 'Quick Scan',
    description: 'Get instant insights into your Terraform project - resources, health score, and potential issues in seconds',
    gradient: 'from-yellow-400 to-orange-500',
    command: 'tfkit scan --open',
    useCase: 'Project overview'
  },
  {
    icon: SearchIcon,
    title: 'Validate Configs',
    description: 'Check syntax, find unused variables, security issues, and best practice violations before deployment',
    gradient: 'from-green-400 to-emerald-600',
    command: 'tfkit validate --all',
    useCase: 'Pre-commit checks'
  },
  {
    icon: FileTextIcon,
    title: 'Export Data',
    description: 'Get your analysis in JSON, YAML, CSV - perfect for docs, dashboards, or CI/CD pipelines',
    gradient: 'from-blue-400 to-cyan-500',
    command: 'tfkit export --format json',
    useCase: 'Tool integration'
  },
  {
    icon: BarChart3Icon,
    title: 'Visualize',
    description: 'See your infrastructure as interactive graphs with 10+ themes. No more guessing about dependencies',
    gradient: 'from-purple-400 to-pink-500',
    command: 'tfkit scan --theme dark --layout graph',
    useCase: 'Architecture review'
  },
  {
    icon: GitBranchIcon,
    title: 'CI/CD Ready',
    description: 'SARIF output, fail-fast mode, and quiet options that actually work in automation',
    gradient: 'from-indigo-400 to-violet-600',
    command: 'tfkit validate --format sarif',
    useCase: 'Pipeline integration'
  },
  {
    icon: NetworkIcon,
    title: 'Dependency Map',
    description: 'Understand how everything connects with clear dependency tracking and relationship mapping',
    gradient: 'from-rose-400 to-red-500',
    command: 'tfkit scan --layout graph',
    useCase: 'Impact analysis'
  }
];

function FeatureCard({ feature, index }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="feature-card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="feature-card-glow" />

      <div className="feature-card">
        {/* Animated background elements */}
        <div className="feature-card-bg-pattern" />
        <div className="feature-card-gradient" />

        {/* Header with icon and badge */}
        <div className="feature-header">
          <motion.div
            className="feature-icon-wrapper"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="feature-icon-bg">
              <SparklesIcon className="feature-sparkle" />
            </div>
            <feature.icon className="feature-icon" />
          </motion.div>

          {/* <div className="feature-badge">
            <span>{feature.capability}</span>
          </div> */}
        </div>

        {/* Content */}
        <div className="feature-content">
          <h3 className="feature-title">
            {feature.title}
          </h3>

          <p className="feature-description">
            {feature.description}
          </p>

          {/* <div className="feature-stats">
            <div className="stat-pill">
              {feature.stats}
            </div>
          </div> */}
        </div>

        {/* Animated CTA */}
        <motion.div
          className="feature-cta"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span>Explore feature</span>
          <ArrowRightIcon className="cta-arrow" />
        </motion.div>

        {/* Particle effects */}
        <div className="feature-particles">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <div className="features-section-premium">
      <div className="premium-bg">
        {/* <div className="floating-orb orb-1" />
        <div className="floating-orb orb-2" />
        <div className="floating-orb orb-3" /> */}
        <div className="animated-grid" />
        <div className="scanlines" />
      </div>

      <div className="features-container-premium">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
          className="premium-header"
        >
          <h2 className="premium-title">
            <span className="title-gradient">Terraform</span>
            <span className="title-main"> Intelligence Suite</span>
          </h2>

          <motion.p
            className="premium-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            Unlock deep insights into your Terraform environments with advanced analytics,
            automated validation, and rich visual intelligence. Export, integrate, and optimize
            effortlessly — across macOS, Linux, and Windows.
          </motion.p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="premium-features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}