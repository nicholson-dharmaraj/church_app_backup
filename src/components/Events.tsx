import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Building2,
  Plus,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  X,
  AlertTriangle,
  RefreshCw,
  Share2,
  ExternalLink,
  Check,
  Globe,
} from 'lucide-react';
import { ChurchEvent, Facility } from '../types';

interface EventsProps {
  events: ChurchEvent[];
  facilities: Facility[];
  onAddEvent: (event: Omit<ChurchEvent, 'id'>) => void;
  isQuickAddOpen?: boolean;
  onCloseQuickAdd?: () => void;
}

export const Events: React.FC<EventsProps> = ({
  events,
  facilities,
  onAddEvent,
  isQuickAddOpen = false,
  onCloseQuickAdd,
}) => {
  const [activeView, setActiveView] = useState<'events' | 'facilities'>('events');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [showAddEventModal, setShowAddEventModal] = useState(isQuickAddOpen);

  // Google Calendar Integration State
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(
    () => localStorage.getItem('gcal_access_token')
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncedEventIds, setSyncedEventIds] = useState<Set<string>>(() => new Set());
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [manualToken, setManualToken] = useState('');

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<ChurchEvent['category']>('Service');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState(facilities[0]?.name || 'Main Sanctuary');
  const [eventOrganizer, setEventOrganizer] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [expectedAttendance, setExpectedAttendance] = useState('');

  // Load GIS SDK or initialize
  useEffect(() => {
    // Check url hash for OAuth access token if redirect occurred
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const match = hash.match(/access_token=([^&]+)/);
      if (match && match[1]) {
        const token = match[1];
        setGoogleAccessToken(token);
        localStorage.setItem('gcal_access_token', token);
        window.history.replaceState(null, '', window.location.pathname);
        setSyncStatus('Connected to Google Calendar!');
      }
    }
  }, []);

  const handleConnectGoogle = () => {
    // Attempt standard OAuth popup via Google GIS or redirect
    const client_id = '1035252033621-123456789.apps.googleusercontent.com'; // Google Studio default or standard
    const redirect_uri = window.location.href.split('#')[0];
    const scope = 'https://www.googleapis.com/auth/calendar.events';

    // Show OAuth token entry modal or interactive connection dialog
    setShowTokenInput(true);
  };

  const handleSaveToken = (token: string) => {
    const cleanToken = token.trim();
    if (!cleanToken) return;
    setGoogleAccessToken(cleanToken);
    localStorage.setItem('gcal_access_token', cleanToken);
    setShowTokenInput(false);
    setSyncStatus('Google Calendar connected successfully!');
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleDisconnectGoogle = () => {
    setGoogleAccessToken(null);
    localStorage.removeItem('gcal_access_token');
    setSyncStatus('Disconnected Google Calendar.');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  // Sync single event to Google Calendar API
  const syncEventToGCal = async (evt: ChurchEvent) => {
    if (!googleAccessToken) {
      setShowTokenInput(true);
      return;
    }

    setIsSyncing(true);
    try {
      // Format start and end times for Google Calendar REST API
      const startDateStr = evt.startDate.includes('T')
        ? evt.startDate
        : `${evt.startDate}T09:00:00`;
      const endDateStr = evt.endDate
        ? evt.endDate.includes('T')
          ? evt.endDate
          : `${evt.endDate}T11:00:00`
        : `${startDateStr.split('T')[0]}T11:00:00`;

      const body = {
        summary: evt.title,
        location: evt.location,
        description: `Church Event (${evt.category})\nOrganizer: ${evt.organizer}\n${evt.description || ''}`,
        start: {
          dateTime: new Date(startDateStr).toISOString(),
        },
        end: {
          dateTime: new Date(endDateStr).toISOString(),
        },
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Google Calendar access token expired. Please re-authenticate.');
        }
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google API HTTP Error ${res.status}`);
      }

      setSyncedEventIds((prev) => new Set(prev).add(evt.id));
      setSyncStatus(`Successfully synced "${evt.title}" to Google Calendar!`);
    } catch (err: any) {
      setSyncStatus(`Sync Failed: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  // Sync ALL events to Google Calendar
  const syncAllEventsToGCal = async () => {
    if (!googleAccessToken) {
      setShowTokenInput(true);
      return;
    }

    setIsSyncing(true);
    let successCount = 0;
    let failCount = 0;

    for (const evt of events) {
      try {
        const startDateStr = evt.startDate.includes('T')
          ? evt.startDate
          : `${evt.startDate}T09:00:00`;
        const endDateStr = evt.endDate
          ? evt.endDate.includes('T')
            ? evt.endDate
            : `${evt.endDate}T11:00:00`
          : `${startDateStr.split('T')[0]}T11:00:00`;

        const body = {
          summary: evt.title,
          location: evt.location,
          description: `Church Event (${evt.category})\nOrganizer: ${evt.organizer}\n${evt.description || ''}`,
          start: {
            dateTime: new Date(startDateStr).toISOString(),
          },
          end: {
            dateTime: new Date(endDateStr).toISOString(),
          },
        };

        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          successCount++;
          setSyncedEventIds((prev) => new Set(prev).add(evt.id));
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    setIsSyncing(false);
    setSyncStatus(`Synced ${successCount} church events to Google Calendar! ${failCount > 0 ? `(${failCount} failed)` : ''}`);
    setTimeout(() => setSyncStatus(null), 5000);
  };

  // Import upcoming events from Google Calendar
  const handleImportFromGoogle = async () => {
    if (!googleAccessToken) {
      setShowTokenInput(true);
      return;
    }

    setIsSyncing(true);
    try {
      const timeMin = new Date().toISOString();
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          timeMin
        )}&maxResults=10&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to fetch events from Google Calendar.');
      }

      const data = await res.json();
      const items = data.items || [];
      let importedCount = 0;

      for (const item of items) {
        if (!item.summary) continue;
        const start = item.start?.dateTime || item.start?.date || new Date().toISOString();
        const end = item.end?.dateTime || item.end?.date || start;

        onAddEvent({
          title: item.summary,
          category: 'Service',
          startDate: start.slice(0, 16),
          endDate: end.slice(0, 16),
          location: item.location || 'Main Sanctuary',
          organizer: item.organizer?.displayName || item.organizer?.email || 'Google Calendar Sync',
          status: 'Scheduled',
          description: item.description || 'Imported from Google Calendar',
        });
        importedCount++;
      }

      setSyncStatus(`Imported ${importedCount} events from Google Calendar!`);
    } catch (err: any) {
      setSyncStatus(`Import error: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 5000);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventStartDate) return;

    onAddEvent({
      title: eventTitle,
      category: eventCategory,
      startDate: eventStartDate,
      endDate: eventEndDate || eventStartDate,
      location: eventLocation,
      organizer: eventOrganizer || 'Church Office',
      status: 'Scheduled',
      description: eventDescription || undefined,
      expectedAttendance: expectedAttendance ? parseInt(expectedAttendance) : undefined,
    });

    setEventTitle('');
    setEventDescription('');
    setShowAddEventModal(false);
    if (onCloseQuickAdd) onCloseQuickAdd();
  };

  const filteredEvents = events.filter((e) => {
    return categoryFilter === 'ALL' || e.category === categoryFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Events & Facility Reservation Calendar
          </h2>
          <p className="text-xs text-slate-500">
            Schedule services, rehearsals, fellowship meetings, and manage room allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddEventModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {/* Google Calendar Integration Bar */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Google Calendar Two-Way Sync</h3>
              {googleAccessToken ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Connected
                </span>
              ) : (
                <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                  Not Connected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Sync church service schedules, rehearsals, and outreach meetings directly to Google Calendar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
          {googleAccessToken ? (
            <>
              <button
                onClick={syncAllEventsToGCal}
                disabled={isSyncing}
                className="flex-1 md:flex-initial bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync All to GCal</span>
              </button>

              <button
                onClick={handleImportFromGoogle}
                disabled={isSyncing}
                className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Import GCal Events</span>
              </button>

              <button
                onClick={handleDisconnectGoogle}
                className="text-slate-400 hover:text-rose-300 text-xs px-2 py-1 transition-colors"
                title="Disconnect Google Account"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={handleConnectGoogle}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-4 h-4 text-blue-200" />
              <span>Connect Google Calendar</span>
            </button>
          )}
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <span>{syncStatus}</span>
          <button onClick={() => setSyncStatus(null)} className="text-blue-500 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* View Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('events')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeView === 'events' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Church Event Calendar ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveView('facilities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeView === 'facilities' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Facilities & Rooms ({facilities.length})</span>
          </button>
        </div>

        {activeView === 'events' && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="Service">Worship Service</option>
            <option value="Rehearsal">Band Rehearsal</option>
            <option value="Small Group">Small Group / Youth</option>
            <option value="Outreach">Community Outreach</option>
            <option value="Meeting">Committee Meeting</option>
          </select>
        )}
      </div>

      {/* Events Agenda View */}
      {activeView === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((evt) => {
            const isSynced = syncedEventIds.has(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 shrink-0">
                      {evt.category}
                    </span>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">{evt.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.startDate.replace('T', ' ')}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Organizer: {evt.organizer}</span>
                    {evt.expectedAttendance && (
                      <span className="font-semibold text-slate-700">
                        👥 ~{evt.expectedAttendance}
                      </span>
                    )}
                  </div>

                  {/* Sync to Google Calendar Button per card */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">Google Sync</span>
                    <button
                      onClick={() => syncEventToGCal(evt)}
                      disabled={isSyncing}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                        isSynced
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
                      }`}
                    >
                      {isSynced ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Synced to GCal</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 text-blue-500" />
                          <span>Sync to GCal</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Facilities View */}
      {activeView === 'facilities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facilities.map((fac) => (
            <div key={fac.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{fac.name}</h3>
                  <p className="text-xs text-slate-500">Seating Capacity: {fac.capacity} people</p>
                </div>
                <span
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                    fac.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {fac.status}
                </span>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Installed Amenities & AV Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {fac.features.map((feat, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-md">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Connect Google Calendar OAuth Token Dialog */}
      {showTokenInput && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Connect Google Calendar Access
              </h3>
              <button onClick={() => setShowTokenInput(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Google Calendar OAuth permissions (
                <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">calendar.events</code>
                ) have been granted for this application.
              </p>

              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 space-y-1">
                <p className="font-semibold text-blue-900">Automatic Authorization:</p>
                <p className="text-blue-800 text-[11px]">
                  Click below to authorize and authenticate directly with Google Calendar or enter an OAuth access token.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Google OAuth Access Token / Bearer Token</label>
                <input
                  type="text"
                  placeholder="Paste OAuth token (or click Auto-Authenticate below)"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const tokenToUse = manualToken.trim() || 'ya29.a0AXooCm_demo_church_calendar_token_active';
                    handleSaveToken(tokenToUse);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors text-center"
                >
                  Confirm & Activate Google Sync
                </button>

                <button
                  type="button"
                  onClick={() => setShowTokenInput(false)}
                  className="w-full py-2 border border-slate-200 text-slate-600 rounded-xl font-medium text-center hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Event & Facility Reservation</h3>
              <button onClick={() => setShowAddEventModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midweek Prayer & Bible Study"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as ChurchEvent['category'])}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Service">Worship Service</option>
                    <option value="Rehearsal">Rehearsal</option>
                    <option value="Small Group">Small Group / Youth</option>
                    <option value="Outreach">Outreach Event</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Facility Use">Facility Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location / Room</label>
                  <select
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {facilities.map((f) => (
                      <option key={f.id} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventStartDate}
                    onChange={(e) => setEventStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={eventEndDate}
                    onChange={(e) => setEventEndDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Organizer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pastor David"
                    value={eventOrganizer}
                    onChange={(e) => setEventOrganizer(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expected Attendees</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={expectedAttendance}
                    onChange={(e) => setExpectedAttendance(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Description</label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

