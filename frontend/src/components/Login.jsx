import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Login({ setUser }) {
  // state variables
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  let [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault() // stop form reload
    console.log("Logging in...")
    // console.log(username, password)
    
    try {
      // sending request to backend
      let res = await axios.post('http://localhost:8000/api/login/', {
        username: username,
        password: password
      })
      
      console.log("Login success", res.data)
      setUser(res.data.user)
      
      // save to local storage
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
      
    } catch (err) {
      console.log("Login error")
      // alert("Error")
      setError('Invalid username or password')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mt-5">
          <div className="card-body">
            <h3>Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label>Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label>Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
            
            <p className="mt-3">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
