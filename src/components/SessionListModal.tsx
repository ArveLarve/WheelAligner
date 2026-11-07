import React from 'react';
import { AlignmentSession, VehicleProfile } from '../types/alignment';
import { Plus, X, Calendar, Clock, User, Trash2, ArrowRight, FileCheck } from 'lucide-react';

interface SessionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: AlignmentSession[];
  activeSessionId: string;
  vehicles: VehicleProfile[];
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export const SessionListModal: React.FC<SessionListModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  vehicles,
  onSelectSession,
  onNewSession,
  onDeleteSession,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-500" />
              <span>Historical Sessions</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-400">
              Review before/final comparisons, session logs, and suspension impact.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNewSession();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-semibold transition-colors min-h-[36px]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No alignment sessions recorded yet. Start your first session!
            </div>
          ) : (
            sessions.map((sess) => {
              const vehicle = vehicles.find((v) => v.id === sess.vehicleId);
              const isActive = sess.id === activeSessionId;
              const hasFinal = Boolean(sess.stages.final);
              const hasIntermediate = Boolean(sess.stages.intermediate);

              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    onSelectSession(sess.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'border-amber-500 bg-neutral-800/90 shadow-md ring-1 ring-amber-500/50'
                      : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 hover:bg-neutral-900/60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400 font-bold">
                        {vehicle?.chassisCode || 'BMW'}
                      </span>
                      <h4 className="font-bold text-sm text-white">{sess.title}</h4>
                      {isActive && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          LOADED
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{sess.operatorName || 'Self'}</span>
                      </span>
                      <span className="text-neutral-500">
                        Vehicle: <strong className="text-neutral-300">{vehicle?.name || 'BMW'}</strong>
                      </span>
                    </div>

                    {sess.suspensionMods && (
                      <p className="text-[11px] text-neutral-400 line-clamp-1">
                        <strong className="text-neutral-300">Mods:</strong> {sess.suspensionMods}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                        Before ✓
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border ${
                        hasIntermediate ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'text-neutral-600 border-neutral-900'
                      }`}>
                        Inter {hasIntermediate ? '✓' : '—'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded border ${
                        hasFinal ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 font-bold' : 'text-neutral-600 border-neutral-900'
                      }`}>
                        Final {hasFinal ? '✓' : '—'}
                      </span>
                    </div>

                    {sessions.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(sess.id);
                        }}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
