import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, addAddress } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Add address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileError(null);
    setUpdating(true);

    const updateData = { name, phone };
    if (newPassword) {
      updateData.password = newPassword;
    }

    const res = await updateProfile(updateData);
    setUpdating(false);

    if (res.success) {
      setProfileMsg('Profile information updated successfully!');
      setNewPassword('');
      setTimeout(() => setProfileMsg(null), 3500);
    } else {
      setProfileError(res.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode) return;

    const res = await addAddress({ street, city, state, postalCode });
    if (res.success) {
      setShowAddressForm(false);
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-subtle flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-2xl bg-[#14213D] text-[#FCA311] text-2xl font-black flex items-center justify-center shadow-subtle flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-gray-900">{user?.name}</h1>
            {user?.role === 'admin' && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                ADMINISTRATOR
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{user?.email}</p>
          <p className="text-xs text-gray-400">
            TechNova Member Since {new Date(user?.createdAt || Date.now()).getFullYear()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Account Settings Form (7 Cols) */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-6">
          <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <User size={18} className="text-[#14213D]" />
            <span>Personal Information</span>
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">
                Email cannot be modified directly for account security.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mobile Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block font-semibold text-gray-700 mb-1">
                Change Password (leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
              />
            </div>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center space-x-2">
                <CheckCircle2 size={16} />
                <span>{profileMsg}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center space-x-2">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={updating}
              className="bg-[#14213D] hover:bg-[#233862] text-white py-2.5 px-6 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right: Saved Addresses (5 Cols) */}
        <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#14213D]" />
              <span>Saved Addresses</span>
            </h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs font-bold text-[#FCA311] hover:underline flex items-center gap-1"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>

          {/* New address form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <p className="font-bold text-gray-800">Add New Shipping Address</p>
              <input
                type="text"
                placeholder="Street Address & Flat No."
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="p-2 bg-white border border-gray-200 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="p-2 bg-white border border-gray-200 rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="PIN Code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-[#14213D] text-white px-3 py-1.5 rounded-lg font-bold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of addresses */}
          <div className="space-y-3">
            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900">{addr.street}</p>
                    {addr.isDefault && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-gray-400">{addr.country || 'India'}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4 text-center">
                No delivery addresses saved yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
