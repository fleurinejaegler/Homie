export type UrgencyLevel = 'Emergency' | 'High' | 'Routine';

export type TradeType = 
  | 'Plumber' 
  | 'Electrician' 
  | 'HVAC' 
  | 'Appliance Repair' 
  | 'General Maintenance';

export type TicketStatus = 
  | 'Pending Review'
  | 'Dispatched Vendor' 
  | 'Assigned In-House' 
  | 'Resolved via DIY'
  | 'Completed';

export interface TriageDiagnostic {
  issue_title: string;
  urgency: UrgencyLevel;
  required_trade: TradeType;
  identified_parts: string[];
  is_diy_eligible: boolean;
  diy_instructions: string[];
  safety_warning?: string;
  technician_summary: string;
  estimated_cost_saved?: number;
}

export interface WorkOrderTicket {
  id: string;
  unit: string;
  tenantName: string;
  tenantContact: string;
  reportedAt: string;
  description: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  diagnostic: TriageDiagnostic;
  status: TicketStatus;
  assignedEntity?: string;
  dispatchETA?: string;
  isResolvedByDIY?: boolean;
  resolutionTimestamp?: string;
  telemetryLog?: string[];
}

export interface PreventiveInspection {
  id: string;
  title: string;
  cycle: string;
  dueInDays: number;
  dueDate: string;
  frequency: string;
  assetTag: string;
  location: string;
  complianceStandard: string;
  requiredTradeCert: string;
  status: 'Compliant' | 'Action Required' | 'Scheduled';
  lastInspectionDate: string;
  technicianAssigned: string;
  actionProtocol: string;
}
