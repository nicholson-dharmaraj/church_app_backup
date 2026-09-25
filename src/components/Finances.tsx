import React, { useState } from 'react';
import {
  Wallet,
  Receipt,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Download,
  Search,
  DollarSign,
  FileText,
  AlertCircle,
  Check,
  X,
  Building,
} from 'lucide-react';
import {
  DepartmentBudget,
  Expense,
  ExpenseCategory,
  ExpenseStatus,
  Vendor,
} from '../types';

interface FinancesProps {
  budgets: DepartmentBudget[];
  expenses: Expense[];
  vendors: Vendor[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpenseStatus: (id: string, status: ExpenseStatus) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id'>) => void;
  isQuickAddOpen?: boolean;
  onCloseQuickAdd?: () => void;
}

export const Finances: React.FC<FinancesProps> = ({
  budgets,
  expenses,
  vendors,
  onAddExpense,
  onUpdateExpenseStatus,
  onAddVendor,
  isQuickAddOpen = false,
  onCloseQuickAdd,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'budgets' | 'vendors'>('expenses');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(isQuickAddOpen);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);

  // Form states for new expense
  const [formTitle, setFormTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState(budgets[0]?.departmentName || '');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Equipment & Tech');
  const [formVendor, setFormVendor] = useState(vendors[0]?.name || '');
  const [formRequestedBy, setFormRequestedBy] = useState('');
  const [formReceiptRef, setFormReceiptRef] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Form states for new vendor
  const [vendorName, setVendorName] = useState('');
  const [vendorCategory, setVendorCategory] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorEmail, setVendorEmail] = useState('');
  const [vendorAccount, setVendorAccount] = useState('');

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formAmount) return;

    onAddExpense({
      title: formTitle,
      department: formDepartment,
      amount: parseFloat(formAmount),
      date: new Date().toISOString().split('T')[0],
      category: formCategory,
      vendor: formVendor,
      requestedBy: formRequestedBy || 'Church Administrator',
      status: 'Pending',
      receiptRef: formReceiptRef || undefined,
      notes: formNotes || undefined,
    });

