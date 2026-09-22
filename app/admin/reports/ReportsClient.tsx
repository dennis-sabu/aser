'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  User, 
  Lock, 
  Check,
  X
} from 'lucide-react';
import { resolveReportAdmin } from '@/app/actions/admin';

interface ReportItem {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details?: string;
  status: string;
  created_at: string;
  reporter?: any;
  reported?: any;
}

export function ReportsClient({ initialReports }: { initialReports: ReportItem[] }) {
  const [reports, setReports] = useState(initialReports);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = (reportId: string, status: 'resolved' | 'dismissed') => {
    startTransition(async () => {
      const res = await resolveReportAdmin(reportId, status);
      if (res.success) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
        setFeedback(`Report marked as ${status}.`);
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  };

  const openReports = reports.filter(r => r.status === 'open');

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-gray-300 rounded-full text-xs font-medium text-black bg-white shadow-2xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          <span>Verified Student Trust & Safety Enforcement</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-normal leading-[1.15] tracking-tight text-black">
          Safety & Reports.<br />
          <span className="gradient-text">Zero-Tolerance Protection.</span>
        </h1>

        <p className="text-base text-gray-600 max-w-2xl">
          Review peer disputes, policy violations, and scam reports. Every report is audited by campus moderators.
        </p>

        {feedback && (
          <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl inline-flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Reports List */}
        <div className="lg:col-span-2 space-y-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      report.status === 'open' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{report.reason}</h3>
                      <p className="text-xs text-gray-400">Case ID: {report.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    report.status === 'open'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Filed By</span>
                    <span className="font-semibold text-gray-800">
                      {Array.isArray(report.reporter) ? report.reporter[0]?.full_name : report.reporter?.full_name || 'Campus Student'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Reported Profile</span>
                    <span className="font-semibold text-gray-800">
                      {Array.isArray(report.reported) ? report.reported[0]?.full_name : report.reported?.full_name || 'Student Profile'}
                    </span>
                  </div>
                </div>

                {report.details && (
                  <p className="text-xs text-gray-600 leading-relaxed bg-white border border-gray-100 p-3 rounded-xl italic">
                    "{report.details}"
                  </p>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(report.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>

                  {report.status === 'open' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(report.id, 'dismissed')}
                        disabled={isPending}
                        className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-full transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'resolved')}
                        disabled={isPending}
                        className="px-4 py-1.5 bg-black hover:bg-gray-800 text-white text-xs font-medium rounded-full transition-colors shadow-2xs"
                      >
                        Resolve Case
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Zero Active Incident Reports</h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                All campus transactions, ride offers, and student exchanges are operating in good standing. No student reports are pending review.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live campus network status: Healthy
              </div>
            </div>
          )}
        </div>

        {/* Safety Guidelines Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-700" />
              Campus Moderator Protocols
            </h3>
            <ul className="space-y-3 text-xs text-gray-600 leading-relaxed">
              <li className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Verify student college ID before suspending or revoking access.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Check message history and transaction logs before adjudicating disputes.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Ensure fair handoffs and encourage constructive peer reviews.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Escalate physical safety concerns directly to College Security.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Safety Helpdesk</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              For security emergencies or critical campus escalations, contact the internal administrator team at <span className="font-mono text-black font-medium">dennissabu444@gmail.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
