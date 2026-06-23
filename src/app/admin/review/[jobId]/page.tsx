'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { INDORE_LOCALITIES } from '@/constants/localities'
import { ExtractionResult, IngestionJob } from '@/types/ingestion'
import { mapExtractionToPublishDefaults } from '@/lib/publish-form'
import { PropertyType, FurnishingType, TenantType } from '@/types/listing'

export default function AdminReviewPage() {
  const params = useParams<{ jobId: string }>()
  const router = useRouter()
  const [job, setJob] = useState<IngestionJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    property_type: '1BHK' as PropertyType,
    rent_monthly: 0,
    locality_slug: 'vijay_nagar',
    broker_phone: '',
    broker_name: 'Broker',
    furnishing: '' as FurnishingType | '',
    preferred_tenant: 'Any' as TenantType,
    available_from: '',
    instagram_handle: '',
  })

  useEffect(() => {
    async function loadJob() {
      const res = await fetch(`/api/ingest/${params.jobId}/status`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load job')
        setLoading(false)
        return
      }

      setJob(data)
      const result = data.result as ExtractionResult | null
      if (result) {
        const defaults = mapExtractionToPublishDefaults(result, data.reel_url)
        setForm({
          property_type: defaults.property_type,
          rent_monthly: defaults.rent_monthly,
          locality_slug: defaults.locality_slug,
          broker_phone: defaults.broker_phone,
          broker_name: defaults.broker_name,
          furnishing: defaults.furnishing || '',
          preferred_tenant: defaults.preferred_tenant,
          available_from: defaults.available_from || '',
          instagram_handle: defaults.instagram_handle || '',
        })
      }
      setLoading(false)
    }

    loadJob()
  }, [params.jobId])

  const handlePublish = async () => {
    if (!form.broker_phone || !form.rent_monthly || !form.locality_slug) {
      setError('Broker phone, rent, and locality are required')
      return
    }

    setPublishing(true)
    setError(null)

    try {
      const res = await fetch('/api/listings/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: params.jobId,
          ...form,
          furnishing: form.furnishing || null,
          available_from: form.available_from || null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Publish failed')

      router.push('/admin/ingest')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-slate-500">Loading job...</div>
  }

  if (!job) {
    return <div className="p-8 text-red-500">{error || 'Job not found'}</div>
  }

  const result = job.result as ExtractionResult | null

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/admin/ingest" className="text-sm text-slate-500 hover:text-slate-800">
        ← Back to ingestion queue
      </Link>

      <h1 className="text-3xl font-bold mt-4 mb-2">Review Listing</h1>
      <p className="text-sm text-slate-500 mb-8">
        Job {job.id.slice(0, 8)} · {job.status} · {job.step_label}
      </p>

      {job.reel_url && (
        <a
          href={job.reel_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-6"
        >
          Open source reel ↗
        </a>
      )}

      {result?.transcript && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-sm text-slate-600 max-h-40 overflow-y-auto">
          <p className="font-semibold text-slate-800 mb-2">Transcript / caption</p>
          {result.transcript}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Property type</span>
            <select
              value={form.property_type}
              onChange={(e) => setForm({ ...form, property_type: e.target.value as PropertyType })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            >
              {['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Monthly rent (₹)</span>
            <input
              type="number"
              value={form.rent_monthly || ''}
              onChange={(e) => setForm({ ...form, rent_monthly: Number(e.target.value) })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            />
          </label>

          <label className="block col-span-2">
            <span className="text-sm font-medium text-slate-700">Locality</span>
            <select
              value={form.locality_slug}
              onChange={(e) => setForm({ ...form, locality_slug: e.target.value })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            >
              {INDORE_LOCALITIES.map((l) => (
                <option key={l.slug} value={l.slug}>{l.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Broker name</span>
            <input
              value={form.broker_name}
              onChange={(e) => setForm({ ...form, broker_name: e.target.value })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Broker phone *</span>
            <input
              value={form.broker_phone}
              onChange={(e) => setForm({ ...form, broker_phone: e.target.value })}
              placeholder="+91..."
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Furnishing</span>
            <select
              value={form.furnishing}
              onChange={(e) => setForm({ ...form, furnishing: e.target.value as FurnishingType | '' })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            >
              <option value="">Unknown</option>
              <option value="Bare">Bare</option>
              <option value="Semi">Semi</option>
              <option value="Full">Full</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Preferred tenant</span>
            <select
              value={form.preferred_tenant}
              onChange={(e) => setForm({ ...form, preferred_tenant: e.target.value as TenantType })}
              className="mt-1 w-full p-2 border border-slate-300 rounded-md"
            >
              {['Any', 'Family', 'Bachelor', 'Girls', 'Boys'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handlePublish}
          disabled={publishing || job.status !== 'completed' || !!job.listing_id}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {job.listing_id ? 'Already published' : publishing ? 'Publishing...' : 'Publish listing'}
        </button>
      </div>
    </div>
  )
}