    // reset
    setFormTitle('');
    setFormAmount('');
    setFormReceiptRef('');
    setFormNotes('');
    setShowAddExpenseModal(false);
    if (onCloseQuickAdd) onCloseQuickAdd();
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName) return;

    onAddVendor({
      name: vendorName,
      category: vendorCategory || 'General Supplier',
      contactPerson: vendorContact,
      phone: vendorPhone,
      email: vendorEmail,
      accountDetails: vendorAccount || undefined,
    });

    setVendorName('');
    setVendorContact('');
    setVendorPhone('');
    setVendorEmail('');
    setShowAddVendorModal(false);
  };

  // Filter Expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || e.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpentPaid = expenses
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);
  const totalPending = expenses
    .filter((e) => e.status === 'Pending')
    .reduce((sum, e) => sum + e.amount, 0);

  // Export Expenses to CSV
  const handleExportExpensesCSV = () => {
    const headers = ['Title', 'Department', 'Category', 'Amount', 'Date', 'Vendor', 'Requested By', 'Status', 'Receipt Ref'];
    const rows = filteredExpenses.map((e) => [
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.department}"`,
      e.category,
      e.amount,
      e.date,
      `"${e.vendor}"`,
      `"${e.requestedBy}"`,
      e.status,
      e.receiptRef || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Church_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial & Expense Management
          </h2>
          <p className="text-xs text-slate-500">
            Track operational expenses, department budget allocations, and approved vendor payables.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportExpensesCSV}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold shadow-xs transition-colors"
          >
            <Receipt className="w-4 h-4" />
            <span>New Claim</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Approved Budget
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${totalAllocated.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all ministry & operational departments</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Paid Expenses
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            ${totalSpentPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round((totalSpentPaid / totalAllocated) * 100)}% of total annual budget used
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Claims Review
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            ${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {expenses.filter((e) => e.status === 'Pending').length} claims waiting for treasurer sign-off
          </p>
        </div>
      </div>

      {/* Navigation Tabs & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'expenses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Expense Requisitions ({expenses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('budgets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'budgets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Department Budgets ({budgets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Approved Vendors ({vendors.length})</span>
          </button>
        </div>

        {activeTab === 'expenses' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search expense, vendor..."
                className="bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 focus:outline-none"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Departments</option>
              {budgets.map((b) => (
                <option key={b.id} value={b.departmentName}>
                  {b.departmentName}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Paid">Paid</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Expense Claim</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Category & Vendor</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">{exp.title}</p>
                      <p className="text-[11px] text-slate-400">Req by: {exp.requestedBy}</p>
                    </td>

                    <td className="p-3 text-slate-700 font-medium">{exp.department}</td>

                    <td className="p-3">
                      <p className="font-medium text-slate-800">{exp.category}</p>
                      <p className="text-[11px] text-slate-500">Vendor: {exp.vendor}</p>
                    </td>

                    <td className="p-3 font-bold text-slate-900">
                      ${exp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-slate-500 whitespace-nowrap">{exp.date}</td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          exp.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : exp.status === 'Approved'
                            ? 'bg-blue-100 text-blue-800'
                            : exp.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {exp.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                        {exp.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {exp.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {exp.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => onUpdateExpenseStatus(exp.id, 'Approved')}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                              title="Approve Requisition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onUpdateExpenseStatus(exp.id, 'Rejected')}
                              className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[11px] font-semibold"
                              title="Reject Claim"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {exp.status === 'Approved' && (
                          <button
                            onClick={() => onUpdateExpenseStatus(exp.id, 'Paid')}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Department Budgets View */}
      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const percentage = Math.round((b.spentAmount / b.allocatedAmount) * 100);
            return (
              <div key={b.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{b.code}</span>
                    <h3 className="font-bold text-slate-900 text-sm">{b.departmentName}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-700 rounded-lg">
                    FY {b.fiscalYear}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Spent: ${b.spentAmount.toLocaleString()}</span>
                    <span>Budget: ${b.allocatedAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage > 90 ? 'bg-rose-500' : percentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percentage)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Remaining: ${(b.allocatedAmount - b.spentAmount).toLocaleString()}</span>
                  <span className="font-bold text-slate-800">{percentage}% Utilized</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vendors Directory */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">Approved Church Suppliers, Contractors & Utilities</p>
            <button
              onClick={() => setShowAddVendorModal(true)}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => (
              <div key={v.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-900 text-sm">{v.name}</h4>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                    {v.category}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <p>Contact: <span className="font-medium text-slate-800">{v.contactPerson || 'N/A'}</span></p>
                  <p>Phone: {v.phone}</p>
                  <p>Email: {v.email}</p>
                  {v.accountDetails && (
                    <p className="text-[11px] text-slate-400">Account: {v.accountDetails}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Submit Operational Expense Claim</h3>
              <button
                onClick={() => setShowAddExpenseModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sound system replacement cables"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    {budgets.map((b) => (
                      <option key={b.id} value={b.departmentName}>
                        {b.departmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Equipment & Tech">Equipment & Tech</option>
                    <option value="Utilities & Facilities">Utilities & Facilities</option>
                    <option value="Maintenance & Repairs">Maintenance & Repairs</option>
                    <option value="Events & Supplies">Events & Supplies</option>
                    <option value="Salaries & Staff">Salaries & Staff</option>
                    <option value="Software & Software">Software & Subscriptions</option>
                    <option value="Missions Outflow">Missions Outflow</option>
                    <option value="Hospitality & Care">Hospitality & Care</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vendor</label>
                  <input
                    type="text"
                    placeholder="Vendor name"
                    value={formVendor}
                    onChange={(e) => setFormVendor(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Requested By</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formRequestedBy}
                    onChange={(e) => setFormRequestedBy(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Invoice / Receipt Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-9021"
                    value={formReceiptRef}
                    onChange={(e) => setFormReceiptRef(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purpose / Notes</label>
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
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Approved Vendor</h3>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. HVAC, A/V, Utilities"
                    value={vendorCategory}
                    onChange={(e) => setVendorCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={vendorContact}
                    onChange={(e) => setVendorContact(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={vendorPhone}
                    onChange={(e) => setVendorPhone(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={vendorEmail}
                    onChange={(e) => setVendorEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
