import React, { useEffect, useState } from 'react';

export function FlightMap({ departure, destination, departureCode, destinationCode }) {
  const [progress, setProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animationComplete) return;
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setAnimationComplete(true);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [animationComplete]);

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 overflow-hidden" style={{
      background: 'linear-gradient(135deg, #EAF9FF 0%, #D5F3FF 100%)'
    }}>
      {/* Background clouds */}
      <div className="absolute top-4 left-10 w-16 h-8 bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute top-8 right-20 w-20 h-10 bg-white/40 rounded-full blur-sm"></div>
      <div className="absolute bottom-12 left-1/3 w-24 h-12 bg-white/40 rounded-full blur-sm"></div>
      
      {/* Flight path */}
      <div className="relative h-full flex items-center">
        {/* Departure city */}
        <div className="absolute left-0 flex flex-col items-center">
          <div className="w-3 h-3 bg-primary rounded-full mb-2 animate-pulse" style={{backgroundColor: '#004C8C'}}></div>
          <div className="text-center">
            <div className="font-medium">{departureCode}</div>
            <div className="text-xs text-muted-foreground">{departure}</div>
          </div>
        </div>

        {/* Destination city */}
        <div className="absolute right-0 flex flex-col items-center max-w-[120px]">
          <div className="w-3 h-3 bg-destructive rounded-full mb-2 animate-pulse" style={{backgroundColor: '#00ADEF'}}></div>
          <div className="text-center">
            <div className="font-medium">{destinationCode}</div>
            <div className="text-xs text-muted-foreground truncate w-full" title={destination}>{destination}</div>
          </div>
        </div>

        {/* Dotted flight path line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2">
          <svg className="w-full h-1" preserveAspectRatio="none">
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="0"
              stroke="#004C8C"
              strokeWidth="2"
              strokeDasharray="8,8"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Animated airplane */}
        <div
          className="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear"
          style={{
            left: `calc(${progress}% - 12px)`,
          }}
        >
          <svg
            className="w-6 h-6 rotate-45"
            fill="#004C8C"
            viewBox="0 0 24 24"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-muted-foreground">
          Flight Progress: {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
