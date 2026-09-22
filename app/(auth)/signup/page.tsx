'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { signUp } from '@/app/actions/auth';
import { Network, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

const initialState = { error: null as string | null };

const DEPARTMENTS = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Information Technology',
  'Chemical Engineering',
  'Biotechnology',
  'Architecture',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // Controlled fields for step 1 (carried to step 2 via hidden inputs)
  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setFields({
      fullName: data.get('fullName') as string,
      email: data.get('email') as string,
      password: data.get('password') as string,
    });
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-8 sm:py-12" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
            <a href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6">
              <Network className="w-5 h-5 text-black" />
              <span className="text-base sm:text-lg font-semibold">Campus Resource Network</span>
            </a>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-12 h-px ${step > 1 ? 'bg-black' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${step >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                2
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight mb-2">
              {step === 1 ? 'Join the Network' : 'Your Student Profile'}
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">
              {step === 1
                ? 'Create your verified student account.'
                : 'Help us verify your campus identity.'}
            </p>
          </div>
        </div>

        <Card className="p-5 sm:p-8 shadow-xl sm:shadow-2xl">
          {/* Step 1 — Account details */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="e.g. Dennis Sabu"
                  defaultValue={fields.fullName}
                  required
                />
                <Input
                  label="College Email"
                  name="email"
                  type="email"
                  placeholder="student@college.edu"
                  defaultValue={fields.email}
                  required
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  defaultValue={fields.password}
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Continue →
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <a href="/login" className="text-black font-medium underline">
                  Login
                </a>
              </p>
            </form>
          )}

          {/* Step 2 — Student profile + submit */}
          {step === 2 && (
            <form action={formAction} className="space-y-6 animate-fade-in-up">
              {/* Pass step-1 data as hidden fields */}
              <input type="hidden" name="fullName" value={fields.fullName} />
              <input type="hidden" name="email" value={fields.email} />
              <input type="hidden" name="password" value={fields.password} />

              {state?.error && (
                <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{state.error}</span>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Student ID Number"
                  name="studentId"
                  placeholder="STU-12345678"
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">Select your department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                  <select
                    name="year"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="">Select your year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Account
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-sm text-gray-500 hover:text-black transition-colors"
              >
                ← Back
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
