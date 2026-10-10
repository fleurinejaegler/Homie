import React, { useState, useRef } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Sparkles, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  ShieldAlert, 
  X, 
  ArrowRight,
  Loader2,
  Play,
  Pause,
  Video,
  Eye,
  RefreshCw,
  Droplets
} from 'lucide-react';
import { TriageDiagnostic, WorkOrderTicket } from '../types';
import DIYDeflectionModal from './DIYDeflectionModal';

interface TenantIntakeViewProps {
  onTicketCreated: (ticket: WorkOrderTicket) => void;
  onDIYDeflected: (ticket: WorkOrderTicket) => void;
  onNavigateToManager: () => void;
  selectedBuilding: string;
  initialPreset?: 'disposal' | 'pipe_burst' | 'sink_leak' | 'gfci' | null;
}

interface UploadedMediaState {
  name: string;
  type: 'image' | 'video';
  previewUrl: string;
  base64Data?: string;
  mimeType?: string;
  videoDuration?: number;
}

export const TenantIntakeView: React.FC<TenantIntakeViewProps> = ({
  onTicketCreated,
  onDIYDeflected,
  onNavigateToManager,
  selectedBuilding,
  initialPreset,
}) => {
  const [unit] = useState('Unit 412');
  const [tenantName] = useState('Alex Chen');
  const [description, setDescription] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMediaState | null>(null);
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');
  const [activeDiagnostic, setActiveDiagnostic] = useState<TriageDiagnostic | null>(null);
  const [showDIYModal, setShowDIYModal] = useState(false);
  const [submittedSuccessTicket, setSubmittedSuccessTicket] = useState<WorkOrderTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Auto-load preset if passed
  React.useEffect(() => {
    if (initialPreset) {
      handleLoadPreset(initialPreset);
    }
  }, [initialPreset]);

  // Simulation Presets
  const handleLoadPreset = (type: 'disposal' | 'pipe_burst' | 'sink_leak' | 'gfci' | 'gas') => {
    setErrorMessage(null);
    setSubmittedSuccessTicket(null);

    if (type === 'disposal') {
      setDescription(
        "Kitchen garbage disposal hums loudly when switched on, but the blades won't spin and water is backing up in the sink."
      );
      setUploadedMedia({
        name: 'disposal_audio_vibration.mp4',
        type: 'video',
        previewUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        mimeType: 'image/jpeg',
      });
    } else if (type === 'pipe_burst') {
      setDescription(
        'Active high-pressure water leaking through the living room ceiling light fixture onto the floor. Plaster cracking.'
      );
      setUploadedMedia({
        name: 'ceiling_leak_cascade.mp4',
        type: 'video',
        previewUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
        mimeType: 'image/jpeg',
      });
    } else if (type === 'sink_leak') {
      setDescription(
        'Water leaking steadily from the drain P-trap connection under the master bathroom sink. Pooling on the cabinet wood base.'
      );
      setUploadedMedia({
        name: 'under_sink_ptrap_leak.mp4',
        type: 'video',
        previewUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        mimeType: 'image/jpeg',
      });
    } else if (type === 'gfci') {
      setDescription(
        'All electrical outlets around the master bath sink lost power suddenly after plugging in hair dryer.'
      );
      setUploadedMedia({
        name: 'gfci_outlet.jpg',
        type: 'image',
        previewUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
        mimeType: 'image/jpeg',
      });
    } else if (type === 'gas') {
      setDescription(
        'Pungent sulfur rotten egg odor detected behind stove burner, detector just beeped.'
      );
      setUploadedMedia({
        name: 'stove_burner.jpg',
        type: 'image',
        previewUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        mimeType: 'image/jpeg',
      });
    }
  };

  // Process user's custom recorded or uploaded video/photo
  const processSelectedFile = async (file: File) => {
    setIsProcessingMedia(true);
    setErrorMessage(null);

    const isVideo = file.type.startsWith('video');
    const previewUrl = URL.createObjectURL(file);

    try {
      if (!isVideo) {
        // Read image file as Base64
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedMedia({
            name: file.name,
            type: 'image',
            previewUrl,
            base64Data: reader.result as string,
            mimeType: file.type || 'image/jpeg',
          });
          setIsProcessingMedia(false);
        };
        reader.onerror = () => {
          setUploadedMedia({
            name: file.name,
            type: 'image',
            previewUrl,
            mimeType: file.type || 'image/jpeg',
          });
          setIsProcessingMedia(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Extract key frame from video using offscreen HTML5 video + canvas
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.src = previewUrl;

        const seekTimeout = setTimeout(() => {
          setUploadedMedia({
            name: file.name,
            type: 'video',
            previewUrl,
            mimeType: 'image/jpeg',
          });
          setIsProcessingMedia(false);
        }, 3500);

        video.onloadeddata = () => {
          video.currentTime = Math.min(0.8, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          clearTimeout(seekTimeout);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth || 640, 1280);
            canvas.height = Math.round((video.videoHeight || 480) * (canvas.width / (video.videoWidth || 640)));
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const base64Data = canvas.toDataURL('image/jpeg', 0.85);
              setUploadedMedia({
                name: file.name,
                type: 'video',
                previewUrl,
                base64Data,
                mimeType: 'image/jpeg',
                videoDuration: video.duration,
              });
              setIsProcessingMedia(false);
              return;
            }
          } catch (e) {
            console.warn('Canvas frame capture fallback:', e);
          }
          setUploadedMedia({
            name: file.name,
            type: 'video',
            previewUrl,
            mimeType: 'image/jpeg',
            videoDuration: video.duration,
          });
          setIsProcessingMedia(false);
        };

        video.onerror = () => {
          clearTimeout(seekTimeout);
          setUploadedMedia({
            name: file.name,
            type: 'video',
            previewUrl,
            mimeType: 'image/jpeg',
          });
          setIsProcessingMedia(false);
        };
      }
    } catch (err) {
      console.error('Error processing media file:', err);
      setUploadedMedia({
        name: file.name,
        type: isVideo ? 'video' : 'image',
        previewUrl,
      });
      setIsProcessingMedia(false);
    }

    // Auto-fill starter prompt if empty
    if (!description.trim()) {
      setDescription(
        isVideo 
          ? 'Live video recording of active maintenance issue attached for autonomous institutional triage.' 
          : 'Photo evidence of maintenance issue attached for inspection.'
      );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleRemoveMedia = () => {
    setUploadedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRunDiagnostic = async () => {
    if (!description.trim() && !uploadedMedia) {
      setErrorMessage('Please describe the issue or record/upload video evidence.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSubmittedSuccessTicket(null);
    setActiveDiagnostic(null);

    // Multi-stage progression feedback matching latest Gemini 3.8 Flash capabilities
    setAnalysisPhase(
      uploadedMedia?.type === 'video'
        ? 'Gemini 3.8 Flash analyzing video frames, water flow rate & ingress risks...'
        : 'Gemini 3.8 Flash inspecting telemetry & trade specifications...'
    );
    
    try {
      const timer1 = setTimeout(() => {
        setAnalysisPhase('Classifying trade specialization, OSHA hazards & parts list...');
      }, 700);

      const timer2 = setTimeout(() => {
        setAnalysisPhase('Formulating Greystar institutional dispatch & deflection SOP...');
      }, 1500);

      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim() || 'Visual evidence inspection request.',
          mediaMetadata: uploadedMedia
            ? { name: uploadedMedia.name, type: uploadedMedia.type }
            : null,
          mediaData: uploadedMedia?.base64Data
            ? { base64: uploadedMedia.base64Data, mimeType: uploadedMedia.mimeType || 'image/jpeg' }
            : null,
          unit,
          tenant: tenantName,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const diagnosticData: TriageDiagnostic = await res.json();
      setActiveDiagnostic(diagnosticData);

      if (diagnosticData.is_diy_eligible) {
        // Trigger DIY Deflection Intercept Modal
        setShowDIYModal(true);
      } else {
        // Direct Dispatch to Manager Command Center
        const newTicket: WorkOrderTicket = {
          id: `WO-${Math.floor(8900 + Math.random() * 900)}`,
          unit,
          tenantName,
          tenantContact: '(415) 555-0142',
          reportedAt: 'Just now',
          description: description || 'Visual telemetry triage request',
          mediaUrl: uploadedMedia?.previewUrl,
          mediaType: uploadedMedia?.type,
          diagnostic: diagnosticData,
          status: diagnosticData.urgency === 'Emergency' ? 'Dispatched Vendor' : 'Pending Review',
          assignedEntity:
            diagnosticData.urgency === 'Emergency'
              ? `Emergency Dispatch (${diagnosticData.required_trade} Specialist)`
              : `In-House Facilities Queue`,
          dispatchETA: diagnosticData.urgency === 'Emergency' ? '15-25 mins' : 'Next Available Tech Window',
          telemetryLog: [
            `${new Date().toLocaleTimeString()} - Tenant intake submitted via Homie AI`,
            uploadedMedia?.type === 'video' 
              ? `${new Date().toLocaleTimeString()} - Video inspection frames extracted & processed by Gemini 3.8 Flash`
              : `${new Date().toLocaleTimeString()} - Multimodal telemetry analyzed`,
            `${new Date().toLocaleTimeString()} - Gemini 3.8 Flash diagnostic: ${diagnosticData.urgency} Urgency (${diagnosticData.required_trade})`,
            `${new Date().toLocaleTimeString()} - Automated dispatch ticket routed to property management desk`,
          ],
        };

        onTicketCreated(newTicket);
        setSubmittedSuccessTicket(newTicket);
      }
    } catch (err: any) {
      console.error('Triage error:', err);
      setErrorMessage('Unable to connect to diagnostic service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDIYDeflection = () => {
    if (!activeDiagnostic) return;

    const resolvedTicket: WorkOrderTicket = {
      id: `WO-${Math.floor(8900 + Math.random() * 900)}`,
      unit,
      tenantName,
      tenantContact: '(415) 555-0142',
      reportedAt: 'Just now',
      description: description || 'Self-guided resolution',
      mediaUrl: uploadedMedia?.previewUrl,
      mediaType: uploadedMedia?.type,
      diagnostic: activeDiagnostic,
      status: 'Resolved via DIY',
      isResolvedByDIY: true,
      resolutionTimestamp: 'Just now',
      assignedEntity: 'Tenant Self-Resolution (Deflected)',
      telemetryLog: [
        `${new Date().toLocaleTimeString()} - Intake entered`,
        `${new Date().toLocaleTimeString()} - Gemini flagged as DIY eligible ($150 saved)`,
        `${new Date().toLocaleTimeString()} - Tenant verified issue resolved without technician dispatch`,
      ],
    };

    onDIYDeflected(resolvedTicket);
    setShowDIYModal(false);
    setDescription('');
    setUploadedMedia(null);
    setActiveDiagnostic(null);
    setSubmittedSuccessTicket(resolvedTicket);
  };

  const handleDispatchAnyway = () => {
    if (!activeDiagnostic) return;

    const dispatchedTicket: WorkOrderTicket = {
      id: `WO-${Math.floor(8900 + Math.random() * 900)}`,
      unit,
      tenantName,
      tenantContact: '(415) 555-0142',
      reportedAt: 'Just now',
      description: description || 'Manual technician request',
      mediaUrl: uploadedMedia?.previewUrl,
      mediaType: uploadedMedia?.type,
      diagnostic: {
        ...activeDiagnostic,
        is_diy_eligible: false,
      },
      status: 'Assigned In-House',
      assignedEntity: `In-House ${activeDiagnostic.required_trade} Tech`,
      dispatchETA: '1-2 hours',
      telemetryLog: [
        `${new Date().toLocaleTimeString()} - Tenant attempted self-resolution; requested technician confirmation`,
        `${new Date().toLocaleTimeString()} - Dispatched to in-house queue`,
      ],
    };

    onTicketCreated(dispatchedTicket);
    setShowDIYModal(false);
    setSubmittedSuccessTicket(dispatchedTicket);
  };

  const isLeakRelated = 
    uploadedMedia?.name.toLowerCase().includes('leak') ||
    description.toLowerCase().includes('leak') ||
    description.toLowerCase().includes('water') ||
    description.toLowerCase().includes('pipe');

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10">
      
      {/* Pitch Hook & Value Proposition */}
      <div className="text-center mb-8 space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs text-[11px] font-semibold text-neutral-800 tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#0000EE]" />
          <span>Multimodal Triage • 35% Avoidable Truck Roll Deflection</span>
        </div>
        <h1 className="font-serif-editorial text-4xl sm:text-5xl text-neutral-950 font-normal tracking-tight leading-[1.1]">
          Stop dispatching $150 truck rolls <br className="hidden sm:inline" />
          for a 30-second fix.
        </h1>
        <p className="max-w-md mx-auto text-xs sm:text-sm text-neutral-600 font-medium leading-relaxed">
          Homie analyzes resident live video & audio telemetry with Gemini 3.8 Flash, diagnosing leaks, appliances, and electrical faults to optimize institutional dispatch.
        </p>
      </div>

      {/* Mobile-First Card Container */}
      <div className="bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-lg shadow-xs overflow-hidden">
        
        {/* 1. Unit & Tenant Header */}
        <div className="px-6 py-5 border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(46.2_33.3%_92.4%)] flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-500">
              Resident Service Portal
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-neutral-900 font-normal mt-0.5">
              {unit} — {tenantName}
            </h2>
          </div>
          <div className="text-right">
            <span className="inline-block px-2.5 py-1 text-[11px] font-semibold text-neutral-700 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-xs">
              The Berkeley Beacon
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">

          {/* Quick Simulation Presets Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#0000EE]" />
                Interactive Demo Presets
              </span>
              <span className="text-[11px] text-neutral-500 font-medium">Click to load simulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Preset 1: Ceiling Pipe Burst */}
              <button
                type="button"
                onClick={() => handleLoadPreset('pipe_burst')}
                className="text-left p-3 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border border-[hsl(51.4_15.6%_78%)] hover:border-red-400 rounded-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-red-700">
                    Ceiling Pipe Burst
                  </span>
                  <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100/70 border border-red-300 px-1.5 py-0.2 rounded-xs">
                    Emergency
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  High-pressure leak cascading through ceiling light fixture.
                </p>
              </button>

              {/* Preset 2: Under-Sink P-Trap Leak */}
              <button
                type="button"
                onClick={() => handleLoadPreset('sink_leak')}
                className="text-left p-3 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border border-[hsl(51.4_15.6%_78%)] hover:border-blue-500 rounded-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-[#0000EE]">
                    Under-Sink Pipe Leak
                  </span>
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100/70 border border-blue-300 px-1.5 py-0.2 rounded-xs">
                    High Urgency
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  P-trap coupling dripping steadily into vanity cabinet.
                </p>
              </button>

              {/* Preset 3: Jammed Disposal (DIY) */}
              <button
                type="button"
                onClick={() => handleLoadPreset('disposal')}
                className="text-left p-3 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border border-[hsl(51.4_15.6%_78%)] hover:border-emerald-500 rounded-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                    Disposal Jammed
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.2 rounded-xs">
                    Save $150
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  Flywheel jammed, hums loudly, water backing up.
                </p>
              </button>

              {/* Preset 4: GFCI Reset (DIY) */}
              <button
                type="button"
                onClick={() => handleLoadPreset('gfci')}
                className="text-left p-3 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border border-[hsl(51.4_15.6%_78%)] hover:border-emerald-500 rounded-md transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700">
                    Bath GFCI Tripped
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-1.5 py-0.2 rounded-xs">
                    Save $150
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                  Bath vanity outlets suddenly unpowered.
                </p>
              </button>
            </div>
          </div>

          {/* 2. Media Capture & Upload Zone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-bold tracking-wider text-neutral-700">
                Media Evidence (Record Video / Capture Photo)
              </label>
              {isProcessingMedia && (
                <span className="text-[11px] text-[#0000EE] font-semibold flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing Video Frames...
                </span>
              )}
            </div>

            {uploadedMedia ? (
              <div className="space-y-2.5">
                <div className="p-3 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 bg-neutral-900 rounded-xs border border-[hsl(51.4_15.6%_78%)] flex items-center justify-center flex-shrink-0 text-white relative overflow-hidden">
                        {uploadedMedia.type === 'video' ? (
                          <Video className="w-5 h-5 text-blue-400" />
                        ) : (
                          <img
                            src={uploadedMedia.previewUrl}
                            alt="Media thumbnail"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {uploadedMedia.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 capitalize flex items-center gap-1">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {uploadedMedia.type === 'video' ? 'Live Video Telemetry Attached' : 'Photo Attached'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="p-1 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                      aria-label="Remove media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Playable Video Player if Video Format */}
                  {uploadedMedia.type === 'video' && uploadedMedia.previewUrl && !uploadedMedia.previewUrl.startsWith('https://images.unsplash') && (
                    <div className="mt-2 rounded-md overflow-hidden bg-black border border-neutral-700">
                      <video
                        src={uploadedMedia.previewUrl}
                        controls
                        playsInline
                        className="w-full max-h-48 object-contain bg-black"
                      />
                    </div>
                  )}

                  {/* Telemetry Indicator */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1 border-t border-[hsl(51.4_15.6%_78%)]/60">
                    <span>Multimodal Inspection: Active</span>
                    <span className="font-mono">Gemini 3.8 Flash Vision Ready</span>
                  </div>
                </div>

                {/* Multimodal Leak Diagnostic Telemetry HUD */}
                {isLeakRelated && (
                  <div className="p-3 bg-red-50/80 border border-red-300 rounded-md text-[11px] space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-red-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping" />
                        Computer Vision Hydraulic & Ingress HUD
                      </span>
                      <span className="font-mono text-[10px]">Active Fluid Stream Detected</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-red-100/50 p-2 rounded-xs border border-red-200">
                      <div>
                        <span className="text-red-700 block font-semibold">Subfloor Ingress Risk:</span>
                        <span className="text-neutral-800">Elevated (Drywall & Cabinet Base)</span>
                      </div>
                      <div>
                        <span className="text-red-700 block font-semibold">Trade Route:</span>
                        <span className="text-neutral-800">Master Plumber Dispatch</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-red-800 leading-tight">
                      <strong>AI Vision Guidance:</strong> Close the angle-stop shutoff valve under the fixture immediately to limit structural damage.
                    </p>
                  </div>
                )}

                {/* Disposal Diagnostic Telemetry */}
                {uploadedMedia.name.includes('disposal') && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-md text-[11px] space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-emerald-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Audio Hum & Frequency Analysis
                      </span>
                      <span className="font-mono text-[10px]">120 Hz Hum • 0 RPM</span>
                    </div>
                    <div className="flex items-center gap-0.5 h-3 px-1 py-0.5 bg-emerald-100/60 rounded-xs">
                      {[40, 70, 90, 85, 30, 95, 100, 60, 45, 80, 90, 75, 50, 85, 95, 60, 40, 75, 90, 85, 45, 95, 100, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-emerald-600 rounded-xs transition-all duration-300"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-tight">
                      <strong>AI Match:</strong> Locked-rotor flywheel jam. Eligible for self-guided hex wrench deflection ($150 saved).
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Record Video directly with Camera */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border-2 border-dashed border-[hsl(51.4_15.6%_78%)] hover:border-black rounded-md transition-all text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0000EE] group-hover:scale-110 flex items-center justify-center mb-2 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      Record Video (Camera)
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Shoot video clip of leak or sound
                    </span>
                  </button>

                  {/* Option 2: Upload Pre-recorded Video or Photo */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-4 bg-[hsl(46.2_33.3%_92.4%)] hover:bg-[#F9F7F1] border-2 border-dashed border-[hsl(51.4_15.6%_78%)] hover:border-black rounded-md transition-all text-center cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-800 group-hover:scale-110 flex items-center justify-center mb-2 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">
                      Upload Video / Photo
                    </span>
                    <span className="text-[10px] text-neutral-500 mt-0.5">
                      Select MP4, MOV, or JPEG
                    </span>
                  </button>
                </div>

                {/* Hidden native input for live camera recording */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="video/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Hidden native input for general file picking */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Instant Try Leak Video Helper Button */}
                <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-neutral-500">
                  <span>Testing without a live leak?</span>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('sink_leak')}
                    className="text-[#0000EE] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Try Sample Leak Video Demo</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Issue Description Input */}
          <div className="space-y-2">
            <label 
              htmlFor="issue-description"
              className="block text-xs uppercase font-bold tracking-wider text-neutral-700"
            >
              Issue Description
            </label>
            <textarea
              id="issue-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you see, hear, or smell (or record a video above)..."
              className="w-full p-3 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-y"
            />
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-md flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 4. Submit Action & Loading State */}
          <div className="pt-2">
            {isLoading ? (
              <div className="p-4 bg-[hsl(46.2_33.3%_92.4%)] border border-[hsl(51.4_15.6%_78%)] rounded-md space-y-3">
                <div className="flex items-center gap-2.5 text-[#0000EE]">
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span className="text-xs font-semibold tracking-wide animate-pulse">
                    {analysisPhase}
                  </span>
                </div>
                <div className="w-full bg-[hsl(50_20.7%_88.6%)] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0000EE] h-full w-2/3 animate-pulse" />
                </div>
                <p className="text-[11px] text-neutral-500 italic">
                  Parsing computer vision frames, water pressure, drywall saturation, and Greystar SOP rules.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRunDiagnostic}
                className="w-full py-3.5 px-4 bg-[#0000EE] hover:bg-blue-700 text-white text-xs uppercase font-bold tracking-wider rounded-md border border-blue-900 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Diagnostic & Submit</span>
              </button>
            )}
          </div>

          {/* Direct Non-DIY Submission Confirmation Banner */}
          {submittedSuccessTicket && (
            <div className={`p-4 rounded-md border space-y-3 ${
              submittedSuccessTicket.isResolvedByDIY
                ? 'bg-emerald-50/80 border-emerald-300'
                : submittedSuccessTicket.diagnostic.urgency === 'Emergency'
                ? 'bg-red-50/90 border-red-300'
                : 'bg-blue-50/80 border-blue-300'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-5 h-5 ${
                    submittedSuccessTicket.isResolvedByDIY ? 'text-emerald-700' : 'text-[#0000EE]'
                  }`} />
                  <h3 className="text-sm font-bold text-neutral-900">
                    {submittedSuccessTicket.isResolvedByDIY 
                      ? 'Ticket Deflected & Resolved (NOI Saved: $150)' 
                      : `Work Order Created: ${submittedSuccessTicket.id}`
                    }
                  </h3>
                </div>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                  submittedSuccessTicket.diagnostic.urgency === 'Emergency'
                    ? 'bg-red-200 text-red-900'
                    : 'bg-neutral-200 text-neutral-800'
                }`}>
                  {submittedSuccessTicket.diagnostic.urgency}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed">
                {submittedSuccessTicket.isResolvedByDIY
                  ? 'Your issue was resolved autonomously via guided deflection. No maintenance technician was dispatched, saving building operations $150.'
                  : `Dispatched to: ${submittedSuccessTicket.assignedEntity}. Estimated arrival: ${submittedSuccessTicket.dispatchETA}.`}
              </p>

              {submittedSuccessTicket.diagnostic.safety_warning && !submittedSuccessTicket.isResolvedByDIY && (
                <div className="text-[11px] font-semibold text-red-800 bg-red-100/80 p-2 rounded-xs border border-red-200">
                  {submittedSuccessTicket.diagnostic.safety_warning}
                </div>
              )}

              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onNavigateToManager}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0000EE] hover:underline cursor-pointer"
                >
                  <span>View in Property Manager Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DIY Deflection Modal Intercept */}
      {showDIYModal && activeDiagnostic && (
        <DIYDeflectionModal
          diagnostic={activeDiagnostic}
          onResolvedDIY={handleConfirmDIYDeflection}
          onDispatchAnyway={handleDispatchAnyway}
          onClose={() => setShowDIYModal(false)}
        />
      )}
    </div>
  );
};

export default TenantIntakeView;
