import React, { useState } from 'react'
import UserService from '../service/userService';
import { useLogin } from './LoginContext';


export default function Login() {

  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const { isLoggedIn, changeLogin, signUp, login, logout, user} = useLogin()

  const saveUserId = event => {
    setId(event.target.value);
  };

  const saveUserPw = event => {
    setPw(event.target.value);
  };

  const handleClick = (e) => {
    const isBlank = checkBlank()
    if(isBlank == true) {
      alert("please type your id or password")
    }
    else{
      signUp(id,pw)
    }
  }

  const checkBlank = () => {
    if (id == "" || pw == ""){
      return true
    }
    else{
      return false
    }
  } 

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      handleClick()
    }
  }

  return (
    <div className='login'>
      <h2>ID</h2>
      <input type="text" placeholder='ID' value={id} onChange={saveUserId}/>
      <h2>Password</h2>
      <input type="text" placeholder='Password' value={pw} onChange={saveUserPw} onKeyDown={(e) => activeEnter(e)}/>
      <button className='login_btn' onClick={handleClick}>SignUp</button>
    </div>
  )
}
