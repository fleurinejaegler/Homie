import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Activity, 
  Sliders, 
  Building, 
  Wrench, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  TrendingDown,
  Gauge,
  PhoneCall,
  Camera,
  Flame,
  ArrowUpRight,
  Cpu
} from 'lucide-react';
import AppleStyleScrollBuilding from './AppleStyleScrollBuilding';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'none';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  className = '',
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '800ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : `opacity-0 ${direction === 'up' ? 'translate-y-8' : ''} scale-[0.98]`
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface OverviewProps {
  onNavigateToTenant: () => void;
  onNavigateToManager: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onNavigateToTenant,
  onNavigateToManager,
}) => {
  const [selectedSimScenario, setSelectedSimScenario] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(3);

  const scenarios = [
    {
      title: 'Acoustic Micro-Leak in Unit 402',
      category: 'Plumbing & Hydro',
      duration: '42s total loop',
      steps: [
        { time: '00:00', title: 'Submeter acoustic spike', detail: '0.14 gpm anomalous continuous flow detected in bathroom riser' },
        { time: '00:12', title: 'Computer vision tenant intake', detail: 'Tenant uploads clip of dripping shutoff valve. Homie identifies 1/2" brass compression fitting' },
        { time: '00:26', title: 'Smart valve actuation', detail: 'Isolation valve pulsed to prevent drywall saturation' },
        { time: '00:42', title: 'Preferred vendor auto-dispatched', detail: 'Express Plumbing assigned under $350 SLA threshold. Resident receives live tracking' },
      ],
      impact: '$3,800 drywall & subfloor damage averted'
    },
    {
      title: 'Chiller 3 Bearing Harmonics',
      category: 'Central Plant HVAC',
      duration: '1m 15s total loop',
      steps: [
        { time: '00:00', title: 'Vibration FFT divergence', detail: 'Accelerometer on roof chiller records 180Hz vibration harmonics (+32% above baseline)' },
        { time: '00:28', title: 'AI degradation diagnosis', detail: 'Predictive failure window: 14 days. Secondary impeller bearing fatigue identified' },
        { time: '00:54', title: 'Automated parts procurement', detail: 'OEM SKF bearing assembly reserved from local distributor inventory' },
        { time: '01:15', title: 'Off-peak maintenance window', detail: 'Scheduled for Tuesday 05:00 AM with Trane certified technician' },
      ],
      impact: '$24,000 emergency compressor replacement prevented'
    },
    {
      title: 'Tenant Intake: Frozen Heat Pump',
      category: 'Conversational Triage',
      duration: '38s total loop',
      steps: [
        { time: '00:00', title: 'Resident voice message', detail: '"My AC is making a hissing noise and not cooling down"' },
        { time: '00:08', title: 'Gemini multimodal analysis', detail: 'Model identifies iced evaporator coil from submitted photo. Filters clogged by pet dander' },
        { time: '00:19', title: 'Guided self-resolution workflow', detail: 'Resident guided through emergency fan-only mode to thaw coil without motor burnout' },
        { time: '00:38', title: 'Filter parcel locker dispatch', detail: 'Correct 16x25x1 MERV 11 filter automatically checked out from on-site building parcel hub' },
      ],
      impact: '100% truck-roll deflection • 9.8/10 tenant CSAT'
    }
  ];

  const handleRunSim = (index: number) => {
    setSelectedSimScenario(index);
    setIsSimulating(true);
    setSimStep(0);

    const stepInterval = setInterval(() => {
      setSimStep(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          return 3;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-[#EBE3D3]/60 via-[#F7F5F0]/30 to-transparent pointer-events-none -z-10 blur-2xl" />

        {/* Minimal pill badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#DDD7CD] bg-[#EDE8DE]/80 backdrop-blur-sm text-xs font-medium text-neutral-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px] text-neutral-600">
              Autonomous Operations Engine
            </span>
            <span className="text-[#B0A795]">•</span>
            <span className="text-neutral-500">Multi-Family Intelligence</span>
          </div>
        </div>

        {/* Main Headline with oversized editorial typography */}
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-neutral-950 leading-[0.95]">
            Physical assets.
            <br />
            <span className="font-serif italic font-normal text-neutral-800">
              Run by intelligence.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-600 leading-relaxed font-normal pt-2">
            Homie autonomously diagnoses, triages, and dispatches multi-family asset operations. Replacing reactive call centers with millimeter-precision digital twin intelligence.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onNavigateToManager}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-sm font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Launch Manager Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToTenant}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#E8E2D5] text-neutral-900 hover:bg-[#DDD6C7] border border-[#DDD7CD] text-sm font-semibold transition-all shadow-xs"
            >
              <Camera className="w-4 h-4 text-neutral-800" />
              <span>Simulate Tenant Intake</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#EDE7DD] border border-[#DDD7CD] shadow-xs">
          <div className="p-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              OpEx Deflection
            </span>
            <div className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              $240<span className="text-sm font-normal text-neutral-600">/unit/yr</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Autonomous vendor dispatch limit</p>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Self-Resolution Rate
            </span>
            <div className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              78.4%
            </div>
            <p className="text-xs text-neutral-500 mt-1">Guided resident DIY + smart actuation</p>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Median Triage Velocity
            </span>
            <div className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              88<span className="text-sm font-normal text-neutral-600">sec</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">From intake to assigned PO</p>
          </div>

          <div className="p-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
              Active Portfolio
            </span>
            <div className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
              38,400+
            </div>
            <p className="text-xs text-neutral-500 mt-1">Class-A residences nationwide</p>
          </div>
        </div>

      </section>

      {/* 2. THE CONTINUOUS SCROLL-DRIVEN 3D BUILDING & FLOOR MAP TRANSFORMATION */}
      <section className="relative w-full border-t border-[#E3DDD1]">
        
        {/* Section Intro */}
        <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 mb-2">
              <Layers className="w-3.5 h-3.5" />
              Dynamic Physical Grounding
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
              The continuous building twin.
            </h2>
            <p className="text-neutral-600 max-w-xl text-base mt-2">
              Scroll down to explore structural stories, floor isolation, and unit-level incident diagnostics.
            </p>
          </div>
        </div>

        {/* Building deconstruction into interactive unit floor plan */}
        <AppleStyleScrollBuilding onNavigateToManager={onNavigateToManager} />

      </section>

      {/* 3. PARADIGM SHIFT: LEGACY PROPERTY MANAGEMENT VS. HOMIE AUTONOMOUS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3DDD1]">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
              The Structural Shift
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              Why traditional property ops collapse under scale.
            </h2>
            <p className="text-neutral-600 mt-3 text-lg">
              Property managers spend 62% of their day answering repetitive phone calls and chasing contractor quotes. Homie turns physical operations into a continuous software protocol.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Legacy Ops Card */}
          <ScrollReveal delay={100} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-[#EDE7DD] border border-[#DDD7CD] flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-500">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#DDD7CD]">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-bold">
                    Legacy Property Management
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700">
                    REACTIVE
                  </span>
                </div>

                <div className="space-y-6 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">After-Hours Call Answering Services</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        Untrained agents take voicemail messages. Critical pipe ruptures sit unnoticed for 6+ hours until morning shift arrives.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">Unnecessary $250 Truck Rolls</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        Contractors dispatched for tripped GCFI outlets, dead smart lock batteries, and loose disposal jams that residents could fix in 30 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✕
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900">Catastrophic Capital Surprises</h4>
                      <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                        Boilers and cooling towers run to failure without harmonic or vibration monitoring, incurring $45,000 emergency replacement fees.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#DDD7CD] mt-8 text-xs font-mono text-neutral-500">
                Avg Cost: $580/unit/year in operational overhead
              </div>
            </div>
          </ScrollReveal>

          {/* Homie Autonomous Card */}
          <ScrollReveal delay={220} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-black text-white border border-neutral-800 shadow-2xl flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
              {/* Subtle ambient luster glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">
                    Homie Autonomous Operating Layer
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    AUTONOMOUS
                  </span>
                </div>

                <div className="space-y-6 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Multimodal Video & Photo Triage</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Resident video and photo intake diagnose the exact component failure in seconds with automated trade classification and parts requisition.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">78% Guided DIY Deflection Engine</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Interactive AR and step-by-step diagnostic workflows empower residents to solve minor issues safely, saving thousands in unneeded callouts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-sm font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">Automated SLA Dispatch & Parts Procurement</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        Preferred vendor networks automatically receive pre-authorized POs, digital lock access codes, and OEM part numbers before arriving on-site.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 border-t border-neutral-800 mt-8 text-xs font-mono text-emerald-400">
                Proven Deflection: $240/unit net savings returned to NOI
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 4. INTERACTIVE AUTONOMOUS TRIAGE SIMULATOR */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3DDD1]">
        
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                Live Engine Sandbox
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-950">
                Watch Homie resolve an incident in 60 seconds.
              </h2>
              <p className="text-neutral-600 max-w-xl text-base mt-2">
                Select a real-world multi-family failure scenario to inspect the autonomous step-by-step resolution loop.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {scenarios.map((sc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunSim(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSimScenario === idx
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-[#EDE8DE] text-neutral-700 border-[#DDD7CD] hover:text-black hover:border-neutral-400'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Simulation Execution Box */}
        <ScrollReveal delay={150}>
          <div className="p-6 sm:p-8 rounded-2xl bg-[#EDE7DD] border border-[#DDD7CD] shadow-sm hover:shadow-md transition-shadow duration-500">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#DDD7CD]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  SIMULATION SCENARIO
                </span>
                <h3 className="text-xl font-bold text-neutral-950">
                  {scenarios[selectedSimScenario].title}
                </h3>
                <p className="text-xs text-neutral-500">
                  Category: {scenarios[selectedSimScenario].category} • Total cycle: {scenarios[selectedSimScenario].duration}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {scenarios[selectedSimScenario].impact}
                </span>
                <button
                  onClick={() => handleRunSim(selectedSimScenario)}
                  disabled={isSimulating}
                  className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Executing...' : 'Re-run Scenario'}</span>
                </button>
              </div>
            </div>

            {/* Sequential Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {scenarios[selectedSimScenario].steps.map((step, idx) => {
                const isPastOrCurrent = idx <= simStep;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      isPastOrCurrent
                        ? 'bg-white border-[#DDD7CD] shadow-xs translate-y-0 opacity-100'
                        : 'bg-[#E5DFD4]/50 border-dashed border-[#DDD7CD] opacity-40 translate-y-2'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-neutral-900 bg-[#F5F2EB] px-2 py-0.5 rounded">
                        {step.time}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-neutral-400">
                        Step 0{idx + 1}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-neutral-900 leading-snug mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </ScrollReveal>

      </section>

      {/* 5. EDITORIAL FEATURE MOMENTS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3DDD1]">
        
        <ScrollReveal>
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
              The Architectural Stack
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950">
              Four pillars of autonomous asset care.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Pillar 1 */}
          <ScrollReveal delay={60} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-[#DDD7CD] shadow-xs hover:border-neutral-900/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EDE7DD] border border-[#DDD7CD] flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Multimodal Resident Intake
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Residents speak or type naturally in any language. Gemini 3.8 Flash extracts serial numbers from appliance plates, identifies fitting leaks, and guides zero-cost DIY resolutions in real-time.
                </p>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs font-mono text-neutral-700 flex items-center justify-between border border-[#DDD7CD]/60">
                <span>Average intake completion:</span>
                <strong className="text-black font-bold">44 seconds</strong>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 2 - Continuous Hydro & Acoustic Mesh (Roadmap / Future Feature) */}
          <ScrollReveal delay={160} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-[#DDD7CD] shadow-xs hover:border-neutral-900/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE7DD] border border-[#DDD7CD] flex items-center justify-center text-neutral-900 group-hover:scale-110 transition-transform duration-300">
                    <Droplets className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-900 bg-purple-100 border border-purple-300 rounded-full">
                    Roadmap • Future Feature
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Continuous Hydro & Acoustic Mesh
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Future integration: Planned hardware connection with IoT submeters, acoustic pipe monitors, and motorized shutoff valves. Currently active via resident video/photo intake and AI computer vision diagnostics.
                </p>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs font-mono text-neutral-700 flex items-center justify-between border border-[#DDD7CD]/60">
                <span>Hardware Rollout Target:</span>
                <strong className="text-purple-950 font-bold">Phase 2 Specification</strong>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 3 */}
          <ScrollReveal delay={260} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-[#DDD7CD] shadow-xs hover:border-neutral-900/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EDE7DD] border border-[#DDD7CD] flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Algorithmic Vendor Dispatch
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Automated contractor selection based on historical completion velocity, verified COI liability insurance, and pre-negotiated portfolio rate cards with smart-lock geofenced access.
                </p>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs font-mono text-neutral-700 flex items-center justify-between border border-[#DDD7CD]/60">
                <span>First-time fix rate:</span>
                <strong className="text-black font-bold">91.8% verified</strong>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 4 */}
          <ScrollReveal delay={360} className="h-full">
            <div className="h-full p-8 rounded-2xl bg-white border border-[#DDD7CD] shadow-xs hover:border-neutral-900/40 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EDE7DD] border border-[#DDD7CD] flex items-center justify-center text-neutral-900 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Institutional ESG & Compliance
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  Autonomous scheduling for seasonal HVAC filter changes, fire damper checks, and local compliance inspections. Audit-ready PDF logs generated without human intervention.
                </p>
              </div>
              <div className="p-3 bg-[#F7F5F0] rounded-xl text-xs font-mono text-neutral-700 flex items-center justify-between border border-[#DDD7CD]/60">
                <span>Audit compliance score:</span>
                <strong className="text-black font-bold">100% automated</strong>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </section>

      {/* 6. INSTITUTIONAL PORTFOLIO PROOF */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#E3DDD1]">
        <ScrollReveal delay={100}>
          <div className="p-8 sm:p-12 rounded-3xl bg-[#EDE7DD] border border-[#DDD7CD] flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl transition-all duration-500">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold block mb-2">
                PORTFOLIO DEPLOYMENT
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-neutral-950 tracking-tight">
                Trusted on top Class-A multi-family portfolios.
              </h3>
              <p className="text-neutral-600 text-sm mt-3 leading-relaxed">
                Leading institutional REITs and property management firms deploy Homie to elevate NOI, compress maintenance response times, and delight residents with instantaneous resolution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
              <button
                onClick={onNavigateToManager}
                className="px-6 py-4 bg-black text-white hover:bg-neutral-800 text-xs font-semibold rounded-xl transition-all shadow-md text-center hover:-translate-y-0.5"
              >
                Open Manager Command Center
              </button>
              <button
                onClick={onNavigateToTenant}
                className="px-6 py-4 bg-white text-neutral-900 hover:bg-[#F5F2EB] border border-[#DDD7CD] text-xs font-semibold rounded-xl transition-all text-center hover:-translate-y-0.5"
              >
                Test Resident Intake View
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. CINEMATIC FINAL EDITORIAL CTA */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-[#E3DDD1]">
        <ScrollReveal delay={100}>
          <h2 className="text-5xl sm:text-7xl font-black text-neutral-950 tracking-tight leading-[0.95] mb-6">
            The autonomous era
            <br />
            <span className="font-serif italic font-normal text-neutral-800">
              starts with your buildings.
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-neutral-600 text-base mb-8">
            Connect your existing PMS (Yardi, RealPage, Entrata) in under 10 minutes. Watch maintenance overhead shrink in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToManager}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-black text-white hover:bg-neutral-800 text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5"
            >
              <span>Access Manager Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};

export default Overview;
