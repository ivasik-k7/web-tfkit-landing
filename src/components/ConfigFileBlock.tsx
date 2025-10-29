import React, { useState } from 'react';
import { CopyIcon, CheckIcon, FileTextIcon, DownloadIcon } from 'lucide-react';

interface ConfigFileBlockProps {
    filename: string;
    content: string;
    language?: string;
    showDownload?: boolean;
    className?: string;
    maxHeight?: string; // Maximum height before scrolling
}

export function ConfigFileBlock({
                                    filename,
                                    content,
                                    language = 'yaml',
                                    showDownload = false,
                                    className = '',
                                    maxHeight = '600px' // Default max height
                                }: ConfigFileBlockProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const downloadFile = () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Simple syntax highlighting for common patterns
    const highlightSyntax = (text: string) => {
        const lines = text.split('\n');

        return lines.map((line, index) => {
            // Comment lines (starting with #)
            if (line.trim().startsWith('#')) {
                return (
                    <div key={index} className="text-gray-500">
                        {line}
                    </div>
                );
            }

            // YAML/Config keys (word followed by colon)
            if (line.match(/^[\s]*[\w-]+:/)) {
                const match = line.match(/^([\s]*)([\w-]+)(:)(.*)/);
                if (match) {
                    const [, indent, key, colon, rest] = match;
                    return (
                        <div key={index}>
                            <span>{indent}</span>
                            <span className="text-cyan-400 font-semibold">{key}</span>
                            <span className="text-gray-400">{colon}</span>
                            <span className="text-gray-300">{rest}</span>
                        </div>
                    );
                }
            }

            // List items (starting with -)
            if (line.trim().startsWith('-')) {
                const match = line.match(/^([\s]*-)(.*)$/);
                if (match) {
                    const [, dash, rest] = match;
                    return (
                        <div key={index}>
                            <span className="text-purple-400">{dash}</span>
                            <span className="text-gray-300">{rest}</span>
                        </div>
                    );
                }
            }

            // String values in quotes
            const quotedString = line.replace(
                /"([^"]*)"/g,
                '<span class="text-green-400">"$1"</span>'
            ).replace(
                /'([^']*)'/g,
                '<span class="text-green-400">\'$1\'</span>'
            );

            // Default
            return (
                <div
                    key={index}
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: quotedString }}
                />
            );
        });
    };

    // Check if content exceeds max height
    const lineCount = content.split('\n').length;
    const estimatedHeight = lineCount * 24; // Approximate line height
    const willScroll = estimatedHeight > parseInt(maxHeight);

    return (
        <div className={`relative ${className}`}>
            {/* Success notification */}
            {copied && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 z-20">
                    <CheckIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">Copied to clipboard!</span>
                </div>
            )}

            <div className="relative rounded-lg bg-gray-900/80 border border-cyan-500/20 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800/70 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <FileTextIcon className="w-5 h-5 text-cyan-400" />
                        <div className="flex flex-col">
              <span className="text-sm font-mono font-semibold text-white">
                {filename}
              </span>
                            {language && (
                                <span className="text-xs text-gray-500">
                  {language.toUpperCase()}
                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {showDownload && (
                            <button
                                onClick={downloadFile}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700/50 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all text-sm text-gray-300 hover:text-purple-400"
                                title="Download file"
                            >
                                <DownloadIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                            </button>
                        )}

                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700/50 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-sm text-gray-300 hover:text-cyan-400"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className="w-4 h-4 text-green-400" />
                                    <span className="text-green-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content - Adjusts to content height with max limit */}
                <div className="relative">
                    <div
                        className="p-6 font-mono text-sm leading-relaxed overflow-x-auto overflow-y-auto custom-scrollbar"
                        style={{ maxHeight }}
                    >
            <pre className="whitespace-pre">
              {highlightSyntax(content)}
            </pre>
                    </div>

                    {/* Fade overlay at bottom - only show if content will scroll */}
                    {willScroll && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none" />
                    )}
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(6, 182, 212, 0.3) rgba(31, 41, 55, 0.5);
        }
      `}</style>
        </div>
    );
}