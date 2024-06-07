import React, {useEffect, useState} from 'react'
import { useLogin } from './LoginContext'
import Spinner from './Spinner'

export default function Result() {
  const { isLoggedIn, changeLogin,  logout, user} = useLogin()

  const [result, setResult] = useState("")

    if (user.name){
      const user_result = user.result.data.result
    }

    return (
      <div className='result'>
        <div className='result_pic'>
        <img src={user.image} alt="result" />
        </div>
        <div className='result_word'><h2>진단 결과</h2>
        <h3>예측된 클래스: {result}</h3>
        </div>
      </div>
  
    )
  }  

