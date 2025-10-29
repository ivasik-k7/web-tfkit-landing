import { useState } from 'react';
import { CopyIcon, CheckIcon, TerminalIcon } from 'lucide-react';

interface CodeLine {
    text: string;
    copyable?: boolean; // Whether this line should have a copy button
}

interface CodeBlockProps {
    lines: CodeLine[] | string[]; // Array of lines or simple strings
    title?: string; // Optional title for the code block
    language?: string; // e.g., "bash", "python", "javascript"
    showLineNumbers?: boolean;
    className?: string;
}

export function CodeBlock({
                              lines,
                              title,
                              language = 'bash',
                              showLineNumbers = false,
                              className = ''
                          }: CodeBlockProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);

    // Normalize lines to CodeLine objects
    const normalizedLines: CodeLine[] = lines.map(line =>
        typeof line === 'string' ? { text: line, copyable: true } : line
    );

    const copyLine = async (text: string, index: number) => {
        try {
            // Remove comment markers and prompt symbols before copying
            const cleanText = text.replace(/^[#$]\s*/, '');
            await navigator.clipboard.writeText(cleanText);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const copyAll = async () => {
        try {
            // Filter out comment lines and clean up commands
            const allText = normalizedLines
                .map(line => line.text)
                .filter(line => line.trim() !== '' && !line.trim().startsWith('#'))
                .map(line => line.replace(/^[$]\s*/, ''))
                .join('\n');
            await navigator.clipboard.writeText(allText);
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Helper function to check if line is a comment
    const isComment = (text: string) => {
        return text.trim().startsWith('#');
    };

    // Helper function to render line content
    const renderLineContent = (line: CodeLine) => {
        const text = line.text;

        // If entire line is a comment (starts with #)
        if (isComment(text)) {
            return <span className="text-gray-500">{text}</span>;
        }

        // If line starts with $ or # (command prompt)
        if (text.startsWith('$') || text.startsWith('#')) {
            return (
                <>
          <span className="text-green-400 mr-2">
            {text.charAt(0)}
          </span>
                    <span>{text.slice(1).trim()}</span>
                </>
            );
        }

        // Regular line
        return <span>{text}</span>;
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative rounded-lg bg-gray-900/80 border border-cyan-500/20 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4 text-cyan-400" />
                        {title && (
                            <span className="text-sm text-gray-400 font-medium">{title}</span>
                        )}
                        {language && (
                            <span className="text-xs text-gray-500 px-2 py-0.5 rounded bg-gray-700/50">
                {language}
              </span>
                        )}
                    </div>
                    <button
                        onClick={copyAll}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-700/50 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all text-sm text-gray-300 hover:text-cyan-400"
                        title="Copy all commands (excludes comments)"
                    >
                        {copiedAll ? (
                            <>
                                <CheckIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-400">Copied!</span>
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-4 h-4" />
                                <span>Copy all</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Code Content */}
                <div className="p-4 font-mono text-sm">
                    {normalizedLines.map((line, index) => {
                        const lineIsComment = isComment(line.text);
                        const isEmpty = line.text.trim() === '';

                        return (
                            <div
                                key={index}
                                className={`group relative flex items-start ${
                                    isEmpty ? '' : 'hover:bg-cyan-500/5'
                                } -mx-4 px-4 py-1 transition-colors`}
                            >
                                {/* Line number */}
                                {showLineNumbers && (
                                    <span className="select-none text-gray-600 mr-4 w-8 text-right">
                    {index + 1}
                  </span>
                                )}

                                {/* Line content */}
                                <code className={`flex-1 whitespace-pre-wrap break-all ${
                                    lineIsComment ? 'text-gray-500' : 'text-gray-300'
                                }`}>
                                    {renderLineContent(line)}
                                </code>

                                {/* Individual line copy button - only for non-comment, non-empty lines */}
                                {line.copyable && !lineIsComment && !isEmpty && (
                                    <button
                                        onClick={() => copyLine(line.text, index)}
                                        className="opacity-0 group-hover:opacity-100 ml-2 p-1.5 rounded bg-gray-700/50 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex-shrink-0"
                                        title="Copy command"
                                    >
                                        {copiedIndex === index ? (
                                            <CheckIcon className="w-3.5 h-3.5 text-green-400" />
                                        ) : (
                                            <CopyIcon className="w-3.5 h-3.5 text-gray-400 hover:text-cyan-400" />
                                        )}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Global success notification */}
            {copiedAll && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 whitespace-nowrap z-10">
                    <CheckIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">Commands copied!</span>
                </div>
            )}
        </div>
    );
}