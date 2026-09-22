'use client';

import React, { useActionState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { signIn } from '@/app/actions/auth';
import { createClient } from '@/lib/supabase';
import { Network, AlertCircle, Loader2 } from 'lucide-react';

const initialState = { error: null as string | null };

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = React.use(searchParams);
  const [state, formAction] = useActionState(signIn, initialState);
  const [isPending, startTransition] = useTransition();

  const handleGoogleLogin = () => {
    const supabase = createClient();
    startTransition(async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
    });
  };

  const callbackError = resolvedSearchParams?.error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-8" style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
            <a href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6">
              <Network className="w-5 h-5 text-black" />
              <span className="text-base sm:text-lg font-semibold">Campus Resource Network</span>
            </a>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-tight mb-2">Welcome back</h1>
            <p className="text-gray-500 text-sm sm:text-base">Sign in to your campus network.</p>
          </div>
        </div>

        <Card className="p-5 sm:p-8 shadow-xl sm:shadow-2xl">
          <div className="space-y-6 animate-fade-in-up">
            {/* Error from callback (e.g. oauth failure) */}
            {callbackError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Sign in failed. Please try again.</span>
              </div>
            )}

            {/* Server Action error */}
            {state?.error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isPending}
              className="w-full py-3.5 flex items-center justify-center gap-3 bg-white text-black border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

            {/* Email / Password Form */}
            <form action={formAction} className="space-y-4">
              <Input
                label="College Email"
                name="email"
                type="email"
                placeholder="student@college.edu"
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-black" />
                  Remember me
                </label>
                <a href="#" className="text-black font-medium hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign In
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="text-black font-medium underline">
                Sign up
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
