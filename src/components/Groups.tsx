import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Plus,
  Send,
  Pin,
  Paperclip,
  Smile,
  Lock,
  Globe,
  Search,
  CheckCircle,
  Share2,
  Mail,
  UserPlus,
  ChevronRight,
  Sparkles,
  Info,
  X,
  Megaphone,
  ArrowLeft,
} from 'lucide-react';
import {
  CoordinationGroup,
  GroupMessage,
  Member,
  SystemRole,
} from '../types';

interface GroupsProps {
  groups: CoordinationGroup[];
  messages: GroupMessage[];
  members: Member[];
  currentMember: Member;
  currentRole: SystemRole;
  onSendMessage: (groupId: string, text: string, isAnnouncement: boolean, attachmentName?: string) => void;
  onCreateGroup: (group: Omit<CoordinationGroup, 'id' | 'createdDate'>) => void;
  onInviteToGroup: (groupId: string, email: string) => void;
  onAddMemberToGroup: (groupId: string, memberId: string) => void;
  onToggleReaction: (messageId: string, emoji: string, userId: string) => void;
  onSetPinnedAnnouncement?: (groupId: string, announcement: string) => void;
}

export const Groups: React.FC<GroupsProps> = ({
  groups,
  messages,
  members,
  currentMember,
  currentRole,
  onSendMessage,
  onCreateGroup,
  onInviteToGroup,
  onAddMemberToGroup,
  onToggleReaction,
  onSetPinnedAnnouncement,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    groups[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [messageInput, setMessageInput] = useState('');
  const [isAnnouncementInput, setIsAnnouncementInput] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | undefined>(undefined);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');

  // New Group Form State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState<CoordinationGroup['category']>('Worship');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [newGroupIsPrivate, setNewGroupIsPrivate] = useState(false);
  const [newGroupColor, setNewGroupColor] = useState('bg-blue-600');

  // Selected group object
  const activeGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const activeMessages = messages.filter((m) => m.groupId === activeGroup?.id);

  // Filter groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || g.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeGroup) return;
    onSendMessage(
      activeGroup.id,
      messageInput.trim(),
      isAnnouncementInput,
      attachmentName
    );
    setMessageInput('');
    setIsAnnouncementInput(false);
    setAttachmentName(undefined);
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onCreateGroup({
      name: newGroupName.trim(),
      category: newGroupCategory,
      description: newGroupDescription.trim(),
      avatarBg: newGroupColor,
      memberIds: [currentMember.id],
      isPrivate: newGroupIsPrivate,
      createdBy: `${currentMember.firstName} ${currentMember.lastName}`,
    });
    setNewGroupName('');
    setNewGroupDescription('');
    setShowCreateModal(false);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeGroup) return;
    onInviteToGroup(activeGroup.id, inviteEmail.trim());
    setInviteSuccessMsg(`Invitation sent to ${inviteEmail} for group ${activeGroup.name}`);
    setInviteEmail('');
    setTimeout(() => {
      setInviteSuccessMsg('');
      setShowInviteModal(false);
    }, 2000);
  };

  const categoryColors: Record<string, string> = {
    Worship: 'bg-blue-100 text-blue-700',
    Youth: 'bg-amber-100 text-amber-700',
    Leadership: 'bg-emerald-100 text-emerald-700',
    Facilities: 'bg-indigo-100 text-indigo-700',
    Hospitality: 'bg-rose-100 text-rose-700',
    General: 'bg-slate-100 text-slate-700',
  };

  const bgOptions = [
    'bg-blue-600',
    'bg-amber-500',
    'bg-emerald-600',
    'bg-indigo-600',
    'bg-rose-600',
    'bg-purple-600',
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Welcome & Team Coordination Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <MessageSquare className="w-4 h-4" />
            Ministry Coordination Hub & Group Messenger
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            WhatsApp-Style Team Groups
          </h2>
          <p className="text-slate-300 text-xs max-w-2xl">
            Real-time chat, song sheet coordination, roster announcements, and team discussion groups for Worship, Youth, Pastors, and Volunteers.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Invite via Email</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Group</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Group List Left, Active Chat Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[500px] lg:h-[680px]">
        {/* Left Groups List Sidebar (4 Cols) */}
        <div
          className={`lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden ${
            selectedGroupId ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team groups..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-medium no-scrollbar">
              {['All', 'Worship', 'Youth', 'Leadership', 'Facilities', 'Hospitality'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md shrink-0 transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                const isSelected = group.id === activeGroup?.id;
                const groupMsgs = messages.filter((m) => m.groupId === group.id);
                const lastMsg = groupMsgs[groupMsgs.length - 1];

                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${group.avatarBg} text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-sm`}
                    >
                      {group.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          {group.name}
                          {group.isPrivate && (
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          )}
                        </h4>
                        {lastMsg && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {lastMsg.timestamp.includes('Today') ? 'Today' : 'Yesterday'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 truncate mb-1">
                        {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : group.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            categoryColors[group.category] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {group.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Users className="w-3 h-3" />
                          {group.memberIds.length} members
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No groups found matching filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Active Chat Window (8 Cols) */}
        {activeGroup ? (
          <div
            className={`lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden ${
              !selectedGroupId ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Group Chat Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white z-10 shadow-2xs">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedGroupId('')}
                  className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                  title="Back to Groups"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${activeGroup.avatarBg} text-white font-bold flex items-center justify-center shadow-xs text-sm sm:text-base shrink-0`}
                >
                  {activeGroup.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 truncate">
                    <span className="truncate">{activeGroup.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        categoryColors[activeGroup.category] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {activeGroup.category}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                    <span className="truncate">{activeGroup.description}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-700 shrink-0">{activeGroup.memberIds.length} Members</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  title="Invite via email"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Invite</span>
                </button>
                <button
                  onClick={() => setShowGroupDetails(!showGroupDetails)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Group Info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pinned Announcement Banner if available */}
            {activeGroup.pinnedAnnouncement && (
              <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 font-medium">
                  <Megaphone className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{activeGroup.pinnedAnnouncement}</span>
                </div>
                <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider shrink-0">Pinned</span>
              </div>
            )}

            {/* Messages Feed Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
              {activeMessages.length > 0 ? (
                activeMessages.map((msg) => {
                  const isMe = msg.senderId === currentMember.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        isMe ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 text-white ${
                          isMe ? 'bg-blue-600' : 'bg-slate-700'
                        }`}
                      >
                        {msg.senderName.charAt(0)}
                      </div>

                      <div
                        className={`max-w-md rounded-2xl p-4 shadow-2xs space-y-1.5 ${
                          msg.isAnnouncement
                            ? 'bg-amber-50 border border-amber-200 text-slate-900'
                            : isMe
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[11px]">
                          <span
                            className={`font-bold ${
                              msg.isAnnouncement
                                ? 'text-amber-900'
                                : isMe
                                ? 'text-blue-100'
                                : 'text-slate-900'
                            }`}
                          >
                            {msg.senderName} ({msg.senderRole})
                          </span>
                          <span
                            className={`text-[10px] ${
                              isMe ? 'text-blue-200' : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>

                        {msg.isAnnouncement && (
                          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            <Pin className="w-3 h-3" /> Official Announcement
                          </div>
                        )}

                        <p className="text-xs whitespace-pre-wrap leading-relaxed">
                          {msg.text}
                        </p>

                        {msg.attachmentName && (
                          <div
                            className={`p-2 rounded-lg flex items-center gap-2 text-xs font-medium ${
                              isMe
                                ? 'bg-blue-700 text-white'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                            }`}
                          >
                            <Paperclip className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate flex-1">{msg.attachmentName}</span>
                            <span className="text-[10px] opacity-80 uppercase">Attachment</span>
                          </div>
                        )}

                        {/* Reaction Pills */}
                        <div className="flex items-center gap-1.5 pt-1">
                          {msg.reactions?.map((r, idx) => (
                            <button
                              key={idx}
                              onClick={() => onToggleReaction(msg.id, r.emoji, currentMember.id)}
                              className={`text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 border transition-colors ${
                                r.users.includes(currentMember.id)
                                  ? 'bg-blue-100 border-blue-300 text-blue-800 font-bold'
                                  : isMe
                                  ? 'bg-blue-700 border-blue-500 text-white'
                                  : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span>{r.count}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => onToggleReaction(msg.id, '🙌', currentMember.id)}
                            className={`text-[11px] px-1.5 py-0.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors ${
                              isMe ? 'hover:bg-blue-700 text-blue-200' : ''
                            }`}
                            title="Add reaction"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2 text-slate-400">
                  <MessageSquare className="w-8 h-8 text-slate-300" />
                  <p className="text-xs font-medium">No messages yet in {activeGroup.name}.</p>
                  <p className="text-[11px] text-slate-400">Be the first to start coordinating with your team!</p>
                </div>
              )}
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 space-y-2">
              {attachmentName && (
                <div className="flex items-center justify-between text-xs bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Paperclip className="w-3.5 h-3.5 text-blue-600" /> Attached: {attachmentName}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachmentName(undefined)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAttachmentName('Ministry_Notice_Doc.pdf')}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Attach file or song sheet"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeGroup.name}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-medium"
                />

                <label className="flex items-center gap-1 text-[11px] text-slate-600 font-medium cursor-pointer px-2 py-1 rounded hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={isAnnouncementInput}
                    onChange={(e) => setIsAnnouncementInput(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Announcement</span>
                </label>

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center p-8 text-center text-slate-400 text-sm">
            Select a group to start messaging.
          </div>
        )}
      </div>

      {/* Modal 1: Create New Group */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Create Coordination Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Deacons & Prayer Volunteers"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ministry Category</label>
                <select
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="Worship">Worship</option>
                  <option value="Youth">Youth</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Purpose</label>
                <textarea
                  rows={2}
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  placeholder="What will team members coordinate in this group?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Avatar Color Theme</label>
                <div className="flex items-center gap-2">
                  {bgOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewGroupColor(color)}
                      className={`w-7 h-7 rounded-full ${color} transition-transform ${
                        newGroupColor === color ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newGroupIsPrivate}
                  onChange={(e) => setNewGroupIsPrivate(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPrivate" className="font-semibold text-slate-700 cursor-pointer">
                  Private Group (Only invited members can view chat)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Invite via Email */}
      {showInviteModal && activeGroup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Invite Member via Email</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {inviteSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
                <p className="text-slate-500">
                  Send an email invitation to join <strong className="text-slate-900">{activeGroup.name}</strong> group chat.
                </p>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="volunteer@church.org"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-800">Generated Direct Join Link:</p>
                  <p className="text-[11px] text-blue-600 font-mono break-all">
                    https://gracecommunity.app/groups/join?code=GCC-GRP-{activeGroup.id.toUpperCase()}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
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
                    Send Email Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
