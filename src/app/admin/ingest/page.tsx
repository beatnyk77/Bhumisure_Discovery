'use client'

import { useState, useEffect } from 'react'
import { IngestionJob } from '@/types/ingestion'

export default function AdminIngestPage() {
  const [reelUrl, setReelUrl] = useState('')
  const [manualTranscript, setManualTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<IngestionJob[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    const { data, error } = await fetch('/api/admin/jobs').then(res => res.json())
    if (!error) setJobs(data)
  }

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelUrl, manualTranscript }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')

      setReelUrl('')
      setManualTranscript('')
      fetchJobs()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Ingestion</h1>
        <button
          type="button"
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' })
            window.location.href = '/admin/login'
          }}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Sign out
        </button>
      </div>

      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-12">
        <h2 className="text-xl font-semibold mb-4">Submit New Reel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reel URL</label>
            <input
              type="url"
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Manual Transcript (Optional)</label>
            <textarea
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Paste transcript here if available..."
              className="w-full p-2 border border-slate-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div >
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Submitting...' : 'Queue Job'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">ID</th>
                <th className="p-4 font-semibold text-slate-700">Status</th>
                <th className="p-4 font-semibold text-slate-700">Progress</th>
                <th className="p-4 font-semibold text-slate-700">Result</th>
                <th className="p-4 font-semibold text-slate-700">Created</th>
                <th className="p-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-slate-500">{job.id.slice(0, 8)}...</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                      job.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                    {job.step_label || '---'}
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    {new Date(job.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    {job.status === 'completed' && !job.listing_id && (
                      <a
                        href={`/admin/review/${job.id}`}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Review →
                      </a>
                    )}
                    {job.listing_id && (
                      <span className="text-xs text-green-600 font-medium">Published</span>
                    )}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No jobs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
