'use client';

import React, { useActionState, useTransition } from 'react';
import { updateProfile, updatePassword, UpdateProfileState } from '@/app/actions/profile';
import { signOut } from '@/app/actions/auth';
import { User, Lock, LogOut, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff, Phone } from 'lucide-react';
import { formatPhoneDisplay } from '@/lib/phone';

const INITIAL: UpdateProfileState = { success: false, error: null };

function FieldInput({
  label,
  name,
  type = 'text',
  defaultValue,
  placeholder,
  required,
  maxLength,
  rows,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
}) {
  const base =
    'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent transition-all';

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {rows ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`${base} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={base}
        />
      )}
    </div>
  );
}

function StatusBanner({ state }: { state: UpdateProfileState }) {
  if (!state.success && !state.error) return null;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${
      state.success
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      {state.success
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
        : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
      <span>{state.success ? 'Changes saved successfully.' : state.error}</span>
    </div>
  );
}

function PasswordField({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          placeholder={placeholder ?? '••••••••'}
          minLength={8}
          className="w-full px-4 py-3 pr-11 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent transition-all"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export function ProfileSettingsForm({
  fullName,
  email,
  department,
  year,
  studentId,
  bio,
  avatarUrl,
  phoneNumber,
  whatsappEnabled,
  isOAuth,
}: {
  fullName: string;
  email: string;
  department: string | null;
  year: string | null;
  studentId: string | null;
  bio: string | null;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  whatsappEnabled?: boolean;
  isOAuth: boolean;
}) {
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, INITIAL);
  const [passwordState, passwordAction, isPasswordPending] = useActionState(updatePassword, INITIAL);
  const [avatar, setAvatar] = React.useState<string | null>(avatarUrl ?? null);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const [phoneVal, setPhoneVal] = React.useState<string>(formatPhoneDisplay(phoneNumber));
  const [isWhatsAppOn, setIsWhatsAppOn] = React.useState(Boolean(whatsappEnabled));
  const [hasManuallyToggled, setHasManuallyToggled] = React.useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneVal(val);
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 10 && !hasManuallyToggled) {
      setIsWhatsAppOn(true);
    } else if (digits.length === 0) {
      setIsWhatsAppOn(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const { createClient } = await import('@/lib/supabase');
    const supabase = createClient();
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage.from('avatars').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      setAvatar(publicUrl);
    }
    setUploadingAvatar(false);
  };

  const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'PhD'];
  const DEPARTMENTS = [
    'Computer Science', 'Information Technology', 'Electronics & Communication',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
    'Chemical Engineering', 'Mathematics', 'Physics', 'Chemistry',
    'Business Administration', 'Design', 'Arts & Humanities', 'Other',
  ];

  const initials = fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <a
        href="/dashboard/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </a>

      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>

      {/* ── Profile Info ── */}
      <form action={profileAction} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <input type="hidden" name="avatar_url" value={avatar ?? ''} />
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-gray-500" />
          </div>
          <h2 className="font-semibold text-gray-900 text-sm">Profile Information</h2>
        </div>

        <div className="p-6 space-y-5">
          <StatusBanner state={profileState} />

          {/* Avatar Upload */}
          <div className="flex items-center gap-4 pb-2">
            {avatar ? (
              <img src={avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
            )}
            <div>
              <label className="cursor-pointer inline-flex items-center px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors">
                {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">PNG or JPG up to 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FieldInput
                label="Full Name"
                name="full_name"
                defaultValue={fullName}
                placeholder="Your full name"
                required
                maxLength={80}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">
                College Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed here.</p>
            </div>

            <FieldInput
              label="Student ID"
              name="student_id"
              defaultValue={studentId ?? ''}
              placeholder="e.g. CS21001"
              maxLength={20}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Year</label>
              <select
                name="year"
                defaultValue={year ?? ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Department</label>
              <select
                name="department"
                defaultValue={department ?? ''}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <FieldInput
                label="Bio"
                name="bio"
                defaultValue={bio ?? ''}
                placeholder="Tell your campus mates a bit about yourself…"
                maxLength={280}
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">Max 280 characters.</p>
            </div>

            {/* WhatsApp Contact Section */}
            <div className="sm:col-span-2 pt-4 border-t border-gray-100 space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  Phone Number
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  Used for optional WhatsApp contact. Never displayed publicly as plain text.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <input
                    type="tel"
                    name="phone_number"
                    value={phoneVal}
                    onChange={handlePhoneChange}
                    placeholder="+91 XXXXX XXXXX"
                    maxLength={18}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent transition-all font-mono"
                  />
                  <p className="text-xs text-gray-400">Accepts normal 10-digit Indian numbers (+91 optional).</p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-800">WhatsApp Contact</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isWhatsAppOn 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {isWhatsAppOn ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {isWhatsAppOn 
                        ? 'Students can contact you via WhatsApp' 
                        : 'Students can only contact you via CampusNet chat'}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      name="whatsapp_enabled"
                      checked={isWhatsAppOn}
                      onChange={(e) => {
                        setHasManuallyToggled(true);
                        setIsWhatsAppOn(e.target.checked);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isProfilePending}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isProfilePending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* ── Change Password ── */}
      {!isOAuth && (
        <form action={passwordAction} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Lock className="w-4 h-4 text-gray-500" />
            </div>
            <h2 className="font-semibold text-gray-900 text-sm">Change Password</h2>
          </div>

          <div className="p-6 space-y-4">
            <StatusBanner state={passwordState} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PasswordField label="New Password" name="new_password" placeholder="Min 8 characters" />
              <PasswordField label="Confirm Password" name="confirm_password" />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPasswordPending}
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isPasswordPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ── Danger Zone ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-500" />
          </div>
          <h2 className="font-semibold text-gray-900 text-sm">Account</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Sign out</p>
              <p className="text-xs text-gray-400 mt-0.5">You'll need to sign in again to access your account.</p>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
