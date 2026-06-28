import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isDark,   setIsDark]   = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      }
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

  // Colors adapt to theme
  const dotColor  = hovering ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.92)' : 'rgba(15,23,42,0.85)';
  const dotGlow   = hovering ? '0 0 6px 2px rgba(59,130,246,0.55)' : isDark
    ? '0 0 4px 1px rgba(255,255,255,0.3)'
    : '0 0 4px 1px rgba(15,23,42,0.2)';
  const ringColor = hovering ? 'rgba(59,130,246,0.85)' : isDark ? 'rgba(148,163,184,0.5)' : 'rgba(71,85,105,0.45)';
  const ringGlow  = hovering ? '0 0 10px 2px rgba(59,130,246,0.3)' : 'none';
  const ringSize  = clicking ? 28 : hovering ? 48 : 40;

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position:      'fixed',
          top: 0, left: 0,
          width:         ringSize,
          height:        ringSize,
          marginLeft:    -(ringSize / 2 - 20),
          marginTop:     -(ringSize / 2 - 20),
          borderRadius:  '50%',
          border:        `1.5px solid ${ringColor}`,
          boxShadow:     ringGlow,
          pointerEvents: 'none',
          zIndex:        99999,
          opacity:       visible ? 1 : 0,
          willChange:    'transform',
          transition:    'opacity 0.3s, border-color 0.2s, box-shadow 0.2s, width 0.15s, height 0.15s, margin 0.15s',
        }}
      />
      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top: 0, left: 0,
          width:         clicking ? 5 : 8,
          height:        clicking ? 5 : 8,
          marginLeft:    clicking ? 1.5 : 0,
          marginTop:     clicking ? 1.5 : 0,
          borderRadius:  '50%',
          background:    dotColor,
          boxShadow:     dotGlow,
          pointerEvents: 'none',
          zIndex:        99999,
          opacity:       visible ? 1 : 0,
          willChange:    'transform',
          transition:    'opacity 0.3s, background 0.2s, box-shadow 0.2s, width 0.15s, height 0.15s, margin 0.15s',
        }}
      />
    </>
  );
}
