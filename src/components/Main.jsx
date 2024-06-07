import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'
import { useLogin } from './LoginContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Main() {
  
  const navigate = useNavigate()
  const { isLoggedIn, logout, user, uploadFile, setUser} = useLogin()
  const [image, SetImage] = useState("")
  const [formData, SetformData] = useState(null)
  let selectedFile = null

  const handleFileChange = async (event) => {
    selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
        SetImage(reader.result);
        user.image = reader.result
        setUser(user)
  };
    const formData = new FormData();
    formData.append('img', selectedFile);
    formData.append('id', user.name)
    SetformData(formData) 
  };

  const handleUpload = (e) => {
    e.preventDefault()
    navigate("/spinner")
    uploadFile(user, formData)
  }

  /*const handleUpload = async (e) => {
    e.preventDefault()
    localStorage.setItem('user', user.name)
    navigate("/result")
    const result = await user.uploadFile(user.name, formData)
    console.log(result)
  } */

  return (
  <>
  <div className='main'>
  <div className='main_items'>
  <label for="avatar"><h2>Choose a picture:</h2></label>
  <input type="file" onChange={handleFileChange} id="avatar" name="file" accept="image/png, image/jpeg" />
  <div className='file_preview'>
        {image && <img className='image' src={image} alt="preview" />}
  </div>
  <button type="button" onClick={handleUpload}>upload</button>
  </div>
  </div>
  </>
  )
}
