import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState('drafts'); // 'drafts' | 'published'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null); // null when creating, post object when editing
  const [formData, setFormData] = useState({ title: '', content: '', published: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

// Schedule Modal State
const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
const [schedulingPostId, setSchedulingPostId] = useState(null);
const [scheduledDate, setScheduledDate] = useState('');

  const token = localStorage.getItem('token');

  // 1. FETCH POSTS DEPENDING ON ACTIVE TAB
  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    
    // Choose endpoint based on active tab
    const endpoint = activeTab === 'drafts' 
      ? 'http://localhost:8080/api/post/draft' 
      : 'http://localhost:8080/api/post/published';

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. CREATE OR UPDATE POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEditing = Boolean(editingPost);
    const url = isEditing
      ? `http://localhost:8080/api/post/${editingPost.id}`
      : 'http://localhost:8080/api/post/publish';

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save post');

      // Refresh list and reset modal
      closeModal();
      fetchPosts();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. PUBLISH DRAFT (PATCH /posts/:id/publish)
  const handlePublishDraft = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/post/${postId}/publishdraft`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to publish draft');

      // Refresh posts list
      fetchPosts();
    } catch (err) {
      alert(err.message);
    }
  };

// 2. Submit scheduled date to backend
const handleSchedule = async (e) => {
  e.preventDefault();
  if (!scheduledDate || !schedulingPostId) return;

  try {
    const response = await fetch(
      `http://localhost:8080/api/post/${schedulingPostId}/publishdraft`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publishTime: scheduledDate, // Send date to backend
        }),
      }
    );

    if (!response.ok) throw new Error('Failed to schedule post');

    // Close modal and refresh UI
    setIsScheduleModalOpen(false);
    setSchedulingPostId(null);
    fetchPosts();
  } catch (err) {
    alert(err.message);
  }
};
  // 4. DELETE POST (DELETE /posts/:id)
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      console.log(user && token)
      const response = await fetch(`http://localhost:8080/api/post/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete post');

      // Optimistically filter deleted post from state
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  // MODAL HELPERS
  const openCreateModal = () => {
    setEditingPost(null);
    setFormData({ title: '', content: '', published: false });
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title, content: post.content, published: post.published });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // 1. Open Modal for a specific post
const openScheduleModal = (postId) => {
  setSchedulingPostId(postId);
  setScheduledDate(''); // Reset date input
  setIsScheduleModalOpen(true);
};
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/90 p-6 rounded-xl border border-slate-700 shadow-md">
          <div>
            <h1 className="text-2xl font-bold">Author Dashboard</h1>
            <p className="text-sm text-slate-400">Manage your published articles and draft manuscripts.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            + Create New Post
          </button>
        </div>

        {/* TABS & NAVIGATION */}
        <div className="flex border-b border-slate-700 gap-4">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-3 px-2 font-medium transition border-b-2 ${
              activeTab === 'drafts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Drafts
          </button>
          <button
            onClick={() => setActiveTab('published')}
            className={`pb-3 px-2 font-medium transition border-b-2 ${
              activeTab === 'published'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Published Posts
          </button>
        </div>

        {/* POSTS LISTING AREA */}
        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading articles...</div>
        ) : error ? (
          <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-800">
            <p className="text-slate-400">No {activeTab} found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <h2 className="text-xl font-semibold text-white">{post.title}</h2>
                  <p className="text-sm text-slate-400 line-clamp-2">{post.content}</p>
                  <p className="text-xs text-slate-500">
                    Last updated: {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                 
                <div className="flex items-center gap-2 self-end sm:self-auto ">
                  {activeTab ==='drafts' ? (<div>
                  {/*<button onClick={()=>{console.log(activeTab)}}> test</button>*/}
                  {!post.published && (
                      <button  
                        onClick={() => openScheduleModal(post.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-2 rounded transition"
                      >
                        Schedule
                      </button>
                    )}
                  {/* Quick-Publish button for Drafts */}
                  {!post.published && (
                    <button
                      onClick={() => handlePublishDraft(post.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded transition"
                    >
                      Publish
                    </button>                    
                  )}
                   <button
                    onClick={() => openEditModal(post)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded transition"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-2 rounded transition"
                  >
                    Delete
                  </button>
                  </div>):(<div> 
                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(post)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-3 py-2 rounded transition"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-600/80 hover:bg-red-600 text-white text-xs px-3 py-2 rounded transition"
                  >
                    Delete
                  </button>
                  </div>) }
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE / EDIT POST MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Article title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Content</label>
                  <textarea
                    required
                    rows="6"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Write article body..."
                  />
                </div>
                      <div>
                          <label htmlFor="UploadFile" className="block text-sm font-medium text-slate-300 mb-1">Upload Here</label>
                          <input 
                            type="file" 
                            name="UploadFile" 
                            id="UploadFile" 
                            className="w-full text-sm text-slate-400
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-lg file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-600 file:text-white
                              file:cursor-pointer hover:file:bg-blue-700
                              bg-slate-900 border border-slate-700 rounded-lg cursor-pointer
                              file:transition                            "
                          />
                        </div>
                {/* Status Toggle (Only on initial creation) */}
                {!editingPost && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="published" className="text-sm text-slate-300">
                      Publish immediately
                    </label>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          {/* SCHEDULE MODAL */}
          {isScheduleModalOpen && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
              <div className="bg-slate-800 text-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-700">
                <h3 className="text-lg font-semibold">Schedule Post Publication</h3>

                <form onSubmit={handleSchedule} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Select Date & Time (Future Only)
                    </label>
                    <input
                      type="datetime-local"
                      required
                      min={new Date().toISOString().slice(0, 16)} // 👈 Blocks selecting past dates/times
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(false)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded transition"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}