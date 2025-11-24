import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';

const AddJob = () => {

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Nairobi');
  const [category, setCategory] = useState('Programming');
  const [level, setLevel] = useState('Beginner level');
  const [salary, setSalary] = useState(0);

  const editorRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    //Initialize quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        })
    }
  }, [])

  return (
    <div>
      <form>

          <div>
            <p>Job Title</p>
            <input type="text" placeholder='Type here' onChange={e => setTitle(e.target.value)} value={title} required />
          </div>

          <div>
            <p>Job Description</p>
            <div ref={editorRef}>

            </div>
          </div>

          <div>

            <div>
              <p>Job Category</p>
              <select onChange={e => setCategory(e.target.value)}>
                {JobCategories.map((category,index)=>(
                  <option value={category} key={index}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <p>Job Location</p>
              <select onChange={e => setLocation(e.target.value)}>
                {JobLocations.map((location,index)=>(
                  <option value={location} key={index}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <p>Job Category</p>
              <select onChange={e => setCategory(e.target.value)}>
                {JobCategories.map((category,index)=>(
                  <option value={category} key={index}>{category}</option>
                ))}
              </select>
            </div>
            


          </div>

      </form>
    </div>
  )
}

export default AddJob
