import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';

const BG_OPTIONS = [
  { value: 'from-green-50 to-green-100', label: 'Green' },
  { value: 'from-orange-50 to-orange-100', label: 'Orange' },
  { value: 'from-blue-50 to-blue-100', label: 'Blue' },
  { value: 'from-purple-50 to-purple-100', label: 'Purple' }
];

const BADGE_COLORS = [
  { value: 'green', label: 'Green' },
  { value: 'orange', label: 'Orange' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' }
];

// Use .env backend url
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PromoCrudPage = () => {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState({
    bg: '',
    badgeText: '',
    badgeColor: '',
    title: '',
    desc: '',
    link: '',
    linkText: '',
    img: '',
    alt: ''
  });

  const fetchPromos = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/promos`);
    const data = await res.json();
    setPromos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = promo => {
    setEditingPromo(promo);
    setForm({
      bg: promo.bg,
      badgeText: promo.badge.text,
      badgeColor: promo.badge.color,
      title: promo.title,
      desc: promo.desc,
      link: promo.link,
      linkText: promo.linkText,
      img: promo.img,
      alt: promo.alt
    });
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this promo?')) return;
    const res = await fetch(`${backendUrl}/api/promos/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Promo deleted');
      fetchPromos();
    } else {
      toast.error('Could not delete promo');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      bg: form.bg,
      badge: { text: form.badgeText, color: form.badgeColor },
      title: form.title,
      desc: form.desc,
      link: form.link,
      linkText: form.linkText,
      img: form.img,
      alt: form.alt
    };
    let res;
    if (editingPromo) {
      res = await fetch(`${backendUrl}/api/promos/${editingPromo._id || editingPromo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${backendUrl}/api/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    if (res.ok) {
      toast.success(editingPromo ? 'Promo updated' : 'Promo created');
      setShowForm(false);
      setEditingPromo(null);
      setForm({
        bg: '',
        badgeText: '',
        badgeColor: '',
        title: '',
        desc: '',
        link: '',
        linkText: '',
        img: '',
        alt: ''
      });
      fetchPromos();
    } else {
      toast.error('Could not save promo');
    }
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Promotions</h1>
        <button
          className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setShowForm(true);
            setEditingPromo(null);
            setForm({
              bg: '',
              badgeText: '',
              badgeColor: '',
              title: '',
              desc: '',
              link: '',
              linkText: '',
              img: '',
              alt: ''
            });
          }}
        >
          Create Promo
        </button>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
            {/* BG Range */}
            <label className="block text-sm font-medium mb-1">Background Color Range</label>
            <select
              name="bg"
              value={form.bg}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select background</option>
              {BG_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Badge Text */}
            <input
              name="badgeText"
              value={form.badgeText}
              onChange={handleChange}
              placeholder="Badge Text (e.g. Limited Time Offer)"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Badge Color */}
            <label className="block text-sm font-medium mb-1 mt-2">Badge Color</label>
            <select
              name="badgeColor"
              value={form.badgeColor}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select badge color</option>
              {BADGE_COLORS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Title */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Description */}
            <input
              name="desc"
              value={form.desc}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Link */}
            <input
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Link (e.g. /products?category=fruits)"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Link Text */}
            <input
              name="linkText"
              value={form.linkText}
              onChange={handleChange}
              placeholder="Link Text (e.g. Shop Fruits)"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Image URL */}
            <input
              name="img"
              value={form.img}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border px-3 py-2 rounded"
              required
            />
            {/* Alt Text */}
            <input
              name="alt"
              value={form.alt}
              onChange={handleChange}
              placeholder="Alt Text"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="mr-2 px-4 py-2 bg-gray-200 rounded"
                onClick={() => { setShowForm(false); setEditingPromo(null); }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                {editingPromo ? 'Update Promo' : 'Save Promo'}
              </button>
            </div>
          </form>
        )}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2">Title</th>
                <th className="p-2">Badge</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promos.map(promo => (
                <tr key={promo._id || promo.id}>
                  <td className="p-2">{promo.title}</td>
                  <td className="p-2">{promo.badge?.text} ({promo.badge?.color})</td>
                  <td className="p-2">
                    <button
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                      onClick={() => handleEdit(promo)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDelete(promo._id || promo.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PromoCrudPage;
