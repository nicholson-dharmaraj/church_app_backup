import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  UserPlus,
  Receipt,
  CalendarPlus,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  Menu,
} from 'lucide-react';
import { ActiveTab, ChurchProfile } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  churchProfile: ChurchProfile;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenQuickAdd: (type: 'member' | 'expense' | 'event' | 'roster') => void;
  pendingExpenseCount: number;
  upcomingEventCount: number;
  maintenanceCount: number;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  churchProfile,
  searchTerm,
  setSearchTerm,
  onOpenQuickAdd,
  pendingExpenseCount,
  upcomingEventCount,
  maintenanceCount,
  onToggleMobileMenu,
}) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Operational Dashboard';
      case 'members':
        return 'Members Directory';
      case 'finances':
        return 'Finance Management';
      case 'ministries':
        return 'Ministries & Rosters';
      case 'events':
        return 'Ministry Calendar';
      case 'groups':
        return 'Ministry Groups';
      case 'worship':
        return 'Worship Ministry';
      case 'assets':
        return 'Assets & Equipment';
      case 'pastoral':
        return 'Pastoral Care';
      case 'permissions':
        return 'Invites & Roles';
      case 'settings':
        return 'Administration Settings';
      default:
        return 'Operational Dashboard';
    }
  };

  const totalNotifications = pendingExpenseCount + maintenanceCount;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Mobile Menu & Title & Badge */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200 hover:bg-slate-50 shrink-0 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h2 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight truncate">
          {getTitle()}
        </h2>
        <span className="hidden sm:inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide shrink-0">
          Internal Only
        </span>
      </div>

      {/* Actions & Search */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="relative w-32 sm:w-56 md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="w-full bg-slate-50 border border-slate-200 rounded pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3 py-2 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:bg-slate-50 relative transition-colors flex items-center gap-1.5"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            {totalNotifications > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 text-xs"
              onMouseLeave={() => setShowNotifications(false)}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Alerts & System Tasks</span>
                <span className="text-[10px] text-slate-400 font-medium">{totalNotifications} Active</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {pendingExpenseCount > 0 ? (
                  <div className="p-3 hover:bg-slate-50 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {pendingExpenseCount} Pending Expense Approvals
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Requires treasurer review in Finances.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 text-slate-500 flex items-center gap-2 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    All expense claims up to date.
                  </div>
                )}

                {maintenanceCount > 0 && (
                  <div className="p-3 hover:bg-slate-50 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {maintenanceCount} Asset Maintenance Reminders
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Check equipment inventory for scheduled servicing.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Entry</span>
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowQuickMenu(false)}
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Create
              </div>
              <button
                onClick={() => {
                  onOpenQuickAdd('member');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>New Member Entry</span>
              </button>

              <button
                onClick={() => {
                  onOpenQuickAdd('expense');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>Log Expense Claim</span>
              </button>

              <button
                onClick={() => {
                  onOpenQuickAdd('event');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <CalendarPlus className="w-4 h-4 text-emerald-600" />
                <span>Schedule Event</span>
              </button>

              <button
                onClick={() => {
                  onOpenQuickAdd('roster');
                  setShowQuickMenu(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span>New Roster</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
