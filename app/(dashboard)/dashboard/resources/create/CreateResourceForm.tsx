'use client';

import React, { useActionState, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, CheckCircle2, Loader2, Info, ChevronDown, AlertCircle } from 'lucide-react';
import { createResource, ActionState } from '@/app/actions/listings';
import { createClient } from '@/lib/supabase';

const CATEGORIES = [
  { label: 'Books & Notes', slug: 'books' },
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Tools', slug: 'tools' },
  { label: 'Lab Equipment', slug: 'lab-equipment' },
  { label: 'Cameras', slug: 'cameras' },
  { label: 'Calculators', slug: 'calculators' },
  { label: 'Hostel Items', slug: 'hostel-items' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Other', slug: 'other' },
];

const METHODS = ['Sell', 'Rent', 'Borrow', 'Lend', 'Free'];
const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Working'];
const PRICE_UNITS = [
  { label: 'Total', value: 'total' },
  { label: 'Per Day', value: 'per_day' },
  { label: 'Per Hour', value: 'per_hour' },
  { label: 'Per Week', value: 'per_week' },
];

const INIT: ActionState = { error: null, success: false };

export default function CreateResourcePage({
  categoryMap,
}: {
  categoryMap: Record<string, string>; // slug → id
}) {
  const [state, formAction, isPending] = useActionState(createResource, INIT);
  const [method, setMethod] = useState('');
  const [condition, setCondition] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string; url?: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: File[]) => {
    const valid = files.filter(
      (f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024
    );
    if (valid.length === 0) {
      setUploadError('Please select PNG or JPG images under 5MB.');
      return;
    }
    setUploadError(null);

    const previews = valid.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setImages((prev) => [...prev, ...previews]);

    // Upload to Supabase storage
    setUploading(true);
    const supabase = createClient();
    const newUrls: string[] = [];
    for (const { file } of previews) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
      const { error } = await supabase.storage.from('resource-images').upload(path, file);
      if (error) {
        setUploadError(`Upload failed: ${error.message}`);
        setUploading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('resource-images').getPublicUrl(path);
      newUrls.push(publicUrl);
    }
    setUploadedUrls((prev) => [...prev, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setUploadedUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const needsPrice = method && !['Free', 'Borrow', 'Lend'].includes(method);
  const categoryId = categoryMap[categorySlug] ?? null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/resources" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-black hover:bg-gray-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a Resource</h1>
          <p className="text-sm text-gray-500 mt-0.5">Share something with your campus community</p>
        </div>
      </div>

      {state.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Hidden fields */}
        <input type="hidden" name="method" value={method} />
        <input type="hidden" name="condition" value={condition} />
        <input type="hidden" name="category_id" value={categoryId ?? ''} />
        <input type="hidden" name="image_urls" value={JSON.stringify(uploadedUrls)} />

        {/* Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setCategorySlug(cat.slug)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left text-sm font-medium ${
                  categorySlug === cat.slug
                    ? 'border-black bg-black text-white'
                    : 'border-gray-100 hover:border-gray-300 text-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Details</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Item Name <span className="text-red-500">*</span></label>
            <input
              required name="title"
              placeholder="e.g. ESP32 DevKit V1, Kreyszig Calculus 10th Ed..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description" rows={3}
              placeholder="Describe the item — edition, specs, accessories included..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Listing Type <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m} type="button" onClick={() => setMethod(m)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    method === m ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Condition <span className="text-red-500">*</span></label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c} type="button" onClick={() => setCondition(c)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    condition === c ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          {needsPrice && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input type="number" name="price" min="0" placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Price Unit</label>
                <div className="relative">
                  <select name="price_unit"
                    className="w-full appearance-none px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all pr-9">
                    {PRICE_UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Pickup Location</label>
              <input type="text" name="location" placeholder="e.g. Library, Block B..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Terms / Notes</label>
              <input type="text" name="terms" placeholder="e.g. Handle with care..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Photos</h2>

          {uploadError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {uploadError}
            </div>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img.preview} alt="" className="w-full h-full object-cover rounded-xl border border-gray-100" />
                  <button
                    type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {uploading && !uploadedUrls[i] && (
                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files)); }}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer border-gray-200 hover:border-gray-400 transition-all"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB each</p>
              </>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          />

          <div className="flex items-start gap-2 bg-blue-50 text-blue-700 text-xs px-3 py-2.5 rounded-lg">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>Good photos get 3× more responses. Include all angles and any damage.</span>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/dashboard/resources" className="flex-1 py-3.5 text-center text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending || uploading || !method || !condition}
            className="flex-1 py-3.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isPending ? 'Posting...' : 'Post Resource'}
          </button>
        </div>
      </form>
    </div>
  );
}
