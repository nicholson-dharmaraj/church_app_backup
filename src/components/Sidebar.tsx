import React from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Users2,
  Calendar,
  Box,
  HeartHandshake,
  Settings,
  Building2,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  KeyRound,
  X,
  Music,
} from 'lucide-react';
import { ActiveTab, ChurchProfile } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  churchProfile: ChurchProfile;
  pendingExpenseCount: number;
  unconfirmedRosterCount: number;
  unreadMessagesCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  churchProfile,
  pendingExpenseCount,
  unconfirmedRosterCount,
  unreadMessagesCount = 3,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    {
      id: 'finances',
      label: 'Finance Management',
      icon: Wallet,
      badge: pendingExpenseCount > 0 ? pendingExpenseCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'ministries',
      label: 'Ministries & Rosters',
      icon: Users2,
      badge: unconfirmedRosterCount > 0 ? unconfirmedRosterCount : undefined,
      badgeColor: 'bg-blue-500 text-white',
    },
    { id: 'events', label: 'Ministry Calendar', icon: Calendar },
    {
      id: 'groups',
      label: 'Ministry Groups',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-emerald-500 text-white',
    },
    { id: 'worship', label: 'Worship', icon: Music },
    { id: 'assets', label: 'Assets & Equipment', icon: Box },
    { id: 'pastoral', label: 'Pastoral Care', icon: HeartHandshake },
    { id: 'permissions', label: 'Invites & Roles', icon: KeyRound },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 lg:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-xs shrink-0">
            {churchProfile.name ? churchProfile.name.charAt(0) : 'C'}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-white font-semibold text-base lg:text-lg tracking-tight truncate leading-tight">
              {churchProfile.name || 'ChurchCentral'}
            </h1>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 lg:py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white bg-slate-800'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-5 h-5 opacity-80 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Pastor Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white font-medium italic shrink-0">
            {churchProfile.leadPastor
              ? churchProfile.leadPastor
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
              : 'PJ'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white text-sm font-medium truncate">
              {churchProfile.leadPastor || 'Pastor James'}
            </span>
            <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">
              Administrator
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 flex-col h-screen sticky top-0 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-slate-900 h-full shadow-2xl flex flex-col z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
