import React from 'react';
import { CheckCircleIcon, DownloadIcon, TerminalIcon, ShieldCheckIcon, FileTextIcon, AlertCircleIcon, TrendingUpIcon, MonitorIcon, SettingsIcon, XCircleIcon, WifiOffIcon, HardDriveIcon, CpuIcon, RefreshCwIcon, GitBranchIcon } from 'lucide-react';
import { ThemeCard } from './ThemeCard.tsx';
import { DemoConsole } from './DemoConsole.tsx';
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
const THEMES: Record<string, ThemeColors> = {
  light: {
    bg_primary: '#ffffff',
    bg_secondary: '#f8f9fa',
    bg_tertiary: '#e9ecef',
    text_primary: '#212529',
    text_secondary: '#6c757d',
    border: '#dee2e6',
    accent: '#0d6efd',
    accent_secondary: '#6610f2',
    success: '#198754',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#0dcaf0'
  },
  dark: {
    bg_primary: '#0a0e27',
    bg_secondary: '#141b3d',
    bg_tertiary: '#1a2347',
    text_primary: '#e0e6f7',
    text_secondary: '#a0a8c1',
    border: '#2d3a5f',
    accent: '#3b82f6',
    accent_secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4'
  },
  cyber: {
    bg_primary: '#0a0a0a',
    bg_secondary: '#111111',
    bg_tertiary: '#1a1a1a',
    text_primary: '#00ff88',
    text_secondary: '#00cc6a',
    border: '#ff0088',
    accent: '#00ffff',
    accent_secondary: '#ff0088',
    success: '#00ff88',
    warning: '#ffff00',
    danger: '#ff0044',
    info: '#00ffff'
  },
  'github-dark': {
    bg_primary: '#0d1117',
    bg_secondary: '#161b22',
    bg_tertiary: '#21262d',
    text_primary: '#f0f6fc',
    text_secondary: '#8b949e',
    border: '#30363d',
    accent: '#58a6ff',
    accent_secondary: '#bc8cff',
    success: '#3fb950',
    warning: '#d29922',
    danger: '#f85149',
    info: '#2f81f7'
  },
  monokai: {
    bg_primary: '#272822',
    bg_secondary: '#383a36',
    bg_tertiary: '#494a47',
    text_primary: '#f8f8f2',
    text_secondary: '#75715e',
    border: '#66d9ef',
    accent: '#f92672',
    accent_secondary: '#ae81ff',
    success: '#a6e22e',
    warning: '#e6db74',
    danger: '#f92672',
    info: '#66d9ef'
  },
  'solarized-light': {
    bg_primary: '#fdf6e3',
    bg_secondary: '#eee8d5',
    bg_tertiary: '#e5e3cb',
    text_primary: '#586e75',
    text_secondary: '#657b83',
    border: '#93a1a1',
    accent: '#268bd2',
    accent_secondary: '#d33682',
    success: '#859900',
    warning: '#cb4b16',
    danger: '#dc322f',
    info: '#2aa198'
  },
  dracula: {
    bg_primary: '#282a36',
    bg_secondary: '#383c4f',
    bg_tertiary: '#44475a',
    text_primary: '#f8f8f2',
    text_secondary: '#6272a4',
    border: '#44475a',
    accent: '#bd93f9',
    accent_secondary: '#ff79c6',
    success: '#50fa7b',
    warning: '#f1fa8c',
    danger: '#ff5555',
    info: '#8be9fd'
  },
  'atom-one-dark': {
    bg_primary: '#282c34',
    bg_secondary: '#3a404b',
    bg_tertiary: '#4f5666',
    text_primary: '#abb2bf',
    text_secondary: '#5c6370',
    border: '#3f4451',
    accent: '#61afef',
    accent_secondary: '#c678dd',
    success: '#98c379',
    warning: '#e5c07b',
    danger: '#e06c75',
    info: '#56b6c2'
  },
  'gruvbox-dark': {
    bg_primary: '#282828',
    bg_secondary: '#3c3836',
    bg_tertiary: '#504945',
    text_primary: '#ebdbb2',
    text_secondary: '#a89984',
    border: '#665c54',
    accent: '#458588',
    accent_secondary: '#b16286',
    success: '#b8bb26',
    warning: '#fabd2f',
    danger: '#fb4934',
    info: '#83a598'
  },
  'night-owl': {
    bg_primary: '#011627',
    bg_secondary: '#0a2133',
    bg_tertiary: '#102a43',
    text_primary: '#d6deeb',
    text_secondary: '#88a2b5',
    border: '#5f7e97',
    accent: '#82aaff',
    accent_secondary: '#c792ea',
    success: '#22da6e',
    warning: '#ffc837',
    danger: '#ef5350',
    info: '#00d0ff'
  }
};
export function DocContent() {
  return <main className="flex-1 p-12 overflow-y-auto">
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
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
              <div className="bg-gray-900 rounded-lg p-6">
                <pre className="text-sm leading-relaxed">
                  <code className="text-gray-500"># Quick project scan</code>
                  {'\n'}
                  <code className="text-cyan-400">tfkit scan</code>
                  {'\n\n'}
                  <code className="text-gray-500">
                    # Scan with visualization
                  </code>
                  {'\n'}
                  <code className="text-cyan-400">tfkit scan</code>
                  <code className="text-white">
                    {' '}
                    --open --theme dark --layout graph
                  </code>
                  {'\n\n'}
                  <code className="text-gray-500">
                    # Validate configurations
                  </code>
                  {'\n'}
                  <code className="text-cyan-400">tfkit validate</code>
                  <code className="text-white"> --all --strict</code>
                  {'\n\n'}
                  <code className="text-gray-500">
                    # Export analysis results
                  </code>
                  {'\n'}
                  <code className="text-cyan-400">tfkit export</code>
                  <code className="text-white">
                    {' '}
                    --format json --format yaml
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>
        {/* Installation Section */}
        <section id="installation" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Installation</h2>
          {/* Quick Install */}
          <div id="quick-install" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Quick Install (Recommended)
            </h3>
            <p className="text-gray-300 mb-4">
              The automated installer script detects your platform and installs
              the latest version automatically.
            </p>
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="text-sm font-semibold text-cyan-400 mb-3">
                  Linux & macOS:
                </div>
                <pre className="text-sm mb-4">
                  <code className="text-white">
                    curl -fsSL
                    https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                    | bash
                  </code>
                </pre>
                <div className="text-sm font-semibold text-cyan-400 mb-3">
                  Alternative with wget:
                </div>
                <pre className="text-sm">
                  <code className="text-white">
                    wget -qO-
                    https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                    | bash
                  </code>
                </pre>
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-cyan-400 font-semibold mb-2 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5" />
                What the Installer Does
              </h4>
              <ul className="text-gray-300 text-sm space-y-1 ml-7">
                <li>✅ Detects your operating system and architecture</li>
                <li>✅ Fetches the latest release from GitHub</li>
                <li>✅ Downloads the appropriate binary</li>
                <li>✅ Verifies the download with SHA256 checksum</li>
                <li>✅ Creates backup if upgrading existing installation</li>
                <li>✅ Installs to platform-appropriate directory</li>
                <li>✅ Sets executable permissions</li>
                <li>✅ Verifies the installation</li>
                <li>✅ Provides PATH configuration instructions if needed</li>
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
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Method 1: Automated Installer (Recommended)
                </h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm">
                      <code className="text-white">
                        curl -fsSL
                        https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                        | bash
                      </code>
                    </pre>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Installs to{' '}
                  <code className="text-cyan-400">~/.local/bin/tfkit</code> by
                  default
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Method 2: Manual Installation
                </h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-gray-500">
                        # Download the binary
                      </code>
                      {'\n'}
                      <code className="text-cyan-400">wget</code>
                      <code className="text-white">
                        {' '}
                        https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-linux-amd64
                      </code>
                      {'\n\n'}
                      <code className="text-gray-500">
                        # Make it executable
                      </code>
                      {'\n'}
                      <code className="text-cyan-400">chmod +x</code>
                      <code className="text-white"> tfkit-linux-amd64</code>
                      {'\n\n'}
                      <code className="text-gray-500"># Move to PATH</code>
                      {'\n'}
                      <code className="text-cyan-400">sudo mv</code>
                      <code className="text-white">
                        {' '}
                        tfkit-linux-amd64 /usr/local/bin/tfkit
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Adding to PATH
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  If you installed to a custom location, add it to your PATH:
                </p>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm">
                      <code className="text-gray-500">
                        # For bash (add to ~/.bashrc)
                      </code>
                      {'\n'}
                      <code className="text-cyan-400">export</code>
                      <code className="text-white">
                        {' '}
                        PATH="$HOME/.local/bin:$PATH"
                      </code>
                      {'\n\n'}
                      <code className="text-gray-500">
                        # For zsh (add to ~/.zshrc)
                      </code>
                      {'\n'}
                      <code className="text-cyan-400">export</code>
                      <code className="text-white">
                        {' '}
                        PATH="$HOME/.local/bin:$PATH"
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
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
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Method 1: Automated Installer (Recommended)
                </h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 mb-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm">
                      <code className="text-white">
                        curl -fsSL
                        https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                        | bash
                      </code>
                    </pre>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Automatically detects your architecture (Intel/Apple Silicon)
                  and installs to{' '}
                  <code className="text-purple-400">~/.local/bin/tfkit</code>
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Method 2: Manual Installation
                </h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 mb-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-gray-500"># For Intel Macs</code>
                      {'\n'}
                      <code className="text-purple-400">curl -Lo</code>
                      <code className="text-white">
                        {' '}
                        tfkit
                        https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-darwin-amd64
                      </code>
                      {'\n\n'}
                      <code className="text-gray-500">
                        # For Apple Silicon Macs
                      </code>
                      {'\n'}
                      <code className="text-purple-400">curl -Lo</code>
                      <code className="text-white">
                        {' '}
                        tfkit
                        https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-darwin-arm64
                      </code>
                      {'\n\n'}
                      <code className="text-gray-500">
                        # Make executable and move to PATH
                      </code>
                      {'\n'}
                      <code className="text-purple-400">chmod +x</code>
                      <code className="text-white"> tfkit</code>
                      {'\n'}
                      <code className="text-purple-400">sudo mv</code>
                      <code className="text-white"> tfkit /usr/local/bin/</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <AlertCircleIcon className="w-5 h-5" />
                  macOS Security Note
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  If you see a security warning, remove the quarantine
                  attribute:
                </p>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500/30 to-gray-500/30 mt-2">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <pre className="text-sm">
                      <code className="text-purple-400">xattr -d</code>
                      <code className="text-white">
                        {' '}
                        com.apple.quarantine /usr/local/bin/tfkit
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
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
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Automated Installation (Git Bash/WSL)
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  If using Git Bash or WSL:
                </p>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 mb-3">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm">
                      <code className="text-green-400">curl -fsSL</code>
                      <code className="text-white">
                        {' '}
                        https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh{' '}
                      </code>
                      <code className="text-green-400">| bash</code>
                    </pre>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Default installation path:{' '}
                  <code className="text-green-400">
                    %LOCALAPPDATA%\Programs\tfkit\tfkit.exe
                  </code>
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Manual Installation (PowerShell)
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      1. Download the binary:
                    </p>
                    <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm leading-relaxed">
                          <code className="text-green-400">
                            Invoke-WebRequest
                          </code>
                          <code className="text-white">
                            {' '}
                            -Uri
                            "https://github.com/ivasik-k7/tfkit/releases/latest/download/tfkit-windows.exe"
                          </code>
                          {'\n'}
                          <code className="text-white">
                            {'  '}-OutFile "tfkit.exe"
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      2. Create installation directory:
                    </p>
                    <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm leading-relaxed">
                          <code className="text-green-400">$installDir = </code>
                          <code className="text-white">
                            "$env:LOCALAPPDATA\Programs\tfkit"
                          </code>
                          {'\n'}
                          <code className="text-green-400">New-Item</code>
                          <code className="text-white">
                            {' '}
                            -ItemType Directory -Force -Path $installDir
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      3. Move binary:
                    </p>
                    <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm">
                          <code className="text-green-400">Move-Item</code>
                          <code className="text-white">
                            {' '}
                            -Force tfkit.exe "$installDir\tfkit.exe"
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">
                      4. Add to PATH (User):
                    </p>
                    <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm leading-relaxed">
                          <code className="text-green-400">
                            $currentPath ={' '}
                          </code>
                          <code className="text-white">
                            [Environment]::GetEnvironmentVariable('Path',
                            'User')
                          </code>
                          {'\n'}
                          <code className="text-green-400">
                            [Environment]::SetEnvironmentVariable(
                          </code>
                          <code className="text-white">'Path'</code>
                          <code className="text-green-400">, </code>
                          <code className="text-white">
                            "$currentPath;$installDir"
                          </code>
                          <code className="text-green-400">, </code>
                          <code className="text-white">'User'</code>
                          <code className="text-green-400">)</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <p className="text-gray-300 text-sm">
                      Restart your terminal for PATH changes to take effect.
                    </p>
                  </div>
                </div>
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
                    <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500">
                      <div className="bg-gray-900 rounded-lg p-4">
                        <pre className="text-sm">
                          <code className="text-green-400">mkdir</code>
                          <code className="text-white">
                            {' '}
                            "%LOCALAPPDATA%\Programs\tfkit"
                          </code>
                        </pre>
                      </div>
                    </div>
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
          {/* Alternative Methods */}
          <div id="alternative-methods" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6" />
              Alternative Installation Methods
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">
                  Install from Source
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Build TFKit from source using Go:
                </p>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-cyan-400">git clone</code>
                      <code className="text-white">
                        {' '}
                        https://github.com/ivasik-k7/tfkit.git
                      </code>
                      {'\n'}
                      <code className="text-cyan-400">cd</code>
                      <code className="text-white"> tfkit</code>
                      {'\n'}
                      <code className="text-cyan-400">go build</code>
                      <code className="text-white"> -o tfkit</code>
                      {'\n'}
                      <code className="text-cyan-400">sudo mv</code>
                      <code className="text-white"> tfkit /usr/local/bin/</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Using Docker</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Run TFKit in a container:
                </p>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm">
                      <code className="text-cyan-400">docker run</code>
                      <code className="text-white">
                        {' '}
                        -v $(pwd):/workspace tfkit/tfkit scan /workspace
                      </code>
                    </pre>
                  </div>
                </div>
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
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm">
                  <code className="text-cyan-400">curl -fsSL</code>
                  <code className="text-white">
                    {' '}
                    https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh{' '}
                  </code>
                  <code className="text-cyan-400">| bash</code>
                </pre>
              </div>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
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
            <p className="text-gray-300 mb-4">
              After installation, verify that TFKit is working correctly:
            </p>
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-sm leading-relaxed">
                  <code className="text-gray-500"># Check version</code>
                  {'\n'}
                  <code className="text-green-400">tfkit --version</code>
                  {'\n\n'}
                  <code className="text-gray-500"># View help</code>
                  {'\n'}
                  <code className="text-green-400">tfkit --help</code>
                  {'\n\n'}
                  <code className="text-gray-500"># Run a quick scan</code>
                  {'\n'}
                  <code className="text-green-400">tfkit scan</code>
                  <code className="text-white"> .</code>
                </pre>
              </div>
            </div>
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
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Linux & macOS</h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-red-500 to-gray-500">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-gray-500"># Remove binary</code>
                      {'\n'}
                      <code className="text-red-400">rm</code>
                      <code className="text-white"> ~/.local/bin/tfkit</code>
                      {'\n\n'}
                      <code className="text-gray-500">
                        # Or if installed system-wide
                      </code>
                      {'\n'}
                      <code className="text-red-400">sudo rm</code>
                      <code className="text-white"> /usr/local/bin/tfkit</code>
                    </pre>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                <h4 className="text-white font-semibold mb-3">Windows</h4>
                <div className="relative p-1 rounded-xl bg-gradient-to-r from-red-500 to-gray-500">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <pre className="text-sm leading-relaxed">
                      <code className="text-gray-500">
                        # In PowerShell as Administrator
                      </code>
                      {'\n'}
                      <code className="text-red-400">Remove-Item</code>
                      <code className="text-white">
                        {' '}
                        "C:\Program Files\tfkit" -Recurse
                      </code>
                      {'\n\n'}
                      <code className="text-gray-500"># Remove from PATH</code>
                      {'\n'}
                      <code className="text-red-400">$env:Path = </code>
                      <code className="text-white">
                        ($env:Path.Split(';') | Where-Object{' '}
                        {'{ $_ -ne "C:\\Program Files\\tfkit" }'}) -join ';'
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Platform-Specific */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a href="#linux" className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-cyan-500/50 transition-all">
              <MonitorIcon className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Linux</h3>
              <p className="text-gray-400 text-sm">
                Installation guide for Linux distributions
              </p>
            </a>
            <a href="#macos" className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-cyan-500/50 transition-all">
              <MonitorIcon className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">macOS</h3>
              <p className="text-gray-400 text-sm">
                Installation guide for macOS systems
              </p>
            </a>
            <a href="#windows" className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50 hover:border-cyan-500/50 transition-all">
              <MonitorIcon className="w-8 h-8 text-green-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Windows</h3>
              <p className="text-gray-400 text-sm">
                Installation guide for Windows systems
              </p>
            </a>
          </div>
        </section>
        {/* Visualizations Section */}
        <section id="visualizations" className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">Visualizations</h2>
          <p className="text-gray-300 mb-6">
            TFKit provides multiple visualization layouts and themes to suit
            different analysis needs.
          </p>
          <div id="layouts" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Layout Options
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <h4 className="text-lg font-bold text-white mb-2">
                  Classic Layout
                </h4>
                <p className="text-gray-400 text-sm">
                  Traditional hierarchical tree layout for clear structural
                  understanding
                </p>
              </div>
              <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <h4 className="text-lg font-bold text-white mb-2">
                  Graph Layout (Default)
                </h4>
                <p className="text-gray-400 text-sm">
                  Force-directed graph showing complex resource relationships
                  and dependencies
                </p>
              </div>
              <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
                <h4 className="text-lg font-bold text-white mb-2">
                  Dashboard Layout
                </h4>
                <p className="text-gray-400 text-sm">
                  Metrics-focused layout with key insights and statistics
                </p>
              </div>
            </div>
          </div>
          <div id="themes" className="mb-8">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
              Available Themes
            </h3>
            <p className="text-gray-300 mb-4">
              Choose from 10 carefully crafted color themes, each with unique
              visual characteristics:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(THEMES).map(([name, colors]) => <ThemeCard key={name} name={name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')} colors={colors} />)}
            </div>
          </div>
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
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <pre className="text-sm">
                  <code className="text-cyan-400">tfkit scan</code>
                  <code className="text-white"> [PATH] [OPTIONS]</code>
                </pre>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
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
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <pre className="text-sm">
                  <code className="text-purple-400">tfkit validate</code>
                  <code className="text-white"> [PATH] [OPTIONS]</code>
                </pre>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
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
            <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 mb-4">
              <div className="bg-gray-900 rounded-lg p-6">
                <pre className="text-sm">
                  <code className="text-green-400">tfkit export</code>
                  <code className="text-white"> [PATH] [OPTIONS]</code>
                </pre>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
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
              <p className="text-gray-300 mb-4">
                Combine scanning, validation, and export in a comprehensive
                analysis workflow:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">
                      # Stage 1: Quick scan with visualization
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output ./reports --theme dark --layout graph --open
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Stage 2: Comprehensive validation
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --check-security --format sarif --output
                      ./reports/validation.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Stage 3: Export in multiple formats
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --format csv --output-dir
                      ./reports --compress
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Stage 4: Generate summary report
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --format simple {'>'} ./reports/summary.txt
                    </code>
                  </pre>
                </div>
              </div>
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">#!/bin/bash</code>
                    {'\n'}
                    <code className="text-gray-500">
                      # Conditional analysis pipeline
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Starting TFKit analysis pipeline..."
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Run validation first
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">if</code>
                    <code className="text-white"> tfkit validate . --all</code>
                    <code className="text-cyan-400">; then</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "✓ Validation passed - proceeding with full analysis"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --open --theme dark --output ./reports
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir ./reports
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">else</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "✗ Validation failed - generating error report"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --format json {'>'} ./reports/errors.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">exit</code>
                    <code className="text-white"> 1</code>
                    {'\n'}
                    <code className="text-cyan-400">fi</code>
                  </pre>
                </div>
              </div>
            </div>
            {/* Scheduled Analysis */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Scheduled Analysis with Cron
              </h4>
              <p className="text-gray-300 mb-4">
                Set up automated daily or weekly infrastructure audits:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">
                      # Create analysis script: ~/tfkit-audit.sh
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">#!/bin/bash</code>
                    {'\n'}
                    <code className="text-cyan-400">REPORT_DIR=</code>
                    <code className="text-white">
                      ~/tfkit-reports/$(date +%Y-%m-%d)
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">mkdir -p</code>
                    <code className="text-white"> $REPORT_DIR</code>
                    {'\n\n'}
                    <code className="text-cyan-400">cd</code>
                    <code className="text-white"> ~/terraform-projects</code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output $REPORT_DIR --theme dark
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --format json {'>'} $REPORT_DIR/validation.json
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Add to crontab for daily execution at 2 AM
                    </code>
                    {'\n'}
                    <code className="text-gray-500">
                      # crontab -e, then add:
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">0 2 * * *</code>
                    <code className="text-white"> ~/tfkit-audit.sh</code>
                  </pre>
                </div>
              </div>
            </div>
            {/* Integration with Terraform */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Integration with Terraform Commands
              </h4>
              <p className="text-gray-300 mb-4">
                Combine TFKit with Terraform workflow for comprehensive
                infrastructure management:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">
                      # Pre-deployment analysis workflow
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Step 1: Validate with TFKit"
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --fail-on-warning
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Step 2: Terraform init and validate"
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">terraform init</code>
                    {'\n'}
                    <code className="text-cyan-400">terraform validate</code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Step 3: Generate and analyze plan"
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">terraform plan</code>
                    <code className="text-white"> -out=tfplan</code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output ./pre-deploy-report
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Step 4: Apply if all checks pass"
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">terraform apply</code>
                    <code className="text-white"> tfplan</code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Step 5: Post-deployment scan"
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output ./post-deploy-report --open
                    </code>
                  </pre>
                </div>
              </div>
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
              <p className="text-gray-300 mb-4">
                Run a thorough security analysis with all checks enabled:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">
                      # Comprehensive security validation
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit validate</code>
                    <code className="text-white"> . \</code>
                    {'\n'}
                    <code className="text-white">{'  '}--all \</code>
                    {'\n'}
                    <code className="text-white">{'  '}--check-security \</code>
                    {'\n'}
                    <code className="text-white">{'  '}--strict \</code>
                    {'\n'}
                    <code className="text-white">
                      {'  '}--fail-on-warning \
                    </code>
                    {'\n'}
                    <code className="text-white">{'  '}--format sarif \</code>
                    {'\n'}
                    <code className="text-white">
                      {'  '}--output ./security-report.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Generate human-readable report
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --format table {'>'}{' '}
                      ./security-report.txt
                    </code>
                  </pre>
                </div>
              </div>
            </div>
            {/* Security Gates */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Security Gates for Deployment
              </h4>
              <p className="text-gray-300 mb-4">
                Implement security gates that prevent deployment of
                non-compliant infrastructure:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">#!/bin/bash</code>
                    {'\n'}
                    <code className="text-gray-500">
                      # Security gate script
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Running security checks..."
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Run security validation
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --strict --format json {'>'}{' '}
                      security.json
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Check for critical issues
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">CRITICAL_COUNT=</code>
                    <code className="text-white">
                      $(jq '.critical_issues | length' security.json)
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">HIGH_COUNT=</code>
                    <code className="text-white">
                      $(jq '.high_issues | length' security.json)
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">if</code>
                    <code className="text-white">
                      {' '}
                      [ $CRITICAL_COUNT -gt 0 ]
                    </code>
                    <code className="text-cyan-400">; then</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "✗ CRITICAL: $CRITICAL_COUNT critical security issues
                      found"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">exit</code>
                    <code className="text-white"> 1</code>
                    {'\n'}
                    <code className="text-cyan-400">elif</code>
                    <code className="text-white"> [ $HIGH_COUNT -gt 5 ]</code>
                    <code className="text-cyan-400">; then</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "✗ WARNING: $HIGH_COUNT high-severity issues found
                      (threshold: 5)"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">exit</code>
                    <code className="text-white"> 1</code>
                    {'\n'}
                    <code className="text-cyan-400">else</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "✓ Security checks passed - deployment approved"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">exit</code>
                    <code className="text-white"> 0</code>
                    {'\n'}
                    <code className="text-cyan-400">fi</code>
                  </pre>
                </div>
              </div>
            </div>
            {/* Compliance Reporting */}
            <div className="mb-8">
              <h4 className="text-xl font-semibold text-white mb-4">
                Compliance Reporting
              </h4>
              <p className="text-gray-300 mb-4">
                Generate compliance reports for auditing and regulatory
                requirements:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <pre className="text-sm leading-relaxed">
                    <code className="text-gray-500">
                      # Generate compliance report
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --check-security --format json {'>'}{' '}
                      compliance-$(date +%Y%m%d).json
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Export for compliance tools
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --format csv --output-dir
                      ./compliance-reports
                    </code>
                    {'\n\n'}
                    <code className="text-gray-500">
                      # Create SARIF for security dashboards
                    </code>
                    {'\n'}
                    <code className="text-purple-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --format sarif {'>'} compliance.sarif
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
          {/* CI/CD Integration */}
          <div id="ci-cd" className="mb-12">
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-500 to-cyan-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-green-400 font-semibold">
                      .github/workflows/tfkit.yml
                    </span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto">
                    <code className="text-gray-500">
                      # TFKit Analysis Workflow
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> TFKit Analysis</code>
                    {'\n\n'}
                    <code className="text-cyan-400">on:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">pull_request:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">branches:</code>
                    <code className="text-white"> [ main, develop ]</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">push:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">branches:</code>
                    <code className="text-white"> [ main ]</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">schedule:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-gray-500">
                      # Run daily at 2 AM UTC
                    </code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-cyan-400">cron:</code>
                    <code className="text-white"> "0 2 * * *"</code>
                    {'\n\n'}
                    <code className="text-cyan-400">jobs:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">tfkit-analysis:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> TFKit Scan and Validate</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">runs-on:</code>
                    <code className="text-white"> ubuntu-latest</code>
                    {'\n\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">steps:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Checkout code</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">uses:</code>
                    <code className="text-white"> actions/checkout@v4</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Install TFKit</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">curl -fsSL</code>
                    <code className="text-white">
                      {' '}
                      https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh{' '}
                      | bash
                    </code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "$HOME/.local/bin" {'>>'}
                      $GITHUB_PATH
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white">
                      {' '}
                      Verify TFKit installation
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> tfkit --version</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Run TFKit scan</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output ./tfkit-reports --theme dark --format json
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white">
                      {' '}
                      Run TFKit validation with security checks
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --check-security --format sarif --output
                      ./tfkit-reports/results.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white">
                      {' '}
                      Upload SARIF to GitHub Security
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">uses:</code>
                    <code className="text-white">
                      {' '}
                      github/codeql-action/upload-sarif@v3
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">if:</code>
                    <code className="text-white"> always()</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">with:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">sarif_file:</code>
                    <code className="text-white">
                      {' '}
                      ./tfkit-reports/results.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Export analysis data</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir ./tfkit-reports
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Upload artifacts</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">uses:</code>
                    <code className="text-white">
                      {' '}
                      actions/upload-artifact@v4
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">if:</code>
                    <code className="text-white"> always()</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">with:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> tfkit-reports</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">path:</code>
                    <code className="text-white"> ./tfkit-reports/</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">retention-days:</code>
                    <code className="text-white"> 30</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white">
                      {' '}
                      Fail on validation errors
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">run:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --fail-on-warning
                    </code>
                  </pre>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
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
            {/* GitLab CI */}
            <div className="mb-10">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <GitBranchIcon className="w-5 h-5" />
                GitLab CI/CD
              </h4>
              <p className="text-gray-300 mb-4">
                Complete GitLab CI pipeline with merge request checks and
                security dashboard integration:
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-orange-400 font-semibold">
                      .gitlab-ci.yml
                    </span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto">
                    <code className="text-gray-500">
                      # TFKit Analysis Pipeline
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">stages:</code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-white">validate</code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-white">scan</code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-white">security</code>
                    {'\n\n'}
                    <code className="text-cyan-400">variables:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">TFKIT_OUTPUT_DIR:</code>
                    <code className="text-white"> "./tfkit-reports"</code>
                    {'\n\n'}
                    <code className="text-cyan-400">before_script:</code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-green-400">curl -fsSL</code>
                    <code className="text-white">
                      {' '}
                      https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                      | bash
                    </code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-green-400">export</code>
                    <code className="text-white">
                      {' '}
                      PATH="$HOME/.local/bin:$PATH"
                    </code>
                    {'\n'}
                    <code className="text-white">{'  - '}</code>
                    <code className="text-green-400">tfkit --version</code>
                    {'\n\n'}
                    <code className="text-cyan-400">tfkit:validate:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">stage:</code>
                    <code className="text-white"> validate</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">script:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">mkdir -p</code>
                    <code className="text-white"> $TFKIT_OUTPUT_DIR</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --format json {'>'}{' '}
                      $TFKIT_OUTPUT_DIR/validation.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --fail-on-warning
                    </code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">artifacts:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">paths:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">$TFKIT_OUTPUT_DIR/</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">expire_in:</code>
                    <code className="text-white"> 30 days</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">only:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">merge_requests</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">main</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">develop</code>
                    {'\n\n'}
                    <code className="text-cyan-400">tfkit:scan:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">stage:</code>
                    <code className="text-white"> scan</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">script:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">mkdir -p</code>
                    <code className="text-white"> $TFKIT_OUTPUT_DIR</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output $TFKIT_OUTPUT_DIR --theme dark --format json
                    </code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir
                      $TFKIT_OUTPUT_DIR
                    </code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">artifacts:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">paths:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">$TFKIT_OUTPUT_DIR/</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">expire_in:</code>
                    <code className="text-white"> 30 days</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">only:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">merge_requests</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">main</code>
                    {'\n\n'}
                    <code className="text-cyan-400">tfkit:security:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">stage:</code>
                    <code className="text-white"> security</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">script:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">mkdir -p</code>
                    <code className="text-white"> $TFKIT_OUTPUT_DIR</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --strict --format sarif {'>'}{' '}
                      $TFKIT_OUTPUT_DIR/gl-sast-report.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">artifacts:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">reports:</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-cyan-400">sast:</code>
                    <code className="text-white">
                      {' '}
                      $TFKIT_OUTPUT_DIR/gl-sast-report.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">expire_in:</code>
                    <code className="text-white"> 30 days</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">allow_failure:</code>
                    <code className="text-white"> false</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">only:</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">merge_requests</code>
                    {'\n'}
                    <code className="text-white">{'    - '}</code>
                    <code className="text-white">main</code>
                  </pre>
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h5 className="text-orange-400 font-semibold mb-2">
                  Key Features:
                </h5>
                <ul className="text-gray-300 text-sm space-y-1 ml-4 list-disc">
                  <li>
                    Three-stage pipeline: validate, scan, and security checks
                  </li>
                  <li>
                    Integrates with GitLab Security Dashboard via SAST reports
                  </li>
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-400 font-semibold">
                      Jenkinsfile
                    </span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto">
                    <code className="text-cyan-400">pipeline</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">agent</code>
                    <code className="text-white"> any</code>
                    {'\n\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">environment</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">TFKIT_OUTPUT =</code>
                    <code className="text-white"> "tfkit-reports"</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">PATH =</code>
                    <code className="text-white">
                      {' '}
                      "$HOME/.local/bin:$PATH"
                    </code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">stages</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Setup') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white"> "Installing TFKit..."</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-green-400">curl -fsSL</code>
                    <code className="text-white">
                      {' '}
                      https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                      | bash
                    </code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-green-400">tfkit --version</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-green-400">mkdir -p</code>
                    <code className="text-white"> $TFKIT_OUTPUT</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">
                      ('Parallel Analysis') {'{'}
                    </code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">parallel</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Scan') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white"> "Running TFKit scan..."</code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">
                      {'                            '}
                    </code>
                    <code className="text-green-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output $TFKIT_OUTPUT --format json
                    </code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Validate') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white"> "Running validation..."</code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">
                      {'                            '}
                    </code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --format json {'>'} $TFKIT_OUTPUT/validation.json
                    </code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Security') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Running security checks..."
                    </code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">
                      {'                            '}
                    </code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --format sarif {'>'}{' '}
                      $TFKIT_OUTPUT/security.sarif
                    </code>
                    {'\n'}
                    <code className="text-white">
                      {'                        '}
                    </code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Export') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white"> "Exporting data..."</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-green-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir $TFKIT_OUTPUT
                    </code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">stage</code>
                    <code className="text-white">('Quality Gate') {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">steps</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "Checking quality gate..."
                    </code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-cyan-400">sh</code>
                    <code className="text-white"> """</code>
                    {'\n'}
                    <code className="text-white">{'                    '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --fail-on-warning
                    </code>
                    {'\n'}
                    <code className="text-white">{'                '}</code>
                    <code className="text-white">"""</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">post</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-cyan-400">always</code>
                    <code className="text-white"> {'{'}</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">archiveArtifacts</code>
                    <code className="text-white">
                      {' '}
                      artifacts: "$TFKIT_OUTPUT/**/*", allowEmptyArchive: true
                    </code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">publishHTML</code>
                    <code className="text-white">
                      {' '}
                      target: [allowMissing: false, alwaysLinkToLastBuild: true,
                      keepAll: true, reportDir: "$TFKIT_OUTPUT", reportFiles:
                      "index.html", reportName: "TFKit Report"]
                    </code>
                    {'\n'}
                    <code className="text-white">{'        '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-white">{'}'}</code>
                    {'\n'}
                    <code className="text-white">{'}'}</code>
                  </pre>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-400 font-semibold">
                      azure-pipelines.yml
                    </span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto">
                    <code className="text-cyan-400">trigger:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">branches:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">include:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">main</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">develop</code>
                    {'\n\n'}
                    <code className="text-cyan-400">pr:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">branches:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">include:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">main</code>
                    {'\n\n'}
                    <code className="text-cyan-400">pool:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">vmImage:</code>
                    <code className="text-white"> "ubuntu-latest"</code>
                    {'\n\n'}
                    <code className="text-cyan-400">variables:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">tfkitOutputDir:</code>
                    <code className="text-white">
                      {' '}
                      "$(Build.ArtifactStagingDirectory)/tfkit-reports"
                    </code>
                    {'\n\n'}
                    <code className="text-cyan-400">steps:</code>
                    {'\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "Install TFKit"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">curl -fsSL</code>
                    <code className="text-white">
                      {' '}
                      https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                      | bash
                    </code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">echo</code>
                    <code className="text-white">
                      {' '}
                      "##vso[task.prependpath]$HOME/.local/bin"
                    </code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit --version</code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white">
                      {' '}
                      "Create Output Directory"
                    </code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white">
                      {' '}
                      "mkdir -p $(tfkitOutputDir)"
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "TFKit Scan"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output $(tfkitOutputDir) --theme dark --format json
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "TFKit Validation"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --format json {'>'}{' '}
                      $(tfkitOutputDir)/validation.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --fail-on-warning
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "Security Scan"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --format sarif {'>'}{' '}
                      $(tfkitOutputDir)/security.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> Bash@3</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "Export Data"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">targetType:</code>
                    <code className="text-white"> "inline"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">script:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'      '}</code>
                    <code className="text-green-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir
                      $(tfkitOutputDir)
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'- '}</code>
                    <code className="text-cyan-400">task:</code>
                    <code className="text-white"> PublishBuildArtifacts@1</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">displayName:</code>
                    <code className="text-white"> "Publish TFKit Reports"</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">condition:</code>
                    <code className="text-white"> always()</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">inputs:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">PathtoPublish:</code>
                    <code className="text-white"> "$(tfkitOutputDir)"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">ArtifactName:</code>
                    <code className="text-white"> "tfkit-reports"</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">publishLocation:</code>
                    <code className="text-white"> "Container"</code>
                  </pre>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-green-600 to-teal-500 mb-4">
                <div className="bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-green-400 font-semibold">
                      .circleci/config.yml
                    </span>
                  </div>
                  <pre className="text-sm leading-relaxed overflow-x-auto">
                    <code className="text-cyan-400">version:</code>
                    <code className="text-white"> 2.1</code>
                    {'\n\n'}
                    <code className="text-cyan-400">jobs:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">tfkit-analysis:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">docker:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">image:</code>
                    <code className="text-white"> cimg/base:stable</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">steps:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">checkout</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Install TFKit</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">curl -fsSL</code>
                    <code className="text-white">
                      {' '}
                      https://raw.githubusercontent.com/ivasik-k7/tfkit/main/install.sh
                      | bash
                    </code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">echo</code>
                    <code className="text-white">
                      {' '}
                      'export PATH="$HOME/.local/bin:$PATH"' {'>>'}
                      $BASH_ENV
                    </code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">source</code>
                    <code className="text-white"> $BASH_ENV</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit --version</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white">
                      {' '}
                      Create Reports Directory
                    </code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white">
                      {' '}
                      mkdir -p /tmp/tfkit-reports
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Run TFKit Scan</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit scan</code>
                    <code className="text-white">
                      {' '}
                      . --output /tmp/tfkit-reports --theme dark --format json
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Run Validation</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --strict --format json {'>'}{' '}
                      /tmp/tfkit-reports/validation.json
                    </code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --all --fail-on-warning
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Security Checks</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit validate</code>
                    <code className="text-white">
                      {' '}
                      . --check-security --format sarif {'>'}{' '}
                      /tmp/tfkit-reports/security.sarif
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">run:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">name:</code>
                    <code className="text-white"> Export Data</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">command:</code>
                    <code className="text-white"> |</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-green-400">tfkit export</code>
                    <code className="text-white">
                      {' '}
                      . --format json --format yaml --output-dir
                      /tmp/tfkit-reports
                    </code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">store_artifacts:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">path:</code>
                    <code className="text-white"> /tmp/tfkit-reports</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">destination:</code>
                    <code className="text-white"> tfkit-reports</code>
                    {'\n\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">store_test_results:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">path:</code>
                    <code className="text-white"> /tmp/tfkit-reports</code>
                    {'\n\n'}
                    <code className="text-cyan-400">workflows:</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">version:</code>
                    <code className="text-white"> 2</code>
                    {'\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">tfkit-workflow:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">jobs:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">tfkit-analysis</code>
                    {'\n\n'}
                    <code className="text-white">{'  '}</code>
                    <code className="text-cyan-400">nightly:</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">triggers:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-cyan-400">schedule:</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">cron:</code>
                    <code className="text-white"> "0 2 * * *"</code>
                    {'\n'}
                    <code className="text-white">{'          '}</code>
                    <code className="text-cyan-400">filters:</code>
                    {'\n'}
                    <code className="text-white">{'            '}</code>
                    <code className="text-cyan-400">branches:</code>
                    {'\n'}
                    <code className="text-white">{'              '}</code>
                    <code className="text-cyan-400">only:</code>
                    {'\n'}
                    <code className="text-white">{'                - '}</code>
                    <code className="text-white">main</code>
                    {'\n'}
                    <code className="text-white">{'    '}</code>
                    <code className="text-cyan-400">jobs:</code>
                    {'\n'}
                    <code className="text-white">{'      - '}</code>
                    <code className="text-white">tfkit-analysis</code>
                  </pre>
                </div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
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
            {/* Best Practices */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h4 className="text-xl font-semibold text-cyan-400 mb-4">
                CI/CD Best Practices
              </h4>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    1. Fail Fast Strategy
                  </h5>
                  <p className="text-sm">
                    Run validation early in the pipeline to catch issues before
                    expensive operations. Use{' '}
                    <code className="text-cyan-400">--fail-on-warning</code> in
                    production pipelines.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    2. Artifact Retention
                  </h5>
                  <p className="text-sm">
                    Always store TFKit reports as artifacts for debugging and
                    compliance. Set appropriate retention periods (30-90 days).
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    3. Security Integration
                  </h5>
                  <p className="text-sm">
                    Upload SARIF reports to your platform's security dashboard
                    for centralized vulnerability tracking and remediation.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    4. Scheduled Scans
                  </h5>
                  <p className="text-sm">
                    Set up daily or weekly scheduled scans to catch drift and
                    new security vulnerabilities in your infrastructure code.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-white mb-2">
                    5. Branch Protection
                  </h5>
                  <p className="text-sm">
                    Require TFKit validation to pass before merging PRs. This
                    ensures only validated code reaches your main branch.
                  </p>
                </div>
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
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-red-500/30 to-gray-500/30 mt-3">
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm">
                    <code className="text-gray-500">
                      # Linux/macOS - Make executable
                    </code>
                    {'\n'}
                    <code className="text-red-400">chmod +x</code>
                    <code className="text-white"> ~/.local/bin/tfkit</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-gray-900/50 to-gray-800/50">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">
                macOS Security Warning
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                <strong>Symptom:</strong> "tfkit cannot be opened because it is
                from an unidentified developer"
              </p>
              <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500/30 to-gray-500/30 mt-3">
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-sm">
                    <code className="text-gray-500">
                      # Remove quarantine attribute
                    </code>
                    {'\n'}
                    <code className="text-cyan-400">xattr -d</code>
                    <code className="text-white">
                      {' '}
                      com.apple.quarantine ~/.local/bin/tfkit
                    </code>
                  </pre>
                </div>
              </div>
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
    </main>;
}