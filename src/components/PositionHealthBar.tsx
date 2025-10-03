// src/components/PositionHealthBar.tsx
"use client";

import React from 'react';

interface PositionHealthBarProps {
    currentHealth: number; // The confirmed health percentage (0-100)
    previewHealth: number; // The health percentage based on slider values (0-100)
}

export function PositionHealthBar({ currentHealth, previewHealth }: PositionHealthBarProps) {
    const isPreviewing = currentHealth !== previewHealth;

    const finalHealthPosition = Math.max(currentHealth, previewHealth);
    const solidEnd = Math.min(currentHealth, previewHealth);
    const previewStart = solidEnd;
    const previewWidth = Math.abs(currentHealth - previewHealth);

    return (
        <div className="relative mt-4">
            <div className="h-9 border-4 border-black bg-white relative overflow-hidden">
                {/* Layer 1: The static, full-width gradient. */}
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />

                {/* Layer 2: A semi-transparent white overlay for the "desaturated" preview effect. */}
                {isPreviewing && (
                    <div
                        className="absolute top-0 h-full bg-white opacity-50"
                        style={{
                            left: `${previewStart}%`,
                            width: `${previewWidth}%`,
                        }}
                    />
                )}

                {/* Layer 3: A solid white "curtain" that covers the empty part of the bar. */}
                <div
                    className="absolute top-0 h-full bg-white"
                    style={{
                        left: `${finalHealthPosition}%`,
                        width: `${100 - finalHealthPosition}%`,
                    }}
                />
                
                {/* Layer 4: The black caps with corrected logic */}
                {isPreviewing ? (
                    <>
                        {/* Cap at the original health position */}
                        {currentHealth > 0 && currentHealth < 100 &&
                            <div className="absolute top-0 h-full w-1 bg-black z-10" style={{ left: `calc(${currentHealth}% - 2px)` }} />
                        }
                        {/* Cap at the new preview health position */}
                        {previewHealth > 0 && previewHealth < 100 &&
                            <div className="absolute top-0 h-full w-1 bg-black z-10" style={{ left: `calc(${previewHealth}% - 2px)` }} />
                        }
                    </>
                ) : (
                    // If not previewing, show a single cap at the end of the bar
                    currentHealth > 0 && currentHealth < 100 &&
                        <div className="absolute top-0 h-full w-1 bg-black z-10" style={{ left: `calc(${currentHealth}% - 2px)` }} />
                )}
            </div>
        </div>
    );
}