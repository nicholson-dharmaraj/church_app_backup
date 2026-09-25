import React, { useState } from 'react';
import {
  Music,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Users,
  Search,
  BookOpen,
  FileText,
  ExternalLink,
  Tag,
  CheckCircle2,
  X,
  ListMusic,
  Play,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { WorshipSong, WorshipPracticeGroup, Member } from '../types';

interface WorshipProps {
  songs: WorshipSong[];
  practiceGroups: WorshipPracticeGroup[];
  members: Member[];
  onAddSong: (song: Omit<WorshipSong, 'id'>) => void;
  onDeleteSong: (id: string) => void;
  onCreatePracticeGroup: (group: Omit<WorshipPracticeGroup, 'id'>) => void;
  onDeletePracticeGroup: (id: string) => void;
  onUpdatePracticeGroupSongs: (groupId: string, songIds: string[]) => void;
}

export const Worship: React.FC<WorshipProps> = ({
  songs,
  practiceGroups,
  members,
  onAddSong,
  onDeleteSong,
  onCreatePracticeGroup,
  onDeletePracticeGroup,
  onUpdatePracticeGroupSongs,
}) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'database'>('groups');
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('ALL');

  // Modals state
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState<WorshipPracticeGroup | null>(null);

  // New Group Form State
  const [groupTitle, setGroupTitle] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [practiceTime, setPracticeTime] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [groupNotes, setGroupNotes] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);

  // New Song Form State
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songKey, setSongKey] = useState('G Major');
  const [songBpm, setSongBpm] = useState('');
  const [songCcli, setSongCcli] = useState('');
  const [songTags, setSongTags] = useState('Praise, Worship');
  const [chordSheetUrl, setChordSheetUrl] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [lyricsPreview, setLyricsPreview] = useState('');

  // Extract unique tags across all songs
  const allTags = Array.from(new Set(songs.flatMap((s) => s.themeTags || [])));

  // Filtered songs
  const filteredSongs = songs.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.artistAuthor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.defaultKey.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === 'ALL' || s.themeTags.includes(tagFilter);
    return matchesSearch && matchesTag;
  });

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle || !serviceDate) return;

    onCreatePracticeGroup({
      title: groupTitle,
      serviceDate,
      practiceTime: practiceTime || '7:00 PM',
      leaderName: leaderName || 'Worship Leader',
      assignedMemberIds: selectedMemberIds,
      songIds: selectedSongIds,
      notes: groupNotes,
      status: 'Upcoming',
    });

    // Reset form
    setGroupTitle('');
    setServiceDate('');
    setPracticeTime('');
    setLeaderName('');
    setGroupNotes('');
    setSelectedMemberIds([]);
    setSelectedSongIds([]);
    setShowCreateGroupModal(false);
  };

  const handleAddSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle || !songArtist) return;

    onAddSong({
      title: songTitle,
      artistAuthor: songArtist,
      defaultKey: songKey,
      bpm: songBpm ? parseInt(songBpm, 10) : undefined,
      ccliNumber: songCcli || undefined,
      themeTags: songTags.split(',').map((t) => t.trim()).filter(Boolean),
      chordSheetUrl: chordSheetUrl || undefined,
      audioLink: audioLink || undefined,
      lyricsPreview: lyricsPreview || undefined,
    });

    setSongTitle('');
    setSongArtist('');
    setSongKey('G Major');
    setSongBpm('');
    setSongCcli('');
    setSongTags('Praise, Worship');
    setChordSheetUrl('');
    setAudioLink('');
    setLyricsPreview('');
    setShowAddSongModal(false);
  };

  const toggleMemberSelection = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleSongSelection = (id: string) => {
    setSelectedSongIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleToggleSongInGroup = (groupId: string, songId: string) => {
    const group = practiceGroups.find((g) => g.id === groupId);
    if (!group) return;
    const isLinked = group.songIds.includes(songId);
    const updatedSongs = isLinked
      ? group.songIds.filter((id) => id !== songId)
      : [...group.songIds, songId];
    onUpdatePracticeGroupSongs(groupId, updatedSongs);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Music className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Worship Ministry
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Coordinate weekly practice groups, assign setlists, and manage songs and worship resources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'groups' ? (
            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Practice Group</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddSongModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Song to Database</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Switcher & Display Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'groups'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Practice Groups ({practiceGroups.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'database'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Song Database ({songs.length})</span>
          </button>
        </div>

        {/* Display Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 self-start sm:self-auto">
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
      </div>

      {/* TAB 1: PRACTICE GROUPS & WEEKLY COORDINATION */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {practiceGroups.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Music className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Practice Groups Created Yet</h3>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Create a practice group for this week's service to coordinate musicians, singers, and link setlist songs.
              </p>
              <button
                onClick={() => setShowCreateGroupModal(true)}
                className="mt-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700"
              >
                + Create First Practice Group
              </button>
            </div>
          ) : displayMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {practiceGroups.map((group) => {
                const linkedSongs = songs.filter((s) => group.songIds.includes(s.id));
                const teamMembers = members.filter((m) => group.assignedMemberIds.includes(m.id));

                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Group Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            Weekly Practice Group
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-1">{group.title}</h3>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete practice group "${group.title}"?`)) {
                              onDeletePracticeGroup(group.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Practice Group"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Info badges */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span>{group.serviceDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{group.practiceTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-medium">
                          <Users className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Leader: {group.leaderName}</span>
                        </div>
                      </div>

                      {group.notes && (
                        <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 text-amber-900">
                          📌 {group.notes}
                        </p>
                      )}

                      {/* Team Roster */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span>Assigned Worship Team ({teamMembers.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {teamMembers.length > 0 ? (
                            teamMembers.map((m) => (
                              <span
                                key={m.id}
                                className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-slate-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                {m.firstName} {m.lastName}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">No team members assigned yet.</span>
                          )}
                        </div>
                      </div>

                      {/* Linked Setlist Songs */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <ListMusic className="w-4 h-4 text-blue-600" />
                            Practice Setlist ({linkedSongs.length} Songs)
                          </span>
                        </div>

                        {linkedSongs.length > 0 ? (
                          <div className="space-y-1.5">
                            {linkedSongs.map((song, idx) => (
                              <div
                                key={song.id}
                                className="flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 p-2 rounded-xl text-xs border border-slate-200/80 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <div className="truncate">
                                    <span className="font-bold text-slate-800 block truncate">
                                      {song.title}
                                    </span>
                                    <span className="text-[10px] text-slate-500 truncate">
                                      {song.artistAuthor}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="bg-blue-100 text-blue-800 font-semibold text-[10px] px-2 py-0.5 rounded-md">
                                    {song.defaultKey}
                                  </span>
                                  <button
                                    onClick={() => handleToggleSongInGroup(group.id, song.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded"
                                    title="Remove from setlist"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs italic bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200 text-center">
                            No songs added to this setlist yet. Click below to attach songs from the database.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Add Song Dropdown */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleToggleSongInGroup(group.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="text-xs border border-slate-200 rounded-lg p-1.5 bg-slate-50 text-slate-700 font-medium w-full"
                      >
                        <option value="">+ Add Song to Setlist...</option>
                        {songs.map((s) => (
                          <option key={s.id} value={s.id} disabled={group.songIds.includes(s.id)}>
                            {s.title} ({s.defaultKey}) {group.songIds.includes(s.id) ? '✓ Attached' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View for Practice Groups */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Group Title</th>
                      <th className="p-3.5">Service Date</th>
                      <th className="p-3.5">Schedule Time</th>
                      <th className="p-3.5">Leader</th>
                      <th className="p-3.5">Assigned Team</th>
                      <th className="p-3.5">Setlist Songs</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {practiceGroups.map((group) => {
                      const linkedSongs = songs.filter((s) => group.songIds.includes(s.id));
                      const teamMembers = members.filter((m) => group.assignedMemberIds.includes(m.id));
                      return (
                        <tr key={group.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{group.title}</td>
                          <td className="p-3.5 text-slate-700 font-medium">{group.serviceDate}</td>
                          <td className="p-3.5 text-slate-600">{group.practiceTime}</td>
                          <td className="p-3.5 font-medium text-slate-800">{group.leaderName}</td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {teamMembers.map((m) => (
                                <span key={m.id} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] rounded-md font-medium">
                                  {m.firstName} {m.lastName}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1 max-w-[220px]">
                              {linkedSongs.map((s) => (
                                <span key={s.id} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-md font-bold border border-blue-100">
                                  {s.title} ({s.defaultKey})
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete practice group "${group.title}"?`)) {
                                  onDeletePracticeGroup(group.id);
                                }
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                              title="Delete Group"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SONG & RESOURCE DATABASE */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Search & Tag Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by song title, artist, key..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Tag:</span>
                <button
                  onClick={() => setTagFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    tagFilter === 'ALL'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      tagFilter === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Songs List: Cards vs Table */}
          {displayMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSongs.map((song) => (
                <div
                  key={song.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{song.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0">
                        Key: {song.defaultKey}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">By {song.artistAuthor}</p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {song.bpm && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                          ⏱ {song.bpm} BPM
                        </span>
                      )}
                      {song.ccliNumber && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                          CCLI #: {song.ccliNumber}
                        </span>
                      )}
                    </div>

                    {song.themeTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {song.themeTags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-medium text-slate-600 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {song.lyricsPreview && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-3">
                        "{song.lyricsPreview}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {song.chordSheetUrl && (
                          <a
                            href={song.chordSheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-semibold text-[11px] flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" /> Chords
                          </a>
                        )}
                        {song.audioLink && (
                          <a
                            href={song.audioLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" /> Audio
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete song "${song.title}" from database?`)) {
                            onDeleteSong(song.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Delete Song"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View for Songs */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Song Title</th>
                      <th className="p-3.5">Artist / Author</th>
                      <th className="p-3.5">Default Key</th>
                      <th className="p-3.5">BPM</th>
                      <th className="p-3.5">CCLI #</th>
                      <th className="p-3.5">Theme Tags</th>
                      <th className="p-3.5">Resources</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSongs.map((song) => (
                      <tr key={song.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{song.title}</td>
                        <td className="p-3.5 font-medium text-slate-700">{song.artistAuthor}</td>
                        <td className="p-3.5">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {song.defaultKey}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium">{song.bpm ? `${song.bpm} BPM` : '—'}</td>
                        <td className="p-3.5 text-slate-500">{song.ccliNumber || '—'}</td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {song.themeTags.map((t) => (
                              <span key={t} className="text-[10px] bg-sky-50 text-sky-700 font-medium border border-sky-100 px-1.5 py-0.5 rounded-md">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            {song.chordSheetUrl && (
                              <a href={song.chordSheetUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold text-[11px] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Chords
                              </a>
                            )}
                            {song.audioLink && (
                              <a href={song.audioLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold text-[11px] flex items-center gap-1">
                                <Play className="w-3 h-3" /> Audio
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete song "${song.title}" from database?`)) {
                                onDeleteSong(song.id);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md"
                            title="Delete Song"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: CREATE PRACTICE GROUP */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Create Weekly Practice Group
              </h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Practice Group Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Morning Service Rehearsal - Aug 10"
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Service Date *</label>
                  <input
                    type="date"
                    required
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Practice Schedule / Time</label>
                  <input
                    type="text"
                    placeholder="e.g. Thursday 7:00 PM - 9:00 PM"
                    value={practiceTime}
                    onChange={(e) => setPracticeTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Worship Leader</label>
                <input
                  type="text"
                  placeholder="e.g. Michael Chen"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              {/* Select Members */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign Team Members</label>
                <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50">
                  {members.map((m) => (
                    <label key={m.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 rounded">
                      <input
                        type="checkbox"
                        checked={selectedMemberIds.includes(m.id)}
                        onChange={() => toggleMemberSelection(m.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        {m.firstName} {m.lastName} ({m.role})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Select Songs for Initial Setlist */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attach Setlist Songs</label>
                <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50">
                  {songs.map((s) => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-100 rounded">
                      <input
                        type="checkbox"
                        checked={selectedSongIds.includes(s.id)}
                        onChange={() => toggleSongSelection(s.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>
                        {s.title} ({s.defaultKey}) - {s.artistAuthor}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rehearsal Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please learn the bridges beforehand; soundcheck starts 15 mins early."
                  value={groupNotes}
                  onChange={(e) => setGroupNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Create Practice Group
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SONG TO DATABASE */}
      {showAddSongModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Add Song to Database
              </h3>
              <button onClick={() => setShowAddSongModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSongSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great Are You Lord"
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Artist / Author *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All Sons & Daughters"
                  value={songArtist}
                  onChange={(e) => setSongArtist(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Default Key</label>
                  <select
                    value={songKey}
                    onChange={(e) => setSongKey(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  >
                    <option value="C Major">C Major</option>
                    <option value="D Major">D Major</option>
                    <option value="E Major">E Major</option>
                    <option value="F Major">F Major</option>
                    <option value="G Major">G Major</option>
                    <option value="A Major">A Major</option>
                    <option value="B Major">B Major</option>
                    <option value="B♭ Major">B♭ Major</option>
                    <option value="E♭ Major">E♭ Major</option>
                    <option value="A Minor">A Minor</option>
                    <option value="E Minor">E Minor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">BPM</label>
                  <input
                    type="number"
                    placeholder="72"
                    value={songBpm}
                    onChange={(e) => setSongBpm(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CCLI #</label>
                  <input
                    type="text"
                    placeholder="6460220"
                    value={songCcli}
                    onChange={(e) => setSongCcli(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Theme Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Praise, Worship, Holiness, Grace"
                  value={songTags}
                  onChange={(e) => setSongTags(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chord Sheet Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://praisecharts.com/..."
                    value={chordSheetUrl}
                    onChange={(e) => setChordSheetUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audio / Video Link (URL)</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={audioLink}
                    onChange={(e) => setAudioLink(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lyrics Preview / Chorus</label>
                <textarea
                  rows={2}
                  placeholder="It's Your breath in our lungs, so we pour out our praise..."
                  value={lyricsPreview}
                  onChange={(e) => setLyricsPreview(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Song to Database
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSongModal(false)}
                  className="py-2.5 px-4 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
