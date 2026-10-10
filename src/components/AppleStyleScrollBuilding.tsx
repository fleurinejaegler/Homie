import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Droplets, 
  Thermometer, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Sliders, 
  ChevronDown,
  Info,
  X
} from 'lucide-react';
import { UnitData, SAMPLE_UNITS } from '../data/unitsData';

interface AppleStyleScrollBuildingProps {
  onSelectUnit?: (unit: UnitData) => void;
  onNavigateToManager?: () => void;
}

export const AppleStyleScrollBuilding: React.FC<AppleStyleScrollBuildingProps> = ({
  onSelectUnit,
  onNavigateToManager
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('402');
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isHudClosed, setIsHudClosed] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth lerp loop for 60fps cinematic fluidity
  useEffect(() => {
    let targetProgress = 0;
    let currentProgress = 0;
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollableDistance = rect.height - windowHeight;

      if (totalScrollableDistance <= 0) return;

      // When the top of container enters viewport
      const scrolled = -rect.top;
      const rawProgress = scrolled / totalScrollableDistance;
      targetProgress = Math.max(0, Math.min(1, rawProgress));
    };

    const updateFrame = () => {
      // Lerp smoothing: current += (target - current) * 0.12
      currentProgress += (targetProgress - currentProgress) * 0.15;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }
      setScrollProgress(currentProgress);
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(updateFrame);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const selectedUnit = SAMPLE_UNITS.find(u => u.id === selectedUnitId) || SAMPLE_UNITS[1];

  // ==========================================
  // MATHEMATICAL INTERPOLATIONS (0.0 to 1.0)
  // ==========================================
  // Phase 1 (0.00 - 0.25): Monolith in perspective, subtle rotation
  // Phase 2 (0.25 - 0.55): Floors explode along vertical axis
  // Phase 3 (0.55 - 0.80): Upper & lower floors fade, Floor 4 flattens into 2D map
  // Phase 4 (0.80 - 1.00): Fully flat 2D blueprint map with interactive unit telemetry

  // 1. Tilt angles
  // rotateX: Starts at 56deg (isometric), stays through explosion, then smoothly drops to 0deg (flat) between 0.52 and 0.78
  const flattenProgress = Math.max(0, Math.min(1, (scrollProgress - 0.52) / 0.24));
  const rotateX = 56 * (1 - flattenProgress); // 56 -> 0
  
  // rotateZ: Starts at -28deg, eases to -18deg during explosion, then drops to 0deg when flattened
  const initialRotateZ = -28 + (scrollProgress * 15);
  const rotateZ = initialRotateZ * (1 - flattenProgress); // -28 -> 0

  // 2. Explosion vertical displacement (active from 0.20 to 0.60)
  const explosionProgress = Math.max(0, Math.min(1, (scrollProgress - 0.20) / 0.32));
  
  // Separation distances for other floors (pixels)
  const floor5Offset = explosionProgress * 230;
  const floor3Offset = explosionProgress * -80;
  const floor2Offset = explosionProgress * -170;
  const floor1Offset = explosionProgress * -260;

  // 3. Fading of external floors as Floor 4 isolates and flattens
  // Starts fading at 0.50, completely gone by 0.70
  const otherFloorsFadeProgress = Math.max(0, Math.min(1, (scrollProgress - 0.48) / 0.20));
  const otherFloorsOpacity = Math.max(0, 1 - otherFloorsFadeProgress);

  // 4. Blueprint / Map detail reveal on Floor 4
  // Floor 4 interior walls and unit outlines emerge as it flattens (0.58 to 0.80)
  const mapRevealProgress = Math.max(0, Math.min(1, (scrollProgress - 0.56) / 0.22));

  // 5. Telemetry Inspector HUD slide-in (0.72 to 0.94)
  const rawHudSlideProgress = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.22));
  const hudSlideProgress = rawHudSlideProgress;
  const hudEffectiveProgress = isHudClosed ? 0 : rawHudSlideProgress;

  // Lateral shift: Floor Map moves smoothly left on desktop (>=1024px) as HUD enters from the right
  // This guarantees ZERO overlap between the floor map and the inspector card!
  const stageShiftX = (isDesktop && !isHudClosed) ? (hudEffectiveProgress * -205) : 0;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[380vh] bg-[#F7F5F0] select-none"
    >
      {/* STICKY FULL-VIEWPORT STAGE */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-8">

        {/* CENTER VIEWPORT: THE CONTINUOUS 3D DECONSTRUCTING & FLATTENING BUILDING */}
        <div 
          className="relative flex-1 w-full flex items-center justify-center"
          style={{ perspective: '1400px' }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(214, 203, 185, ${0.4 + scrollProgress * 0.3}) 0%, rgba(247, 245, 240, 0) 70%)`
            }}
          />

          {/* MAIN 3D TRANSFORM ASSEMBLY CONTAINER */}
          <div 
            className="relative transition-transform duration-100 ease-out origin-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateX(${stageShiftX}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${isDesktop ? 0.90 + scrollProgress * 0.08 : 0.72 + scrollProgress * 0.08})`,
              width: '540px',
              maxWidth: '92vw',
              height: '385px',
            }}
          >

            {/* ========================================================= */}
            {/* FLOOR 5 (PENTHOUSE & MECHANICAL ROOF) - DECONSTRUCTS UP   */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${140 + floor5Offset}px)`,
                opacity: otherFloorsOpacity,
                display: otherFloorsOpacity <= 0.01 ? 'none' : 'block'
              }}
            >
              {/* Roof Slab */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#E2DDD3] to-[#D5CEC0] border-2 border-[#C2BAAA] shadow-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-[#C2BAAA]/60 pb-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
                    Level 05 • Penthouse & Chillers
                  </span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#B8AE9D] border border-neutral-400" />
                    <span className="w-3 h-3 rounded-xs bg-[#B8AE9D] border border-neutral-400" />
                  </div>
                </div>
                
                {/* Mechanical Chillers Mockup */}
                <div className="flex gap-4 items-center justify-around py-6">
                  <div className="w-20 h-14 bg-[#B5AC9C] rounded border border-neutral-500/40 p-1 flex flex-col justify-between">
                    <div className="w-full h-1.5 bg-neutral-600/30 rounded-xs" />
                    <span className="text-[8px] font-mono text-neutral-700 text-center">CHILLER 01</span>
                  </div>
                  <div className="w-24 h-16 bg-[#B5AC9C] rounded border border-neutral-500/40 p-1 flex flex-col justify-between">
                    <div className="w-full h-1.5 bg-neutral-600/30 rounded-xs" />
                    <span className="text-[8px] font-mono text-neutral-700 text-center">SOLAR RISER</span>
                  </div>
                  <div className="w-20 h-14 bg-[#B5AC9C] rounded border border-neutral-500/40 p-1 flex flex-col justify-between">
                    <div className="w-full h-1.5 bg-neutral-600/30 rounded-xs" />
                    <span className="text-[8px] font-mono text-neutral-700 text-center">CHILLER 02</span>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-neutral-500 text-right">
                  PARAPET 142.0 FT
                </div>
              </div>

              {/* Glass Facade edge drops */}
              <div 
                className="absolute inset-x-2 -bottom-4 h-6 bg-cyan-500/10 border border-cyan-400/30 backdrop-blur-xs rounded-b-lg"
                style={{ transform: 'rotateX(90deg) translateZ(3px)' }}
              />
            </div>

            {/* ========================================================= */}
            {/* FLOOR 4 (THE TARGET STORY) — MORPHS INTO 2D FLAT MAP      */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-0 transition-shadow duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(70px)',
                zIndex: 20
              }}
            >
              {/* 3D Slab Wall Depth (visible only when in 3D perspective, completely hidden once flat) */}
              <div 
                className="absolute -bottom-4 inset-x-0 h-4 bg-[#B5AB98] border-x-2 border-b-2 border-[#8E8472] rounded-b-xl transition-opacity duration-300 pointer-events-none"
                style={{ 
                  opacity: 1 - flattenProgress,
                  transform: 'rotateX(90deg) translateZ(8px)',
                  display: flattenProgress >= 0.85 ? 'none' : 'block'
                }}
              />

              {/* SLAB BASE: Transitions from 3D architectural slab into flat blueprint canvas */}
              <div 
                className={`relative w-full h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ${
                  mapRevealProgress > 0.5 
                    ? 'bg-[#F2EFE8] border-2 border-neutral-900 shadow-2xl' 
                    : 'bg-gradient-to-br from-[#EDE8DF] to-[#DFD8CC] border-2 border-[#BFB6A4] shadow-xl'
                }`}
              >
                {/* SLAB HEADER / ARCHITECTURAL BANNER */}
                <div className="px-4 py-2.5 border-b border-[#DDD7CD] flex items-center justify-between shrink-0 bg-[#EFECE4]/90">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-900">
                      LEVEL 04 • RESIDENTIAL SUITES (401 – 406)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {mapRevealProgress > 0.6 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-white font-bold tracking-wider">
                        ACTIVE SUBMETERS
                      </span>
                    )}
                  </div>
                </div>

                {/* THE INTERNAL FLAT ARCHITECTURAL FLOORPLAN */}
                <div className="relative p-2.5 flex-1 min-h-0 flex flex-col justify-between">

                  {/* TOP ROW UNITS: 401, 402, 403 */}
                  <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
                    
                    {/* UNIT 401 (NOMINAL) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('401');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '401');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '401'
                          ? 'bg-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20'
                          : 'bg-[#FAF8F5] border-[#DDD7CD] hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-neutral-900">UNIT 401</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          OK
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>71.2°F</span>
                        <span>0.00 GPM</span>
                      </div>
                    </div>

                    {/* UNIT 402 (CRITICAL MICRO-LEAK INCIDENT) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('402');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '402');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '402'
                          ? 'bg-rose-50 border-rose-600 shadow-lg ring-2 ring-rose-600/30'
                          : 'bg-rose-50/70 border-rose-400 hover:border-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      {/* Pulsing Alert Badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-rose-950">UNIT 402</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold shadow-xs animate-pulse">
                          <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          LEAK 0.14 GPM
                        </span>
                      </div>

                      {/* Water Anomaly Text */}
                      <div className="flex items-center gap-1.5 py-0.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                        <span className="text-[10px] font-mono font-bold text-rose-800 leading-tight">
                          Bathroom Valve Divergence
                        </span>
                      </div>

                      <div className="text-[10px] text-rose-900 font-mono font-bold flex items-center justify-between pt-1 border-t border-rose-200">
                        <span>Submeter Alert</span>
                        <span className="text-rose-700 underline">Auto-Valved</span>
                      </div>
                    </div>

                    {/* UNIT 403 (TRIAGE IN PROGRESS) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('403');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '403');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '403'
                          ? 'bg-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20'
                          : 'bg-[#FAF8F5] border-[#DDD7CD] hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-neutral-900">UNIT 403</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-300">
                          <Activity className="w-2.5 h-2.5 text-blue-600 animate-spin" />
                          TRIAGE
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>74.6°F</span>
                        <span>VAV Drift</span>
                      </div>
                    </div>

                  </div>

                  {/* CENTRAL ARCHITECTURAL ACCESS CORRIDOR & ELEVATOR CORE (ZERO OVERLAP) */}
                  <div className="h-6 my-1.5 px-3 bg-[#EAE5DA] border-y border-dashed border-[#C5BBAA] rounded flex items-center justify-between z-10 shrink-0">
                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neutral-400" />
                      HALLWAY 04
                    </span>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#DDD6C6] border border-[#BFB5A2] text-neutral-800 shadow-2xs">
                      <span className="text-[8px] font-mono font-bold tracking-wide">ELEV / CORE</span>
                      <span className="text-[7px] font-mono px-1 rounded bg-neutral-900 text-neutral-100 font-bold">W-04</span>
                    </div>

                    <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                      EGRESS 02
                      <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    </span>
                  </div>

                  {/* BOTTOM ROW UNITS: 404, 405, 406 */}
                  <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
                    
                    {/* UNIT 404 (NOMINAL) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('404');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '404');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '404'
                          ? 'bg-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20'
                          : 'bg-[#FAF8F5] border-[#DDD7CD] hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-neutral-900">UNIT 404</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          OK
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>70.8°F</span>
                        <span>Health 96%</span>
                      </div>
                    </div>

                    {/* UNIT 405 (PREVENTIVE WARNING) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('405');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '405');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '405'
                          ? 'bg-amber-50/90 border-amber-600 shadow-md ring-2 ring-amber-600/30'
                          : 'bg-amber-50/60 border-amber-300 hover:border-amber-500 hover:bg-amber-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-amber-950">UNIT 405</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold border border-amber-400">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                          PREDICTIVE
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-800 font-mono flex items-center justify-between">
                        <span>Pump Cavitation</span>
                        <span>Parts Staged</span>
                      </div>
                    </div>

                    {/* UNIT 406 (NOMINAL) */}
                    <div 
                      onClick={() => {
                        setSelectedUnitId('406');
                        setIsHudClosed(false);
                        const u = SAMPLE_UNITS.find(unit => unit.id === '406');
                        if (u) onSelectUnit?.(u);
                      }}
                      className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        selectedUnitId === '406'
                          ? 'bg-white border-neutral-950 shadow-md ring-2 ring-neutral-950/20'
                          : 'bg-[#FAF8F5] border-[#DDD7CD] hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-neutral-900">UNIT 406</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          OK
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono flex items-center justify-between">
                        <span>69.8°F</span>
                        <span>0.00 GPM</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* FLOOR 3 - EXPLODES DOWNWARD                               */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${0 + floor3Offset}px)`,
                opacity: otherFloorsOpacity,
                display: otherFloorsOpacity <= 0.01 ? 'none' : 'block'
              }}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#E8E2D7] to-[#DDD6C8] border-2 border-[#C6BEAF] shadow-lg p-3 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
                  Level 03 • Residential Units 301-306
                </span>
                <div className="grid grid-cols-3 gap-2 opacity-50">
                  <div className="h-10 bg-[#D4CDBC] rounded border border-neutral-400/50" />
                  <div className="h-10 bg-[#D4CDBC] rounded border border-neutral-400/50" />
                  <div className="h-10 bg-[#D4CDBC] rounded border border-neutral-400/50" />
                </div>
                <span className="text-[9px] font-mono text-neutral-500 text-right">ELEVATION 36.0 FT</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* FLOOR 2 - EXPLODES DOWNWARD                               */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${-70 + floor2Offset}px)`,
                opacity: otherFloorsOpacity,
                display: otherFloorsOpacity <= 0.01 ? 'none' : 'block'
              }}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#E2DDD1] to-[#D5CEC0] border-2 border-[#C0B7A6] shadow-lg p-3 flex flex-col justify-between">
                <span className="text-[10px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
                  Level 02 • Residential Units 201-206
                </span>
                <div className="grid grid-cols-3 gap-2 opacity-40">
                  <div className="h-10 bg-[#CCC3B2] rounded border border-neutral-400/50" />
                  <div className="h-10 bg-[#CCC3B2] rounded border border-neutral-400/50" />
                  <div className="h-10 bg-[#CCC3B2] rounded border border-neutral-400/50" />
                </div>
                <span className="text-[9px] font-mono text-neutral-500 text-right">ELEVATION 24.0 FT</span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* FLOOR 1 (PODIUM / LOBBY) - EXPLODES DOWNWARD              */}
            {/* ========================================================= */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${-140 + floor1Offset}px)`,
                opacity: otherFloorsOpacity,
                display: otherFloorsOpacity <= 0.01 ? 'none' : 'block'
              }}
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#DDD7CB] to-[#CFC7B7] border-2 border-[#B8AF9E] shadow-xl p-3 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-neutral-700 uppercase tracking-widest">
                    Level 01 • Lobby & Amenity Courtyard
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">
                    PODIUM
                  </span>
                </div>
                <div className="flex items-center justify-center py-6">
                  <div className="w-48 h-12 border border-neutral-500/40 rounded flex items-center justify-center bg-[#C5BBAA]/50">
                    <span className="text-[9px] font-mono uppercase text-neutral-700 font-bold">
                      Main Entry • Access Turnstiles
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-neutral-600 text-right">ELEVATION 0.0 FT</span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* FLOATING TELEMETRY INSPECTOR HUD (SLIDES IN DURING STAGE 4) */}
          {/* ========================================================= */}
          <div 
            className={`absolute transition-all duration-300 z-40 ${
              isDesktop
                ? 'left-[calc(50%+85px)] top-1/2 -translate-y-1/2 w-[360px]'
                : 'bottom-8 inset-x-4 max-w-sm mx-auto'
            } bg-[#FAF8F5]/95 backdrop-blur-xl border border-[#DDD7CD] rounded-2xl p-5 shadow-2xl ${
              hudEffectiveProgress > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
            style={{
              opacity: hudEffectiveProgress,
              transform: isDesktop
                ? `translateY(-50%) translateX(${(1 - hudEffectiveProgress) * 40}px)`
                : `translateY(${(1 - hudEffectiveProgress) * 20}px)`,
              display: hudEffectiveProgress <= 0.02 ? 'none' : 'block'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DDD1]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedUnit.status === 'critical' 
                    ? 'bg-rose-500 animate-ping' 
                    : selectedUnit.status === 'warning' 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                }`} />
                <h4 className="font-bold text-sm text-neutral-900 font-mono tracking-tight">
                  {selectedUnit.name}
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  selectedUnit.status === 'critical'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : selectedUnit.status === 'warning'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {selectedUnit.status}
                </span>
                <button
                  type="button"
                  onClick={() => setIsHudClosed(true)}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-[#EDE8DE] transition-colors"
                  title="Minimize inspector"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Resident & Status */}
            <div className="py-2.5 border-b border-[#E3DDD1] flex justify-between items-center text-xs">
              <span className="text-neutral-500">Tenant: <strong className="text-neutral-900 font-semibold">{selectedUnit.tenant}</strong></span>
              <span className="font-mono text-neutral-600">HVAC Health: <strong className="text-neutral-900 font-bold">{selectedUnit.hvacHealth}%</strong></span>
            </div>

            {/* Metric gauges */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-[#E3DDD1]">
              <div className="p-2 rounded bg-[#EDE8DE] text-center border border-[#E0D9CB]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-500">
                  <Thermometer className="w-3 h-3 text-neutral-600" />
                  TEMP
                </div>
                <div className="text-xs font-bold font-mono text-neutral-900 mt-0.5">
                  {selectedUnit.temp}
                </div>
              </div>

              <div className={`p-2 rounded text-center ${
                selectedUnit.waterFlow !== '0.00 gpm' && selectedUnit.waterFlow !== '0.00 gpm (idle)'
                  ? 'bg-rose-100 border border-rose-300'
                  : 'bg-[#EDE8DE] border border-[#E0D9CB]'
              }`}>
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-500">
                  <Droplets className="w-3 h-3 text-blue-600" />
                  HYDRO
                </div>
                <div className={`text-xs font-bold font-mono mt-0.5 ${
                  selectedUnit.waterFlow !== '0.00 gpm' && selectedUnit.waterFlow !== '0.00 gpm (idle)'
                    ? 'text-rose-700 font-black'
                    : 'text-neutral-900'
                }`}>
                  {selectedUnit.waterFlow.split(' ')[0]} gpm
                </div>
              </div>

              <div className="p-2 rounded bg-[#EDE8DE] text-center border border-[#E0D9CB]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-500">
                  <Activity className="w-3 h-3 text-neutral-600" />
                  HUMID
                </div>
                <div className="text-xs font-bold font-mono text-neutral-900 mt-0.5">
                  {selectedUnit.humidity.split(' ')[0]}
                </div>
              </div>
            </div>

            {/* Homie Autonomous Action */}
            <div className="py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-neutral-700 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Autonomous Mitigation Loop
              </div>
              <p className="text-xs text-neutral-700 bg-white border border-[#DDD7CD] p-2.5 rounded-lg leading-relaxed shadow-2xs">
                {selectedUnit.lastAutonomousAction}
              </p>
            </div>

            {/* Quick dispatch or inspect action */}
            {onNavigateToManager && (
              <button
                type="button"
                onClick={onNavigateToManager}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-neutral-950 hover:bg-neutral-850 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <span>Open Work Order in Manager Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* SLEEK MINIMAL BOTTOM BAR */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-center text-xs font-mono text-neutral-600 z-30 py-2 border-t border-[#DDD7CD]/60">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EDE8DE]/90 border border-[#DDD7CD] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wide text-neutral-700">Interactive floor map — click units to inspect</span>
          </div>

          {/* Re-open inspector pill if minimized */}
          {scrollProgress >= 0.72 && isHudClosed && (
            <button
              type="button"
              onClick={() => setIsHudClosed(false)}
              className="ml-3 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-mono font-semibold tracking-wide hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Open Inspector
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default AppleStyleScrollBuilding;
