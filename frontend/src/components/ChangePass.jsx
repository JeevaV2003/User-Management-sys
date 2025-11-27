import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

function ChangePass({ user }) {
  let [oldPassword, setOldPassword] = useState('')
  let [newPassword, setNewPassword] = useState('')
  let [msg, setMsg] = useState('')
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      await axios.post('http://localhost:8000/api/change-password/', {
        username: user.username,
        old_password: oldPassword,
        new_password: newPassword
      })
      
      alert('Password changed!')
      navigate('/')
      
    } catch (err) {
      setMsg('Error changing password. Check old password.')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card mt-5">
          <div className="card-body">
            <h3>Change Password</h3>
            
            {msg && <div className="alert alert-danger">{msg}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Old Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={oldPassword} 
                  onChange={(e) => setOldPassword(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="mb-3">
                <label>New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  minLength="5"
                  maxLength="20"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$"
                  title="Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                />
              </div>
              
              <button type="submit" className="btn btn-primary">Update Password</button>
              <Link to="/" className="btn btn-link">Cancel</Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePass
