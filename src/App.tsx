import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Member,
  DepartmentBudget,
  Expense,
  ExpenseStatus,
  Vendor,
  Ministry,
  ServiceRoster,
  ChurchEvent,
  Facility,
  Asset,
  PastoralCareNote,
  PrayerRequest,
  ChurchProfile,
  UserInvite,
  SystemRole,
  RolePermissions,
  CoordinationGroup,
  GroupMessage,
  WorshipSong,
  WorshipPracticeGroup,
} from './types';

import {
  loadChurchData,
  saveChurchProfile,
  saveMembers,
  saveBudgets,
  saveExpenses,
  saveVendors,
  saveMinistries,
  saveRosters,
  saveEvents,
  saveFacilities,
  saveAssets,
  savePastoralNotes,
  savePrayerRequests,
  saveUserInvites,
  saveRolePermissions,
  saveCoordinationGroups,
  saveGroupMessages,
  saveWorshipSongs,
  saveWorshipPracticeGroups,
  resetAllChurchData,
} from './storage';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Members } from './components/Members';
import { Finances } from './components/Finances';
import { Ministries } from './components/Ministries';
import { Events } from './components/Events';
import { Assets } from './components/Assets';
import { PastoralCare } from './components/PastoralCare';
import { Settings } from './components/Settings';
import { Groups } from './components/Groups';
import { Permissions } from './components/Permissions';
import { Worship } from './components/Worship';

