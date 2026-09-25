export type MemberRole = 'Member' | 'Regular Attender' | 'Visitor' | 'Leader' | 'Staff';
export type MemberStatus = 'Active' | 'Inactive' | 'Transferred';
export type FamilyRole = 'Head' | 'Spouse' | 'Child' | 'Other';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: MemberRole;
  status: MemberStatus;
  gender: 'Male' | 'Female';
  birthDate?: string;
  baptismDate?: string;
  familyId?: string;
  familyRole?: FamilyRole;
  ministryGroups: string[];
  joinedDate: string;
  notes?: string;
  avatarUrl?: string;
}

export interface Family {
  id: string;
  name: string;
  primaryContactId: string;
  primaryContactName: string;
  address: string;
  memberIds: string[];
}

export interface DepartmentBudget {
  id: string;
  departmentName: string;
  allocatedAmount: number;
  spentAmount: number;
  fiscalYear: string;
  code: string;
  color: string;
}

export type ExpenseCategory = 
  | 'Equipment & Tech' 
  | 'Utilities & Facilities' 
  | 'Maintenance & Repairs' 
  | 'Events & Supplies' 
  | 'Salaries & Staff' 
  | 'Software & Software' 
  | 'Missions Outflow' 
  | 'Hospitality & Care' 
  | 'Other';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected';

export interface Expense {
  id: string;
  title: string;
  department: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  vendor: string;
  requestedBy: string;
  status: ExpenseStatus;
  receiptRef?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  accountDetails?: string;
}

export interface Ministry {
  id: string;
  name: string;
  category: 'Worship' | 'Discipleship' | 'Children & Youth' | 'Operations & Tech' | 'Hospitality & Care';
  leaderId: string;
  leaderName: string;
  description: string;
  memberCount: number;
  meetingSchedule: string;
}

export interface RosterRole {
  roleName: string;
  assignedMemberId?: string;
  assignedMemberName?: string;
  status: 'Confirmed' | 'Pending' | 'Declined';
}

export interface ServiceRoster {
  id: string;
  date: string;
  serviceType: 'Sunday Morning Service' | 'Midweek Prayer' | 'Youth Fellowship' | 'Special Event';
  roles: RosterRole[];
  notes?: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  category: 'Service' | 'Rehearsal' | 'Small Group' | 'Facility Use' | 'Outreach' | 'Meeting';
  startDate: string; // ISO or YYYY-MM-DDTHH:mm
  endDate: string;
  location: string;
  organizer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  description?: string;
  expectedAttendance?: number;
}

export interface Facility {
  id: string;
  name: string;
  capacity: number;
  features: string[];
  status: 'Available' | 'Booked' | 'Maintenance';
}

export interface Asset {
  id: string;
  name: string;
  category: 'Audio/Visual' | 'Musical Instrument' | 'Furniture' | 'Vehicle' | 'IT Equipment';
  serialNumber?: string;
  purchaseDate: string;
  purchaseCost: number;
  location: string;
  condition: 'Excellent' | 'Good' | 'Needs Repair' | 'Retired';
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface PastoralCareNote {
  id: string;
  memberId: string;
  memberName: string;
  pastorName: string;
  date: string;
  type: 'Visitation' | 'Counseling' | 'Phone Call' | 'Hospital Visit' | 'Discipleship';
  summary: string;
  followUpDate?: string;
  isConfidential: boolean;
}

export interface PrayerRequest {
  id: string;
  title: string;
  requestedBy: string;
  memberId?: string;
  dateAdded: string;
  category: 'Health' | 'Family' | 'Spiritual' | 'Financial/Jobs' | 'General';
  status: 'Active' | 'Answered' | 'Archived';
  notes?: string;
}

export interface ChurchProfile {
  name: string;
  denomination: string;
  address: string;
  phone: string;
  email: string;
  leadPastor: string;
  website: string;
  taxId: string;
}

export type SystemRole = 
  | 'Administrator' 
  | 'Pastor / Minister' 
  | 'Treasurer / Finance' 
  | 'Department Leader' 
  | 'Member / Volunteer';

export interface RolePermissions {
  canManageMembers: boolean;
  canManageFinances: boolean;
  canManageRosters: boolean;
  canManageEvents: boolean;
  canManageAssets: boolean;
  canAccessPastoralCare: boolean;
  canManageGroups: boolean;
  canInviteUsers: boolean;
}

export interface UserInvite {
  id: string;
  email: string;
  name: string;
  role: SystemRole;
  status: 'Pending' | 'Accepted' | 'Expired';
  invitedBy: string;
  dateSent: string;
  accessGroups: string[];
  inviteCode: string;
  notes?: string;
}

export interface CoordinationGroup {
  id: string;
  name: string;
  category: 'Worship' | 'Youth' | 'Leadership' | 'Facilities' | 'Hospitality' | 'General';
  description: string;
  avatarBg: string;
  memberIds: string[];
  isPrivate: boolean;
  createdBy: string;
  createdDate: string;
  pinnedAnnouncement?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isAnnouncement?: boolean;
  attachmentName?: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface WorshipSong {
  id: string;
  title: string;
  artistAuthor: string;
  defaultKey: string;
  bpm?: number;
  ccliNumber?: string;
  themeTags: string[];
  chordSheetUrl?: string;
  audioLink?: string;
  lyricsPreview?: string;
}

export interface WorshipPracticeGroup {
  id: string;
  title: string;
  serviceDate: string;
  practiceTime: string;
  leaderName: string;
  assignedMemberIds: string[];
  songIds: string[];
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export type ActiveTab = 
  | 'dashboard' 
  | 'members' 
  | 'finances' 
  | 'ministries' 
  | 'events' 
  | 'groups'
  | 'worship'
  | 'assets' 
  | 'pastoral' 
  | 'permissions'
  | 'settings';
