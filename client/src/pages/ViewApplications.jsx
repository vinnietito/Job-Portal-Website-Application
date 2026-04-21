import React, { useContext, useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ViewApplications = () => {

  const { backendUrl, companyToken } = useContext(AppContext)

  const [applicants, setApplicants] = useState(false)

  // Function to Fetch Company job Application Data
  const fetchCompanyJobApplications = async () => {

    try {

      const {data} = await axios.get(backendUrl + '/api/company/applicants',
        {headers: {token: companyToken}}
      )

      if (data.success) {
        setApplicants(data.applications.reverse())
      } else  {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error('Failed to fetch applicants')
    }
  }


  // Function to Update Job Application Status
  const changeJobApplicationStatus = async (id, status) => {

    try {

      const {data} = await axios.post(backendUrl + '/api/company/change-status',
        {id, status},
        {headers: {token: companyToken}}
      )

      if (data.success) {
        fetchCompanyJobApplications()
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }


  }




  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications()
    }

  },[companyToken])


  return applicants ? applicants.length === 0 ? ( <div></div>) : (
    <div className='container p-4 mx-auto'>
      <div>
        <table className='w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b-0'>
              <th className='px-4 py-2 text-left'>#</th>
              <th className='px-4 py-2 text-left'>User Name</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Job Title</th>
              <th className='px-4 py-2 text-left max-sm:hidden'>Location</th>
              <th className='px-4 py-2 text-left'>Resume</th>
              <th className='px-4 py-2 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter( item => item.jobId && item.userId).map((applicant, index)=>(
              <tr key={index} className='text-gray-700'>
                <td className='px-4 py-2 text-center border-b'>{index +1}</td>
                <td className='flex items-center justify-center px-4 py-2 text-center border-b'>
                  <img className='w-10 h-10 mr-3 rounded-full max-sm:hidden' src={applicant.userId.image} alt="" />
                  <span>{applicant.userId.name}</span>
                </td>
                <td className='px-4 py-2 border-b max-sm:hidden'>{applicant.jobId.title}</td>
                <td className='px-4 py-2 border-b max-sm:hidden'>{applicant.jobId.location}</td>
                <td className='px-4 py-2 border-b'>
                  <a className='inline-flex items-center gap-2 px-3 py-1 text-blue-400 bg-blue-50' href={applicant.userId.resume} target='_blank'>
                    Resume <img src={assets.resume_download_icon} alt="" /></a>
                </td>
                <td className='relative px-4 py-2 border-b'>
                  <div className='relative inline-block text-left group'>
                    <button className='text-gray-500 action-button'>...</button>
                    <div className='absolute top-0 right-0 z-10 hidden w-32 mt-2 bg-white border border-gray-200 rounded shadow md:left-0 group-hover:block'>
                      <button className='block w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-100'>Accept</button>
                      <button className='block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100'>Reject</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />
}

export default ViewApplications
