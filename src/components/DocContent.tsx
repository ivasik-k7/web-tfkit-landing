import React, {useEffect, useState} from 'react';
import {
    CheckCircleIcon,
    DownloadIcon,
    TerminalIcon,
    ShieldCheckIcon,
    FileTextIcon,
    AlertCircleIcon,
    TrendingUpIcon,
    MonitorIcon,
    SettingsIcon,
    XCircleIcon,
    WifiOffIcon,
    HardDriveIcon,
    CpuIcon,
    RefreshCwIcon,
    GitBranchIcon,
    ChevronRightIcon
} from 'lucide-react';
import { ThemeCard } from './ThemeCard.tsx';
import { DemoConsole } from './DemoConsole.tsx';
import {ThemeCarousel} from "./ThemeCarousel.tsx";
import {CodeBlock} from "./CodeBlock.tsx";
import {ConfigFileBlock} from "./ConfigFileBlock.tsx";
interface ThemeColors {
  bg_primary: string;
  bg_secondary: string;
  bg_tertiary: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  accent: string;
  accent_secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}
export function DocContent() {
    const [activeSection, setActiveSection] = useState('overview');

    // Section names mapping
    const sectionNames: { [key: string]: string } = {
        'overview': 'Overview',
        'quick-start': 'Quick Start',
        'quick-install': 'Quick Install',
        'linux': 'Linux Installation',
        'macos': 'macOS Installation',
        'windows': 'Windows Installation',
        'alternative-methods': 'Alternative Methods',
        'upgrading': 'Upgrading',
        'verifying': 'Verifying',
        'uninstalling': 'Uninstalling',
        'themes': 'Available Themes',
        'scan': 'Scan Command',
        'validate': 'Validate Command',
        'export': 'Export Command',
        'pipelines': 'Analysis Pipelines',
        'security': 'Security Workflow',
        'ci-cd': 'CI/CD Integration',
        'troubleshooting': 'Troubleshooting',
        'support': 'Support'
    };

    // Intersection Observer to detect active section
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -80% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('section[id], div[id^="quick-"], div[id^="linux"], div[id^="macos"], div[id^="windows"], div[id^="alternative"], div[id^="upgrading"], div[id^="verifying"], div[id^="uninstalling"], div[id^="scan"], div[id^="validate"], div[id^="export"], div[id^="pipelines"], div[id^="security"], div[id^="ci-cd"]');

        sections.forEach(section => {
            observer.observe(section);
        });

        return () => {
            sections.forEach(section => {
                observer.unobserve(section);
            });
        };
    }, []);

    // Scroll to section
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for sticky header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Get breadcrumb trail
    const getBreadcrumb = (sectionId: string): string[] => {
        const breadcrumbs = ['Documentation'];

        // Determine parent sections
        if (['quick-install', 'linux', 'macos', 'windows', 'alternative-methods', 'upgrading', 'verifying', 'uninstalling'].includes(sectionId)) {
            breadcrumbs.push('Installation');
        } else if (['scan', 'validate', 'export'].includes(sectionId)) {
            breadcrumbs.push('Commands');
        } else if (['pipelines', 'security', 'ci-cd'].includes(sectionId)) {
            breadcrumbs.push('Advanced');
        }

        breadcrumbs.push(sectionNames[sectionId] || sectionId);
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumb(activeSection);


    return (
    <div className="flex-1 relative w-[70%]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-cyan-500/20">
            <div className="px-8 py-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                            )}
                            <span
                                className={`${
                                    index === breadcrumbs.length - 1
                                        ? 'text-cyan-400 font-semibold'
                                        : 'text-gray-500'
                                } transition-colors`}
                            >
                  {crumb}
                </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Active Section Title */}
                <h2 className="mt-2 text-xl font-bold text-white">
                    {sectionNames[activeSection] || 'Documentation'}
                </h2>

                {/* Progress indicator */}
                <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300"
                        style={{
                            width: `${(Object.keys(sectionNames).indexOf(activeSection) + 1) / Object.keys(sectionNames).length * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
        <main className="flex-1 p-12 overflow-y-auto">
      <div className="max-w-4xl">
        {/* Overview Section */}
        <section id="overview" className="mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TFKit Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Terraform Intelligence & Analysis Suite
          </p>
          <div className="flex gap-3 mb-8">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold border border-cyan-500/30">
              Python 3.8+
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
              MIT License
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold border border-purple-500/30">
              v0.4.43
            </span>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            A comprehensive toolkit for analyzing, visualizing, and validating
            Terraform infrastructure code. TFKit provides deep insights into
            your Terraform projects with advanced dependency tracking, security
            scanning, and interactive visualizations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <CheckCircleIcon className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Quick Scanning
              </h3>
              <p className="text-gray-400 text-sm">
                Rapid project analysis with comprehensive metrics and health
                assessment
              </p>
            </div>
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <ShieldCheckIcon className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Validation Suite
              </h3>
              <p className="text-gray-400 text-sm">
                Built-in validation with security and compliance checks
              </p>
            </div>
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <FileTextIcon className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Multi-Format Export
              </h3>
              <p className="text-gray-400 text-sm">
                Flexible output formats for integration with other tools
              </p>
            </div>
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <MonitorIcon className="w-8 h-8 text-yellow-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Interactive Visualizations
              </h3>
              <p className="text-gray-400 text-sm">
                Rich graphical representations with multiple themes and layouts
              </p>
            </div>
          </div>
        </section>
        {/* Quick Start Section */}
        <section id="quick-start" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Quick Start</h2>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Installation
            </h3>
            <DemoConsole />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Basic Usage
            </h3>
            <p className="text-gray-300 mb-4">
              Get started with these essential commands:
            </p>
              <CodeBlock
                  lines={[
                      '# Scan with visualization',
                      '$ pip install tfkit-py',
                      '',
                      '# Scan with visualization',
                      '$ tfkit scan --open --theme dark --layout graph',
                      '',
                      '# Validate configurations',
                      '$ tfkit validate --all --strict',
                      '',
                      '# Export analysis results',
                      '$ tfkit export --format json --format yaml',
                  ]}
                  title=""
                  language=""
              />
          </div>
        </section>
        {/* Installation Section */}
        <section id="installation" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Installation</h2>
          {/* Quick Install */}
          <div id="quick-install" className="mb-8 space-y-6">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Quick Install (Recommended)
            </h3>
            <p className="text-gray-300 mb-4">
              The automated installer script detects your platform and installs
              the latest version automatically.
            </p>


              <CodeBlock
                  lines={[
                      'curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                  ]}
                  title="Linux & macOS:"
                  language=""
              />

              <div className="pt-4 pb-4">
                  <CodeBlock
                      lines={[
                          'wget -qO- https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                      ]}
                      title="Alternative with wget:"
                      language=""
                  />
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                      What the Installer Does
                  </h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Detects your operating system (Linux, macOS, or Windows) and CPU architecture</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Determines the correct binary file (tfkit-linux, tfkit-macos, or tfkit-windows.exe)</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Automatically selects an installation directory (~/.local/bin or %LOCALAPPDATA%\Programs\tfkit)</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Checks for any existing installation and retrieves its current version (if available)</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Creates a backup of the existing binary before updating</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Queries GitHub for the latest release version of tfkit</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Downloads the corresponding binary using curl or wget, with automatic fallbacks</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Validates the download (file size, type, and SHA256 checksum)</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Installs the binary to the selected directory and sets executable permissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Cleans up temporary and backup files after a successful update</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Restores your previous version automatically if any step fails</span>
                      </li>
                      <li className="flex items-start gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Verifies the new installation by running tfkit --version or tfkit --help</span>
                      </li>
                  </ul>
              </div>
          </div>
          {/* Linux Installation */}
          <div id="linux" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <MonitorIcon className="w-6 h-6" />
              Linux Installation
            </h3>
            <p className="text-gray-300 mb-4">
              TFKit supports all major Linux distributions. Choose your
              preferred installation method:
            </p>
            <div className="space-y-6">
                  <CodeBlock
                      lines={[
                          '# Installs to ~/.local/bin/tfkit by default',
                          'curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                      ]}
                      title="Method 1: Automated Installer (Recommended)"
                      language=""
                  />

                    <CodeBlock
                        lines={[
                            '# Download the binary',
                            'wget https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-linux-amd64',
                            '# Make it executable',
                            'chmod +x tfkit-linux-amd64',
                            '# Move to PATH',
                            'sudo mv tfkit-linux-amd64 /usr/local/bin/tfkit',
                        ]}
                        title="Method 2: Manual Installation"
                        language=""
                    />


                <CodeBlock
                    lines={[
                        '# For bash (add to ~/.bashrc)',
                        'export PATH="$HOME/.local/bin:$PATH',
                        '# For zsh (add to ~/.zshrc)',
                        'export PATH="$HOME/.local/bin:$PATH"',
                    ]}
                    title="If you installed to a custom location, add it to your PATH"
                    language=""
                />
            </div>
          </div>
          {/* macOS Installation */}
          <div id="macos" className="mb-8">
            <h3 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <MonitorIcon className="w-6 h-6" />
              macOS Installation
            </h3>
            <p className="text-gray-300 mb-4">
              TFKit supports both Intel and Apple Silicon Macs. Choose your
              preferred installation method:
            </p>



              <CodeBlock
                  lines={[
                      '# Automatically detects your architecture (Intel/Apple Silicon) and installs to \'~/.local/bin/tfkit\'',
                      'curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                  ]}
                  title="Method 1: Automated Installer (Recommended)"
                  language=""
              />

          </div>
          {/* Windows Installation */}
          <div id="windows" className="mb-8">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <MonitorIcon className="w-6 h-6" />
              Windows Installation
            </h3>
            <p className="text-gray-300 mb-4">
              TFKit supports Windows 10 and later. Choose your preferred
              installation method:
            </p>
            <div className="space-y-6">



                <CodeBlock
                    lines={[
                        '# Default installation path: \'%LOCALAPPDATA%\\Programs\\tfkit\\tfkit.exe\'',
                        'curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                    ]}
                    title="Automated Installation (Git Bash/WSL)"
                    language=""
                />


                <CodeBlock
                    lines={[
                        '# 1. Download the binary:',
                        'Invoke-WebRequest -Uri "https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-windows.exe" -OutFile "tfkit.exe"',
                        '# 2. Create installation directory:',
                        '$installDir = "$env:LOCALAPPDATA\\Programs\\tfkit"',
                        'New-Item -ItemType Directory -Force -Path $installDir',
                        '# 3. Move binary:',
                        'Move-Item -Force tfkit.exe "$installDir\\tfkit.exe"',
                        '# 4. Add to PATH (User):',
                        '$currentPath = [Environment]::GetEnvironmentVariable(\'Path\', \'User\')',
                        '[Environment]::SetEnvironmentVariable(\'Path\', "$currentPath;$installDir", \'User\')',
                    ]}
                    title="Manual Installation (PowerShell)"
                    language=""
                />

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">
                        Restart your terminal for PATH changes to take effect.
                    </p>
                </div>

              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Manual Installation (Command Prompt)
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      1. Download from browser:
                    </p>
                    <ul className="text-gray-400 text-sm space-y-1 ml-4 list-disc">
                      <li>
                        Visit:{' '}
                        <a href="https://github.com/ivasik-k7/tfkit/releases/latest" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                          https://github.com/ivasik-k7/tfkit/releases/latest
                        </a>
                      </li>
                      <li>Download tfkit-windows.exe</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      2. Create installation directory:
                    </p>



                      <CodeBlock
                          lines={[
                              'mkdir "%LOCALAPPDATA%\\Programs\\tfkit"',
                          ]}
                          title=""
                          language=""
                      />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      3. Move the file:
                    </p>
                    <ul className="text-gray-400 text-sm space-y-1 ml-4 list-disc">
                      <li>
                        Move tfkit-windows.exe to{' '}
                        <code className="text-green-400">
                          %LOCALAPPDATA%\Programs\tfkit\
                        </code>
                      </li>
                      <li>Rename to tfkit.exe</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      4. Add to PATH manually:
                    </p>
                    <ol className="text-gray-400 text-sm space-y-1 ml-4 list-decimal">
                      <li>Right-click "This PC" → Properties</li>
                      <li>Click "Advanced system settings"</li>
                      <li>Click "Environment Variables"</li>
                      <li>Under "User variables", select "Path" → Edit</li>
                      <li>
                        Click "New" and add:{' '}
                        <code className="text-green-400">
                          %LOCALAPPDATA%\Programs\tfkit
                        </code>
                      </li>
                      <li>Click OK on all dialogs</li>
                      <li>Restart your terminal</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Windows Subsystem for Linux (WSL)
                </h4>
                <p className="text-gray-300 text-sm">
                  If using WSL, follow the{' '}
                  <a href="#linux" className="text-green-400 hover:underline">
                    Linux installation guide
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          {/* Upgrading */}
          <div id="upgrading" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <TrendingUpIcon className="w-6 h-6" />
              Upgrading TFKit
            </h3>
            <p className="text-gray-300 mb-4">
              To upgrade to the latest version, simply run the installer again.
              It will automatically backup your existing installation.
            </p>



              <CodeBlock
                  lines={[
                      'curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash',
                  ]}
                  title=""
                  language=""
              />

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-4">
              <p className="text-gray-300 text-sm">
                <strong>Note:</strong> Your previous installation will be backed
                up to{' '}
                <code className="text-cyan-400">~/.local/bin/tfkit.backup</code>
              </p>
            </div>
          </div>
          {/* Verifying */}
          <div id="verifying" className="mb-8">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              Verifying Installation
            </h3>



              <CodeBlock
                  lines={[
                      '# Check version',
                      'tfkit --version',
                      '',
                      '# View help',
                      'tfkit --help',
                      '',
                      '# Run a quick scan',
                      'tfkit scan .',
                  ]}
                  title="After installation, verify that TFKit is working correctly"
                  language=""
              />
          </div>
          {/* Uninstalling */}
          <div id="uninstalling" className="mb-8">
            <h3 className="text-2xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              <AlertCircleIcon className="w-6 h-6" />
              Uninstalling TFKit
            </h3>
            <p className="text-gray-300 mb-4">
              To remove TFKit from your system:
            </p>
            <div className="space-y-6">


                <CodeBlock
                    lines={[
                        '# Remove binary',
                        'rm ~/.local/bin/tfkit',
                        '',
                        '# Or if installed system-wide',
                        'sudo rm /usr/local/bin/tfkit',
                    ]}
                    title="Linux & macOS"
                    language=""
                />

                <CodeBlock
                    lines={[
                        '# In PowerShell as Administrator',
                        'Remove-Item "C:\\Program Files\\tfkit" -Recurse',
                        '',
                        '# Remove from PATH',
                        '$env:Path = ($env:Path.Split(\';\') | Where-Object { $_ -ne "C:\\Program Files\\tfkit" }) -join \';\'',
                    ]}
                    title="Windows"
                    language=""
                />
            </div>
          </div>
        </section>{/* Available Themes section */}
          <section id="themes" className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">Available Themes</h2>

              <ThemeCarousel />

<div className="pb-8"></div>


              <CodeBlock
                  lines={[
                      '#Apply themes using the \'--theme\' flag:',
                      'tfkit scan --theme neon --layout graph',
                  ]}
                  title="Using Themes"
                  language=""
              />
          </section>
        {/* Command Reference Section */}
        <section id="commands" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Command Reference
          </h2>
          {/* Scan Command */}
          <div id="scan" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <TerminalIcon className="w-6 h-6" />
              Scan Command
            </h3>
            <p className="text-gray-300 mb-4">
              Quick analysis for rapid insights into your Terraform project with
              comprehensive statistics and health assessment.
            </p>
              <CodeBlock
                  lines={[
                      'tfkit scan [PATH] [OPTIONS]',
                  ]}
                  title=""
                  language=""
              />
            <div className="bg-gray-800/50 mt-4 rounded-lg p-5 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Options:</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>
                  <code className="text-cyan-400">--output, -o DIR</code> -
                  Output directory for reports
                </li>
                <li>
                  <code className="text-cyan-400">--format, -f FORMAT</code> -
                  Output format: table, json, yaml, simple
                </li>
                <li>
                  <code className="text-cyan-400">--open, -O</code> - Open
                  results in browser
                </li>
                <li>
                  <code className="text-cyan-400">--theme THEME</code> -
                  Visualization theme (default: dark)
                </li>
                <li>
                  <code className="text-cyan-400">--layout LAYOUT</code> -
                  Visualization layout (default: graph)
                </li>
              </ul>
            </div>
          </div>
          {/* Validate Command */}
          <div id="validate" className="mb-8">
            <h3 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              Validate Command
            </h3>
            <p className="text-gray-300 mb-4">
              Comprehensive validation of Terraform configurations with multiple
              check types and flexible output formats.
            </p>

              <CodeBlock
                  lines={[
                      'tfkit validate [PATH] [OPTIONS]',
                  ]}
                  title=""
                  language=""
              />
            <div className="bg-gray-800/50 mt-4 rounded-lg p-5 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">
                Validation Options:
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>
                  <code className="text-purple-400">--all, -a</code> - Run all
                  validation checks (recommended)
                </li>
                <li>
                  <code className="text-purple-400">--strict, -s</code> - Enable
                  strict validation mode
                </li>
                <li>
                  <code className="text-purple-400">--check-security</code> -
                  Security validation
                </li>
                <li>
                  <code className="text-purple-400">--fail-on-warning</code> -
                  Treat warnings as errors (CI/CD mode)
                </li>
                <li>
                  <code className="text-purple-400">--format, -f FORMAT</code> -
                  Output format: table, json, sarif
                </li>
              </ul>
            </div>
          </div>
          {/* Export Command */}
          <div id="export" className="mb-8">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <FileTextIcon className="w-6 h-6" />
              Export Command
            </h3>
            <p className="text-gray-300 mb-4">
              Export analysis data in multiple structured formats for
              integration with other tools and workflows.
            </p>

              <CodeBlock
                  lines={[
                      'tfkit export [PATH] [OPTIONS]',
                  ]}
                  title=""
                  language=""
              />
            <div className="bg-gray-800/50 mt-4 rounded-lg p-5 border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Options:</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>
                  <code className="text-green-400">--format, -f FORMAT</code> -
                  Export formats: json, yaml, csv, xml, toml
                </li>
                <li>
                  <code className="text-green-400">--output-dir, -o DIR</code> -
                  Output directory
                </li>
                <li>
                  <code className="text-green-400">--compress, -c</code> -
                  Compress output files into ZIP archive
                </li>
                <li>
                  <code className="text-green-400">--split-by TYPE</code> -
                  Split exports by: type, provider, module
                </li>
              </ul>
            </div>
          </div>
        </section>
        {/* Advanced Usage Section */}
        <section id="advanced" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Advanced Usage</h2>
          <p className="text-gray-300 mb-8">
            Leverage TFKit's advanced features for sophisticated infrastructure
            analysis, security workflows, and seamless CI/CD integration.
          </p>
          {/* Analysis Pipelines */}
          <div id="pipelines" className="mb-12">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6" />
              Analysis Pipelines
            </h3>
            <p className="text-gray-300 mb-6">
              Create sophisticated analysis workflows by chaining TFKit commands
              and integrating with other tools.
            </p>
            {/* Multi-Stage Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Multi-Stage Analysis Pipeline
              </h4>
                <CodeBlock
                    lines={[
                        '# Stage 1: Quick scan with visualization',
                        'tfkit scan . --output ./reports --theme dark --layout graph --open',
                        '',
                        '# Stage 2: Comprehensive validation',
                        'tfkit validate . --all --strict --check-security --format sarif --output ./reports/validation.sarif',
                        '',
                        '# Stage 3: Export in multiple formats',
                        'tfkit export . --format json --format yaml --format csv --output-dir ./reports --compress',
                        '',
                        '# Stage 4: Generate summary report',
                        'tfkit scan . --format simple > ./reports/summary.txt',
                    ]}
                    title="Combine scanning, validation, and export in a comprehensive analysis workflow"
                    language=""
                />
            </div>
            {/* Conditional Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Conditional Analysis with Error Handling
              </h4>
              <p className="text-gray-300 mb-4">
                Implement smart workflows that adapt based on validation
                results:
              </p>

                <ConfigFileBlock
                    filename="tfkit-analysis.sh"
                    language="bash"
                    showDownload={true}
                    content={`#!/bin/bash
# Conditional analysis pipeline

echo "Starting TFKit analysis pipeline..."

# Run validation first
if tfkit validate . --all; then
    echo "✓ Validation passed - proceeding with full analysis"
    tfkit scan . --open --theme dark --output ./reports
    tfkit export . --format json --format yaml --output-dir ./reports
else
    echo "✗ Validation failed - generating error report"
    tfkit validate . --all --format json > ./reports/errors.json
    exit 1
fi`}
                />
            </div>
            {/* Scheduled Analysis */}
            <div className="mb-8 mt-4">
              <h4 className="text-xl font-semibold text-white mb-4">
                Scheduled Analysis with Cron
              </h4>
              <p className="text-gray-300 mb-4">
                Set up automated daily or weekly infrastructure audits:
              </p>


                <ConfigFileBlock
                    filename="pre-deploy-checks.sh"
                    language="bash"
                    showDownload={true}
                    content={`# Pre-deployment analysis workflow
echo "Step 1: Validate with TFKit"
tfkit validate . --all --strict --fail-on-warning

echo "Step 2: Terraform init and validate"
terraform init
terraform validate

echo "Step 3: Generate and analyze plan"
terraform plan -out=tfplan
tfkit scan . --output ./pre-deploy-report

echo "Step 4: Apply if all checks pass"
terraform apply tfplan

echo "Step 5: Post-deployment scan"
tfkit scan . --output ./post-deploy-report --open`}
                />
            </div>
          </div>
          {/* Security Workflow */}
          <div id="security" className="mb-12">
            <h3 className="text-2xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" />
              Security-Focused Workflow
            </h3>
            <p className="text-gray-300 mb-6">
              Implement comprehensive security scanning and compliance checking
              for your Terraform infrastructure.
            </p>
            {/* Security Scan */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Complete Security Audit
              </h4>

                <CodeBlock
                    lines={[
                        '# Comprehensive security validation',
                        'tfkit validate . \\\n' +
                        '  --all \\\n' +
                        '  --check-security \\\n' +
                        '  --strict \\\n' +
                        '  --fail-on-warning \\\n' +
                        '  --format sarif \\\n' +
                        '  --output ./security-report.sarif',
                        '',
                        '# Generate human-readable report',
                        'tfkit validate . --check-security --format table > ./security-report.txt',
                    ]}
                    title="Run a thorough security analysis with all checks enabled"
                    language=""
                />
            </div>
            {/* Security Gates */}
            <div className="mb-8 mt-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Security Gates for Deployment
              </h4>
              <p className="text-gray-300 mb-4">
                Implement security gates that prevent deployment of
                non-compliant infrastructure:
              </p>

                <ConfigFileBlock
                    filename="check.sh"
                    language="bash"
                    showDownload={true}
                    content={`
#!/bin/bash
# Security gate script

echo "Running security checks..."

# Run security validation
tfkit validate . --check-security --strict --format json > security.json

# Check for critical issues
CRITICAL_COUNT=$(jq '.critical_issues | length' security.json)
HIGH_COUNT=$(jq '.high_issues | length' security.json)

if [ $CRITICAL_COUNT -gt 0 ]; then
    echo "✗ CRITICAL: $CRITICAL_COUNT critical security issues found"
    exit 1
elif [ $HIGH_COUNT -gt 5 ]; then
    echo "✗ WARNING: $HIGH_COUNT high-severity issues found (threshold: 5)"
    exit 1
else
    echo "✓ Security checks passed - deployment approved"
    exit 0
fi `}
                />
            </div>
            {/* Compliance Reporting */}
            <div className="mb-8 mt-4">
              <h4 className="text-xl font-semibold text-white mb-4">
                Compliance Reporting
              </h4>


                <CodeBlock
                    lines={[
                        '# Generate compliance report',
                        'tfkit validate . --all --check-security --format json > compliance-$(date +%Y%m%d).json',
                        '',
                        '# Export for compliance tools',
                        'tfkit export . --format json --format yaml --format csv --output-dir ./compliance-reports',
                        '',
                        '# Create SARIF for security dashboards',
                        'tfkit validate . --check-security --format sarif > compliance.sarif',
                    ]}
                    title="Generate compliance reports for auditing and regulatory requirements"
                    language=""
                />
            </div>
          </div>
          {/* CI/CD Integration */}
          <div id="ci-cd" className="mb-12 mt-4">
            <h3 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <GitBranchIcon className="w-6 h-6" />
              CI/CD Integration
            </h3>
            <p className="text-gray-300 mb-6">
              Integrate TFKit into your CI/CD pipelines for automated
              infrastructure validation and security scanning. Below are
              production-ready configurations for major CI/CD platforms.
            </p>
            {/* GitHub Actions */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <GitBranchIcon className="w-5 h-5" />
                GitHub Actions
              </h4>
              <p className="text-gray-300 mb-4">
                Complete GitHub Actions workflow with PR checks, security
                scanning, and artifact uploads:
              </p>

                <ConfigFileBlock
                    filename=".github/workflows/tfkit.yml"
                    language="yaml"
                    showDownload={true}
                    content={`# TFKit Analysis Workflow
name: TFKit Analysis

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]
  schedule:
    # Run daily at 2 AM UTC
    - cron: "0 2 * * *"

jobs:
  tfkit-analysis:
    name: TFKit Scan and Validate
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install TFKit
        run: |
          curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
          echo "$HOME/.local/bin" >>$GITHUB_PATH

      - name: Verify TFKit installation
        run: tfkit --version

      - name: Run TFKit scan
        run: |
          tfkit scan . --output ./tfkit-reports --theme dark --format json

      - name: Run TFKit validation with security checks
        run: |
          tfkit validate . --all --strict --check-security --format sarif --output ./tfkit-reports/results.sarif

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: ./tfkit-reports/results.sarif

      - name: Export analysis data
        run: |
          tfkit export . --format json --format yaml --output-dir ./tfkit-reports

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: tfkit-reports
          path: ./tfkit-reports/
          retention-days: 30

      - name: Fail on validation errors
        run: |
          tfkit validate . --all --fail-on-warning# TFKit Analysis Workflow
name: TFKit Analysis

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main ]
  schedule:
    # Run daily at 2 AM UTC
    - cron: "0 2 * * *"

jobs:
  tfkit-analysis:
    name: TFKit Scan and Validate
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install TFKit
        run: |
          curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
          echo "$HOME/.local/bin" >>$GITHUB_PATH

      - name: Verify TFKit installation
        run: tfkit --version

      - name: Run TFKit scan
        run: |
          tfkit scan . --output ./tfkit-reports --theme dark --format json

      - name: Run TFKit validation with security checks
        run: |
          tfkit validate . --all --strict --check-security --format sarif --output ./tfkit-reports/results.sarif

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: ./tfkit-reports/results.sarif

      - name: Export analysis data
        run: |
          tfkit export . --format json --format yaml --output-dir ./tfkit-reports

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: tfkit-reports
          path: ./tfkit-reports/
          retention-days: 30

      - name: Fail on validation errors
        run: |
          tfkit validate . --all --fail-on-warning`}
                />
              <div className="bg-green-500/10 border border-green-500/30 mt-8 rounded-lg p-4">
                <h5 className="text-green-400 font-semibold mb-2">
                  Key Features:
                </h5>
                <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                  <li>Runs on pull requests and pushes to main branch</li>
                  <li>Scheduled daily scans for continuous monitoring</li>
                  <li>Uploads SARIF results to GitHub Security tab</li>
                  <li>Stores reports as artifacts for 30 days</li>
                  <li>
                    Fails pipeline if validation errors or warnings are found
                  </li>
                </ul>
              </div>
            </div>
              <div className="mb-10">
                  <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <GitBranchIcon className="w-5 h-5" />
                      GitLab CI/CD
                  </h4>
                  <p className="text-gray-300 mb-4">
                      Complete GitLab CI pipeline with merge request checks and
                      security dashboard integration:
                  </p>

                  <ConfigFileBlock
                      filename=".gitlab-ci.yml"
                      language="yaml"
                      showDownload={true}
                      maxHeight="1400px"
                      content={`# TFKit Analysis Pipeline
                     
stages:
  - validate
  - scan
  - security

variables:
  TFKIT_OUTPUT_DIR: "./tfkit-reports"

before_script:
  - curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
  - export PATH="$HOME/.local/bin:$PATH"
  - tfkit --version

tfkit:validate:
  stage: validate
  script:
    - mkdir -p $TFKIT_OUTPUT_DIR
    - tfkit validate . --all --strict --format json > $TFKIT_OUTPUT_DIR/validation.json
    - tfkit validate . --all --fail-on-warning
  artifacts:
    paths:
      - $TFKIT_OUTPUT_DIR/
    expire_in: 30 days
  only:
    - merge_requests
    - main
    - develop

tfkit:scan:
  stage: scan
  script:
    - mkdir -p $TFKIT_OUTPUT_DIR
    - tfkit scan . --output $TFKIT_OUTPUT_DIR --theme dark --format json
    - tfkit export . --format json --format yaml --output-dir $TFKIT_OUTPUT_DIR
  artifacts:
    paths:
      - $TFKIT_OUTPUT_DIR/
    expire_in: 30 days
  only:
    - merge_requests
    - main

tfkit:security:
  stage: security
  script:
    - mkdir -p $TFKIT_OUTPUT_DIR
    - tfkit validate . --check-security --strict --format sarif > $TFKIT_OUTPUT_DIR/gl-sast-report.json
  artifacts:
    reports:
      sast: $TFKIT_OUTPUT_DIR/gl-sast-report.json
    expire_in: 30 days
  allow_failure: false
  only:
    - merge_requests
    - main`}
                  />

                  <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <h5 className="text-orange-400 font-semibold mb-2">
                          Key Features:
                      </h5>
                      <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                          <li>Three-stage pipeline: validate, scan, and security checks</li>
                          <li>Integrates with GitLab Security Dashboard via SAST reports</li>
                          <li>Runs on merge requests and main branch</li>
                          <li>Stores artifacts for 30 days</li>
                          <li>Blocks merge if security issues are found</li>
                      </ul>
                  </div>
              </div>


            {/* Jenkins */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <GitBranchIcon className="w-5 h-5" />
                Jenkins Pipeline
              </h4>
              <p className="text-gray-300 mb-4">
                Declarative Jenkins pipeline with parallel execution and
                comprehensive reporting:
              </p>
                <ConfigFileBlock
                    filename="ci-tfkit-pipeline.groovy"
                    language=""
                    maxHeight="1800px"
                    showDownload={true}
                    content={`pipeline {
    agent any

    environment {
        TFKIT_OUTPUT = "tfkit-reports"
        PATH = "$HOME/.local/bin:$PATH"
    }

    stages {
        stage('Setup') {
            steps {
                echo "Installing TFKit..."
                sh """
                    curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
                    tfkit --version
                    mkdir -p $TFKIT_OUTPUT
                """
            }
        }

        stage('Parallel Analysis') {
            parallel {
                stage('Scan') {
                    steps {
                        echo "Running TFKit scan..."
                        sh """
                            tfkit scan . --output $TFKIT_OUTPUT --format json
                        """
                    }
                }

                stage('Validate') {
                    steps {
                        echo "Running validation..."
                        sh """
                            tfkit validate . --all --format json > $TFKIT_OUTPUT/validation.json
                        """
                    }
                }

                stage('Security') {
                    steps {
                        echo "Running security checks..."
                        sh """
                            tfkit validate . --check-security --format sarif > $TFKIT_OUTPUT/security.sarif
                        """
                    }
                }
            }
        }

        stage('Export') {
            steps {
                echo "Exporting data..."
                sh """
                    tfkit export . --format json --format yaml --output-dir $TFKIT_OUTPUT
                """
            }
        }

        stage('Quality Gate') {
            steps {
                echo "Checking quality gate..."
                sh """
                    tfkit validate . --all --strict --fail-on-warning
                """
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: "$TFKIT_OUTPUT/**/*", allowEmptyArchive: true
            publishHTML target: [allowMissing: false, alwaysLinkToLastBuild: true, keepAll: true, reportDir: "$TFKIT_OUTPUT", reportFiles: "index.html", reportName: "TFKit Report"]
        }
    }
}`}
                />
              <div className="bg-blue-500/10 border border-blue-500/30 mt-8 rounded-lg p-4">
                <h5 className="text-blue-400 font-semibold mb-2">
                  Key Features:
                </h5>
                <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                  <li>
                    Parallel execution of scan, validate, and security checks
                  </li>
                  <li>Quality gate stage that fails build on issues</li>
                  <li>Archives all reports as build artifacts</li>
                  <li>Publishes HTML reports in Jenkins UI</li>
                  <li>Comprehensive error handling with post actions</li>
                </ul>
              </div>
            </div>
            {/* Azure DevOps */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <GitBranchIcon className="w-5 h-5" />
                Azure DevOps Pipeline
              </h4>
              <p className="text-gray-300 mb-4">
                Complete Azure Pipelines YAML with PR validation and security
                integration:
              </p>
                <ConfigFileBlock
                    filename="azure-pipelines.yml"
                    language="yaml"
                    showDownload={true}
                    maxHeight="1600px"
                    content={`trigger:
  branches:
    include:
      - main
      - develop

pr:
  branches:
    include:
      - main

pool:
  vmImage: "ubuntu-latest"

variables:
  tfkitOutputDir: "$(Build.ArtifactStagingDirectory)/tfkit-reports"

steps:
- task: Bash@3
  displayName: "Install TFKit"
  inputs:
    targetType: "inline"
    script: |
      curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
      echo "##vso[task.prependpath]$HOME/.local/bin"
      tfkit --version

- task: Bash@3
  displayName: "Create Output Directory"
  inputs:
    targetType: "inline"
    script: "mkdir -p $(tfkitOutputDir)"

- task: Bash@3
  displayName: "TFKit Scan"
  inputs:
    targetType: "inline"
    script: |
      tfkit scan . --output $(tfkitOutputDir) --theme dark --format json

- task: Bash@3
  displayName: "TFKit Validation"
  inputs:
    targetType: "inline"
    script: |
      tfkit validate . --all --strict --format json > $(tfkitOutputDir)/validation.json
      tfkit validate . --all --fail-on-warning

- task: Bash@3
  displayName: "Security Scan"
  inputs:
    targetType: "inline"
    script: |
      tfkit validate . --check-security --format sarif > $(tfkitOutputDir)/security.sarif

- task: Bash@3
  displayName: "Export Data"
  inputs:
    targetType: "inline"
    script: |
      tfkit export . --format json --format yaml --output-dir $(tfkitOutputDir)

- task: PublishBuildArtifacts@1
  displayName: "Publish TFKit Reports"
  condition: always()
  inputs:
    PathtoPublish: "$(tfkitOutputDir)"
    ArtifactName: "tfkit-reports"
    publishLocation: "Container"`}
                />
              <div className="bg-blue-500/10 border border-blue-500/30 mt-8 rounded-lg p-4">
                <h5 className="text-blue-400 font-semibold mb-2">
                  Key Features:
                </h5>
                <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                  <li>Triggers on PR and main branch pushes</li>
                  <li>Publishes reports as build artifacts</li>
                  <li>Integrates with Azure DevOps security features</li>
                  <li>Fails build on validation errors</li>
                  <li>Always publishes reports even if build fails</li>
                </ul>
              </div>
            </div>
            {/* CircleCI */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <GitBranchIcon className="w-5 h-5" />
                CircleCI Configuration
              </h4>
              <p className="text-gray-300 mb-4">
                CircleCI config with workflows, caching, and artifact storage:
              </p>
                <ConfigFileBlock
                    filename=".circleci/config.yml"
                    language="yaml"
                    showDownload={true}
                    content={`jobs:
  tfkit-analysis:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout

      - run:
          name: Install TFKit
          command: |
            curl -fsSL https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh | bash
            echo 'export PATH="$HOME/.local/bin:$PATH"' >>$BASH_ENV
            source $BASH_ENV
            tfkit --version

      - run:
          name: Create Reports Directory
          command: mkdir -p /tmp/tfkit-reports

      - run:
          name: Run TFKit Scan
          command: |
            tfkit scan . --output /tmp/tfkit-reports --theme dark --format json

      - run:
          name: Run Validation
          command: |
            tfkit validate . --all --strict --format json > /tmp/tfkit-reports/validation.json
            tfkit validate . --all --fail-on-warning

      - run:
          name: Security Checks
          command: |
            tfkit validate . --check-security --format sarif > /tmp/tfkit-reports/security.sarif

      - run:
          name: Export Data
          command: |
            tfkit export . --format json --format yaml --output-dir /tmp/tfkit-reports

      - store_artifacts:
          path: /tmp/tfkit-reports
          destination: tfkit-reports

      - store_test_results:
          path: /tmp/tfkit-reports

workflows:
  version: 2
  tfkit-workflow:
    jobs:
      - tfkit-analysis

  nightly:
    triggers:
      - schedule:
          cron: "0 2 * * *"
          filters:
            branches:
              only:
                - main
    jobs:
      - tfkit-analysis`}
                />
              <div className="bg-green-500/10 border border-green-500/30 mt-8 rounded-lg p-4">
                <h5 className="text-green-400 font-semibold mb-2">
                  Key Features:
                </h5>
                <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                  <li>Runs on every commit and PR</li>
                  <li>Scheduled nightly builds on main branch</li>
                  <li>Stores artifacts and test results</li>
                  <li>Comprehensive validation with fail conditions</li>
                  <li>Security scanning with SARIF output</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {/* Troubleshooting Section */}
        <section id="troubleshooting" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircleIcon className="w-10 h-10 text-yellow-400" />
            Troubleshooting
          </h2>
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-yellow-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">
                Command Not Found
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                <strong>Symptom:</strong> "tfkit: command not found" or "'tfkit'
                is not recognized"
              </p>
              <div className="text-gray-400 text-sm space-y-2">
                <p>
                  <strong>Solutions:</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Verify PATH includes install directory</li>
                  <li>Restart terminal after PATH modifications</li>
                  <li>Check if binary exists in installation directory</li>
                </ul>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Permission Denied
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                <strong>Symptom:</strong> "Permission denied" when running tfkit
              </p>

                <CodeBlock
                    lines={[
                        '# Linux/macOS - Make executable',
                        'chmod +x ~/.local/bin/tfkit',
                    ]}
                    title=""
                    language=""
                />
            </div>
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">
                macOS Security Warning
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                <strong>Symptom:</strong> "tfkit cannot be opened because it is
                from an unidentified developer"
              </p>

                <CodeBlock
                    lines={[
                        '# Remove quarantine attribute',
                        'xattr -d com.apple.quarantine ~/.local/bin/tfkit',
                    ]}
                    title=""
                    language=""
                />
            </div>
          </div>
        </section>
        {/* Support Section */}
        <section id="support" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://github.com/ivasik-k7/tfkit/issues" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-cyan-500/50 transition-all">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Issues</h3>
              <p className="text-gray-400 text-sm">
                Report bugs and request features on GitHub
              </p>
            </a>
            <a href="https://github.com/ivasik-k7/tfkit/discussions" target="_blank" rel="noopener noreferrer" className="p-6 rounded-xl border border-purple-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-purple-500/50 transition-all">
              <h3 className="text-xl font-bold text-purple-400 mb-2">
                Discussions
              </h3>
              <p className="text-gray-400 text-sm">
                Join the community and ask questions
              </p>
            </a>
          </div>
        </section>
      </div>
    </main>
    </div>
    );
}