import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function Register() {
  // form states
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')
  let [email, setEmail] = useState('')
  let [error, setError] = useState('')
  
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    
    try {
      // calling api
      await axios.post('http://localhost:8000/api/register/', {
        username: username,
        password: password,
        email: email
      })
      
      console.log("Registered!")
      alert('Registration successful! Please login.')
      navigate('/login')
      
    } catch (err) {
      console.log(err)
      // check if server sent a specific error message
      if (err.response && err.response.data) {
        // if it's a simple error message
        if (err.response.data.error) {
          setError(err.response.data.error)
        } else {
          // maybe it's a serializer error object? just show generic for now or try to pick one
          // let's just show the first one we find if possible, or generic
          setError('Registration failed. Check your inputs.')
        }
      } else {
        setError('Something went wrong. Server might be down.')
      }
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mt-5">
          <div className="card-body">
            <h3>Register (Student)</h3>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleRegister}>
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
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
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
                  minLength="5"
                  maxLength="20"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$"
                  title="Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                />
              </div>
              
              <button type="submit" className="btn btn-success">Register</button>
            </form>
            
            <p className="mt-3">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
