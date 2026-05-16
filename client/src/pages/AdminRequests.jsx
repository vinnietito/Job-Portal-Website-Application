import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminRequests = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const envAdminToken = import.meta.env.VITE_ADMIN_TOKEN
  const [adminPassword, setAdminPassword] = useState('')
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')
  const [overview, setOverview] = useState({ totalCompanies: 0, pendingCount: 0, verifiedCount: 0, pending: [], verified: [] })
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'))

  const handleLogin = async () => {
    if (!adminPassword && !envAdminToken) {
      return toast.error('Enter the admin password to log in')
    }

    try {
      setLoading(true)
      const password = adminPassword || envAdminToken
      const { data } = await axios.post(backendUrl + '/api/company/admin/login', { password })

      if (data.success) {
        setAdminToken(data.token)
        localStorage.setItem('adminToken', data.token)
        setIsLoggedIn(true)
        toast.success('Admin logged in successfully')
      } else {
        toast.error(data.message || 'Admin login failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchOverview = async () => {
    if (!adminToken) return
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/company/admin/overview', { headers: { Authorization: `Bearer ${adminToken}` } })
      if (data.success) {
        setOverview(data)
      } else {
        toast.error(data.message || 'Failed to load admin overview')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (isLoggedIn) fetchOverview()
  }, [isLoggedIn, adminToken])

  const approve = async (companyId) => {
    if (!adminToken) return toast.error('Admin token required')
    try {
      const { data } = await axios.post(backendUrl + `/api/company/verify-recruiter/${companyId}`, {}, { headers: { Authorization: `Bearer ${adminToken}` } })
      if (data.success) {
        toast.success(data.message)
        fetchOverview()
      } else {
        toast.error(data.message || 'Failed to verify recruiter')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
    setIsLoggedIn(false)
    setOverview({ totalCompanies: 0, pendingCount: 0, verifiedCount: 0, pending: [], verified: [] })
    setAdminPassword('')
  }

  return (
    <div className='min-h-screen bg-slate-50 py-10 px-4 md:px-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='rounded-3xl bg-white shadow-xl overflow-hidden'>
          <div className='bg-gradient-to-r from-slate-900 via-blue-900 to-purple-950 text-white px-8 py-10'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-3xl sm:text-4xl font-semibold'>Admin Dashboard</h1>
                <p className='mt-2 text-slate-200 max-w-2xl'>Review recruiter verification requests, approve trusted companies, and track verified recruiter counts.</p>
              </div>
              <div className='flex gap-3'>
                {isLoggedIn && (
                  <button onClick={handleLogout} className='rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition'>Sign Out</button>
                )}
              </div>
            </div>
          </div>

          <div className='p-6'>
            {!isLoggedIn ? (
              <div className='rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm'>
                <h2 className='text-xl font-semibold mb-4'>Administrator Access</h2>
                <p className='text-sm text-slate-600 mb-5'>Enter the admin secret to load pending recruiter verification requests and manage the recruiter pool.</p>
                <div className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Admin password</label>
                    <input
                      type='password'
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      className='w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:ring-blue-100 focus:outline-none'
                      placeholder='Enter admin password'
                    />
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className='inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/20 hover:bg-slate-800 transition w-full sm:w-auto'
                  >
                    {loading ? 'Logging in…' : 'Admin Login'}
                  </button>
                  <p className='text-xs text-slate-500'>If your project is configured with <span className='font-medium'>VITE_ADMIN_TOKEN</span>, leave this field empty.</p>
                </div>
              </div>
            ) : (
              <>
                <div className='grid gap-4 sm:grid-cols-3 mb-6'>
                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                    <p className='text-sm text-slate-500'>Total companies</p>
                    <p className='mt-3 text-3xl font-semibold text-slate-900'>{overview.totalCompanies}</p>
                  </div>
                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                    <p className='text-sm text-slate-500'>Pending approvals</p>
                    <p className='mt-3 text-3xl font-semibold text-amber-600'>{overview.pendingCount}</p>
                  </div>
                  <div className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                    <p className='text-sm text-slate-500'>Verified recruiters</p>
                    <p className='mt-3 text-3xl font-semibold text-emerald-600'>{overview.verifiedCount}</p>
                  </div>
                </div>

                {loading && <div className='text-slate-600 mb-6'>Loading latest data…</div>}

                <section className='mb-8'>
                  <div className='flex items-center justify-between gap-3 mb-4'>
                    <div>
                      <h2 className='text-xl font-semibold'>Pending Verification Requests</h2>
                      <p className='text-sm text-slate-500'>Approve or reject incoming recruiter requests.</p>
                    </div>
                    <button onClick={fetchOverview} className='rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition'>Refresh</button>
                  </div>

                  {overview.pending.length === 0 ? (
                    <div className='rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600'>No pending requests at the moment.</div>
                  ) : (
                    <div className='space-y-4'>
                      {overview.pending.map((item) => (
                        <div key={item._id} className='rounded-3xl border border-slate-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                          <div>
                            <p className='text-lg font-semibold text-slate-900'>{item.name}</p>
                            <p className='text-sm text-slate-500'>{item.email}</p>
                            <p className='text-xs text-slate-400'>Requested on {new Date(item.verificationRequestedAt).toLocaleString()}</p>
                          </div>
                          <button onClick={() => approve(item._id)} className='rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition'>Approve</button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <div className='mb-4'>
                    <h2 className='text-xl font-semibold'>Verified Recruiters</h2>
                    <p className='text-sm text-slate-500'>Companies already approved to access applicant resumes.</p>
                  </div>
                  {overview.verified.length === 0 ? (
                    <div className='rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600'>No verified recruiters yet.</div>
                  ) : (
                    <div className='grid gap-4'>
                      {overview.verified.map((company) => (
                        <div key={company._id} className='rounded-3xl border border-slate-200 bg-white p-5'>
                          <p className='font-semibold text-slate-900'>{company.name}</p>
                          <p className='text-sm text-slate-500'>{company.email}</p>
                          {company.verificationRequestedAt && <p className='text-xs text-slate-400'>Requested on {new Date(company.verificationRequestedAt).toLocaleDateString()}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRequests
