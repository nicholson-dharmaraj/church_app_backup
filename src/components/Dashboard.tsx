import React from 'react';
import {
  Users,
  Wallet,
  Receipt,
  Calendar,
  Clock,
  ArrowUpRight,
  UserPlus,
  Building2,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Member,
  DepartmentBudget,
  Expense,
  ServiceRoster,
  ChurchEvent,
  PastoralCareNote,
  PrayerRequest,
  ActiveTab,
} from '../types';

interface DashboardProps {
  members: Member[];
  budgets: DepartmentBudget[];
  expenses: Expense[];
  rosters: ServiceRoster[];
  events: ChurchEvent[];
  pastoralNotes: PastoralCareNote[];
  prayerRequests: PrayerRequest[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickAdd: (type: 'member' | 'expense' | 'event' | 'roster') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  members,
  budgets,
  expenses,
  rosters,
  events,
  pastoralNotes,
  prayerRequests,
  setActiveTab,
  onOpenQuickAdd,
}) => {
  // Financial computations (Strictly management & expense tracking)
  const totalAllocatedBudget = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalExpensesPaid = expenses
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPendingExpenses = expenses
    .filter((e) => e.status === 'Pending')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenseCount = expenses.filter((e) => e.status === 'Pending').length;

  const activeMembers = members.filter((m) => m.status === 'Active');
  const upcomingRoster = rosters[0]; // Next upcoming service roster

  // Recharts Data Prep
  const budgetChartData = budgets.map((b) => ({
    name: b.departmentName.split('&')[0].trim(),
    Budget: b.allocatedAmount,
    Spent: b.spentAmount,
  }));

  // Expense by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
  const categoryPieData = Object.keys(categoryMap).map((cat) => ({
    name: cat,
    value: categoryMap[cat],
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Active Members Stat Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Members</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeMembers.length}</h3>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            {members.filter((m) => m.role === 'Member').length} Full Members • {members.filter((m) => m.role === 'Regular Attender').length} Attenders
          </p>
        </div>

        {/* Operational Budget Stat Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Operational Budget</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalAllocatedBudget.toLocaleString()}</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Across {budgets.length} Departments
          </p>
        </div>

        {/* Operations Expenses Stat Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Operations Expenses</p>
            <h3 className="text-2xl font-bold text-slate-900">${totalExpensesPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">
            {Math.round((totalExpensesPaid / (totalAllocatedBudget || 1)) * 100)}% Budget Utilized
          </p>
        </div>

        {/* Pending Review Claims Stat Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Claims</p>
            <h3 className="text-2xl font-bold text-slate-900">{pendingExpenseCount}</h3>
          </div>
          <p className="text-xs text-amber-600 font-medium mt-1">
            ${totalPendingExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })} Awaiting Review
          </p>
        </div>
      </div>

      {/* Mid Section Grid: Recent Expense Table & Management Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expense Tracking & Disbursements Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="font-bold text-slate-800 text-base">Expense Tracking & Disbursements</h4>
            <button
              onClick={() => setActiveTab('finances')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 font-medium">
                {expenses.slice(0, 5).map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-slate-400 text-xs">{exp.date}</td>
                    <td className="px-6 py-3.5 text-slate-900">{exp.department}</td>
                    <td className="px-6 py-3.5 text-slate-700">{exp.description}</td>
                    <td className="px-6 py-3.5 text-slate-900 font-semibold">${exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : exp.status === 'Approved'
                            ? 'bg-blue-100 text-blue-700'
                            : exp.status === 'Pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {exp.status === 'Pending' ? 'Pending Review' : exp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facility Schedule & Management Tip Column */}
        <div className="flex flex-col gap-6">
          {/* Facility / Upcoming Schedule */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-base">Facility Schedule</h4>
              <button
                onClick={() => setActiveTab('events')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Calendar
              </button>
            </div>
            <div className="space-y-4">
              {events.slice(0, 3).map((evt, idx) => (
                <div key={evt.id} className="flex items-start gap-3">
                  <div className={`w-1 self-stretch rounded-full ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{evt.title}</p>
                    <p className="text-xs text-slate-500">{evt.location} • {evt.startDate.replace('T', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Management Tip Dark Card */}
          <div className="bg-slate-900 rounded-xl p-6 flex flex-col justify-center">
            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Management Tip</p>
            <p className="text-white text-sm italic">
              "All department expense claims and receipts for the Q3 operational budget should be reconciled weekly."
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Budget Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-base">Department Budget Allocation & Expenses</h4>
              <p className="text-xs text-slate-500 mt-0.5">Comparing allocated funds with logged actual disbursements</p>
            </div>
            <button
              onClick={() => setActiveTab('finances')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Finance Management <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => `$${val.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Allocated Budget" />
                <Bar dataKey="Spent" fill="#6366f1" radius={[4, 4, 0, 0]} name="Expenses Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Sunday Service Roster */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-800 text-base">Sunday Roster</h4>
              <button
                onClick={() => setActiveTab('ministries')}
                className="text-xs text-blue-600 font-semibold hover:underline"
              >
                Rosters
              </button>
            </div>
            {upcomingRoster ? (
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50 p-2 rounded">
                  <span>Date: {upcomingRoster.date}</span>
                  <span className="text-slate-800 font-bold">{upcomingRoster.serviceType}</span>
                </div>
                <div className="space-y-2">
                  {upcomingRoster.roles.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded border border-slate-100 text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{r.roleName}</p>
                        <p className="text-[11px] text-slate-500">{r.assignedMemberName || 'Unassigned'}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mt-2">No active roster scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
