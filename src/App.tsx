/**
 * Homie — AI-native operations and maintenance triage platform for enterprise property managers (Greystar).
 */
import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import Overview from './components/Overview';
import TenantIntakeView from './components/TenantIntakeView';
import ManagerCommandCenter from './components/ManagerCommandCenter';
import homieLogo from './homie text logo 2.png';
import { WorkOrderTicket, PreventiveInspection, TicketStatus } from './types';
import { 
  INITIAL_METRICS, 
  INITIAL_TICKETS, 
  INITIAL_PREVENTIVE_INSPECTIONS 
} from './data/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<'overview' | 'tenant' | 'manager'>('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<string>(
    'Greystar — The Berkeley Beacon • Unit 412'
  );
  const [activePreset, setActivePreset] = useState<'disposal' | 'pipe_burst' | null>(null);
  const [geminiConnected, setGeminiConnected] = useState<boolean>(true);

  // Tickets state
  const [tickets, setTickets] = useState<WorkOrderTicket[]>(() => {
    const saved = localStorage.getItem('homie_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TICKETS;
  });

  // Preventive compliance tasks state
  const [preventiveTasks, setPreventiveTasks] = useState<PreventiveInspection[]>(() => {
    const saved = localStorage.getItem('homie_preventive');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PREVENTIVE_INSPECTIONS;
  });

  // Financial and performance metrics state
  const [noiSavedMTD, setNoiSavedMTD] = useState<number>(() => {
    const saved = localStorage.getItem('homie_noi');
    return saved ? Number(saved) : INITIAL_METRICS.noiSavedMTD;
  });

  const [diyDeflectionsCount, setDiyDeflectionsCount] = useState<number>(() => {
    const saved = localStorage.getItem('homie_deflections');
    return saved ? Number(saved) : INITIAL_METRICS.diyDeflectionsCount;
  });

  // Check health endpoint on load
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setGeminiConnected(true);
        }
      })
      .catch(() => {
        // Client fallback active
        setGeminiConnected(true);
      });
  }, []);

  // Save changes to localStorage for session persistence
  useEffect(() => {
    localStorage.setItem('homie_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('homie_preventive', JSON.stringify(preventiveTasks));
  }, [preventiveTasks]);

  useEffect(() => {
    localStorage.setItem('homie_noi', String(noiSavedMTD));
  }, [noiSavedMTD]);

  useEffect(() => {
    localStorage.setItem('homie_deflections', String(diyDeflectionsCount));
  }, [diyDeflectionsCount]);

  // Handle new non-DIY work order ticket submission
  const handleTicketCreated = (newTicket: WorkOrderTicket) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  // Handle successful DIY deflection
  const handleDIYDeflected = (resolvedTicket: WorkOrderTicket) => {
    setTickets((prev) => [resolvedTicket, ...prev]);
    setNoiSavedMTD((prev) => prev + 150);
    setDiyDeflectionsCount((prev) => prev + 1);
  };

  // Update ticket status
  const handleUpdateTicketStatus = (
    ticketId: string, 
    status: TicketStatus, 
    assignedEntity?: string
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            assignedEntity: assignedEntity || t.assignedEntity,
            telemetryLog: [
              ...(t.telemetryLog || []),
              `${new Date().toLocaleTimeString()} - Status updated to '${status}' by Property Manager`,
            ],
          };
        }
        return t;
      })
    );
  };

  // Add preventive maintenance task from ingested manual
  const handleAddPreventiveTask = (newTask: PreventiveInspection) => {
    setPreventiveTasks((prev) => [newTask, ...prev]);
  };

  // Update preventive inspection status
  const handleUpdatePreventiveStatus = (
    taskId: string, 
    status: 'Compliant' | 'Action Required' | 'Scheduled'
  ) => {
    setPreventiveTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status,
            lastInspectionDate: status === 'Compliant' ? 'Today (Certified)' : task.lastInspectionDate,
          };
        }
        return task;
      })
    );
  };


  // Calculate live compliance score
  const compliantCount = preventiveTasks.filter((t) => t.status === 'Compliant').length;
  const preventiveComplianceScore = preventiveTasks.length > 0 
    ? Math.round((compliantCount / preventiveTasks.length) * 100) 
    : 94;

  const activeWorkOrdersCount = tickets.filter(
    (t) => t.status !== 'Completed' && t.status !== 'Resolved via DIY'
  ).length;

  return (
    <div className="min-h-screen bg-[hsl(46.2_33.3%_92.4%)] text-black selection:bg-[#0000EE] selection:text-white flex flex-col font-sans">
      
      {/* Top Navigation Bar */}
      <TopNav
        currentView={currentView}
        onViewChange={(view) => {
          if (view !== 'tenant') setActivePreset(null);
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'overview' && (
          <Overview
            onNavigateToTenant={() => {
              setActivePreset(null);
              setCurrentView('tenant');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToManager={() => {
              setCurrentView('manager');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'tenant' && (
          <TenantIntakeView
            onTicketCreated={handleTicketCreated}
            onDIYDeflected={handleDIYDeflected}
            onNavigateToManager={() => {
              setCurrentView('manager');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            selectedBuilding={selectedBuilding}
            initialPreset={activePreset}
          />
        )}

        {currentView === 'manager' && (
          <ManagerCommandCenter
            tickets={tickets}
            preventiveTasks={preventiveTasks}
            metrics={{
              activeWorkOrdersCount,
              noiSavedMTD,
              diyDeflectionsCount,
              preventiveComplianceScore,
              buildingName: selectedBuilding,
            }}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onAddPreventiveTask={handleAddPreventiveTask}
            onUpdatePreventiveStatus={handleUpdatePreventiveStatus}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-[hsl(51.4_15.6%_78%)] py-6 px-4 bg-[hsl(50_20.7%_88.6%)] text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={homieLogo || "/api/logo"}
              alt="homie"
              className="h-7 sm:h-8 w-auto object-contain select-none"
              referrerPolicy="no-referrer"
            />
            <span className="font-medium text-neutral-700">— Autonomous Asset Operations & Maintenance Intelligence</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
