import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, setUser } = useAuth(); // Assuming your AuthContext exposes setUser to update local state
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Pre-fill form with current user data when loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
      });
      if (user.avatarUrl) {
        setPreviewUrl(user.avatarUrl);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('name', formData.name);
      data.append('username', formData.username);
      
      
      if (avatarFile) {
        data.append('upload', avatarFile);
      }

      const response = await fetch('http://localhost:8080/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });
      console.log(data) 
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      
      // Update global auth context state so navbar updates immediately
      if (setUser) {
        setUser(updatedUser);
      }

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className=" w-full md:w-[60%] text-center py-20 text-slate-400">Please log in to view your profile.</div>;
  }

  return (
    <div className="min-h-screen md:w-[50%] bg-slate-500 text-slate-100 p-6 sm:p-12">
      <div className="max-w-xl mx-auto bg-slate-800/60 border border-slate-700/80 rounded-2xl p-8 shadow-xl space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Update your personal account details and avatar.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-emerald-900/40 border border-emerald-500 text-emerald-300' : 'bg-red-900/40 border border-red-500 text-red-300'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Avatar Preview & Upload */}
          <div className="flex items-center gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-700 border-2 border-blue-500 flex items-center justify-center">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-slate-300">
                  {formData.name?.[0] || formData.username?.[0] || 'U'}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Display Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Jhon Doe"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Username / Handle Field */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Username Handle
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="e.g. agung_dev"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition text-sm disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>

        </form>

      </div>
    </div>
  );
}