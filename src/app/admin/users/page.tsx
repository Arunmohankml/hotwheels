"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User as UserIcon, Shield, ChevronDown, Trash2, MoreHorizontal, Ban, Eye, UserPlus, UserMinus, ShieldAlert, Check, X } from 'lucide-react';
import Link from 'next/link';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, variant = 'danger' }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl p-8 text-center"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-black text-white'
          }`}>
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-xl font-medium tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-luxury-muted mb-8 leading-relaxed">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-4 border border-luxury-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-black transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white transition-all shadow-lg ${
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-zinc-800'
              }`}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<string[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Confirmation State
  const [confirmData, setConfirmData] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: 'danger' | 'primary';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  async function fetchUsers() {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await query
        .order('joined_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setUsers(data);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId: string, isAdmin: boolean) => {
    setConfirmData({
      isOpen: true,
      title: isAdmin ? 'Promote to Admin?' : 'Revoke Admin Privileges?',
      message: isAdmin ? 'This user will gain full access to the control panel.' : 'This user will no longer have administrative access.',
      variant: isAdmin ? 'primary' : 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').update({ is_admin: isAdmin }).eq('id', userId);
          if (error) throw error;
          fetchUsers();
        } catch (error) {
          alert('Error updating role');
        } finally {
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBanToggle = async (userId: string, isBanned: boolean) => {
    setConfirmData({
      isOpen: true,
      title: isBanned ? 'Ban Account?' : 'Unban Account?',
      message: isBanned 
        ? 'The user will be blocked from accessing their account immediately, along with their IP and device signature.' 
        : 'The user will regain access to the platform.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const { error } = await supabase.from('profiles').update({ is_banned: isBanned }).eq('id', userId);
          if (error) throw error;
          fetchUsers();
        } catch (error) {
          alert('Error updating ban status');
        } finally {
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDeleteUser = async (userId: string) => {
    setConfirmData({
      isOpen: true,
      title: 'Delete Profile?',
      message: 'This action is permanent and will purge all user metadata from the registry.',
      variant: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const { error } = await supabase.from('profiles').delete().eq('id', userId);
          if (error) throw error;
          fetchUsers();
        } catch (error) {
          alert('Error deleting user');
        } finally {
          setIsDeleting(false);
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    setConfirmData({
      isOpen: true,
      title: `Delete ${selectedUsers.length} Users?`,
      message: 'Are you sure you want to purge these records from the database?',
      variant: 'danger',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const { error } = await supabase.from('profiles').delete().in('id', selectedUsers);
          if (error) throw error;
          setSelectedUsers([]);
          fetchUsers();
        } catch (error) {
          alert('Error deleting users');
        } finally {
          setIsDeleting(false);
          setConfirmData(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const isAllPageSelected = users.length > 0 && users.every(u => selectedUsers.includes(u.id));

  const toggleSelectAll = () => {
    if (isAllPageSelected) {
      const currentPageIds = users.map(u => u.id);
      setSelectedUsers(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      const currentPageIds = users.map(u => u.id);
      setSelectedUsers(prev => [...new Set([...prev, ...currentPageIds])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  const toggleExpand = (id: string) => {
    setExpandedUsers(prev => prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]);
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border border-luxury-border rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-black rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      <ConfirmModal 
        isOpen={confirmData.isOpen}
        title={confirmData.title}
        message={confirmData.message}
        variant={confirmData.variant}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmData(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 pb-6 md:pb-8 border-b border-luxury-border">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-muted mb-2 md:mb-3">Identity Registry</p>
          <h1 className="text-3xl md:text-4xl font-light tracking-tighter">Collector <span className="font-medium">Management.</span></h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {selectedUsers.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={14} /> Delete Selected ({selectedUsers.length})
            </button>
          )}
          <div className="relative group w-full md:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-muted group-focus-within:text-black transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search Name or Email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white border border-luxury-border py-3 pl-10 pr-4 rounded-xl text-[11px] font-medium tracking-wide outline-none focus:border-black transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-luxury-border rounded-[24px] md:rounded-[32px] shadow-soft relative">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-visible">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-luxury-border bg-luxury-bg/50">
                <th className="p-6 w-10">
                  <input 
                    type="checkbox" 
                    checked={isAllPageSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-luxury-border accent-black"
                  />
                </th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Identity</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Status</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted">Role</th>
                <th className="p-6 text-[9px] font-bold uppercase tracking-[0.3em] text-luxury-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id} className="border-b border-luxury-border/50 hover:bg-luxury-bg/50 transition-colors group">
                  <td className="p-6">
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="w-4 h-4 rounded border-luxury-border accent-black"
                    />
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-luxury-bg border border-luxury-border rounded-xl flex items-center justify-center shrink-0">
                        <UserIcon size={18} className="text-luxury-muted" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-black">{user.full_name || 'Anonymous Collector'}</p>
                        <p className="text-[10px] text-luxury-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                         user.is_banned ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]'
                       }`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                      user.is_admin ? 'bg-black text-white border-black' : 'bg-white text-black border-luxury-border'
                    }`}>
                      {user.is_admin ? 'Administrator' : 'Collector'}
                    </span>
                  </td>
                  <td className="p-6 text-right relative">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/users/${user.id}`} className="p-2 text-luxury-muted hover:text-black transition-colors rounded-lg hover:bg-white border border-transparent hover:border-luxury-border">
                        <Eye size={16} />
                      </Link>
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                          className="p-2 text-luxury-muted hover:text-black transition-colors rounded-lg hover:bg-white border border-transparent hover:border-luxury-border"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        <AnimatePresence>
                          {activeMenu === user.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white border border-luxury-border rounded-[20px] shadow-2xl z-20 overflow-hidden"
                              >
                                <div className="p-2">
                                  <Link href={`/admin/users/${user.id}`} className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-luxury-muted hover:text-black hover:bg-luxury-bg transition-colors rounded-xl">
                                    <Eye size={14} /> Manage Profile
                                  </Link>
                                  <button 
                                    onClick={() => handleRoleChange(user.id, !user.is_admin)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-luxury-muted hover:text-black hover:bg-luxury-bg transition-colors rounded-xl"
                                  >
                                    {user.is_admin ? <UserMinus size={14} /> : <UserPlus size={14} />}
                                    {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                  </button>
                                  <button 
                                    onClick={() => handleBanToggle(user.id, !user.is_banned)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                                  >
                                    <Ban size={14} /> {user.is_banned ? 'Unban Account' : 'Ban Account'}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                                  >
                                    <Trash2 size={14} /> Delete Account
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              )) : null}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-luxury-border">
          {users.length > 0 && (
            <div className="p-4 bg-luxury-bg/50 border-b border-luxury-border flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={isAllPageSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-luxury-border accent-black"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-muted">Select All Collectors</span>
              </div>
              <span className="text-[9px] font-bold bg-white px-2 py-1 border border-luxury-border rounded-lg text-black">
                {selectedUsers.length} Selected
              </span>
            </div>
          )}
          {users.length > 0 ? users.map((user) => {
            const isExpanded = expandedUsers.includes(user.id);
            return (
              <div key={user.id} className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center" onClick={() => toggleExpand(user.id)}>
                  <div className="flex items-center gap-4">
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                        className="w-4 h-4 rounded border-luxury-border accent-black"
                      />
                    </div>
                    <div className="w-10 h-10 bg-luxury-bg border border-luxury-border rounded-xl flex items-center justify-center shrink-0">
                      <UserIcon size={18} className="text-luxury-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-black truncate max-w-[150px]">{user.full_name || 'Anonymous'}</p>
                      <span className={`text-[8px] font-bold uppercase tracking-widest ${user.is_banned ? 'text-red-600' : 'text-green-600'}`}>
                        {user.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-luxury-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-4 pt-2 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-4 bg-luxury-bg p-4 rounded-2xl border border-luxury-border">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Email Address</p>
                        <p className="text-[11px] font-medium text-black truncate">{user.email}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Registration Date</p>
                          <p className="text-[11px] font-medium text-black">
                            {new Date(user.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] font-bold uppercase tracking-widest text-luxury-muted mb-1">Access Level</p>
                          <p className="text-[11px] font-bold text-black uppercase">{user.is_admin ? 'Admin' : 'Customer'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="flex items-center justify-center gap-2 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Eye size={14} /> Manage
                      </Link>
                      <button 
                        onClick={() => handleRoleChange(user.id, !user.is_admin)}
                        className="flex items-center justify-center gap-2 py-3 bg-white border border-luxury-border rounded-xl text-[10px] font-bold uppercase tracking-widest"
                      >
                        {user.is_admin ? <UserMinus size={14} /> : <UserPlus size={14} />} {user.is_admin ? 'Demote' : 'Promote'}
                      </button>
                      <button 
                        onClick={() => handleBanToggle(user.id, !user.is_banned)}
                        className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Ban size={14} /> {user.is_banned ? 'Unban' : 'Ban User'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          }) : (
            <div className="p-12 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-muted">
              Community database is empty.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-6 md:p-8 bg-luxury-bg/30 border-t border-luxury-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-luxury-muted order-2 md:order-1">
              Showing Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-4 order-1 md:order-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronDown size={16} className="rotate-90" />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-luxury-border rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20"
              >
                <ChevronDown size={16} className="-rotate-90" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
