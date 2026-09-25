import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  Copy,
  Key,
  Users,
  Check,
  X,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Crown,
  Briefcase,
  UserCheck,
  Edit2,
  Plus,
  Search,
} from 'lucide-react';
import {
  UserInvite,
  SystemRole,
  RolePermissions,
  CoordinationGroup,
  Member,
} from '../types';

interface PermissionsProps {
  userInvites: UserInvite[];
  rolePermissions: Record<SystemRole, RolePermissions>;
  groups: CoordinationGroup[];
  activeSimulationRole: SystemRole;
  members?: Member[];
  onSendInvite: (invite: Omit<UserInvite, 'id' | 'dateSent' | 'inviteCode' | 'status'>) => void;
  onResendInvite: (inviteId: string) => void;
  onRevokeInvite: (inviteId: string) => void;
  onUpdateRolePermissions: (role: SystemRole, permissions: RolePermissions) => void;
  onSelectSimulationRole: (role: SystemRole) => void;
  onUpdateMember?: (member: Member) => void;
}

export const Permissions: React.FC<PermissionsProps> = ({
  userInvites,
  rolePermissions,
  groups,
  activeSimulationRole,
  members = [],
  onSendInvite,
  onResendInvite,
  onRevokeInvite,
  onUpdateRolePermissions,
  onSelectSimulationRole,
  onUpdateMember,
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'matrix' | 'invites'>('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Promote/Assign Staff Form State
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [promotedRole, setPromotedRole] = useState<'Staff' | 'Leader'>('Staff');
  const [promotedSystemRole, setPromotedSystemRole] = useState<SystemRole>('Pastor / Minister');

  // Search in team list
  const [teamSearch, setTeamSearch] = useState('');

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<SystemRole>('Department Leader');
  const [selectedGroupNames, setSelectedGroupNames] = useState<string[]>([]);
  const [inviteNotes, setInviteNotes] = useState('');

  // Editable local permissions matrix
  const [matrixState, setMatrixState] = useState<Record<SystemRole, RolePermissions>>(
    rolePermissions
  );
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const systemRolesList: SystemRole[] = [
    'Administrator',
    'Pastor / Minister',
    'Treasurer / Finance',
    'Department Leader',
    'Member / Volunteer',
  ];

  // Filter members who are Staff or Leader or found in userInvites with an admin/pastor role
  const staffAndLeaders = members.filter(
    (m) =>
      m.role === 'Staff' ||
      m.role === 'Leader' ||
      m.notes?.toLowerCase().includes('pastor') ||
      m.notes?.toLowerCase().includes('staff') ||
      userInvites.some(
        (i) => i.email.toLowerCase() === m.email.toLowerCase() && i.role !== 'Member / Volunteer'
      )
  );

  const nonStaffMembers = members.filter(
    (m) => !staffAndLeaders.some((s) => s.id === m.id)
  );

  const filteredTeam = staffAndLeaders.filter((m) => {
    const q = teamSearch.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q)
    );
  });

  const permissionKeys: { key: keyof RolePermissions; label: string; desc: string }[] = [
    {
      key: 'canManageMembers',
      label: 'Members & Family Directory',
      desc: 'View, add, and edit church member records and families',
    },
    {
      key: 'canManageFinances',
      label: 'Finances, Budgets & Requisitions',
      desc: 'View department budgets and approve vendor expenses',
    },
    {
      key: 'canManageRosters',
      label: 'Sunday Rosters & Duty Schedules',
      desc: 'Create service rosters and assign volunteers',
    },
    {
      key: 'canManageEvents',
      label: 'Events & Facility Calendar',
      desc: 'Schedule church events and manage room bookings',
    },
    {
      key: 'canManageAssets',
      label: 'Equipment & Asset Register',
      desc: 'Track audio equipment, instruments, and maintenance',
    },
    {
      key: 'canAccessPastoralCare',
      label: 'Pastoral Care & Confidential Notes',
      desc: 'Access pastoral visitation logs and prayer requests',
    },
    {
      key: 'canManageGroups',
      label: 'Ministry Coordination Groups',
      desc: 'Create WhatsApp-style groups and post announcements',
    },
    {
      key: 'canInviteUsers',
      label: 'Portal Invites & Role Assignment',
      desc: 'Send portal email invites and manage system access',
    },
  ];

  const handleGroupToggle = (groupName: string) => {
    if (selectedGroupNames.includes(groupName)) {
      setSelectedGroupNames(selectedGroupNames.filter((g) => g !== groupName));
    } else {
      setSelectedGroupNames([...selectedGroupNames, groupName]);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    onSendInvite({
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole,
      accessGroups: selectedGroupNames,
      invitedBy: 'Administrator',
      notes: inviteNotes.trim(),
    });

    setInviteEmail('');
    setInviteName('');
    setSelectedGroupNames([]);
    setInviteNotes('');
    setShowInviteModal(false);
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !onUpdateMember) return;

    const targetMember = members.find((m) => m.id === selectedMemberId);
    if (!targetMember) return;

    // Update member role
    onUpdateMember({
      ...targetMember,
      role: promotedRole,
      notes: targetMember.notes
        ? `${targetMember.notes} | System Role: ${promotedSystemRole}`
        : `System Role: ${promotedSystemRole}`,
    });

    // Automatically send portal invite if not existing
    const existingInvite = userInvites.find(
      (i) => i.email.toLowerCase() === targetMember.email.toLowerCase()
    );
    if (!existingInvite && targetMember.email) {
      onSendInvite({
        email: targetMember.email,
        name: `${targetMember.firstName} ${targetMember.lastName}`,
        role: promotedSystemRole,
        accessGroups: targetMember.ministryGroups || [],
        invitedBy: 'Administrator',
        notes: `Promoted to ${promotedRole} (${promotedSystemRole})`,
      });
    }

    setSelectedMemberId('');
    setShowPromoteModal(false);
  };

  const handleTogglePermission = (role: SystemRole, permKey: keyof RolePermissions) => {
    const updated = {
      ...matrixState[role],
      [permKey]: !matrixState[role][permKey],
    };
    const nextMatrix = {
      ...matrixState,
      [role]: updated,
    };
    setMatrixState(nextMatrix);
    onUpdateRolePermissions(role, updated);
  };

  const copyInviteLink = (invite: UserInvite) => {
    const link = `https://gracecommunity.app/portal/join?code=${invite.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedCodeId(invite.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  // Helper to resolve system role for a member
  const getMemberSystemRole = (m: Member): SystemRole => {
    const invite = userInvites.find(
      (i) => i.email.toLowerCase() === m.email.toLowerCase()
    );
    if (invite) return invite.role;

    if (m.notes?.includes('Pastor') || m.firstName.toLowerCase().includes('pastor')) {
      return 'Pastor / Minister';
    }
    if (m.role === 'Staff') return 'Pastor / Minister';
    if (m.role === 'Leader') return 'Department Leader';
    return 'Member / Volunteer';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Top Banner & Active Simulation Role Control */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            Church Staff, Leaders & Access Control
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Church Staff Roster & System Permissions
          </h2>
          <p className="text-slate-300 text-xs max-w-2xl">
            All congregation members live in the unified Member Directory. Assign Pastors, Staff, and Ministry Leaders here to manage their portal roles, access rights, and permissions.
          </p>
        </div>

        {/* Live Role Simulation Bar */}
        <div className="bg-slate-800/90 border border-slate-700 p-3 sm:p-3.5 rounded-xl flex items-center justify-between sm:justify-start gap-3 shrink-0 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>Active View Role:</span>
          </div>
          <select
            value={activeSimulationRole}
            onChange={(e) => onSelectSimulationRole(e.target.value as SystemRole)}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-600 focus:ring-2 focus:ring-blue-500"
          >
            {systemRolesList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'team'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>Church Staff & Leaders ({staffAndLeaders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'matrix'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Role Permissions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('invites')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === 'invites'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email Invitations ({userInvites.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'team' && (
            <button
              onClick={() => setShowPromoteModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Staff / Leader Role</span>
            </button>
          )}

          {activeTab === 'invites' && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CHURCH STAFF & LEADERS LIST */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pastors & Ministers</p>
                <p className="text-xl font-bold text-slate-900">
                  {staffAndLeaders.filter((m) => getMemberSystemRole(m) === 'Pastor / Minister').length || 2}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Department & Ministry Leaders</p>
                <p className="text-xl font-bold text-slate-900">
                  {staffAndLeaders.filter((m) => getMemberSystemRole(m) === 'Department Leader').length || 4}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Staff & Board Access</p>
                <p className="text-xl font-bold text-slate-900">{staffAndLeaders.length}</p>
              </div>
            </div>
          </div>

          {/* Search & Team Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  placeholder="Search pastor, staff, role, email..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <span className="text-xs text-slate-500 font-medium">
                Showing {filteredTeam.length} Assigned Staff & Leaders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Staff Name & Contact</th>
                    <th className="px-6 py-3.5">System Access Role</th>
                    <th className="px-6 py-3.5">Assigned Ministries</th>
                    <th className="px-6 py-3.5">Module Privileges</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredTeam.map((m) => {
                    const sysRole = getMemberSystemRole(m);
                    const perms = rolePermissions[sysRole] || rolePermissions['Member / Volunteer'];

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                              {m.firstName.charAt(0)}
                              {m.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>
                                  {m.firstName} {m.lastName}
                                </span>
                                {sysRole === 'Pastor / Minister' && (
                                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                                )}
                              </p>
                              <p className="text-[11px] text-slate-500">{m.email || m.phone}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              sysRole === 'Administrator'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : sysRole === 'Pastor / Minister'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : sysRole === 'Treasurer / Finance'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {sysRole}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {m.ministryGroups.length > 0 ? (
                              m.ministryGroups.map((g, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                                >
                                  {g}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-[11px]">General Staff</span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 text-[10px]">
                            {perms.canManageFinances && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                                Finances
                              </span>
                            )}
                            {perms.canAccessPastoralCare && (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold">
                                Pastoral Care
                              </span>
                            )}
                            {perms.canManageMembers && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold">
                                Directory
                              </span>
                            )}
                            {perms.canManageRosters && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-semibold">
                                Rosters
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedMemberId(m.id);
                              setPromotedRole(m.role === 'Staff' ? 'Staff' : 'Leader');
                              setPromotedSystemRole(sysRole);
                              setShowPromoteModal(true);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit Role</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">System Role Permissions Matrix</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toggle exact operational permissions for each system role. Changes update real-time portal views.
              </p>
            </div>
            {saveSuccessMsg && (
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {saveSuccessMsg}
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
                  <th className="p-4 w-1/3">Portal Capability / Feature Module</th>
                  {systemRolesList.map((role) => (
                    <th key={role} className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span>{role}</span>
                        {role === activeSimulationRole && (
                          <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                            Active Preview
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {permissionKeys.map(({ key, label, desc }) => (
                  <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{label}</p>
                      <p className="text-[11px] text-slate-500">{desc}</p>
                    </td>

                    {systemRolesList.map((role) => {
                      const isEnabled = matrixState[role][key];
                      const isAdmin = role === 'Administrator';

                      return (
                        <td key={role} className="p-4 text-center">
                          <button
                            disabled={isAdmin}
                            onClick={() => handleTogglePermission(role, key)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isEnabled
                                ? 'bg-blue-600 text-white shadow-2xs'
                                : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                            } ${isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                            title={
                              isAdmin
                                ? 'Administrator always has full privileges'
                                : `Toggle ${label} for ${role}`
                            }
                          >
                            {isEnabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL INVITES LIST */}
      {activeTab === 'invites' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Portal Invitations & Team Access</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage sent email invitations, copy direct sign-up codes, and monitor user activation.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              {userInvites.filter((i) => i.status === 'Accepted').length} Accepted •{' '}
              {userInvites.filter((i) => i.status === 'Pending').length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Member Name & Email</th>
                  <th className="px-6 py-3.5">Assigned System Role</th>
                  <th className="px-6 py-3.5">Coordination Groups</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Date Sent</th>
                  <th className="px-6 py-3.5 text-right">Actions & Share Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {userInvites.map((invite) => (
                  <tr key={invite.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {invite.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{invite.name}</p>
                          <p className="text-[11px] text-slate-500">{invite.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200">
                        {invite.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {invite.accessGroups.map((g, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {invite.status === 'Accepted' ? (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Accepted
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold flex items-center gap-1 w-fit">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Invite
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-400">{invite.dateSent}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => copyInviteLink(invite)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Copy direct invite link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copiedCodeId === invite.id ? 'Copied!' : 'Copy Code'}
                        </button>

                        <button
                          onClick={() => onResendInvite(invite.id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Resend email invitation"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onRevokeInvite(invite.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: PROMOTE / ASSIGN MEMBER TO STAFF & ASSIGN SYSTEM ROLE */}
      {showPromoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Assign Staff / Leader Role to Member
              </h3>
              <button onClick={() => setShowPromoteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePromoteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Congregation Member
                </label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Member from Directory --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.email || m.phone || 'No Email'}) — Current: {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Member Directory Classification
                  </label>
                  <select
                    value={promotedRole}
                    onChange={(e) => setPromotedRole(e.target.value as 'Staff' | 'Leader')}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="Staff">Staff / Pastoral Team</option>
                    <option value="Leader">Ministry / Dept Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    System Access Level & Permissions
                  </label>
                  <select
                    value={promotedSystemRole}
                    onChange={(e) => setPromotedSystemRole(e.target.value as SystemRole)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  >
                    {systemRolesList.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 flex items-start gap-2 text-slate-700 text-[11px]">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Promoting a member grants them full portal access based on the selected System Access Level. They will automatically receive an invitation code to log into the portal.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMemberId}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save & Assign Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Send Email Portal Invite</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Pastor Samuel Park"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email ID</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="samuel.p@church.org"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned System Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as SystemRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  {systemRolesList.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Coordination Groups</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-32 overflow-y-auto">
                  {groups.map((group) => (
                    <label key={group.id} className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                      <input
                        type="checkbox"
                        checked={selectedGroupNames.includes(group.name)}
                        onChange={() => handleGroupToggle(group.name)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">{group.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Invitation Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={inviteNotes}
                  onChange={(e) => setInviteNotes(e.target.value)}
                  placeholder="Welcome message or instructions for the invited team member"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

