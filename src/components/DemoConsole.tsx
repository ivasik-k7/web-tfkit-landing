import React, { useEffect, useState } from 'react';
import { TerminalIcon, PlayIcon, CopyIcon, CheckIcon } from 'lucide-react';
export function DemoConsole() {
  const [step, setStep] = useState<'typing' | 'output' | 'complete'>('typing');
  const [typedText, setTypedText] = useState('');
  const [typedOutput, setTypedOutput] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const command = 'pip install tfkit-py';
  const output = `Collecting tfkit-py
  Downloading tfkit_py-0.4.43-py3-none-any.whl (125 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 125.4/125.4 kB 2.5 MB/s eta 0:00:00
Collecting click>=8.0.0
  Using cached click-8.1.7-py3-none-any.whl (97 kB)
Collecting rich>=10.0.0
  Using cached rich-13.7.0-py3-none-any.whl (240 kB)
Installing collected packages: rich, click, tfkit-py
Successfully installed click-8.1.7 rich-13.7.0 tfkit-py-0.4.43`;
  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);
  // Main animation cycle
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === 'typing') {
      if (typedText.length < command.length) {
        timeout = setTimeout(() => {
          setTypedText(command.slice(0, typedText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setStep('output');
        }, 500);
      }
    } else if (step === 'output') {
      if (typedOutput.length < output.length) {
        timeout = setTimeout(() => {
          setTypedOutput(output.slice(0, typedOutput.length + 1));
        }, 15);
      } else {
        timeout = setTimeout(() => {
          setStep('complete');
        }, 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [step, typedText, typedOutput, command, output]);
  const restartAnimation = () => {
    setTypedText('');
    setTypedOutput('');
    setStep('typing');
  };
  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setShowNotification(true);
      setTimeout(() => {
        setCopied(false);
        setShowNotification(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return <div className="relative">
      {/* Success Notification */}
      {showNotification && <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border border-green-400">
            <CheckIcon className="w-5 h-5" />
            <span className="font-semibold">Command copied successfully!</span>
          </div>
        </div>}
      <div className="relative p-1 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400 font-medium">
                  Terminal
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={restartAnimation} className="p-2 rounded-lg bg-gray-700 hover:bg-cyan-500 transition-all text-white flex items-center gap-2 text-sm" title="Restart animation">
                <PlayIcon className="w-4 h-4" />
              </button>
              <div className="relative">
                <button onClick={copyCommand} className="p-2 rounded-lg bg-gray-700 hover:bg-cyan-500 transition-all text-white flex items-center gap-2 text-sm" title="Copy command">
                  {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
                {copied && <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 whitespace-nowrap">
                    Copied!
                  </div>}
              </div>
            </div>
          </div>
          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm h-[280px] overflow-y-auto">
            {/* Command Line */}
            <div className="flex items-center mb-2">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-white">{typedText}</span>
              {step === 'typing' && showCursor && <span className="text-white bg-white/80 ml-0.5 inline-block w-2 h-4" />}
            </div>
            {/* Output with typing effect */}
            {(step === 'output' || step === 'complete') && <div className="text-gray-300 whitespace-pre-wrap leading-relaxed mt-4">
                {typedOutput}
                {step === 'output' && showCursor && <span className="text-white bg-white/80 ml-0.5 inline-block w-2 h-4" />}
              </div>}
          </div>
        </div>
      </div>
    </div>;
}