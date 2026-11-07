/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AlignmentSession,
  SessionCalculations,
  SessionStage,
  SingleWheelMeasurement,
  VehicleProfile,
  WheelPosition,
} from './types/alignment';
import {
  loadStoredSessions,
  loadStoredVehicles,
  saveStoredSessions,
  saveStoredVehicles,
  exportBackupJson,
} from './utils/storage';
import { calculateSessionStage } from './utils/alignmentMath';

import { Header } from './components/Header';
import { StringBoxVisualizer } from './components/StringBoxVisualizer';
import { StageMeasurementsEditor } from './components/StageMeasurementsEditor';
import { StringSquaringAssistant } from './components/StringSquaringAssistant';
import { ComparisonReport } from './components/ComparisonReport';
import { ChassisGuideViewer } from './components/ChassisGuideViewer';
import { VehicleManagerModal } from './components/VehicleManagerModal';
import { SessionListModal } from './components/SessionListModal';
import { NewSessionModal } from './components/NewSessionModal';
import { UnitConverterModal } from './components/UnitConverterModal';

import {
  Car,
  History,
  Info,
  Layers,
  Wrench,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(true);

  // Loaded database
  const [vehicles, setVehicles] = useState<VehicleProfile[]>([]);
  const [sessions, setSessions] = useState<AlignmentSession[]>([]);

  // Active selections
  const [activeVehicleId, setActiveVehicleId] = useState<string>('bmw-e60-msport');
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [activeStage, setActiveStage] = useState<SessionStage>('final');
  const [currentTab, setCurrentTab] = useState<
    'measure' | 'squaring' | 'report' | 'guides' | 'converter'
  >('measure');

  // Selected wheel for quick focus
  const [selectedWheel, setSelectedWheel] = useState<WheelPosition>('FL');

  // Modals state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState<boolean>(false);
  const [isSessionListOpen, setIsSessionListOpen] = useState<boolean>(false);
  const [isNewSessionOpen, setIsNewSessionOpen] = useState<boolean>(false);
  const [isConverterOpen, setIsConverterOpen] = useState<boolean>(false);
  const [guideChassisTarget, setGuideChassisTarget] = useState<string>('E60');

  // Load from local storage on mount
  useEffect(() => {
    const loadedVehs = loadStoredVehicles();
    const loadedSess = loadStoredSessions();

    setVehicles(loadedVehs);
    setSessions(loadedSess);

    if (loadedSess.length > 0) {
      setActiveSessionId(loadedSess[0].id);
      setActiveVehicleId(loadedSess[0].vehicleId);
      if (loadedSess[0].stages.final) {
        setActiveStage('final');
      } else if (loadedSess[0].stages.intermediate) {
        setActiveStage('intermediate');
      } else {
        setActiveStage('before');
      }
    } else if (loadedVehs.length > 0) {
      setActiveVehicleId(loadedVehs[0].id);
    }
  }, []);

  // Sync dark class to html document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Current active vehicle profile
  const activeVehicle =
    vehicles.find((v) => v.id === activeVehicleId) ||
    vehicles[0] || {
      id: 'default',
      name: 'BMW 5-Series (E60)',
      chassisCode: 'E60',
      yearModel: '2008',
      bodyType: 'Sedan',
      wheelbaseMm: 2888,
      trackFrontMm: 1558,
      trackRearMm: 1582,
      rimDiameterInches: 18,
      rimLipDiameterMm: 482,
      targets: {
        frontCamber: { min: -1.1, target: -0.85, max: -0.6, unit: 'deg' },
        frontToePerWheel: { min: 0.05, target: 0.1, max: 0.15, unit: 'deg' },
        frontTotalToe: { min: 0.12, target: 0.2, max: 0.28, unit: 'deg' },
        rearCamber: { min: -1.9, target: -1.6, max: -1.35, unit: 'deg' },
        rearToePerWheel: { min: 0.08, target: 0.13, max: 0.18, unit: 'deg' },
        rearTotalToe: { min: 0.18, target: 0.26, max: 0.35, unit: 'deg' },
        maxThrustAngle: 0.06,
      },
    };

  // Current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || null;

  // Active stage measurements
  const currentStageMeasurements = activeSession?.stages[activeStage] ||
    activeSession?.stages.before || {
      timestamp: new Date().toISOString(),
      wheels: {
        FL: { wheel: 'FL', stringFrontMm: 46.5, stringRearMm: 47.4, camberDeg: -0.88, rideHeightMm: 582 },
        FR: { wheel: 'FR', stringFrontMm: 46.5, stringRearMm: 47.4, camberDeg: -0.86, rideHeightMm: 583 },
        RL: { wheel: 'RL', stringFrontMm: 37.0, stringRearMm: 38.1, camberDeg: -1.62, rideHeightMm: 570 },
        RR: { wheel: 'RR', stringFrontMm: 37.0, stringRearMm: 38.1, camberDeg: -1.60, rideHeightMm: 571 },
      },
    };

  // Calculations for active stage
  const sessionCalculations: SessionCalculations = calculateSessionStage(
    currentStageMeasurements,
    activeVehicle.rimLipDiameterMm,
    activeVehicle.targets
  );

  // Wheel update handler
  const handleUpdateWheel = (wheel: WheelPosition, data: Partial<SingleWheelMeasurement>) => {
    if (!activeSession) return;

    const existingStage = activeSession.stages[activeStage] || {
      timestamp: new Date().toISOString(),
      wheels: JSON.parse(JSON.stringify(activeSession.stages.before.wheels)),
    };

    const updatedWheels = {
      ...existingStage.wheels,
      [wheel]: {
        ...existingStage.wheels[wheel],
        ...data,
      },
    };

    const updatedSession: AlignmentSession = {
      ...activeSession,
      updatedAt: new Date().toISOString(),
      stages: {
        ...activeSession.stages,
        [activeStage]: {
          ...existingStage,
          timestamp: new Date().toISOString(),
          wheels: updatedWheels,
        },
      },
    };

    const newSessions = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setSessions(newSessions);
    saveStoredSessions(newSessions);
  };

  // Stage notes update
  const handleUpdateStageNotes = (notes: string) => {
    if (!activeSession) return;
    const existingStage = activeSession.stages[activeStage] || activeSession.stages.before;
    const updatedSession: AlignmentSession = {
      ...activeSession,
      updatedAt: new Date().toISOString(),
      stages: {
        ...activeSession.stages,
        [activeStage]: {
          ...existingStage,
          stageNotes: notes,
        },
      },
    };
    const newSessions = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setSessions(newSessions);
    saveStoredSessions(newSessions);
  };

  // Clone from stage
  const handleCopyFromStage = (sourceStage: SessionStage) => {
    if (!activeSession) return;
    const sourceData = activeSession.stages[sourceStage];
    if (!sourceData) return;

    const clonedWheels = JSON.parse(JSON.stringify(sourceData.wheels));
    const updatedSession: AlignmentSession = {
      ...activeSession,
      updatedAt: new Date().toISOString(),
      stages: {
        ...activeSession.stages,
        [activeStage]: {
          timestamp: new Date().toISOString(),
          stageNotes: `Cloned measurements from ${sourceStage} stage. Ready for fine adjustment.`,
          wheels: clonedWheels,
        },
      },
    };

    const newSessions = sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setSessions(newSessions);
    saveStoredSessions(newSessions);
  };

  // Save or delete vehicle
  const handleSaveVehicle = (vehicle: VehicleProfile) => {
    const exists = vehicles.some((v) => v.id === vehicle.id);
    let updated: VehicleProfile[];
    if (exists) {
      updated = vehicles.map((v) => (v.id === vehicle.id ? vehicle : v));
    } else {
      updated = [...vehicles, vehicle];
    }
    setVehicles(updated);
    saveStoredVehicles(updated);
    setActiveVehicleId(vehicle.id);
  };

  const handleDeleteVehicle = (id: string) => {
    const updated = vehicles.filter((v) => v.id !== id);
    setVehicles(updated);
    saveStoredVehicles(updated);
    if (activeVehicleId === id && updated.length > 0) {
      setActiveVehicleId(updated[0].id);
    }
  };

  // Save new session
  const handleSaveNewSession = (newSession: AlignmentSession) => {
    const updated = [newSession, ...sessions];
    setSessions(updated);
    saveStoredSessions(updated);
    setActiveSessionId(newSession.id);
    setActiveVehicleId(newSession.vehicleId);
    setActiveStage('before');
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    saveStoredSessions(updated);
    if (activeSessionId === id && updated.length > 0) {
      setActiveSessionId(updated[0].id);
    }
  };

  // Export & Import
  const handleExportBackup = () => {
    exportBackupJson(vehicles, sessions);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.vehicles && Array.isArray(parsed.vehicles)) {
          setVehicles(parsed.vehicles);
          saveStoredVehicles(parsed.vehicles);
        }
        if (parsed.sessions && Array.isArray(parsed.sessions)) {
          setSessions(parsed.sessions);
          saveStoredSessions(parsed.sessions);
          if (parsed.sessions.length > 0) {
            setActiveSessionId(parsed.sessions[0].id);
            setActiveVehicleId(parsed.sessions[0].vehicleId);
          }
        }
      } catch (err) {
        console.error('Failed to import backup JSON', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Quick open adjustment guide for a wheel
  const handleOpenGuideForWheel = (wheel: WheelPosition) => {
    setGuideChassisTarget(activeVehicle.chassisCode);
    setCurrentTab('guides');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeVehicle={activeVehicle}
        activeSession={activeSession}
        onNewSession={() => setIsNewSessionOpen(true)}
        onExport={handleExportBackup}
        onImport={handleImportBackup}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenVehicles={() => setIsVehicleModalOpen(true)}
      />

      {/* Subheader Chassis & Session Context Bar */}
      <div className="no-print bg-neutral-900/60 border-b border-neutral-800/80 px-3.5 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Active Profile Info */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="flex items-center gap-1.5 font-bold text-white hover:text-amber-400 transition-colors py-1"
            >
              <Car className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[170px] sm:max-w-none">{activeVehicle.name}</span>
            </button>
            <span className="text-neutral-500 font-mono hidden sm:inline">·</span>
            <span className="text-neutral-400 font-mono hidden sm:inline">
              WB: {activeVehicle.wheelbaseMm}mm
            </span>
            <span className="text-neutral-500 font-mono hidden sm:inline">·</span>
            <span className="text-neutral-400 font-mono hidden sm:inline">
              Rear Track: +{activeVehicle.trackRearMm - activeVehicle.trackFrontMm}mm
            </span>
          </div>

          {/* Session Switcher Pill */}
          <div className="flex items-center gap-2">
            {activeSession && (
              <button
                onClick={() => setIsSessionListOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700/80 text-neutral-300 text-xs font-mono transition-colors border border-neutral-700/60 min-h-[32px]"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{activeSession.title}</span>
              </button>
            )}

            <button
              onClick={() => setIsConverterOpen(true)}
              className="hidden sm:inline-block px-2 py-1 text-neutral-400 hover:text-white text-xs font-mono rounded hover:bg-neutral-800 transition-colors"
            >
              Convert Units (mm/°)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Viewport - pb-24 ensures mobile bottom nav never covers content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 pb-24 md:pb-6 space-y-4 sm:space-y-6">
        {/* TAB 1: ALIGNMENT RIG & MEASUREMENT */}
        {currentTab === 'measure' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Top Interactive String Box Schematic */}
            <StringBoxVisualizer
              vehicle={activeVehicle}
              measurements={currentStageMeasurements.wheels}
              calculations={sessionCalculations}
              onSelectWheel={setSelectedWheel}
              selectedWheel={selectedWheel}
            />

            {/* Stage Measurements Editor (Before / Intermediate / Final) */}
            {activeSession && (
              <StageMeasurementsEditor
                session={activeSession}
                activeStage={activeStage}
                onChangeStage={setActiveStage}
                onUpdateWheel={handleUpdateWheel}
                onUpdateStageNotes={handleUpdateStageNotes}
                onCopyFromStage={handleCopyFromStage}
                vehicle={activeVehicle}
                selectedWheel={selectedWheel}
                onSelectWheel={setSelectedWheel}
                onOpenGuideForWheel={handleOpenGuideForWheel}
              />
            )}
          </div>
        )}

        {/* TAB 2: STRING SQUARING ASSISTANT */}
        {currentTab === 'squaring' && (
          <StringSquaringAssistant vehicle={activeVehicle} />
        )}

        {/* TAB 3: COMPARISON REPORT */}
        {currentTab === 'report' && activeSession && (
          <ComparisonReport session={activeSession} vehicle={activeVehicle} />
        )}

        {/* TAB 4: CHASSIS & WHEEL ADJUSTMENT GUIDES */}
        {currentTab === 'guides' && (
          <ChassisGuideViewer initialChassisCode={activeVehicle.chassisCode} />
        )}

        {/* TAB 5: UNIT CONVERTER TOOL (INLINE VIEW) */}
        {currentTab === 'converter' && (
          <div className="max-w-3xl mx-auto">
            <UnitConverterModal
              isOpen={true}
              onClose={() => setCurrentTab('measure')}
              defaultRimInches={activeVehicle.rimDiameterInches}
            />
          </div>
        )}
      </main>

      {/* Footer - Desktop only */}
      <footer className="no-print hidden md:block border-t border-neutral-900 bg-neutral-950 py-4 px-6 text-center text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ApexString Precision Alignment · BMW E60, E87 & F11 Geometry</span>
          <span>Parallel Box String Method · Local Garage Storage</span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenVehicles={() => setIsVehicleModalOpen(true)}
        onOpenSessions={() => setIsSessionListOpen(true)}
        onOpenConverter={() => setIsConverterOpen(true)}
        onExport={handleExportBackup}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Modals */}
      <VehicleManagerModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        vehicles={vehicles}
        activeVehicleId={activeVehicleId}
        onSelectVehicle={(id) => {
          setActiveVehicleId(id);
          setIsVehicleModalOpen(false);
        }}
        onSaveVehicle={handleSaveVehicle}
        onDeleteVehicle={handleDeleteVehicle}
      />

      <SessionListModal
        isOpen={isSessionListOpen}
        onClose={() => setIsSessionListOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        vehicles={vehicles}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          const sess = sessions.find((s) => s.id === id);
          if (sess) setActiveVehicleId(sess.vehicleId);
        }}
        onNewSession={() => setIsNewSessionOpen(true)}
        onDeleteSession={handleDeleteSession}
      />

      <NewSessionModal
        isOpen={isNewSessionOpen}
        onClose={() => setIsNewSessionOpen(false)}
        vehicles={vehicles}
        currentVehicleId={activeVehicleId}
        onSave={handleSaveNewSession}
      />

      {currentTab !== 'converter' && (
        <UnitConverterModal
          isOpen={isConverterOpen}
          onClose={() => setIsConverterOpen(false)}
          defaultRimInches={activeVehicle.rimDiameterInches}
        />
      )}
    </div>
  );
}
