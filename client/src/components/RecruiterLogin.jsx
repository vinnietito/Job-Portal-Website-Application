import React, { useState } from 'react'
import { assets } from '../assets/assets'
import e from 'cors'

const RecruiterLogin = () => {

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [image, setImage] = useState(false)

  const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (state === "Sign Up" && !isTextDataSubmitted) {
      setIsTextDataSubmitted(true)
    }
  }



  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
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
              <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                <img src={assets.person_icon} alt="" />
                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} type="text" value={name} placeholder='Company Name' required />
              </div>
            )}

            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.email_icon} alt="" />
              <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} type="email" value={email} placeholder='Email Id' required />
            </div>

            <div className='border px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
              <img src={assets.lock_icon} alt="" />
              <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} type="password" value={password} placeholder='Password' required />
            </div>


          </>}

        <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password</p>

        <button type='submit' className='bg-blue-600 text-white px-6 py-2 rounded-full w-full '>
          {state === 'Login' ? 'login' : isTextDataSubmitted ? 'create account' : 'next'}
        </button>

        {
          state === 'Login'
            ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign Up</span></p>
            : <p className='mt-5 text-center'>Already ahve an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Login</span></p>
        }

      </form>
    </div>
  )
}

export default RecruiterLogin
