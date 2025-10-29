import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ThemeCard } from './ThemeCard.tsx';
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
interface ThemeCarouselProps {
  themes: Record<string, ThemeColors>;
}
export function ThemeCarousel({
  themes
}: ThemeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const themeEntries = Object.entries(themes);
  const itemsPerPage = 3;
  const maxIndex = Math.max(0, themeEntries.length - itemsPerPage);
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };
  const visibleThemes = themeEntries.slice(currentIndex, currentIndex + itemsPerPage);
  return <div className="relative">
      <div className="flex items-center gap-4">
        <button onClick={handlePrev} disabled={currentIndex === 0} className="flex-shrink-0 w-10 h-10 rounded-full border border-cyan-500/30 bg-gray-800/50 flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeftIcon className="w-5 h-5 text-cyan-400" />
        </button>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-4 transition-transform duration-500 ease-out" style={{
          transform: `translateX(0)`
        }}>
            {visibleThemes.map(([name, colors]) => <div key={name} className="flex-1 min-w-0">
                <ThemeCard name={name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')} colors={colors} />
              </div>)}
          </div>
        </div>
        <button onClick={handleNext} disabled={currentIndex >= maxIndex} className="flex-shrink-0 w-10 h-10 rounded-full border border-cyan-500/30 bg-gray-800/50 flex items-center justify-center hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRightIcon className="w-5 h-5 text-cyan-400" />
        </button>
      </div>
      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({
        length: maxIndex + 1
      }).map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-cyan-400 w-8' : 'bg-gray-600 hover:bg-gray-500'}`} />)}
      </div>
    </div>;
}