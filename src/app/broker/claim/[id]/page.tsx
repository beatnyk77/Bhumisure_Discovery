'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function BrokerClaimPage() {
  const params = useParams()
  const router = useRouter()
  const [step, setStep] = useState<'info' | 'otp' | 'success'>('info')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep('otp')
      setLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = async () => {
    setLoading(true)
    // Simulate verification and claim logic
    setTimeout(() => {
      setStep('success')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        {step === 'info' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
              🏠
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Claim Your Listing</h1>
            <p className="text-slate-500 mb-8">
              Verify your phone number to manage this listing and receive direct enquiries.
            </p>
            <div className="space-y-4">
              <input
                type="tel"
                placeholder="Enter Phone Number (+91...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendOTP}
                disabled={!phone || loading}
                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Verify OTP</h1>
            <p className="text-slate-500 mb-8">
              We sent a code to {phone}. Please enter it below.
            </p>
            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl text-center text-2xl font-mono tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={otp.length < 6 || loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Verifying...' : 'Complete Verification'}
              </button>
              <button 
                onClick={() => setStep('info')}
                className="text-sm text-slate-400 hover:text-slate-600 font-medium"
              >
                Change Phone Number
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Listing Claimed!</h1>
            <p className="text-slate-500 mb-8">
              You can now manage this listing and view all enquiries from your dashboard.
            </p>
            <button
              onClick={() => router.push('/broker/dashboard')}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
