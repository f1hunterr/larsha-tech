import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let ringX = 0, ringY = 0;
    let dotX  = 0, dotY  = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (!visible) setVisible(true);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isClickable = el?.closest('a, button, [role="button"], input, select, textarea, label') != null;
      setHovering(isClickable);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const animate = () => {
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
      // Ring follows with smooth lag
      ringX += (dotX - ringX) * 0.12;
      ringY += (dotY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
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

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer glowing ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 40, height: 40,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? 'rgba(96,165,250,0.8)' : 'rgba(96,165,250,0.4)'}`,
          boxShadow: hovering
            ? '0 0 12px 3px rgba(96,165,250,0.35)'
            : '0 0 8px 2px rgba(96,165,250,0.15)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s, border-color 0.2s, box-shadow 0.2s, width 0.2s, height 0.2s',
          willChange: 'transform',
          scale: clicking ? '0.85' : hovering ? '1.4' : '1',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 8, height: 8,
          borderRadius: '50%',
          background: hovering ? '#60a5fa' : 'rgba(255,255,255,0.9)',
          boxShadow: hovering
            ? '0 0 8px 3px rgba(96,165,250,0.6)'
            : '0 0 6px 2px rgba(255,255,255,0.4)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s, background 0.2s, box-shadow 0.2s',
          willChange: 'transform',
          transform: clicking ? 'scale(0.6)' : 'scale(1)',
        }}
      />
    </>
  );
}
