import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'
import { useLogin } from './LoginContext'

export default function Nav() {

  const { isLoggedIn, logout, user} = useLogin()

  if (isLoggedIn == true)
  {
    return (
      <div className='nav'>
        <h1 className='title title_text'>
        <Link to = '/'className="link">Skin Cancer Classfication</Link>
        </h1>
        
        <div> <h2 className='nav_user'>wellcome! {user.name}</h2></div>
        <div className='signUp_Login'>
        <button className='button1'><Link to = '/Main' className="link">Main</Link></button>
        <button className='button1'><Link to = '/Mypage' className="link">Mypage</Link></button>
        <button className='button2' onClick={logout}><Link to = '/' className="link">Logout</Link></button>
        </div>
      </div>
    )
  }

  else{
    return (
      <div className='nav'>
        <h1 className='title'>
        <Link to = '/' className="link">Skin Cancer Classfication</Link>
        </h1>
        
        <div className='signUp_Login'>
        <button className='button1'><Link to = '/SignUp' className="link">SignUp</Link></button>
        <button className='button2'><Link to = '/Login' className="link">Login</Link></button>
        </div>
      </div>
    )
  }
}
