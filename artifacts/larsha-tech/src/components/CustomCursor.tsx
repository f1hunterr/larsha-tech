import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      setHovering(!!el?.closest('a, button, [role="button"], input, select, textarea, label'));
    };

    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = () => {
      // Dot — instant
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
      // Ring — smooth follow, higher factor = less wobble
      ringX += (mouseX - ringX) * 0.25;
      ringY += (mouseY - ringY) * 0.25;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${Math.round(ringX - 20)}px, ${Math.round(ringY - 20)}px)`;
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mousedown',  onDown);
    document.addEventListener('mouseup',    onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mousedown',  onDown);
      document.removeEventListener('mouseup',    onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  const ringSize = clicking ? 28 : hovering ? 48 : 40;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position:     'fixed',
          top: 0, left: 0,
          width:        ringSize,
          height:       ringSize,
          marginLeft:   -(ringSize / 2 - 20),
          marginTop:    -(ringSize / 2 - 20),
          borderRadius: '50%',
          border:       `1.5px solid ${hovering ? 'rgba(96,165,250,0.85)' : 'rgba(96,165,250,0.45)'}`,
          boxShadow:    hovering ? '0 0 10px 2px rgba(96,165,250,0.3)' : '0 0 6px 1px rgba(96,165,250,0.12)',
          pointerEvents: 'none',
          zIndex:       99999,
          opacity:      visible ? 1 : 0,
          willChange:   'transform',
          transition:   'opacity 0.3s, border-color 0.2s, box-shadow 0.2s, width 0.15s, height 0.15s, margin 0.15s',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position:     'fixed',
          top: 0, left: 0,
          width:        clicking ? 5 : 8,
          height:       clicking ? 5 : 8,
          marginLeft:   clicking ? 1.5 : 0,
          marginTop:    clicking ? 1.5 : 0,
          borderRadius: '50%',
          background:   hovering ? '#60a5fa' : 'rgba(255,255,255,0.95)',
          boxShadow:    hovering ? '0 0 6px 2px rgba(96,165,250,0.55)' : '0 0 4px 1px rgba(255,255,255,0.35)',
          pointerEvents: 'none',
          zIndex:       99999,
          opacity:      visible ? 1 : 0,
          willChange:   'transform',
          transition:   'opacity 0.3s, background 0.2s, box-shadow 0.2s, width 0.15s, height 0.15s, margin 0.15s',
        }}
      />
    </>
  );
}
