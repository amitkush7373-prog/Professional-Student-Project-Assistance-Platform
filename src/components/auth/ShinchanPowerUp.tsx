import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';

export type ShinchanAnimationState = 'idle' | 'charging' | 'powering' | 'success' | 'error';

interface ShinchanPowerUpProps {
  state: ShinchanAnimationState;
  statusText?: string;
  className?: string;
}

export const ShinchanPowerUp: React.FC<ShinchanPowerUpProps> = ({
  state,
  statusText,
  className = ''
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    if (state === 'charging' || state === 'powering') {
      const p = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 60 - 30,
        y: Math.random() * -50 - 10,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 0.4
      }));
      setParticles(p);
    } else {
      setParticles([]);
    }
  }, [state]);

  const isEnergized = state === 'charging' || state === 'powering';
  const isVictory = state === 'success';
  const isConfused = state === 'error';

  return (
    <div className={`relative flex items-center gap-3 select-none pointer-events-none transition-all duration-300 ${className}`}>
      
      {/* Shinchan Character Container */}
      <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex items-end justify-center">
        
        {/* Electric Energy Aura when Powering Up */}
        {isEnergized && (
          <div className="absolute inset-0 -m-3 flex items-center justify-center pointer-events-none">
            {/* Pulsing Outer Glow */}
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400/30 via-yellow-400/30 to-blue-500/30 blur-md animate-ping" />
            <div className="absolute w-28 h-28 rounded-full border-2 border-cyan-400/40 animate-spin" style={{ animationDuration: '2s' }} />

            {/* Lightning Arcs */}
            <svg className="absolute w-32 h-32 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" viewBox="0 0 100 100">
              <path
                d="M 20,50 L 35,30 L 30,45 L 45,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="animate-bounce"
              />
              <path
                d="M 80,45 L 65,30 L 70,42 L 55,20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 30,80 L 45,65 L 40,75 L 60,60"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Energy Particle Sparks */}
            {particles.map(pt => (
              <div
                key={pt.id}
                className="absolute rounded-full bg-cyan-300 shadow-[0_0_6px_#38bdf8] animate-ping"
                style={{
                  width: `${pt.size}px`,
                  height: `${pt.size}px`,
                  transform: `translate(${pt.x}px, ${pt.y}px)`,
                  animationDelay: `${pt.delay}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        )}

        {/* Victory Star Burst on Success */}
        {isVictory && (
          <div className="absolute -top-3 -right-2 flex items-center justify-center animate-bounce">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-500/40 tracking-wider">
              Victory! ✌️
            </span>
          </div>
        )}

        {/* Error Sweatdrop on Failed Auth */}
        {isConfused && (
          <div className="absolute top-1 right-2 animate-bounce">
            <span className="text-xl">💧</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SHINCHAN SVG VECTOR CHARACTER */}
        {/* ========================================================================= */}
        <svg
          viewBox="0 0 120 140"
          className={`w-full h-full transition-transform duration-200 filter drop-shadow-md ${
            isEnergized
              ? 'scale-110 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]'
              : isVictory
              ? 'scale-105 drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]'
              : 'hover:scale-105'
          }`}
        >
          <defs>
            <radialGradient id="shinchanSkin" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FFE0BD" />
              <stop offset="100%" stopColor="#F7C89F" />
            </radialGradient>
            <linearGradient id="shinchanShirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="shinchanShorts" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>
          </defs>

          {/* Character Body Group */}
          <g className={isEnergized ? 'animate-pulse' : ''}>
            
            {/* Legs & Shoes */}
            <rect x="42" y="105" width="10" height="18" fill="#F7C89F" rx="3" />
            <rect x="68" y="105" width="10" height="18" fill="#F7C89F" rx="3" />
            
            {/* White Socks */}
            <rect x="41" y="118" width="12" height="6" fill="#FFFFFF" rx="2" />
            <rect x="67" y="118" width="12" height="6" fill="#FFFFFF" rx="2" />

            {/* Yellow Shoes */}
            <ellipse cx="46" cy="126" rx="9" ry="5" fill="#EAB308" />
            <ellipse cx="74" cy="126" rx="9" ry="5" fill="#EAB308" />

            {/* Yellow Shorts */}
            <path
              d="M 36,92 L 84,92 L 82,108 L 62,108 L 60,98 L 58,108 L 38,108 Z"
              fill="url(#shinchanShorts)"
              stroke="#CA8A04"
              strokeWidth="1.5"
            />

            {/* Red Shirt Body */}
            <path
              d="M 32,68 C 32,62 42,58 60,58 C 78,58 88,62 88,68 L 86,94 L 34,94 Z"
              fill="url(#shinchanShirt)"
              stroke="#B91C1C"
              strokeWidth="1.5"
            />

            {/* Arms depending on state */}
            {isVictory ? (
              /* Victory 'V' Arms raised */
              <g>
                <path d="M 34,70 Q 20,50 18,38" fill="none" stroke="#F7C89F" strokeWidth="9" strokeLinecap="round" />
                <circle cx="18" cy="36" r="6" fill="#FFE0BD" />
                <path d="M 86,70 Q 100,50 102,38" fill="none" stroke="#F7C89F" strokeWidth="9" strokeLinecap="round" />
                <circle cx="102" cy="36" r="6" fill="#FFE0BD" />
              </g>
            ) : isEnergized ? (
              /* Action Kamen Power Pose / Electric Hands shooting lightning */
              <g>
                <path d="M 34,70 Q 14,75 12,65" fill="none" stroke="#F7C89F" strokeWidth="9" strokeLinecap="round" />
                <circle cx="10" cy="65" r="6.5" fill="#FFE0BD" />
                <path d="M 86,70 Q 106,75 108,65" fill="none" stroke="#F7C89F" strokeWidth="9" strokeLinecap="round" />
                <circle cx="110" cy="65" r="6.5" fill="#FFE0BD" />
                {/* Electric sparks at hands */}
                <polygon points="5,60 12,65 7,72 15,68" fill="#FBBF24" />
                <polygon points="115,60 108,65 113,72 105,68" fill="#38BDF8" />
              </g>
            ) : (
              /* Idle / Hands on hips cute pose */
              <g>
                <path d="M 34,70 Q 24,80 32,88" fill="none" stroke="#F7C89F" strokeWidth="8" strokeLinecap="round" />
                <circle cx="32" cy="88" r="5.5" fill="#FFE0BD" />
                <path d="M 86,70 Q 96,80 88,88" fill="none" stroke="#F7C89F" strokeWidth="8" strokeLinecap="round" />
                <circle cx="88" cy="88" r="5.5" fill="#FFE0BD" />
              </g>
            )}

            {/* Signature Shinchan Head with Chubby Cheek Contour */}
            <path
              d="M 30,42 C 22,35 28,18 48,14 C 70,10 94,18 96,35 C 98,52 88,58 76,58 C 66,58 58,60 48,58 C 36,56 26,52 30,42 Z"
              fill="url(#shinchanSkin)"
              stroke="#D97706"
              strokeWidth="1.2"
            />

            {/* Short Black Hair */}
            <path
              d="M 34,32 C 34,18 45,12 60,12 C 78,12 92,18 94,30 C 90,26 80,24 68,24 C 54,24 42,26 34,32 Z"
              fill="#1E293B"
            />

            {/* Iconic Thick Black Eyebrows */}
            <path
              d="M 38,28 Q 48,22 56,27"
              fill="none"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M 68,27 Q 78,22 86,28"
              fill="none"
              stroke="#0F172A"
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Eyes */}
            {isVictory ? (
              /* Winking / Happy Star Eyes */
              <g>
                <path d="M 42,35 Q 48,30 54,35" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 70,35 Q 76,30 82,35" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            ) : isEnergized ? (
              /* Glowing Electric Focused Eyes */
              <g>
                <ellipse cx="48" cy="35" rx="5" ry="6" fill="#0F172A" />
                <ellipse cx="76" cy="35" rx="5" ry="6" fill="#0F172A" />
                <circle cx="49" cy="33" r="2.5" fill="#38BDF8" />
                <circle cx="77" cy="33" r="2.5" fill="#38BDF8" />
              </g>
            ) : isConfused ? (
              /* Dizzy Spiral Eyes */
              <g>
                <ellipse cx="48" cy="35" rx="4" ry="4" fill="none" stroke="#0F172A" strokeWidth="1.5" />
                <ellipse cx="76" cy="35" rx="4" ry="4" fill="none" stroke="#0F172A" strokeWidth="1.5" />
              </g>
            ) : (
              /* Classic Curious Big Eyes */
              <g>
                <ellipse cx="48" cy="35" rx="5" ry="6" fill="#0F172A" />
                <ellipse cx="76" cy="35" rx="5" ry="6" fill="#0F172A" />
                <circle cx="49" cy="33" r="2" fill="#FFFFFF" />
                <circle cx="77" cy="33" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Cheek Blush Circles */}
            <ellipse cx="36" cy="42" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.75" />
            <ellipse cx="86" cy="42" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.75" />

            {/* Playful Mouth */}
            {isVictory ? (
              <path d="M 56,44 Q 62,54 68,44 Z" fill="#E11D48" />
            ) : isEnergized ? (
              <path d="M 54,45 Q 62,52 70,45" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeLinecap="round" />
            ) : (
              <path d="M 58,45 Q 63,49 68,45" fill="none" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
            )}

          </g>
        </svg>
      </div>

      {/* Dynamic Status Pill */}
      {statusText && (
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide shadow-sm animate-in fade-in slide-in-from-left-2 duration-150">
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{statusText}</span>
          </div>
        </div>
      )}

    </div>
  );
};
