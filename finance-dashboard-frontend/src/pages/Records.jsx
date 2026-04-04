import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle, DollarSign, IndianRupee } from 'lucide-react';
import { recordsAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import { formatCurrency } from '../utils/formatUtils';
import ToastContainer from '../components/common/Toast';

// Currency conversion rate (USD to INR)
const USD_TO_INR = 83.5;

const CATEGORIES = [
  'Salary',
  'Freelance',
  'Bonus',
  'Food',
  'Transport',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Education',
  'Rent',
  'Insurance',
  'Other',
];

const RecordForm = ({ record, onSubmit, onClose, isLoading, currency = 'USD' }) => {
  const [formData, setFormData] = useState(
    record || {
      amount: '',
      type: 'EXPENSE',
      category: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert date to ISO datetime format
    const dateTime = new Date(formData.date).toISOString();

    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      date: dateTime,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {record ? 'Edit Record' : 'Add New Record'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => {
                setFormData({ ...formData, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData({ ...formData, date: e.target.value });
                if (errors.date) setErrors({ ...errors, date: '' });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows="3"
              placeholder="Optional notes"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-400"
            >
              {isLoading ? 'Saving...' : record ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirm = ({ record, onConfirm, onCancel, isLoading }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full p-6">
        <div className="flex gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Delete Record</h2>
            <p className="text-gray-600 mt-1">
              Are you sure? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            <strong>{record.category}</strong> - {formatCurrency(record.amount)}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(record.id)}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [sortConfig, setSortConfig] = useState({ key: 'date', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    fetchRecords();
  }, [filters, sortConfig]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await recordsAPI.getAll({
        type: filters.type || undefined,
        category: filters.category || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
        page: 1,
        limit: 500,
        sortBy: sortConfig.key,
        sortOrder: sortConfig.order,
      });
      
      console.log('Records API Response:', response);
      console.log('Records Data:', response.data?.data?.data);
      
      const recordsData = response.data?.data?.data || [];
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setSelectedRecords([]);
    } catch (err) {
      console.error('Records API Error:', err);
      addToast(
        err.response?.data?.error?.message || 'Failed to load records',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      setFormLoading(true);
      if (editingRecord) {
        await recordsAPI.update(editingRecord.id, formData);
        addToast('Record updated successfully', 'success');
      } else {
        await recordsAPI.create(formData);
        addToast('Record created successfully', 'success');
      }
      setShowForm(false);
      setEditingRecord(null);
      fetchRecords();
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || 'Failed to save record',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setFormLoading(true);
      await recordsAPI.delete(id);
      addToast('Record deleted successfully', 'success');
      setDeleteRecord(null);
      fetchRecords();
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || 'Failed to delete record',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRecords.length === 0) {
      addToast('No records selected', 'warning');
      return;
    }

    if (!window.confirm(`Delete ${selectedRecords.length} records? This cannot be undone.`)) {
      return;
    }

    try {
      setFormLoading(true);
      await Promise.all(selectedRecords.map(id => recordsAPI.delete(id)));
      addToast(`${selectedRecords.length} records deleted successfully`, 'success');
      setSelectedRecords([]);
      fetchRecords();
    } catch (err) {
      addToast(
        err.response?.data?.error?.message || 'Failed to delete records',
        'error'
      );
    } finally {
      setFormLoading(false);
    }
  };

  const formatAmount = (amount) => {
    if (currency === 'INR') {
      const inr = amount * USD_TO_INR;
      return `₹${inr.toFixed(2)}`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  const filterAndSearchRecords = () => {
    let filtered = [...records];

    // Apply amount filters
    if (filters.minAmount) {
      filtered = filtered.filter(r => r.amount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(r => r.amount <= parseFloat(filters.maxAmount));
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredRecords = filterAndSearchRecords();
  const allSelected = selectedRecords.length === filteredRecords.length && filteredRecords.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(r => r.id));
    }
  };

  const toggleSelectRecord = (id) => {
    setSelectedRecords(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Records</h1>
          <p className="text-gray-600 mt-2">Manage and analyze your income and expenses</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded transition flex items-center gap-2 ${
                currency === 'USD'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              USD
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-4 py-2 rounded transition flex items-center gap-2 ${
                currency === 'INR'
                  ? 'bg-primary text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              <IndianRupee className="w-4 h-4" />
              INR
            </button>
          </div>
          <button
            onClick={() => {
              setEditingRecord(null);
              setShowForm(true);
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Record
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Advanced Filters</h2>
          <button
            onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '', minAmount: '', maxAmount: '' })}
            className="text-sm text-primary hover:underline"
          >
            Reset Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
            <input
              type="number"
              value={filters.minAmount}
              onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
            <input
              type="number"
              value={filters.maxAmount}
              onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
              placeholder="Any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
      </div>

      {/* Search And Bulk Actions */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Search by category or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {selectedRecords.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{selectedRecords.length} selected</span>
            <button
              onClick={handleBulkDelete}
              disabled={formLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition text-sm font-medium flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-600 mt-2">Loading records...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th 
                    onClick={() => setSortConfig({ key: 'date', order: sortConfig.order === 'asc' ? 'desc' : 'asc' })}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    Date {sortConfig.key === 'date' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th 
                    onClick={() => setSortConfig({ key: 'amount', order: sortConfig.order === 'asc' ? 'desc' : 'asc' })}
                    className="px-6 py-3 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    Amount {sortConfig.key === 'amount' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRecords.includes(record.id)}
                        onChange={() => toggleSelectRecord(record.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{record.category}</td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.type === 'INCOME'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.type === 'INCOME' ? '+ Income' : '- Expense'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold text-right">
                      <span className={record.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                        {record.type === 'INCOME' ? '+' : '-'}{formatAmount(record.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600 truncate max-w-xs">
                      {record.notes || '<no notes>'}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingRecord(record);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteRecord(record)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">No records found</p>
            <button
              onClick={() => {
                setEditingRecord(null);
                setShowForm(true);
              }}
              className="text-primary hover:underline font-medium"
            >
              Create your first record →
            </button>
          </div>
        )}
      </div>

      {/* Forms & Dialogs */}
      {showForm && (
        <RecordForm
          record={editingRecord}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingRecord(null);
          }}
          isLoading={formLoading}
        />
      )}

      {deleteRecord && (
        <DeleteConfirm
          record={deleteRecord}
          onConfirm={handleDelete}
          onCancel={() => setDeleteRecord(null)}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default RecordsPage;
