import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import AdminUsers from './components/AdminUsers'
import ChangePass from './components/ChangePass'
import { useState, useEffect } from 'react'

function App() {
  // storing user info
  const [user, setUser] = useState(null)

  useEffect(() => {
    // check if user is already logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <BrowserRouter>
      <div className="container mt-4">
        <Routes>
          {/* login page */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          
          {/* register page */}
          <Route path="/register" element={<Register />} />
          
          {/* home page, protected */}
          <Route path="/" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
          
          {/* admin only */}
          <Route path="/admin-users" element={user && user.role === 'admin' ? <AdminUsers /> : <Navigate to="/" />} />
          
          <Route path="/change-password" element={user ? <ChangePass user={user} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
