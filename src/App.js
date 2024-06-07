import './App.css';
import { Outlet } from 'react-router-dom'
import Nav from './components/Nav';
import { QueryClient, QueryClientProvider } from 'react-query'
import Footer from './components/Footer';
import { LoginProvider } from './components/LoginContext';

const queryClient = new QueryClient()

function App() {
  return (
    <>
    <LoginProvider>
    <Nav/>
      <QueryClientProvider client={queryClient}>
        <Outlet/>
      </QueryClientProvider>
    <Footer/>
    </LoginProvider>
    </>
  )
}

export default App;
