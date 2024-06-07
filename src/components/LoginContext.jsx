import React, { createContext, useState, useContext } from 'react';
import UserService from '../service/userService';
import { useNavigate } from 'react-router-dom';

const LoginContext = createContext();

export const useLogin = () => {
  return useContext(LoginContext);
}

export const LoginProvider = ({ children }) => {

  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(new UserService())

  const login = async (id,pw) => {
    const new_user = await user.login(id,pw)
    if(new_user) {
      const name_split = new_user.split('_')
      const user_name = name_split[0]
      user.name = user_name
      setUser(user)
      navigate("/main")
      changeLogin()
      
    }
    else{
      alert("Invaild Id or Password")
    }
  }

  const signUp = async (id,pw) => {
    const new_user = await user.signUp(id,pw)
  
    if(new_user.data == "유저 존재") {
      alert("user already exists")
    }
    else {
      const name_split = new_user.split('_')
      const user_name = name_split[0]
      user.name = user_name
      setUser(user)
      navigate("/main")
      changeLogin()
    }
  }

  const logout = () => {
    setUser(new UserService());
    changeLogin();
  }

  const changeLogin = () => {
    const new_isLoggedIn = !isLoggedIn
    return(setIsLoggedIn(new_isLoggedIn))
  }

  const uploadFile = async (user, formData) => {
    const result = await user.uploadFile(user.name, formData)
    user.result = result
    setUser(user)
    navigate("/result")
  }

  return (
    <LoginContext.Provider value={{isLoggedIn, changeLogin, signUp, login, logout, user, uploadFile, setUser}}>
      {children}
    </LoginContext.Provider>
  );
}