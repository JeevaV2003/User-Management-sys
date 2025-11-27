import { Link, useNavigate } from 'react-router-dom'

function Home({ user, setUser }) {
  const navigate = useNavigate()

  // logout function
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user') // clear storage
    navigate('/login')
  }

  return (
    <div className="card mt-5">
      <div className="card-body text-center">
        <h1>Welcome, {user.username}!</h1>
        <p className="lead">Role: {user.role}</p>
        
        <div className="mt-4">
          {/* show admin button only if admin */}
          {user.role === 'admin' && (
            <Link to="/admin-users" className="btn btn-warning me-2">Manage Users</Link>
          )}
          
          <Link to="/change-password" class="btn btn-secondary me-2">Change Password</Link>
          
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  )
}

export default Home
