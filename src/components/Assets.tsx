import React, { useState } from 'react';
import { Box, Plus, Wrench, AlertTriangle, CheckCircle2, Calendar, X, ShieldAlert, LayoutGrid, Table } from 'lucide-react';
import { Asset } from '../types';

interface AssetsProps {
  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id'>) => void;
  onUpdateAssetCondition: (id: string, condition: Asset['condition']) => void;
}

export const Assets: React.FC<AssetsProps> = ({ assets, onAddAsset, onUpdateAssetCondition }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [displayMode, setDisplayMode] = useState<'cards' | 'table'>('cards');
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Asset['category']>('Audio/Visual');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState<Asset['condition']>('Good');
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchaseCost) return;

    onAddAsset({
      name,
      category,
      serialNumber: serialNumber || undefined,
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      purchaseCost: parseFloat(purchaseCost),
      location: location || 'Main Sanctuary',
      condition,
      nextMaintenanceDate: nextMaintenanceDate || undefined,
      notes: notes || undefined,
    });

    setName('');
    setPurchaseCost('');
    setShowAddAssetModal(false);
  };

  const filteredAssets = assets.filter((a) => categoryFilter === 'ALL' || a.category === categoryFilter);

  const needsRepairCount = assets.filter((a) => a.condition === 'Needs Repair').length;
  const totalValue = assets.reduce((sum, a) => sum + a.purchaseCost, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Assets & Equipment Inventory
          </h2>
          <p className="text-xs text-slate-500">
            Track sound boards, musical instruments, vehicles, and facility equipment maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowAddAssetModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Inventory Value
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ${totalValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{assets.length} Registered Equipment Items</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Operational Condition
          </span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {assets.filter((a) => a.condition === 'Excellent' || a.condition === 'Good').length} / {assets.length} Ready
          </div>
          <p className="text-[11px] text-slate-400 mt-1">In Good or Excellent Condition</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Needs Service / Repair
          </span>
          <div className={`text-2xl font-bold mt-1 ${needsRepairCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {needsRepairCount} Items
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires maintenance attention</p>
        </div>
      </div>

      {/* Category Filter Bar & Display Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'Audio/Visual', 'Musical Instrument', 'Vehicle', 'Furniture', 'IT Equipment'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Equipment' : cat}
            </button>
          ))}
        </div>

        {/* Display Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
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

      {/* Asset Grid vs Table */}
      {displayMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((ast) => (
            <div key={ast.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">{ast.category}</span>
                  <h3 className="font-bold text-slate-900 text-sm">{ast.name}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    ast.condition === 'Excellent'
                      ? 'bg-emerald-100 text-emerald-800'
                      : ast.condition === 'Good'
                      ? 'bg-sky-100 text-sky-800'
                      : ast.condition === 'Needs Repair'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {ast.condition}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <p>📍 Location: <strong className="text-slate-800">{ast.location}</strong></p>
                <p>S/N: {ast.serialNumber || 'N/A'}</p>
                <p>Cost: ${ast.purchaseCost.toLocaleString()} ({ast.purchaseDate})</p>
                {ast.nextMaintenanceDate && <p>🔧 Next Service: {ast.nextMaintenanceDate}</p>}
              </div>

              {ast.notes && <p className="text-xs text-slate-500 italic">"{ast.notes}"</p>}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Update Condition:</span>
                <div className="flex items-center gap-1">
                  {(['Excellent', 'Good', 'Needs Repair'] as const).map((cond) => (
                    <button
                      key={cond}
                      onClick={() => onUpdateAssetCondition(ast.id, cond)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ast.condition === cond ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cond.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View for Assets */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Asset Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Serial #</th>
                  <th className="p-3.5">Cost</th>
                  <th className="p-3.5">Next Service</th>
                  <th className="p-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((ast) => (
                  <tr key={ast.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{ast.name}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {ast.category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ast.condition === 'Excellent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ast.condition === 'Good'
                            ? 'bg-sky-100 text-sky-800'
                            : ast.condition === 'Needs Repair'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ast.condition}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-700">{ast.location}</td>
                    <td className="p-3.5 text-slate-500">{ast.serialNumber || 'N/A'}</td>
                    <td className="p-3.5 font-medium text-slate-800">${ast.purchaseCost.toLocaleString()}</td>
                    <td className="p-3.5 text-slate-600">{ast.nextMaintenanceDate || '—'}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {(['Excellent', 'Good', 'Needs Repair'] as const).map((cond) => (
                          <button
                            key={cond}
                            onClick={() => onUpdateAssetCondition(ast.id, cond)}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                              ast.condition === cond ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {cond.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Register Church Equipment / Asset</h3>
              <button onClick={() => setShowAddAssetModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamaha C3 Grand Piano"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Asset['category'])}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Audio/Visual">Audio/Visual</option>
                    <option value="Musical Instrument">Musical Instrument</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Furniture">Furniture</option>
                    <option value="IT Equipment">IT Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Cost ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Location / Room</label>
                  <input
                    type="text"
                    placeholder="Main Sanctuary Stage"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as Asset['condition'])}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Next Service Date</label>
                  <input
                    type="date"
                    value={nextMaintenanceDate}
                    onChange={(e) => setNextMaintenanceDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
