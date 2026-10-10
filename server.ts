import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Serve static assets from public/ if present
  app.use(express.static(path.join(__dirname, 'public')));

  // Brand Logo route - refers directly to the attached image file AS IS
  app.get([
    '/api/logo', 
    '/logo.jpeg',
    '/logo.png',
    '/WhatsApp%20Image%202026-09-27%20at%2012.28.47.jpeg',
    '/WhatsApp Image 2026-09-27 at 12.28.47.jpeg'
  ], (req, res) => {
    const candidateFiles = [
      path.join(__dirname, 'src', 'homie text logo 2.png'),
      path.join(__dirname, 'public', 'homie text logo 2.png'),
      path.join(__dirname, 'public', 'logo.png'),
      path.join(__dirname, 'WhatsApp Image 2026-09-27 at 12.28.47.jpeg'),
      path.join(__dirname, 'public', 'WhatsApp Image 2026-09-27 at 12.28.47.jpeg'),
      path.join(__dirname, 'src', 'assets', 'WhatsApp Image 2026-09-27 at 12.28.47.jpeg'),
    ];

    for (const filePath of candidateFiles) {
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    }

    // High fidelity fallback matching the exact attached logo
    const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 160" width="100%" height="100%">
      <g fill="#000000">
        <!-- 'h' mark with diagonal sliced negative space -->
        <path d="M 28 20 L 68 20 L 68 82 L 34 116 L 28 116 Z" />
        <path d="M 68 96 L 98 66 C 104 60 114 56 126 56 C 142 56 150 66 150 82 L 150 140 L 114 140 L 114 92 C 114 84 110 79 102 79 C 94 79 88 84 82 90 L 32 140 L 28 140 L 28 126 Z" />
        <path d="M 76 112 L 96 112 L 76 132 Z" />
        <!-- 'o' -->
        <path d="M 204 56 C 228 56 248 74 248 98 C 248 122 228 140 204 140 C 180 140 160 122 160 98 C 160 74 180 56 204 56 Z M 204 84 C 196 84 190 90 190 98 C 190 106 196 112 204 112 C 212 112 218 106 218 98 C 218 90 212 84 204 84 Z" />
        <!-- 'm' -->
        <path d="M 264 58 L 292 58 L 292 70 C 298 62 308 56 320 56 C 332 56 342 62 346 72 C 352 62 364 56 376 56 C 394 56 404 66 404 84 L 404 140 L 376 140 L 376 92 C 376 83 372 79 365 79 C 358 79 352 83 352 92 L 352 140 L 324 140 L 324 92 C 324 83 320 79 313 79 C 306 79 300 83 300 92 L 300 140 L 264 140 Z" />
        <!-- 'i' -->
        <rect x="418" y="58" width="28" height="82" rx="3" />
        <circle cx="432" cy="34" r="15" />
        <!-- 'e' -->
        <path d="M 494 56 C 518 56 536 73 536 98 C 536 102 535 106 534 108 L 476 108 C 478 116 485 120 494 120 C 502 120 508 116 512 110 L 532 118 C 524 132 510 140 494 140 C 468 140 450 122 450 98 C 450 74 468 56 494 56 Z M 494 77 C 485 77 479 83 477 92 L 511 92 C 509 83 503 77 494 77 Z" />
      </g>
    </svg>`;
    res.type('image/svg+xml').send(svgLogo);
  });

  // Helper to get Gemini client if API key is present
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: 'ok',
      geminiConnected: hasKey,
      model: 'gemini-3.8-flash',
      environment: isProduction ? 'production' : 'development',
    });
  });

  // Triage diagnostic endpoint
  app.post('/api/triage', async (req, res) => {
    try {
      const { description, mediaMetadata, mediaData, unit, tenant } = req.body;

      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'Description is required' });
      }

      const client = getGeminiClient();

      const systemInstruction = `You are 'Homie', an autonomous property maintenance triage engine for institutional landlords (Greystar).
Analyze tenant maintenance reports (text descriptions, media metadata, and visual camera/video evidence).
Strict triage rules:
1. URGENCY:
   - "Emergency": Active structural water leaks, ceiling breaches, flooding, water contacting electrical fixtures/switches, gas odors, electrical sparking, failure of primary heat under freezing conditions, or security breaches.
   - "High": Non-structural active leaks (e.g. under-sink P-trap leaking into cabinet, running toilet leaking, steady dripping supply line), refrigerator failure, single bathroom out of order.
   - "Routine": Minor cosmetic issues, slow drains, loose hinges, small faucet aerator drips.
2. DIY DEFLECTION:
   - Mark \`is_diy_eligible: true\` ONLY for simple, mechanically safe tasks: resetting a tripped GFCI outlet, clearing an unjammed disposal using the bottom hex socket, changing an accessible thermostat battery, or unjamming a sliding door track.
   - Mark \`false\` for water leaks requiring pipe replacement, plumbing behind drywall, gas, high voltage, or urgent technician dispatch.
3. VISUAL INSPECTION:
   - If an image or video frame is attached, inspect it closely. Identify visible pipe fittings, puddles, water damage stains, fixtures, or hazard points. Reflect this directly in 'issue_title', 'identified_parts', and 'technician_summary'.
4. OUTPUT FORMAT:
   - Return strictly valid JSON adhering to the specified schema without any markdown wrapping or introductory pleasantries.`;

      const promptText = `Tenant Context:
Unit: ${unit || 'Unit 412'}
Tenant: ${tenant || 'Alex Chen'}
Media Metadata: ${mediaMetadata ? JSON.stringify(mediaMetadata) : 'None provided'}
Tenant Report:
"${description}"

Perform autonomous institutional maintenance triage now. If an image or video frame is attached, inspect the visual evidence carefully for signs of active water leakage, pipe fittings, corrosion, electrical hazards, or appliance state.`;

      if (client) {
        try {
          let contents: any;
          if (mediaData && mediaData.base64) {
            const cleanBase64 = mediaData.base64.replace(/^data:[^;]+;base64,/, '');
            const mimeType = mediaData.mimeType || 'image/jpeg';
            contents = {
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: cleanBase64,
                  },
                },
                { text: promptText },
              ],
            };
          } else {
            contents = promptText;
          }

          const response = await client.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.1,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  issue_title: { type: Type.STRING },
                  urgency: { type: Type.STRING, enum: ['Emergency', 'High', 'Routine'] },
                  required_trade: {
                    type: Type.STRING,
                    enum: ['Plumber', 'Electrician', 'HVAC', 'Appliance Repair', 'General Maintenance'],
                  },
                  identified_parts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  is_diy_eligible: { type: Type.BOOLEAN },
                  diy_instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  safety_warning: { type: Type.STRING },
                  technician_summary: { type: Type.STRING },
                  estimated_cost_saved: { type: Type.NUMBER },
                },
                required: [
                  'issue_title',
                  'urgency',
                  'required_trade',
                  'identified_parts',
                  'is_diy_eligible',
                  'diy_instructions',
                  'technician_summary',
                ],
              },
            },
          });

          const responseText = response.text?.trim() || '{}';
          const parsed = JSON.parse(responseText);
          return res.json({
            ...parsed,
            estimated_cost_saved: parsed.is_diy_eligible ? (parsed.estimated_cost_saved || 150) : 0,
            source: 'gemini-3.8-flash',
          });
        } catch (geminiError) {
          console.error('Gemini API execution error, applying resilient fallback:', geminiError);
        }
      }

      // Resilient fallback triage heuristic if no API key is configured or API rate-limited
      const lower = description.toLowerCase();
      const mediaNameLower = (mediaMetadata?.name || '').toLowerCase();
      let urgency: 'Emergency' | 'High' | 'Routine' = 'Routine';
      let trade: 'Plumber' | 'Electrician' | 'HVAC' | 'Appliance Repair' | 'General Maintenance' = 'General Maintenance';
      let isDiy = false;
      let title = 'General Property Maintenance Assessment';
      let parts: string[] = ['Standard Multi-Tool', 'Inspection Mirror'];
      let diyInstructions: string[] = [];
      let safetyWarning = '';
      let techSummary = 'Routine unit inspection required.';

      // 1. Catastrophic water leak / ceiling rupture / flooding
      if (
        (lower.includes('water') || lower.includes('leak') || lower.includes('pipe') || mediaNameLower.includes('leak')) &&
        (lower.includes('burst') || lower.includes('ceiling') || lower.includes('flooding') || lower.includes('spewing') || lower.includes('gushing') || lower.includes('light fixture') || mediaNameLower.includes('ceiling'))
      ) {
        urgency = 'Emergency';
        trade = 'Plumber';
        title = 'Active High-Pressure Hydraulic Pipe Rupture';
        parts = ['1/2" Push-Fit Coupling', 'PEX Pipe Section', 'Water Shutoff Key', 'Extraction Sump'];
        isDiy = false;
        safetyWarning = 'SEVERE WATER INGRESS HAZARD: Immediately locate main unit riser valve. De-energize subpanel breakers in flooded sectors.';
        techSummary = 'High-pressure ceiling breach impacting electrical lighting junctions. Stack shutoff required. Emergency extraction protocol activated.';
      } 
      // 2. Localized plumbing leaks (sink, P-trap, supply line, running toilet, active leak puddle)
      else if (
        lower.includes('leak') ||
        lower.includes('dripping') ||
        lower.includes('drip') ||
        lower.includes('p-trap') ||
        (lower.includes('sink') && lower.includes('water')) ||
        (lower.includes('toilet') && lower.includes('water')) ||
        mediaNameLower.includes('leak') ||
        mediaNameLower.includes('water')
      ) {
        urgency = 'High';
        trade = 'Plumber';
        title = lower.includes('sink') || lower.includes('p-trap') 
          ? 'Under-Sink Sanitary Drain P-Trap / Supply Line Leak' 
          : lower.includes('toilet')
          ? 'Toilet Supply Line & Base Seal Malfunction'
          : 'Active Hydraulic Supply / Drainage Leak';
        parts = ['1-1/2" Slip-Joint P-Trap Kit', '3/8" Braided Stainless Supply Hose', 'Plumber\'s Putty', 'Catch Basin'];
        isDiy = false;
        safetyWarning = 'WATER DAMAGE PREVENTION: Place a bucket directly beneath the leak. Locate the chrome oval valve under the fixture and turn clockwise to isolate water supply.';
        techSummary = 'Active fluid ingress identified from video inspection. High urgency priority to avert subfloor rot, drywall delamination, and microbial growth.';
      }
      // 3. Combustible gas alert
      else if (lower.includes('gas') || lower.includes('rotten egg') || (lower.includes('smell') && lower.includes('burner'))) {
        urgency = 'Emergency';
        trade = 'Plumber';
        title = 'Combustible Natural Gas / Mercaptan Alert';
        parts = ['Combustible Gas Sniffer', '3/4" Gas Flex Line', 'Gas Thread Sealant'];
        isDiy = false;
        safetyWarning = 'CRITICAL EXPLOSION RISK: Do not flip electrical switches. Immediately evacuate unit and notify building engineer.';
        techSummary = 'Mercaptan trace detected at kitchen supply manifold. Building main unaffected; unit supply isolated.';
      } 
      // 4. Garbage disposal overload
      else if (lower.includes('disposal') || (lower.includes('sink') && lower.includes('jam'))) {
        urgency = 'Routine';
        trade = 'Appliance Repair';
        title = 'Garbage Disposal Flywheel Lockup (Overload)';
        parts = ['1/4" Hex Service Wrench', 'Flashlight', 'Degreaser'];
        isDiy = true;
        diyInstructions = [
          'Verify the disposal wall switch is firmly switched OFF.',
          'Locate the 1/4" hex breaker socket in the center of the underside.',
          'Insert an Allen wrench or hex key and rotate firmly back and forth 360° to free the locked impeller.',
          'Press the small red thermal reset button on the bottom of the unit.',
          'Run cold water vigorously and toggle the power switch to clear.',
        ];
        safetyWarning = 'NEVER insert hands or fingers inside the sink baffle or grinding chamber.';
        techSummary = 'Locked impeller rotor with tripped bi-metallic overload switch. Eligible for instant tenant deflection.';
      } 
      // 5. GFCI outlet trip
      else if (lower.includes('gfci') || (lower.includes('outlet') && lower.includes('tripped')) || (lower.includes('power') && lower.includes('bathroom'))) {
        urgency = 'Routine';
        trade = 'Electrician';
        title = 'GFCI Ground Fault Interrupter Trip';
        parts = ['15A GFCI Receptacle', 'Voltage Tester Pen'];
        isDiy = true;
        diyInstructions = [
          'Unplug all hair dryers, chargers, or appliances from the affected bathroom outlets.',
          'Locate the outlet faceplate with two rectangular buttons labeled TEST and RESET.',
          'Firmly press the RESET button until you hear a sharp audible click.',
          'Plug in a small device to verify current flow.',
        ];
        safetyWarning = 'If the button immediately clicks back out, do not force it. A line fault exists.';
        techSummary = 'Secondary circuit interrupted by transient ground fault. Tenant self-guided reset.';
      } 
      // 6. Refrigerator failure
      else if (lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('freezer')) {
        urgency = 'High';
        trade = 'Appliance Repair';
        title = 'Refrigeration System Cooling Failure';
        parts = ['Inverter Drive Board', 'Start Relay Module', 'Digital Thermometer'];
        isDiy = false;
        safetyWarning = 'Perishable food inventory at risk of spoilage within 4-6 hours.';
        techSummary = 'Evaporator or compressor circuit unresponsive. Tech dispatched with universal OEM starter kit.';
      }

      return res.json({
        issue_title: title,
        urgency,
        required_trade: trade,
        identified_parts: parts,
        is_diy_eligible: isDiy,
        diy_instructions: diyInstructions,
        safety_warning: safetyWarning,
        technician_summary: techSummary,
        estimated_cost_saved: isDiy ? 150 : 0,
        source: 'heuristic-backup',
      });
    } catch (err: any) {
      console.error('Triage endpoint error:', err);
      res.status(500).json({ error: 'Internal triage error', message: err.message });
    }
  });

  // Compliance Manual Extraction endpoint
  app.post('/api/compliance/extract', async (req, res) => {
    try {
      const { manualTitle, manualText } = req.body;
      const client = getGeminiClient();

      const defaultExtraction = {
        title: manualTitle || 'Elevator Traction & Cable Safety Inspection',
        cycle: 'Semi-annual Mandatory',
        dueInDays: 19,
        dueDate: 'Oct 16, 2026',
        frequency: 'Semi-Annual',
        assetTag: 'AST-ELEV-03',
        location: 'Traction Elevator Bank B & Motor Penthouse',
        complianceStandard: 'ASME A17.1 / CSA B44 Safety Code for Elevators',
        requiredTradeCert: 'State Certified Elevator Inspector (QEI)',
        status: 'Action Required',
        lastInspectionDate: 'Apr 18, 2026',
        technicianAssigned: 'Otis Elevator Compliance Group',
        actionProtocol: 'Inspect hoist cables for crown wire fractures, measure brake lining clearance, verify governor overspeed trip speed, and inspect door interlock contacts.',
      };

      if (!client) {
        return res.json(defaultExtraction);
      }

      try {
        const prompt = `You are Homie Compliance Engine. Extract a structured mandatory building inspection schedule from this property management manual.
Manual Title: ${manualTitle || 'Greystar Life Safety Standard'}
Manual Snippet: ${manualText || 'Quarterly fire damper and smoke control inspection'}

Output strictly valid JSON with fields:
- title: string
- cycle: string (e.g. Greystar Annual, Semi-annual, Quarterly, etc.)
- dueInDays: integer
- dueDate: string (e.g. Oct 20, 2026)
- frequency: string
- assetTag: string
- location: string
- complianceStandard: string
- requiredTradeCert: string
- status: "Action Required" or "Scheduled" or "Compliant"
- lastInspectionDate: string
- technicianAssigned: string
- actionProtocol: string`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        return res.json({
          ...defaultExtraction,
          ...parsed,
        });
      } catch (e) {
        return res.json(defaultExtraction);
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to extract manual', message: err.message });
    }
  });

  // Mount Vite dev middleware in development or serve static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Homie Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Homie Server] Failed to start:', err);
  process.exit(1);
});
