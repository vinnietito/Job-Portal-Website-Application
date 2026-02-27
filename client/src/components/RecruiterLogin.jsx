import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import e from 'cors'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RecruiterLogin = () => {

  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [image, setImage] = useState(false)

  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

  const {setShowRecruiterLogin, backendUrl, setCompanyToken, setCompanyData} = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true)
    }

    try {

      if (state === "Login") {

        const {data} = await axios.post(backendUrl + '/api/company/login', {email, password})

        if(data.success) {
          console.log(data);
          setCompanyData(data.company)
          setCompanyToken(data.token)
          localStorage.setItem('companyToken', data.token)
          setShowRecruiterLogin(false)
          navigate('/dashboard')
        }

      }
      
    } catch (error) {
      
    }


  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  },[])

  return (
    <div className='absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center backdrop-blur-sm bg-black/30'>
      <form onSubmit={onSubmitHandler} className='relative p-10 bg-white rounded-xl text-slate-500'>
        <h1 className='text-2xl font-medium text-center text-neutral-700'>Recruiter {state}</h1>
        <p className='text-sm'>Welcome back! Please sign in to continue</p>
        {state === "Sign Up" && isTextDataSubmitted
          ? <>
          
          <div className='flex items-center gap-4 my-10'>
            <label htmlFor="image">
              <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) :  assets.upload_area}alt="" />
              <input onChange={e=> setImage(e.target.files[0])} type="file" id='image' hidden />
            </label>
            <p>Upload Company <br />logo</p>
          </div>

          </>
          : <>
            {state !== 'Login' && (
              <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
                <img src={assets.person_icon} alt="" />
                <input className='text-sm outline-none' onChange={e => setName(e.target.value)} type="text" value={name} placeholder='Company Name' required />
              </div>
            )}

            <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
              <img src={assets.email_icon} alt="" />
              <input className='text-sm outline-none' onChange={e => setEmail(e.target.value)} type="email" value={email} placeholder='Email Id' required />
            </div>

            <div className='flex items-center gap-2 px-4 py-2 mt-5 border rounded-full'>
              <img src={assets.lock_icon} alt="" />
              <input className='text-sm outline-none' onChange={e => setPassword(e.target.value)} type="password" value={password} placeholder='Password' required />
            </div>


          </>}

        {state === "Login" && <p className='my-4 text-sm text-blue-600 cursor-pointer'>Forgot Password</p>}

        <button type='submit' className='w-full px-6 py-2 mt-4 text-white bg-blue-600 rounded-full'>
          {state === 'Login' ? 'login' : isTextDataSubmitted ? 'create account' : 'next'}
        </button>

        {
          state === 'Login'
            ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign Up</span></p>
            : <p className='mt-5 text-center'>Already ahve an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Login</span></p>
        }

        <img onClick={e => setShowRecruiterLogin(false)} className='absolute cursor-pointer top-5 right-5' src={assets.cross_icon} alt="" />

      </form>
    </div>
  )
}

export default RecruiterLogin
