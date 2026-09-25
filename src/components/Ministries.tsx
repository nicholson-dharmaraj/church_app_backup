import React, { useState } from 'react';
import {
  Users2,
  Calendar,
  UserCheck,
  Plus,
  Check,
  X,
  Clock,
  Printer,
  ChevronRight,
  ShieldAlert,
  UserPlus,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { Ministry, ServiceRoster, Member, RosterRole } from '../types';

interface MinistriesProps {
  ministries: Ministry[];
  rosters: ServiceRoster[];
  members: Member[];
  onAddRoster: (roster: Omit<ServiceRoster, 'id'>) => void;
  onUpdateRoster: (roster: ServiceRoster) => void;
  onAddMinistry: (ministry: Omit<Ministry, 'id'>) => void;
  isQuickAddOpen?: boolean;
  onCloseQuickAdd?: () => void;
}

export const Ministries: React.FC<MinistriesProps> = ({
  ministries,
  rosters,
  members,
  onAddRoster,
  onUpdateRoster,
  onAddMinistry,
  isQuickAddOpen = false,
  onCloseQuickAdd,
}) => {
  const [activeTab, setActiveTab] = useState<'rosters' | 'ministries'>('rosters');
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [selectedRosterId, setSelectedRosterId] = useState<string>(rosters[0]?.id || '');
  const [showAddRosterModal, setShowAddRosterModal] = useState(isQuickAddOpen);
  const [showAddMinistryModal, setShowAddMinistryModal] = useState(false);

  // New Roster Form State
  const [rosterDate, setRosterDate] = useState('');
  const [rosterServiceType, setRosterServiceType] = useState<ServiceRoster['serviceType']>('Sunday Morning Service');
  const [rosterNotes, setRosterNotes] = useState('');

  // New Ministry Form State
  const [minName, setMinName] = useState('');
  const [minCategory, setMinCategory] = useState<Ministry['category']>('Worship');
  const [minLeaderId, setMinLeaderId] = useState('');
  const [minDesc, setMinDesc] = useState('');
  const [minSchedule, setMinSchedule] = useState('');

  const currentRoster = rosters.find((r) => r.id === selectedRosterId) || rosters[0];

  const handleCreateRoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rosterDate) return;

    const defaultRoles: RosterRole[] = [
      { roleName: 'Preacher / Service Lead', status: 'Pending' },
      { roleName: 'Worship Leader', status: 'Pending' },
      { roleName: 'Vocalist / Band', status: 'Pending' },
      { roleName: 'Audio Engineer', status: 'Pending' },
      { roleName: 'Lead Greeter / Usher', status: 'Pending' },
      { roleName: 'Nursery & Children Lead', status: 'Pending' },
    ];

    onAddRoster({
      date: rosterDate,
      serviceType: rosterServiceType,
      roles: defaultRoles,
      notes: rosterNotes || undefined,
    });

    setShowAddRosterModal(false);
    if (onCloseQuickAdd) onCloseQuickAdd();
  };

  const handleAssignRoleMember = (roleIndex: number, memberId: string) => {
    if (!currentRoster) return;
    const assignedMem = members.find((m) => m.id === memberId);

    const updatedRoles = [...currentRoster.roles];
    updatedRoles[roleIndex] = {
      ...updatedRoles[roleIndex],
      assignedMemberId: memberId || undefined,
      assignedMemberName: assignedMem ? `${assignedMem.firstName} ${assignedMem.lastName}` : undefined,
      status: memberId ? 'Confirmed' : 'Pending',
    };

    onUpdateRoster({
      ...currentRoster,
      roles: updatedRoles,
    });
  };

  const handleToggleRoleStatus = (roleIndex: number, newStatus: 'Confirmed' | 'Pending' | 'Declined') => {
    if (!currentRoster) return;
    const updatedRoles = [...currentRoster.roles];
    updatedRoles[roleIndex] = {
      ...updatedRoles[roleIndex],
      status: newStatus,
    };

    onUpdateRoster({
      ...currentRoster,
      roles: updatedRoles,
    });
  };

  const handleCreateMinistry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minName) return;

    const leader = members.find((m) => m.id === minLeaderId);

    onAddMinistry({
      name: minName,
      category: minCategory,
      leaderId: minLeaderId || 'unassigned',
      leaderName: leader ? `${leader.firstName} ${leader.lastName}` : 'Unassigned',
      description: minDesc,
      memberCount: 1,
      meetingSchedule: minSchedule || 'TBD',
    });

    setMinName('');
    setMinDesc('');
    setShowAddMinistryModal(false);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Ministries & Sunday Duty Rosters
          </h2>
          <p className="text-xs text-slate-500">
            Schedule volunteer positions for Sunday services and coordinate ministry teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'rosters' && currentRoster && (
            <button
              onClick={handlePrintRoster}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Sunday Sheet</span>
            </button>
          )}

          <button
            onClick={() => setShowAddRosterModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Roster</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('rosters')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'rosters' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Sunday Duty Rosters</span>
        </button>

        <button
          onClick={() => setActiveTab('ministries')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'ministries' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Ministry Teams ({ministries.length})</span>
        </button>
      </div>

      {/* Sunday Roster Matrix View */}
      {activeTab === 'rosters' && (
        <div className="space-y-4">
          {/* Roster Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Select Service Date:</span>
              <div className="flex flex-wrap gap-2">
                {rosters.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRosterId(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      (currentRoster && currentRoster.id === r.id)
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    📅 {r.date} ({r.serviceType.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>

            {currentRoster && (
              <div className="text-xs text-slate-500">
                Type: <span className="font-semibold text-slate-800">{currentRoster.serviceType}</span>
              </div>
            )}
          </div>

          {/* Service Roster Table */}
          {currentRoster ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Sunday Duty Roster — {currentRoster.date}
                  </h3>
                  {currentRoster.notes && (
                    <p className="text-xs text-slate-500 italic mt-0.5">Note: {currentRoster.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg">
                    {currentRoster.roles.filter((r) => r.status === 'Confirmed').length} / {currentRoster.roles.length} Confirmed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentRoster.roles.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{role.roleName}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleRoleStatus(idx, 'Confirmed')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            role.status === 'Confirmed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          Confirmed
                        </button>
                        <button
                          onClick={() => handleToggleRoleStatus(idx, 'Pending')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                            role.status === 'Pending'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          Pending
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Assigned Volunteer / Leader
                      </label>
                      <select
                        value={role.assignedMemberId || ''}
                        onChange={(e) => handleAssignRoleMember(idx, e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      >
                        <option value="">-- Unassigned Volunteer --</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.firstName} {m.lastName} ({m.role})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No duty rosters scheduled.</p>
          )}
        </div>
      )}

      {/* Ministries Directory View */}
      {activeTab === 'ministries' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Active Church Ministry Teams and Volunteer Coordinators</p>
            <div className="flex items-center gap-3">
              {/* Display Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setDisplayMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    displayMode === 'cards'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="View as Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setDisplayMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    displayMode === 'table'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="View as Table"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>

              <button
                onClick={() => setShowAddMinistryModal(true)}
                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Ministry Team
              </button>
            </div>
          </div>

          {displayMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ministries.map((min) => (
                <div key={min.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                        {min.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{min.name}</h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                      {min.memberCount} Volunteers
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{min.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Team Leader: <strong className="text-slate-800">{min.leaderName}</strong></span>
                    <span>🗓 {min.meetingSchedule}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View for Ministry Teams */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Ministry Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Team Leader</th>
                      <th className="p-3.5">Meeting Schedule</th>
                      <th className="p-3.5">Volunteers</th>
                      <th className="p-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ministries.map((min) => (
                      <tr key={min.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{min.name}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                            {min.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800">{min.leaderName}</td>
                        <td className="p-3.5 text-slate-600">{min.meetingSchedule}</td>
                        <td className="p-3.5 font-bold text-slate-900">{min.memberCount}</td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">{min.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Roster Modal */}
      {showAddRosterModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Create Sunday Service Duty Roster</h3>
              <button onClick={() => setShowAddRosterModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoster} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Date *</label>
                <input
                  type="date"
                  required
                  value={rosterDate}
                  onChange={(e) => setRosterDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Type</label>
                <select
                  value={rosterServiceType}
                  onChange={(e) => setRosterServiceType(e.target.value as ServiceRoster['serviceType'])}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="Sunday Morning Service">Sunday Morning Service</option>
                  <option value="Midweek Prayer">Midweek Prayer Meeting</option>
                  <option value="Youth Fellowship">Youth Fellowship</option>
                  <option value="Special Event">Special Service Event</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Special Notes / Focus</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Communion Sunday, missionary guest speaker"
                  value={rosterNotes}
                  onChange={(e) => setRosterNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRosterModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create Roster Sheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Ministry Modal */}
      {showAddMinistryModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New Ministry Team</h3>
              <button onClick={() => setShowAddMinistryModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMinistry} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ministry Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media & Projection Team"
                  value={minName}
                  onChange={(e) => setMinName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={minCategory}
                  onChange={(e) => setMinCategory(e.target.value as Ministry['category'])}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="Worship">Worship</option>
                  <option value="Discipleship">Discipleship</option>
                  <option value="Children & Youth">Children & Youth</option>
                  <option value="Operations & Tech">Operations & Tech</option>
                  <option value="Hospitality & Care">Hospitality & Care</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Team Leader</label>
                <select
                  value={minLeaderId}
                  onChange={(e) => setMinLeaderId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="">Select Member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={minDesc}
                  onChange={(e) => setMinDesc(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Meeting Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Thursdays 7:00 PM"
                  value={minSchedule}
                  onChange={(e) => setMinSchedule(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMinistryModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                >
                  Save Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
