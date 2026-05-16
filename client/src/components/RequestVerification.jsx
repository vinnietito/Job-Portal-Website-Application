import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const RequestVerification = () => {
  const { backendUrl, companyToken, companyData, setCompanyData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const request = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/company/request-verification', {}, { headers: { token: companyToken } })
      if (data.success) {
        toast.success(data.message)
        setCompanyData(prev => prev ? { ...prev, verificationRequested: true } : prev)
      } else {
        toast.error(data.message || 'Failed to request verification')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!companyData) return null

  if (companyData.verified) return <div className='text-sm text-green-600'>Verified recruiter</div>

  if (companyData.verificationRequested) return <div className='text-sm text-yellow-600'>Verification requested — pending admin approval</div>

  return (
    <button onClick={request} disabled={loading} className='px-3 py-1 text-sm text-white bg-blue-600 rounded'>
      {loading ? 'Requesting…' : 'Request Verification'}
    </button>
  )
}

export default RequestVerification
