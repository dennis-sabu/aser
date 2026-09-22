import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientServer } from '@/lib/supabase-server';
import { Package, Plus, ArrowLeft, ExternalLink, Tag } from 'lucide-react';
import type { Resource } from '@/lib/database.types';

export const metadata = {
  title: 'My Resources | CampusNet',
};

export default async function ManageResourcesPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: resourcesData } = await supabase
    .from('resources')
    .select('*, category:categories(*)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  const resources = (resourcesData || []) as Resource[];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/resources"
              className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Resources
            </Link>
          </div>
          <h1 className="text-3xl font-normal tracking-tight text-gray-900">My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your active campus resource listings.</p>
        </div>

        <Link href="/dashboard/resources/create">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Resource
          </button>
        </Link>
      </div>

      {/* Listings Grid */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {res.image_urls && res.image_urls.length > 0 ? (
                      <img src={res.image_urls[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    res.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {res.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{res.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{res.category?.name ?? 'General'}</span>
                    <span>•</span>
                    <span className="capitalize">{res.method ?? 'Available'}</span>
                    {res.condition && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{res.condition}</span>
                      </>
                    )}
                  </div>
                </div>

                {res.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{res.description}</p>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-gray-900">
                    {res.price ? `₹${res.price}` : 'Free'}
                  </span>
                  {res.price_unit && res.price_unit !== 'total' && (
                    <span className="text-xs text-gray-500 ml-1">/{res.price_unit.replace('_', ' ')}</span>
                  )}
                </div>

                <Link
                  href={`/dashboard/resources/${res.id}`}
                  className="flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-black transition-colors"
                >
                  View Listing
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No active listings yet</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Have textbooks, lab components, calculators, or project kits? List them to share, sell, or rent to peers on your campus.
          </p>
          <Link href="/dashboard/resources/create">
            <button className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              List Your First Resource
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
