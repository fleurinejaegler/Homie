export interface UnitData {
  id: string;
  name: string;
  floor: number;
  status: 'nominal' | 'warning' | 'critical' | 'in_progress';
  tenant: string;
  issue?: string;
  temp: string;
  humidity: string;
  waterFlow: string;
  hvacHealth: number;
  lastAutonomousAction: string;
  telemetryLog: Array<{ time: string; event: string }>;
}

export const SAMPLE_UNITS: UnitData[] = [
  {
    id: '401',
    name: 'Unit 401 — Corner Penthouse',
    floor: 4,
    status: 'nominal',
    tenant: 'Elena Rostova',
    temp: '71.2°F',
    humidity: '42%',
    waterFlow: '0.00 gpm (idle)',
    hvacHealth: 98,
    lastAutonomousAction: 'Preventive filter differential pressure normal. Automated seasonal balance complete.',
    telemetryLog: [
      { time: '12:30', event: 'Smart thermostat diurnal setback applied' },
      { time: '11:15', event: 'Acoustic monitoring: baseline nominal (<32 dB)' },
      { time: '08:00', event: 'Submeter water telemetry synchronized' }
    ]
  },
  {
    id: '402',
    name: 'Unit 402 — 2BR Balcony Suite',
    floor: 4,
    status: 'critical',
    tenant: 'Marcus & Chloe Sterling',
    issue: 'Under-sink angle stop micro-leak detected by acoustic hydro-sensor',
    temp: '72.8°F',
    humidity: '58% (elevated)',
    waterFlow: '0.14 gpm continuous',
    hvacHealth: 91,
    lastAutonomousAction: 'Smart isolation valve actuated to 15% pulse mode. Resident notified via SMS. Vendor pre-dispatched.',
    telemetryLog: [
      { time: '12:28', event: 'Moisture delta exceeded +12% threshold' },
      { time: '12:28', event: 'AI Triage: Classified Priority 1 Plumbing Leak' },
      { time: '12:29', event: 'Automated work order WO-4402 generated' },
      { time: '12:31', event: 'Express Plumbing accepted auto-dispatch ETA 13:45' }
    ]
  },
  {
    id: '403',
    name: 'Unit 403 — 1BR Studio East',
    floor: 4,
    status: 'in_progress',
    tenant: 'Devon Vance',
    issue: 'HVAC Variable Air Volume (VAV) actuator drift (+2.4° delta)',
    temp: '74.6°F',
    humidity: '46%',
    waterFlow: '0.00 gpm',
    hvacHealth: 76,
    lastAutonomousAction: 'Over-the-air recalibration running. Target airflow CFM realigning.',
    telemetryLog: [
      { time: '12:10', event: 'VAV damper command mismatch reported' },
      { time: '12:12', event: 'Autonomous PID loop recalibration initiated' },
      { time: '12:25', event: 'Delta narrowed from 3.8° to 2.4°' }
    ]
  },
  {
    id: '404',
    name: 'Unit 404 — 2BR South Terrace',
    floor: 4,
    status: 'nominal',
    tenant: 'Sarah Lin',
    temp: '70.8°F',
    humidity: '40%',
    waterFlow: '0.00 gpm',
    hvacHealth: 99,
    lastAutonomousAction: 'All acoustic, thermal, and electrical telemetry within target tolerances.',
    telemetryLog: [
      { time: '11:45', event: 'CO2 level nominal (420 ppm)' },
      { time: '09:00', event: 'Morning occupancy profile active' }
    ]
  },
  {
    id: '405',
    name: 'Unit 405 — 1BR Courtyard View',
    floor: 4,
    status: 'warning',
    tenant: 'Julian Barnes',
    issue: 'Dishwasher drain pump cavitation vibration anomaly',
    temp: '72.0°F',
    humidity: '44%',
    waterFlow: '0.00 gpm',
    hvacHealth: 88,
    lastAutonomousAction: 'Acoustic signature flagged for preventive impeller clearance on next scheduled cycle.',
    telemetryLog: [
      { time: '10:14', event: 'Vibration pattern 140Hz spike during drain cycle' },
      { time: '10:15', event: 'Preventive ticket P-882 queued for Tuesday review' }
    ]
  },
  {
    id: '406',
    name: 'Unit 406 — 2BR Loft North',
    floor: 4,
    status: 'nominal',
    tenant: 'Amara Okafor',
    temp: '71.5°F',
    humidity: '41%',
    waterFlow: '0.00 gpm',
    hvacHealth: 95,
    lastAutonomousAction: 'Smart lock battery 94%. IAQ index: Excellent.',
    telemetryLog: [
      { time: '08:30', event: 'Automated door strike sensor check passed' }
    ]
  }
];
