import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  X,
  Edit2,
  Trash2,
  Users2,
  Check,
  UserCheck,
  Heart,
  ChevronRight,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { Member, Family, MemberRole, MemberStatus } from '../types';

interface MembersProps {
  members: Member[];
  families: Family[];
  onAddMember: (member: Omit<Member, 'id'>) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  initialSearchTerm?: string;
  isQuickAddOpen?: boolean;
  onCloseQuickAdd?: () => void;
}

export const Members: React.FC<MembersProps> = ({
  members,
  families,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  initialSearchTerm = '',
  isQuickAddOpen = false,
  onCloseQuickAdd,
}) => {
  const [activeView, setActiveView] = useState<'members' | 'families'>('members');
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showAddModal, setShowAddModal] = useState(isQuickAddOpen);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form state
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formRole, setFormRole] = useState<MemberRole>('Member');
  const [formStatus, setFormStatus] = useState<MemberStatus>('Active');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formBaptismDate, setFormBaptismDate] = useState('');
  const [formMinistryGroups, setFormMinistryGroups] = useState<string>('');
  const [formNotes, setFormNotes] = useState('');

  // Handle opening add modal
  const openAddModal = () => {
    setEditingMember(null);
    setFormFirstName('');
    setFormLastName('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormRole('Member');
    setFormStatus('Active');
    setFormGender('Male');
    setFormBirthDate('');
    setFormBaptismDate('');
    setFormMinistryGroups('');
    setFormNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFormFirstName(member.firstName);
    setFormLastName(member.lastName);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setFormAddress(member.address);
    setFormRole(member.role);
    setFormStatus(member.status);
    setFormGender(member.gender);
    setFormBirthDate(member.birthDate || '');
    setFormBaptismDate(member.baptismDate || '');
    setFormMinistryGroups(member.ministryGroups.join(', '));
    setFormNotes(member.notes || '');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName || !formLastName) return;

    const groups = formMinistryGroups
      ? formMinistryGroups.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    if (editingMember) {
      onUpdateMember({
        ...editingMember,
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        role: formRole,
        status: formStatus,
        gender: formGender,
        birthDate: formBirthDate || undefined,
        baptismDate: formBaptismDate || undefined,
        ministryGroups: groups,
        notes: formNotes || undefined,
      });
    } else {
      onAddMember({
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        phone: formPhone,
        address: formAddress,
        role: formRole,
        status: formStatus,
        gender: formGender,
        birthDate: formBirthDate || undefined,
        baptismDate: formBaptismDate || undefined,
        ministryGroups: groups,
        joinedDate: new Date().toISOString().split('T')[0],
        notes: formNotes || undefined,
      });
    }

    setShowAddModal(false);
    if (onCloseQuickAdd) onCloseQuickAdd();
  };

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);

    const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['First Name', 'Last Name', 'Role', 'Status', 'Email', 'Phone', 'Address', 'Joined Date'];
    const rows = filteredMembers.map((m) => [
      m.firstName,
      m.lastName,
      m.role,
      m.status,
      m.email,
      m.phone,
      `"${m.address.replace(/"/g, '""')}"`,
      m.joinedDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Church_Central_Members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Member & Family Directory
          </h2>
          <p className="text-xs text-slate-500">
            Manage church membership roles, family groupings, ministry groups, and contact records.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          {/* Add Member */}
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* View Toggle Tabs & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-3 gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveView('members')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
              activeView === 'members'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Members ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveView('families')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 ${
              activeView === 'families'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Family Units ({families.length})</span>
          </button>
        </div>

        {/* Quick Filter Bar */}
        {activeView === 'members' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial min-w-[160px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, email..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="Member">Full Member</option>
              <option value="Regular Attender">Regular Attender</option>
              <option value="Visitor">Visitor</option>
              <option value="Leader">Ministry Leader</option>
              <option value="Staff">Church Staff</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Transferred">Transferred</option>
            </select>

            {/* Display Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
              <button
                onClick={() => setDisplayMode('cards')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  displayMode === 'cards'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="View as Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setDisplayMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  displayMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="View as Table"
              >
                <Table className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Members Directory Content */}
      {activeView === 'members' && (
        displayMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.firstName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      {member.firstName} {member.lastName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold">
                        {member.role}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          member.status === 'Active'
                            ? 'bg-emerald-500'
                            : member.status === 'Inactive'
                            ? 'bg-amber-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(member)}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                    title="Edit Member"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    title="Delete Member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email || 'No email registered'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{member.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.address || 'No address listed'}</span>
                </div>
              </div>

              {/* Groups & Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {member.ministryGroups.map((grp, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md"
                    >
                      {grp}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5"
                >
                  Profile <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Member Name</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Contact Info</th>
                  <th className="p-3.5">Ministry Groups</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-900 flex items-center gap-2.5">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                      )}
                      <div>
                        <span className="block">{m.firstName} {m.lastName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{m.gender}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 text-[10px] font-bold">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="text-slate-800 font-medium">{m.email || '—'}</div>
                      <div className="text-[11px] text-slate-400">{m.phone || '—'}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {m.ministryGroups.map((grp, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md">
                            {grp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500">{m.joinedDate}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedMember(m)}
                          className="px-2 py-1 text-sky-600 hover:bg-sky-50 rounded-md font-semibold text-[11px]"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteMember(m.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )
      )}

      {/* Families View */}
      {activeView === 'families' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {families.map((fam) => {
            const familyMembers = members.filter((m) => fam.memberIds.includes(m.id));
            return (
              <div key={fam.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{fam.name}</h3>
                    <p className="text-xs text-slate-500">
                      Primary Contact: {fam.primaryContactName}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                    {familyMembers.length} Members
                  </span>
                </div>

                <div className="space-y-2">
                  {familyMembers.map((fm) => (
                    <div
                      key={fm.id}
                      className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          {fm.firstName} {fm.lastName}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md">
                          {fm.familyRole || 'Member'}
                        </span>
                      </div>
                      <span className="text-slate-500">{fm.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member Profile Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-base">
                  {selectedMember.firstName[0]}
                  {selectedMember.lastName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedMember.role} • Joined {selectedMember.joinedDate}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMember(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="pt-2 space-y-2">
                <p className="font-semibold text-slate-800">Contact Details</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Email: <span className="font-medium text-slate-900">{selectedMember.email}</span></div>
                  <div>Phone: <span className="font-medium text-slate-900">{selectedMember.phone}</span></div>
                  <div className="col-span-2">Address: <span className="font-medium text-slate-900">{selectedMember.address}</span></div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <p className="font-semibold text-slate-800">Church Information</p>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>Gender: <span className="font-medium text-slate-900">{selectedMember.gender}</span></div>
                  <div>Status: <span className="font-medium text-emerald-700">{selectedMember.status}</span></div>
                  <div>Baptism Date: <span className="font-medium text-slate-900">{selectedMember.baptismDate || 'N/A'}</span></div>
                  <div>Birth Date: <span className="font-medium text-slate-900">{selectedMember.birthDate || 'N/A'}</span></div>
                </div>
              </div>

              <div className="pt-2 space-y-1.5">
                <p className="font-semibold text-slate-800">Ministry Involvement</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.ministryGroups.map((g, i) => (
                    <span key={i} className="px-2 py-0.5 bg-sky-50 text-sky-700 font-semibold rounded-md text-[11px]">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {selectedMember.notes && (
                <div className="pt-2">
                  <p className="font-semibold text-slate-800">Administrative Notes</p>
                  <p className="text-slate-600 mt-1 italic">{selectedMember.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const m = selectedMember;
                  setSelectedMember(null);
                  openEditModal(m);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit Member Record
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingMember ? 'Edit Member Record' : 'Add New Church Member'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Home Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Church Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as MemberRole)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Member">Full Member</option>
                    <option value="Regular Attender">Regular Attender</option>
                    <option value="Visitor">Visitor</option>
                    <option value="Leader">Ministry Leader</option>
                    <option value="Staff">Church Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Membership Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as MemberStatus)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Transferred">Transferred</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Birth Date</label>
                  <input
                    type="date"
                    value={formBirthDate}
                    onChange={(e) => setFormBirthDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Baptism Date</label>
                  <input
                    type="date"
                    value={formBaptismDate}
                    onChange={(e) => setFormBaptismDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ministry Groups (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Worship Team, Youth Pastor, Usher"
                  value={formMinistryGroups}
                  onChange={(e) => setFormMinistryGroups(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Administrative Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
