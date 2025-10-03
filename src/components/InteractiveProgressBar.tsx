// src/components/InteractiveProgressBar.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface InteractiveProgressBarProps {
    currentValue: number;
    sliderValue: number;
    maxValue: number;
    onValueChange: (value: number) => void;
    baseColor: string;
    previewAddColor: string;
    previewRemoveColor: string;
}

export function InteractiveProgressBar({
    currentValue,
    sliderValue,
    maxValue,
    onValueChange,
    baseColor,
    previewAddColor,
    previewRemoveColor,
}: InteractiveProgressBarProps) {
    const barRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleValueChange = useCallback((clientX: number) => {
        if (!barRef.current || maxValue === 0) return;

        const rect = barRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newValue = Math.round(percentage * maxValue);
        onValueChange(newValue);
    }, [maxValue, onValueChange]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleValueChange(e.clientX);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleValueChange(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => handleValueChange(e.clientX);
        const handleTouchMove = (e: TouchEvent) => handleValueChange(e.touches[0].clientX);
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, handleValueChange]);
    
    const baseWidth = (Math.min(sliderValue, currentValue) / maxValue) * 100;
    const addWidth = sliderValue > currentValue ? ((sliderValue - currentValue) / maxValue) * 100 : 0;
    const removeWidth = sliderValue < currentValue ? ((currentValue - sliderValue) / maxValue) * 100 : 0;
    const removeLeft = (sliderValue / maxValue) * 100;
    
    // New logic for the divider's position
    const dividerPosition = Math.max(sliderValue, currentValue);
    const showDivider = sliderValue !== currentValue && dividerPosition > 0 && dividerPosition < maxValue;

    return (
        <div 
            ref={barRef}
            className="mt-6 h-9 bg-white border-4 border-black relative cursor-pointer"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            <div className={`h-full absolute ${baseColor}`} style={{ width: `${baseWidth}%` }} />
            {addWidth > 0 && (
                <div className={`h-full absolute ${previewAddColor}`} style={{ left: `${baseWidth}%`, width: `${addWidth}%` }} />
            )}
            {removeWidth > 0 && (
                <div className={`h-full absolute ${previewRemoveColor}`} style={{ left: `${removeLeft}%`, width: `${removeWidth}%` }} />
            )}

            {/* Vertical Divider Line with new position logic */}
            {showDivider && (
                <div 
                    className="absolute h-full w-1 bg-black z-10"
                    style={{ left: `calc(${(dividerPosition / maxValue) * 100}% - 2px)`}}
                />
            )}

            <div 
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-black rounded-full pointer-events-none z-20"
                style={{ left: `calc(${(sliderValue / maxValue) * 100}% - 8px)`}}
            />
        </div>
    );
}