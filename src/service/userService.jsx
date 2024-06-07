import React from 'react'
import axios from 'axios'

export default class UserService{
  constructor(){
    const name = ""
  }

  async login(id, pw){
    try{
      return(
      await axios.post(`http://localhost:4000/login/${id}`, {
        id: id,
        pw: pw,
      })
      .then((res) => {return res.data.token}))
    } catch (e) {
      console.error(e)
    }
  }

  async signUp(id, pw){
    try{
      return(
      await axios.post(`http://localhost:4000/signup/${id}`, {
        id: id,
        pw: pw,
      })
      .then((res) => {return res.data.token}))
    } catch(e) {
      console.error(e)
    }
  }

  async uploadFile(id, formData){
    try {
      return(
      await axios.post(`http://localhost:4000/main/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {return res}));

    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };
}

