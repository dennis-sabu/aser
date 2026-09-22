'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Mail } from 'lucide-react';
import { Network } from 'lucide-react';

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
            <a href="/" className="inline-flex items-center gap-2 mb-8">
              <Network className="w-5 h-5" />
              <span className="text-lg font-semibold">Campus Resource Network</span>
            </a>

            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-normal tracking-tight mb-3">Check your inbox</h1>
            <p className="text-gray-500 max-w-xs mx-auto">
              We&apos;ve sent a verification link to your college email. Click it to activate your account.
            </p>
          </div>
        </div>

        <Card className="p-8 shadow-2xl text-center animate-fade-in-up">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                Open your college email inbox
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                Look for the email from Campus Resource Network
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                Click &quot;Confirm your email&quot; to verify
              </div>
            </div>

            <div className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Only verified students can access the campus network.</span>
            </div>

            <p className="text-sm text-gray-500">
              Didn&apos;t receive the email?{' '}
              <a href="/signup" className="text-black font-medium underline">
                Try signing up again
              </a>
            </p>

            <a href="/login" className="block text-sm text-gray-400 hover:text-black transition-colors">
              ← Back to login
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
