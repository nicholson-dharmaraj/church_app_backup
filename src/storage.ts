import {
  Member,
  Family,
  DepartmentBudget,
  Expense,
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
  RolePermissions,
  CoordinationGroup,
  GroupMessage,
  SystemRole,
  WorshipSong,
  WorshipPracticeGroup,
} from './types';

import {
  initialMembers,
  initialFamilies,
  initialDepartmentBudgets,
  initialExpenses,
  initialVendors,
  initialMinistries,
  initialServiceRosters,
  initialChurchEvents,
  initialFacilities,
  initialAssets,
  initialPastoralNotes,
  initialPrayerRequests,
  initialChurchProfile,
  initialUserInvites,
  defaultRolePermissions,
  initialCoordinationGroups,
  initialGroupMessages,
  initialWorshipSongs,
  initialWorshipPracticeGroups,
} from './mockData';

const KEYS = {
  MEMBERS: 'church_central_members_v1',
  FAMILIES: 'church_central_families_v1',
  BUDGETS: 'church_central_budgets_v1',
  EXPENSES: 'church_central_expenses_v1',
  VENDORS: 'church_central_vendors_v1',
  MINISTRIES: 'church_central_ministries_v1',
  ROSTERS: 'church_central_rosters_v1',
  EVENTS: 'church_central_events_v1',
  FACILITIES: 'church_central_facilities_v1',
  ASSETS: 'church_central_assets_v1',
  PASTORAL: 'church_central_pastoral_v1',
  PRAYERS: 'church_central_prayers_v1',
  PROFILE: 'church_central_profile_v1',
  USER_INVITES: 'church_central_user_invites_v1',
  ROLE_PERMISSIONS: 'church_central_role_permissions_v1',
  GROUPS: 'church_central_groups_v1',
  MESSAGES: 'church_central_messages_v1',
  WORSHIP_SONGS: 'church_central_worship_songs_v1',
  WORSHIP_GROUPS: 'church_central_worship_groups_v1',
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

export function loadChurchData() {
  return {
    profile: getStored<ChurchProfile>(KEYS.PROFILE, initialChurchProfile),
    members: getStored<Member[]>(KEYS.MEMBERS, initialMembers),
    families: getStored<Family[]>(KEYS.FAMILIES, initialFamilies),
    budgets: getStored<DepartmentBudget[]>(KEYS.BUDGETS, initialDepartmentBudgets),
    expenses: getStored<Expense[]>(KEYS.EXPENSES, initialExpenses),
    vendors: getStored<Vendor[]>(KEYS.VENDORS, initialVendors),
    ministries: getStored<Ministry[]>(KEYS.MINISTRIES, initialMinistries),
    rosters: getStored<ServiceRoster[]>(KEYS.ROSTERS, initialServiceRosters),
    events: getStored<ChurchEvent[]>(KEYS.EVENTS, initialChurchEvents),
    facilities: getStored<Facility[]>(KEYS.FACILITIES, initialFacilities),
    assets: getStored<Asset[]>(KEYS.ASSETS, initialAssets),
    pastoralNotes: getStored<PastoralCareNote[]>(KEYS.PASTORAL, initialPastoralNotes),
    prayerRequests: getStored<PrayerRequest[]>(KEYS.PRAYERS, initialPrayerRequests),
    userInvites: getStored<UserInvite[]>(KEYS.USER_INVITES, initialUserInvites),
    rolePermissions: getStored<Record<SystemRole, RolePermissions>>(KEYS.ROLE_PERMISSIONS, defaultRolePermissions),
    coordinationGroups: getStored<CoordinationGroup[]>(KEYS.GROUPS, initialCoordinationGroups),
    groupMessages: getStored<GroupMessage[]>(KEYS.MESSAGES, initialGroupMessages),
    worshipSongs: getStored<WorshipSong[]>(KEYS.WORSHIP_SONGS, initialWorshipSongs),
    worshipPracticeGroups: getStored<WorshipPracticeGroup[]>(KEYS.WORSHIP_GROUPS, initialWorshipPracticeGroups),
  };
}

export function saveChurchProfile(profile: ChurchProfile) {
  setStored(KEYS.PROFILE, profile);
}

export function saveMembers(members: Member[]) {
  setStored(KEYS.MEMBERS, members);
}

export function saveFamilies(families: Family[]) {
  setStored(KEYS.FAMILIES, families);
}

export function saveBudgets(budgets: DepartmentBudget[]) {
  setStored(KEYS.BUDGETS, budgets);
}

export function saveExpenses(expenses: Expense[]) {
  setStored(KEYS.EXPENSES, expenses);
}

export function saveVendors(vendors: Vendor[]) {
  setStored(KEYS.VENDORS, vendors);
}

export function saveMinistries(ministries: Ministry[]) {
  setStored(KEYS.MINISTRIES, ministries);
}

export function saveRosters(rosters: ServiceRoster[]) {
  setStored(KEYS.ROSTERS, rosters);
}

export function saveEvents(events: ChurchEvent[]) {
  setStored(KEYS.EVENTS, events);
}

export function saveFacilities(facilities: Facility[]) {
  setStored(KEYS.FACILITIES, facilities);
}

export function saveAssets(assets: Asset[]) {
  setStored(KEYS.ASSETS, assets);
}

export function savePastoralNotes(notes: PastoralCareNote[]) {
  setStored(KEYS.PASTORAL, notes);
}

export function savePrayerRequests(requests: PrayerRequest[]) {
  setStored(KEYS.PRAYERS, requests);
}

export function saveUserInvites(invites: UserInvite[]) {
  setStored(KEYS.USER_INVITES, invites);
}

export function saveRolePermissions(permissions: Record<SystemRole, RolePermissions>) {
  setStored(KEYS.ROLE_PERMISSIONS, permissions);
}

export function saveCoordinationGroups(groups: CoordinationGroup[]) {
  setStored(KEYS.GROUPS, groups);
}

export function saveGroupMessages(messages: GroupMessage[]) {
  setStored(KEYS.MESSAGES, messages);
}

export function saveWorshipSongs(songs: WorshipSong[]) {
  setStored(KEYS.WORSHIP_SONGS, songs);
}

export function saveWorshipPracticeGroups(groups: WorshipPracticeGroup[]) {
  setStored(KEYS.WORSHIP_GROUPS, groups);
}

export function resetAllChurchData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
