import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Save,
  RotateCcw,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ChurchProfile } from '../types';

interface SettingsProps {
  churchProfile: ChurchProfile;
  onSaveProfile: (profile: ChurchProfile) => void;
  onResetDemoData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  churchProfile,
  onSaveProfile,
  onResetDemoData,
}) => {
  const [profile, setProfile] = useState<ChurchProfile>(churchProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Church Profile & Portal Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure church contact details, leadership info, and data management options.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Church Management Mode</p>
            <p className="text-slate-600">
              Configured strictly for internal management, member records, and department expense budgeting. No giving or donation forms active.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" /> Church Details
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Changes saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Church Name *</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Denomination / Affiliation</label>
              <input
                type="text"
                value={profile.denomination}
                onChange={(e) => setProfile({ ...profile, denomination: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lead / Senior Pastor *</label>
              <input
                type="text"
                required
                value={profile.leadPastor}
                onChange={(e) => setProfile({ ...profile, leadPastor: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tax ID / Non-Profit Registration</label>
              <input
                type="text"
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Physical Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full border border-slate-200 rounded-lg p-2.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Office Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Office Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Website URL</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full border border-slate-200 rounded-lg p-2.5"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" /> Save Church Profile
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone / Data Management */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
          Data Management & Demo Reset
        </h3>
        <p className="text-xs text-slate-500">
          Reset all stored member records, financial expenses, and rosters back to initial demo data if needed.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={onResetDemoData}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-xs border border-rose-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Portal Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
