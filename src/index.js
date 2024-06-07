import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Main from './components/Main';
import MyPage from './components/MyPage';
import NotFound from './components/NotFound';
import Spinner from './components/Spinner';
import Result from './components/Result'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <NotFound/>,
    children: [
      {index: true, element: <Home/>},
      {path: 'login', element: <Login/>},
      {path: 'signup', element: <SignUp/>},
      {path: 'main', element: <Main/>},
      {path: 'mypage', element: <MyPage/>},
      {path: 'spinner', element: <Spinner/>},
      {path: 'result', element: <Result/>},
    ]
  }
])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);


