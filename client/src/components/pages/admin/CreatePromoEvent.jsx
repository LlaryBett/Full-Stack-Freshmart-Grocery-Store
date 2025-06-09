import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';

const CreatePromoEvent = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    trigger: '',
    discountType: 'percentage',
    discountAmount: '',
    durationDays: 7,
    isActive: true,
    criteriaCategories: '' // Comma-separated string for categories
  });
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  // Fetch all promo events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/admin/promo-events`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, [backendUrl, token, loading]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build criteria object if categories are provided
      let criteria = undefined;
      if (form.criteriaCategories.trim()) {
        criteria = {
          categories: form.criteriaCategories
            .split(',')
            .map(c => c.trim())
            .filter(Boolean)
        };
      }
      const payload = {
        name: form.name,
        description: form.description,
        trigger: form.trigger,
        discountType: form.discountType,
        discountAmount: form.discountAmount,
        durationDays: form.durationDays,
        isActive: form.isActive,
        ...(criteria ? { criteria } : {})
      };
      const method = editing ? 'PUT' : 'POST';
      const url = editing
        ? `${backendUrl}/api/admin/promo-events/${editing._id}`
        : `${backendUrl}/api/admin/promo-events`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save event');
      toast.success(editing ? 'Promo event updated!' : 'Promo event created!');
      setForm({
        name: '',
        description: '',
        trigger: '',
        discountType: 'percentage',
        discountAmount: '',
        durationDays: 7,
        isActive: true,
        criteriaCategories: ''
      });
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Error saving event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = event => {
    setForm({
      name: event.name,
      description: event.description,
      trigger: event.trigger,
      discountType: event.discountType,
      discountAmount: event.discountAmount,
      durationDays: event.durationDays,
      isActive: event.isActive,
      criteriaCategories: event.criteria?.categories?.join(', ') || ''
    });
    setEditing(event);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this promo event?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/admin/promo-events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete event');
      toast.success('Promo event deleted');
    } catch (err) {
      toast.error(err.message || 'Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Fixed sidebar */}
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit Promo Event' : 'Create Promo Event'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Event Name (e.g. Birthday, Black Friday)"
              className="w-full border p-2 rounded"
              required
            />
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 rounded"
            />
            <input
              name="trigger"
              value={form.trigger}
              onChange={handleChange}
              placeholder="Trigger (e.g. on_signup, on_birthday)"
              className="w-full border p-2 rounded"
              required
            />
            <div className="flex gap-4">
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input
                name="discountAmount"
                type="number"
                value={form.discountAmount}
                onChange={handleChange}
                placeholder="Discount Amount"
                className="border p-2 rounded"
                required
              />
            </div>
            <input
              name="durationDays"
              type="number"
              value={form.durationDays}
              onChange={handleChange}
              placeholder="Valid Days"
              className="w-full border p-2 rounded"
              required
            />
            {/* New: Criteria field for categories */}
            <input
              name="criteriaCategories"
              value={form.criteriaCategories}
              onChange={handleChange}
              placeholder="Criteria: Categories (comma separated, e.g. fruits, seafood)"
              className="w-full border p-2 rounded"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Active
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {loading ? (editing ? 'Updating...' : 'Creating...') : (editing ? 'Update Event' : 'Create Event')}
            </button>
            {editing && (
              <button
                type="button"
                className="ml-4 text-gray-600 underline"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    name: '',
                    description: '',
                    trigger: '',
                    discountType: 'percentage',
                    discountAmount: '',
                    durationDays: 7,
                    isActive: true,
                    criteriaCategories: ''
                  });
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-2">Existing Promo Events</h3>
          <ul>
            {events.map(event => (
              <li key={event._id} className="mb-3 border-b pb-2 flex justify-between items-center">
                <div>
                  <div className="font-bold">{event.name}</div>
                  <div className="text-xs text-gray-500">{event.description}</div>
                  <div className="text-xs">Trigger: {event.trigger}</div>
                  <div className="text-xs">
                    {event.discountType === 'percentage'
                      ? `${event.discountAmount}%`
                      : `Ksh ${event.discountAmount}`} off, {event.durationDays} days, {event.isActive ? 'Active' : 'Inactive'}
                  </div>
                  {event.criteria?.categories && (
                    <div className="text-xs text-blue-600">
                      Criteria: Categories - {event.criteria.categories.join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 underline"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default CreatePromoEvent;
