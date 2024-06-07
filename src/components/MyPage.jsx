import React from 'react'
import { useLogin } from './LoginContext'


export default function MyPage() {

  const { isLoggedIn, logout, user} = useLogin()

  return (
    <div className='mypage'>{user.name}'s MyPage</div>
  )
}
