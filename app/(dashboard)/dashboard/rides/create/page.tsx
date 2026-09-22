'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { createRide, ActionState } from '@/app/actions/listings';

const VEHICLE_TYPES = ['Car', 'Bike', 'Auto', 'SUV', 'Van', 'Other'];
const INIT: ActionState = { error: null, success: false };

export default function CreateRidePage() {
  const [state, formAction, isPending] = useActionState(createRide, INIT);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/rides" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer a Ride</h1>
          <p className="text-sm text-gray-500 mt-0.5">Help fellow students get to campus or home</p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Route</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">From <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input required name="from_location" placeholder="e.g. Downtown Station, Kottayam"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">To <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input required name="to_location" placeholder="e.g. Campus North Gate"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Date <span className="text-red-500">*</span></label>
              <input required name="ride_date" type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Departure Time <span className="text-red-500">*</span></label>
              <input required name="ride_time" type="time"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Vehicle & Seats</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Available Seats <span className="text-red-500">*</span></label>
              <input required name="total_seats" type="number" min="1" max="10" placeholder="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Cost per Person (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input name="estimated_cost" type="number" min="0" placeholder="0 for free"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map(v => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="vehicle_type" value={v} className="sr-only peer" />
                  <span className="px-3 py-1.5 rounded-lg border text-xs font-medium transition-all border-gray-200 text-gray-600 hover:border-gray-400 peer-checked:border-black peer-checked:bg-black peer-checked:text-white">
                    {v}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea name="notes" rows={2} placeholder="e.g. Meet at main gate, luggage space available..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all resize-none" />
          </div>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 text-amber-700 text-xs px-4 py-3 rounded-xl border border-amber-100">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Ride creators are responsible for passenger safety. Ensure your vehicle is registered and insured.</span>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/rides" className="flex-1 py-3.5 text-center text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={isPending}
            className="flex-1 py-3.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Publishing...' : 'Publish Ride'}
          </button>
        </div>
      </form>
    </div>
  );
}
