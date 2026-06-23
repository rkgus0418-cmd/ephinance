
import React from 'react';

export const Logo = ({ className = "h-10 w-auto" }: { className?: string }) => {
  return (
    <svg 
      viewBox="10 25 315 265" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ephinanceLogoArrowGradient" x1="0%" y1="90%" x2="100%" y2="10%">
          <stop offset="0%" stopColor="#C4481A" />
          <stop offset="50%" stopColor="#D95F29" />
          <stop offset="100%" stopColor="#F1B33F" />
        </linearGradient>
      </defs>
      
      {/* Letter E (Deep Chocolate Brown) */}
      <path 
        d="M 148,110 L 80,110 C 58,110 40,128 40,150 L 40,240 C 40,262 58,280 80,280 L 148,280 L 148,244 L 80,244 C 78,244 76,242 76,240 L 76,215 L 136,215 L 136,179 L 76,179 L 76,150 C 76,148 78,146 80,146 L 148,146 Z" 
        fill="#4E3629" 
      />
      
      {/* Letter P (Warm Amber Gold) */}
      <path 
        d="M 154,110 L 220,110 C 248,110 270,131 270,158 C 270,185 248,206 220,206 L 190,206 L 190,280 L 154,280 Z M 190,144 L 190,172 L 220,172 C 228,172 234,166 234,158 C 234,150 228,144 220,144 Z" 
        fill="#E59A32" 
        fillRule="evenodd"
      />
      
      {/* Trajectory Growth Arrow (Swooping brand gradient) */}
      <path 
        d="M 60,195 C 100,195 140,190 180,165 C 215,143 245,110 270,70 L 255,55 L 315,35 L 295,95 L 280,80 C 255,120 225,153 188,175 C 145,200 102,205 60,195 Z" 
        fill="url(#ephinanceLogoArrowGradient)" 
      />
    </svg>
  );
};

