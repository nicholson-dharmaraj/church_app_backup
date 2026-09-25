import React, { useState } from 'react';
import { HeartHandshake, Plus, Calendar, Lock, CheckCircle2, User, X, Heart } from 'lucide-react';
import { PastoralCareNote, PrayerRequest, Member } from '../types';

interface PastoralCareProps {
  notes: PastoralCareNote[];
  prayers: PrayerRequest[];
  members: Member[];
  onAddNote: (note: Omit<PastoralCareNote, 'id'>) => void;
  onAddPrayer: (prayer: Omit<PrayerRequest, 'id'>) => void;
  onUpdatePrayerStatus: (id: string, status: PrayerRequest['status']) => void;
}

export const PastoralCare: React.FC<PastoralCareProps> = ({
  notes,
  prayers,
  members,
  onAddNote,
  onAddPrayer,
  onUpdatePrayerStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'pastoral' | 'prayers'>('pastoral');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);

  // Pastoral Form
  const [noteMemberId, setNoteMemberId] = useState(members[0]?.id || '');
  const [notePastor, setNotePastor] = useState('');
  const [noteType, setNoteType] = useState<PastoralCareNote['type']>('Visitation');
  const [noteSummary, setNoteSummary] = useState('');
  const [noteFollowUp, setNoteFollowUp] = useState('');
  const [noteConfidential, setNoteConfidential] = useState(false);

  // Prayer Form
  const [prayerTitle, setPrayerTitle] = useState('');
  const [prayerBy, setPrayerBy] = useState('');
  const [prayerCategory, setPrayerCategory] = useState<PrayerRequest['category']>('Health');
  const [prayerNotes, setPrayerNotes] = useState('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteSummary) return;

    const mem = members.find((m) => m.id === noteMemberId);

    onAddNote({
      memberId: noteMemberId,
      memberName: mem ? `${mem.firstName} ${mem.lastName}` : 'General',
      pastorName: notePastor || 'Lead Pastor',
      date: new Date().toISOString().split('T')[0],
      type: noteType,
      summary: noteSummary,
      followUpDate: noteFollowUp || undefined,
      isConfidential: noteConfidential,
    });

    setNoteSummary('');
    setShowNoteModal(false);
  };

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerTitle) return;

    onAddPrayer({
      title: prayerTitle,
      requestedBy: prayerBy || 'Anonymous',
      dateAdded: new Date().toISOString().split('T')[0],
      category: prayerCategory,
      status: 'Active',
      notes: prayerNotes || undefined,
    });

    setPrayerTitle('');
    setShowPrayerModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pastoral Care & Prayer Request Wall
          </h2>
          <p className="text-xs text-slate-500">
            Confidential pastoral visitations, counseling logs, and church prayer needs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'pastoral' ? (
            <button
              onClick={() => setShowNoteModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Log Pastoral Visit / Call</span>
            </button>
          ) : (
            <button
              onClick={() => setShowPrayerModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Prayer Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('pastoral')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'pastoral' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Pastoral Care Logs ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('prayers')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'prayers' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Prayer Requests ({prayers.length})</span>
        </button>
      </div>

      {/* Pastoral Notes View */}
      {activeTab === 'pastoral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((n) => (
            <div key={n.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{n.type}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{n.memberName}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {n.isConfidential && (
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Confidential
                    </span>
                  )}
                  <span className="text-slate-400">{n.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                "{n.summary}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Minister: <strong className="text-slate-800">{n.pastorName}</strong></span>
                {n.followUpDate && <span className="font-semibold text-sky-700">Follow-up: {n.followUpDate}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prayer Requests Wall */}
      {activeTab === 'prayers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prayers.map((pr) => (
            <div key={pr.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{pr.title}</h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    pr.status === 'Active'
                      ? 'bg-amber-100 text-amber-800'
                      : pr.status === 'Answered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pr.status}
                </span>
              </div>

              <p className="text-xs text-slate-600">{pr.notes || 'No extra notes provided.'}</p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>By: {pr.requestedBy}</span>
                <div className="flex items-center gap-1">
                  {pr.status === 'Active' && (
                    <button
                      onClick={() => onUpdatePrayerStatus(pr.id, 'Answered')}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                    >
                      Praise God (Answered)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pastoral Care Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Log Pastoral Care Record</h3>
              <button onClick={() => setShowNoteModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Church Member</label>
                <select
                  value={noteMemberId}
                  onChange={(e) => setNoteMemberId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Care Type</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as PastoralCareNote['type'])}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Visitation">Visitation</option>
                    <option value="Counseling">Counseling</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Hospital Visit">Hospital Visit</option>
                    <option value="Discipleship">Discipleship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pastoral Staff</label>
                  <input
                    type="text"
                    placeholder="Pastor David"
                    value={notePastor}
                    onChange={(e) => setNotePastor(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Care Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={noteSummary}
                  onChange={(e) => setNoteSummary(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={noteFollowUp}
                    onChange={(e) => setNoteFollowUp(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="conf"
                    checked={noteConfidential}
                    onChange={(e) => setNoteConfidential(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <label htmlFor="conf" className="text-slate-700 font-semibold cursor-pointer">
                    Mark Confidential
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Prayer Request Modal */}
      {showPrayerModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Church Prayer Request</h3>
              <button onClick={() => setShowPrayerModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePrayer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prayer Title / Need *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Surgery recovery for Eleanor"
                  value={prayerTitle}
                  onChange={(e) => setPrayerTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Requested By</label>
                  <input
                    type="text"
                    value={prayerBy}
                    onChange={(e) => setPrayerBy(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={prayerCategory}
                    onChange={(e) => setPrayerCategory(e.target.value as PrayerRequest['category'])}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Health">Health & Healing</option>
                    <option value="Family">Family & Marriage</option>
                    <option value="Spiritual">Spiritual Guidance</option>
                    <option value="Financial/Jobs">Financial / Employment</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prayer Notes</label>
                <textarea
                  rows={2}
                  value={prayerNotes}
                  onChange={(e) => setPrayerNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrayerModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold">
                  Publish to Prayer Wall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