export default function App() {
  const [data, setData] = useState(() => loadChurchData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickAddType, setQuickAddType] = useState<'member' | 'expense' | 'event' | 'roster' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync helpers
  const handleSaveProfile = (profile: ChurchProfile) => {
    setData((prev) => ({ ...prev, profile }));
    saveChurchProfile(profile);
  };

  const handleAddMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: `m-${Date.now()}`,
    };
    const updated = [newMember, ...data.members];
    setData((prev) => ({ ...prev, members: updated }));
    saveMembers(updated);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    const updated = data.members.map((m) => (m.id === updatedMember.id ? updatedMember : m));
    setData((prev) => ({ ...prev, members: updated }));
    saveMembers(updated);
  };

  const handleDeleteMember = (id: string) => {
    const updated = data.members.filter((m) => m.id !== id);
    setData((prev) => ({ ...prev, members: updated }));
    saveMembers(updated);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    const updated = [newExpense, ...data.expenses];
    setData((prev) => ({ ...prev, expenses: updated }));
    saveExpenses(updated);
  };

  const handleUpdateExpenseStatus = (id: string, status: ExpenseStatus) => {
    const updatedExpenses = data.expenses.map((e) => {
      if (e.id === id) {
        return { ...e, status };
      }
      return e;
    });

    // Also update department budget spent amount if paid
    const exp = data.expenses.find((e) => e.id === id);
    let updatedBudgets = data.budgets;

    if (exp && status === 'Paid' && exp.status !== 'Paid') {
      updatedBudgets = data.budgets.map((b) => {
        if (b.departmentName === exp.department) {
          return { ...b, spentAmount: b.spentAmount + exp.amount };
        }
        return b;
      });
      saveBudgets(updatedBudgets);
    }

    setData((prev) => ({
      ...prev,
      expenses: updatedExpenses,
      budgets: updatedBudgets,
    }));
    saveExpenses(updatedExpenses);
  };

  const handleAddVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `v-${Date.now()}`,
    };
    const updated = [newVendor, ...data.vendors];
    setData((prev) => ({ ...prev, vendors: updated }));
    saveVendors(updated);
  };

  const handleAddRoster = (rosterData: Omit<ServiceRoster, 'id'>) => {
    const newRoster: ServiceRoster = {
      ...rosterData,
      id: `rost-${Date.now()}`,
    };
    const updated = [newRoster, ...data.rosters];
    setData((prev) => ({ ...prev, rosters: updated }));
    saveRosters(updated);
  };

  const handleUpdateRoster = (updatedRoster: ServiceRoster) => {
    const updated = data.rosters.map((r) => (r.id === updatedRoster.id ? updatedRoster : r));
    setData((prev) => ({ ...prev, rosters: updated }));
    saveRosters(updated);
  };

  const handleAddMinistry = (minData: Omit<Ministry, 'id'>) => {
    const newMin: Ministry = {
      ...minData,
      id: `min-${Date.now()}`,
    };
    const updated = [...data.ministries, newMin];
    setData((prev) => ({ ...prev, ministries: updated }));
    saveMinistries(updated);
  };

  const handleAddEvent = (evtData: Omit<ChurchEvent, 'id'>) => {
    const newEvt: ChurchEvent = {
      ...evtData,
      id: `evt-${Date.now()}`,
    };
    const updated = [newEvt, ...data.events];
    setData((prev) => ({ ...prev, events: updated }));
    saveEvents(updated);
  };

  const handleAddAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
    };
    const updated = [newAsset, ...data.assets];
    setData((prev) => ({ ...prev, assets: updated }));
    saveAssets(updated);
  };

  const handleUpdateAssetCondition = (id: string, condition: Asset['condition']) => {
    const updated = data.assets.map((a) => (a.id === id ? { ...a, condition } : a));
    setData((prev) => ({ ...prev, assets: updated }));
    saveAssets(updated);
  };

  const handleAddPastoralNote = (noteData: Omit<PastoralCareNote, 'id'>) => {
    const newNote: PastoralCareNote = {
      ...noteData,
      id: `past-${Date.now()}`,
    };
    const updated = [newNote, ...data.pastoralNotes];
    setData((prev) => ({ ...prev, pastoralNotes: updated }));
    savePastoralNotes(updated);
  };

  const handleAddPrayer = (prayerData: Omit<PrayerRequest, 'id'>) => {
    const newPrayer: PrayerRequest = {
      ...prayerData,
      id: `pr-${Date.now()}`,
    };
    const updated = [newPrayer, ...data.prayerRequests];
    setData((prev) => ({ ...prev, prayerRequests: updated }));
    savePrayerRequests(updated);
  };

  const handleUpdatePrayerStatus = (id: string, status: PrayerRequest['status']) => {
    const updated = data.prayerRequests.map((p) => (p.id === id ? { ...p, status } : p));
    setData((prev) => ({ ...prev, prayerRequests: updated }));
    savePrayerRequests(updated);
  };

  // Simulation Role State
  const [activeSimulationRole, setActiveSimulationRole] = useState<SystemRole>('Administrator');

  // Group Handlers
  const handleSendMessage = (
    groupId: string,
    text: string,
    isAnnouncement: boolean,
    attachmentName?: string
  ) => {
    const newMsg: GroupMessage = {
      id: `msg-${Date.now()}`,
      groupId,
      senderId: data.members[0]?.id || 'm-1',
      senderName: `${data.members[0]?.firstName || 'Pastor'} ${data.members[0]?.lastName || 'David'}`,
      senderRole: activeSimulationRole === 'Administrator' ? 'Lead Pastor' : activeSimulationRole,
      text,
      timestamp: 'Just now',
      isAnnouncement,
      attachmentName,
      reactions: [],
    };
    const updatedMsgs = [...data.groupMessages, newMsg];
    setData((prev) => ({ ...prev, groupMessages: updatedMsgs }));
    saveGroupMessages(updatedMsgs);
  };

  const handleCreateGroup = (groupData: Omit<CoordinationGroup, 'id' | 'createdDate'>) => {
    const newGroup: CoordinationGroup = {
      ...groupData,
      id: `grp-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
    };
    const updatedGroups = [...data.coordinationGroups, newGroup];
    setData((prev) => ({ ...prev, coordinationGroups: updatedGroups }));
    saveCoordinationGroups(updatedGroups);
  };

  const handleInviteToGroup = (groupId: string, email: string) => {
    // Add user invite or add to group
    const existingGroup = data.coordinationGroups.find((g) => g.id === groupId);
    const updatedInvites: UserInvite[] = [
      {
        id: `inv-${Date.now()}`,
        email,
        name: email.split('@')[0].replace('.', ' '),
        role: 'Member / Volunteer',
        status: 'Pending',
        invitedBy: 'Pastor David Robertson',
        dateSent: new Date().toISOString().split('T')[0],
        accessGroups: existingGroup ? [existingGroup.name] : [],
        inviteCode: `GCC-GRP-${Date.now().toString().slice(-4)}`,
        notes: `Invited to group: ${existingGroup?.name}`,
      },
      ...data.userInvites,
    ];
    setData((prev) => ({ ...prev, userInvites: updatedInvites }));
    saveUserInvites(updatedInvites);
  };

  const handleAddMemberToGroup = (groupId: string, memberId: string) => {
    const updatedGroups = data.coordinationGroups.map((g) => {
      if (g.id === groupId && !g.memberIds.includes(memberId)) {
        return { ...g, memberIds: [...g.memberIds, memberId] };
      }
      return g;
    });
    setData((prev) => ({ ...prev, coordinationGroups: updatedGroups }));
    saveCoordinationGroups(updatedGroups);
  };

  const handleToggleReaction = (messageId: string, emoji: string, userId: string) => {
    const updatedMsgs = data.groupMessages.map((msg) => {
      if (msg.id === messageId) {
        const reactions = msg.reactions ? [...msg.reactions] : [];
        const existingReactionIndex = reactions.findIndex((r) => r.emoji === emoji);

        if (existingReactionIndex > -1) {
          const rx = reactions[existingReactionIndex];
          if (rx.users.includes(userId)) {
            // Remove user
            rx.users = rx.users.filter((u) => u !== userId);
            rx.count = rx.users.length;
          } else {
            // Add user
            rx.users.push(userId);
            rx.count = rx.users.length;
          }
        } else {
          reactions.push({ emoji, count: 1, users: [userId] });
        }
        return { ...msg, reactions: reactions.filter((r) => r.count > 0) };
      }
      return msg;
    });
    setData((prev) => ({ ...prev, groupMessages: updatedMsgs }));
    saveGroupMessages(updatedMsgs);
  };

  // User Invite Handlers
  const handleSendInvite = (
    inviteData: Omit<UserInvite, 'id' | 'dateSent' | 'inviteCode' | 'status'>
  ) => {
    const newInvite: UserInvite = {
      ...inviteData,
      id: `inv-${Date.now()}`,
      dateSent: new Date().toISOString().split('T')[0],
      inviteCode: `GCC-${inviteData.role.substring(0, 3).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      status: 'Pending',
    };
    const updated = [newInvite, ...data.userInvites];
    setData((prev) => ({ ...prev, userInvites: updated }));
    saveUserInvites(updated);
  };

  const handleResendInvite = (inviteId: string) => {
    const updated = data.userInvites.map((i) =>
      i.id === inviteId ? { ...i, dateSent: new Date().toISOString().split('T')[0] } : i
    );
    setData((prev) => ({ ...prev, userInvites: updated }));
    saveUserInvites(updated);
  };

  const handleRevokeInvite = (inviteId: string) => {
    const updated = data.userInvites.filter((i) => i.id !== inviteId);
    setData((prev) => ({ ...prev, userInvites: updated }));
    saveUserInvites(updated);
  };

  const handleUpdateRolePermissions = (
    role: SystemRole,
    permissions: RolePermissions
  ) => {
    const updatedMatrix = {
      ...data.rolePermissions,
      [role]: permissions,
    };
    setData((prev) => ({ ...prev, rolePermissions: updatedMatrix }));
    saveRolePermissions(updatedMatrix);
  };

  // Worship Handlers
  const handleAddWorshipSong = (songData: Omit<WorshipSong, 'id'>) => {
    const newSong: WorshipSong = {
      ...songData,
      id: `song-${Date.now()}`,
    };
    const updated = [newSong, ...data.worshipSongs];
    setData((prev) => ({ ...prev, worshipSongs: updated }));
    saveWorshipSongs(updated);
  };

  const handleDeleteWorshipSong = (id: string) => {
    const updated = data.worshipSongs.filter((s) => s.id !== id);
    setData((prev) => ({ ...prev, worshipSongs: updated }));
    saveWorshipSongs(updated);
  };

  const handleCreateWorshipPracticeGroup = (groupData: Omit<WorshipPracticeGroup, 'id'>) => {
    const newGroup: WorshipPracticeGroup = {
      ...groupData,
      id: `wpg-${Date.now()}`,
    };
    const updated = [newGroup, ...data.worshipPracticeGroups];
    setData((prev) => ({ ...prev, worshipPracticeGroups: updated }));
    saveWorshipPracticeGroups(updated);
  };

  const handleDeleteWorshipPracticeGroup = (id: string) => {
    const updated = data.worshipPracticeGroups.filter((g) => g.id !== id);
    setData((prev) => ({ ...prev, worshipPracticeGroups: updated }));
    saveWorshipPracticeGroups(updated);
  };

  const handleUpdateWorshipPracticeGroupSongs = (groupId: string, songIds: string[]) => {
    const updated = data.worshipPracticeGroups.map((g) =>
      g.id === groupId ? { ...g, songIds } : g
    );
    setData((prev) => ({ ...prev, worshipPracticeGroups: updated }));
    saveWorshipPracticeGroups(updated);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Are you sure you want to reset all data to the initial demo state?')) {
      resetAllChurchData();
      setData(loadChurchData());
    }
  };

  const handleOpenQuickAdd = (type: 'member' | 'expense' | 'event' | 'roster') => {
    setQuickAddType(type);
    if (type === 'member') setActiveTab('members');
    if (type === 'expense') setActiveTab('finances');
    if (type === 'event') setActiveTab('events');
    if (type === 'roster') setActiveTab('ministries');
  };

  // Notification Counts
  const pendingExpenseCount = data.expenses.filter((e) => e.status === 'Pending').length;
  const maintenanceCount = data.assets.filter((a) => a.condition === 'Needs Repair').length;
  const unconfirmedRosterCount = data.rosters[0]
    ? data.rosters[0].roles.filter((r) => r.status === 'Pending').length
    : 0;

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        churchProfile={data.profile}
        pendingExpenseCount={pendingExpenseCount}
        unconfirmedRosterCount={unconfirmedRosterCount}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          activeTab={activeTab}
          churchProfile={data.profile}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenQuickAdd={handleOpenQuickAdd}
          pendingExpenseCount={pendingExpenseCount}
          upcomingEventCount={data.events.length}
          maintenanceCount={maintenanceCount}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 pb-12">
          {activeTab === 'dashboard' && (
            <Dashboard
              members={data.members}
              budgets={data.budgets}
              expenses={data.expenses}
              rosters={data.rosters}
              events={data.events}
              pastoralNotes={data.pastoralNotes}
              prayerRequests={data.prayerRequests}
              setActiveTab={setActiveTab}
              onOpenQuickAdd={handleOpenQuickAdd}
            />
          )}

          {activeTab === 'members' && (
            <Members
              members={data.members}
              families={data.families}
              onAddMember={handleAddMember}
              onUpdateMember={handleUpdateMember}
              onDeleteMember={handleDeleteMember}
              initialSearchTerm={searchTerm}
              isQuickAddOpen={quickAddType === 'member'}
              onCloseQuickAdd={() => setQuickAddType(null)}
            />
          )}

          {activeTab === 'finances' && (
            <Finances
              budgets={data.budgets}
              expenses={data.expenses}
              vendors={data.vendors}
              onAddExpense={handleAddExpense}
              onUpdateExpenseStatus={handleUpdateExpenseStatus}
              onAddVendor={handleAddVendor}
              isQuickAddOpen={quickAddType === 'expense'}
              onCloseQuickAdd={() => setQuickAddType(null)}
            />
          )}

          {activeTab === 'ministries' && (
            <Ministries
              ministries={data.ministries}
              rosters={data.rosters}
              members={data.members}
              onAddRoster={handleAddRoster}
              onUpdateRoster={handleUpdateRoster}
              onAddMinistry={handleAddMinistry}
              isQuickAddOpen={quickAddType === 'roster'}
              onCloseQuickAdd={() => setQuickAddType(null)}
            />
          )}

          {activeTab === 'events' && (
            <Events
              events={data.events}
              facilities={data.facilities}
              onAddEvent={handleAddEvent}
              isQuickAddOpen={quickAddType === 'event'}
              onCloseQuickAdd={() => setQuickAddType(null)}
            />
          )}

          {activeTab === 'groups' && (
            <Groups
              groups={data.coordinationGroups}
              messages={data.groupMessages}
              members={data.members}
              currentMember={data.members[0]}
              currentRole={activeSimulationRole}
              onSendMessage={handleSendMessage}
              onCreateGroup={handleCreateGroup}
              onInviteToGroup={handleInviteToGroup}
              onAddMemberToGroup={handleAddMemberToGroup}
              onToggleReaction={handleToggleReaction}
            />
          )}

          {activeTab === 'worship' && (
            <Worship
              songs={data.worshipSongs}
              practiceGroups={data.worshipPracticeGroups}
              members={data.members}
              onAddSong={handleAddWorshipSong}
              onDeleteSong={handleDeleteWorshipSong}
              onCreatePracticeGroup={handleCreateWorshipPracticeGroup}
              onDeletePracticeGroup={handleDeleteWorshipPracticeGroup}
              onUpdatePracticeGroupSongs={handleUpdateWorshipPracticeGroupSongs}
            />
          )}

          {activeTab === 'assets' && (
            <Assets
              assets={data.assets}
              onAddAsset={handleAddAsset}
              onUpdateAssetCondition={handleUpdateAssetCondition}
            />
          )}

          {activeTab === 'pastoral' && (
            <PastoralCare
              notes={data.pastoralNotes}
              prayers={data.prayerRequests}
              members={data.members}
              onAddNote={handleAddPastoralNote}
              onAddPrayer={handleAddPrayer}
              onUpdatePrayerStatus={handleUpdatePrayerStatus}
            />
          )}

          {activeTab === 'permissions' && (
            <Permissions
              userInvites={data.userInvites}
              rolePermissions={data.rolePermissions}
              groups={data.coordinationGroups}
              activeSimulationRole={activeSimulationRole}
              members={data.members}
              onSendInvite={handleSendInvite}
              onResendInvite={handleResendInvite}
              onRevokeInvite={handleRevokeInvite}
              onUpdateRolePermissions={handleUpdateRolePermissions}
              onSelectSimulationRole={setActiveSimulationRole}
              onUpdateMember={handleUpdateMember}
            />
          )}

          {activeTab === 'settings' && (
            <Settings
              churchProfile={data.profile}
              onSaveProfile={handleSaveProfile}
              onResetDemoData={handleResetDemoData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
