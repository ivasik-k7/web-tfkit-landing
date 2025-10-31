import { useState, useEffect, type ReactNode, useCallback } from 'react';
import '../styles/variables.css';
import '../styles/scrollbar.css';

interface ScrollbarProps {
    children: ReactNode;
    variant?: 'default' | 'thin' | 'hidden' | 'glass' | 'matrix';
    showProgress?: boolean;
    className?: string;
}

export function Scrollbar({
    children,
    variant = 'default',
    showProgress = true,
    className = ''
}: ScrollbarProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [thumbPosition, setThumbPosition] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(80);
    const [isDragging, setIsDragging] = useState(false);

    const updateScrollbar = useCallback(() => {
        const scrollPx = document.documentElement.scrollTop;
        const winHeight = document.documentElement.clientHeight;
        const docHeight = document.documentElement.scrollHeight;

        if (docHeight <= winHeight) {
            setThumbHeight(winHeight);
            setThumbPosition(0);
            setScrollProgress(0);
            return;
        }

        const winHeightPx = docHeight - winHeight;
        const scrolled = winHeightPx > 0 ? scrollPx / winHeightPx : 0;
        setScrollProgress(scrolled);

        const trackHeight = winHeight;
        const thumbH = Math.max((winHeight / docHeight) * trackHeight, 80);
        const thumbY = scrolled * (trackHeight - thumbH);

        setThumbHeight(thumbH);
        setThumbPosition(thumbY);
    }, []);

    const handleThumbClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;

        const track = document.querySelector('.scrollbar-overlay') as HTMLElement;
        if (!track) return;

        const trackRect = track.getBoundingClientRect();
        const trackHeight = trackRect.height;
        const clickY = e.clientY - trackRect.top;
        const thumbH = thumbHeight;
        const maxThumbY = trackHeight - thumbH;
        const thumbY = Math.max(0, Math.min(clickY - thumbH / 2, maxThumbY));

        if (maxThumbY > 0) {
            const scrollY = (thumbY / maxThumbY) * (document.documentElement.scrollHeight - window.innerHeight);
            window.scrollTo({ top: scrollY });
        }
    }, [isDragging, thumbHeight]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        updateScrollbar();
        window.addEventListener('scroll', updateScrollbar, { passive: true });
        window.addEventListener('resize', updateScrollbar, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('scroll', updateScrollbar);
            window.removeEventListener('resize', updateScrollbar);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [updateScrollbar, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        document.body.classList.add('custom-scrollbar-enabled');
        return () => {
            document.body.classList.remove('custom-scrollbar-enabled');
        };
    }, []);

    if (variant === 'hidden') {
        return <div className={`app-content ${className}`}>{children}</div>;
    }

    return (
        <>
            <div className={`app-content ${className}`}>
                {children}
            </div>

            {/* Custom scrollbar overlay */}
            <div className={`scrollbar-overlay scrollbar-${variant}`}>
                <div className="scrollbar-track">
                    <div
                        className={`scrollbar-thumb ${isDragging ? 'pulse' : ''}`}
                        style={{
                            height: `${thumbHeight}px`,
                            transform: `translateY(${thumbPosition}px)`
                        }}
                        onMouseDown={handleThumbClick}
                    />
                </div>
            </div>

            {/* Progress Bar */}
            {showProgress && (
                <div
                    className="scroll-progress-bar"
                    style={{ transform: `scaleX(${scrollProgress})` }}
                />
            )}
        </>
    );
}