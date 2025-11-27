import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function AdminUsers() {
  let [users, setUsers] = useState([])
  
  // form state for new user
  let [newUser, setNewUser] = useState({ username: '', password: '', email: '', role: 'student' })
  let [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      let res = await axios.get('http://localhost:8000/api/users/')
      // console.log(res.data)
      setUsers(res.data)
    } catch (err) {
      console.log("Error loading users")
      alert('Error fetching users')
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:8000/api/users/add/', newUser)
      alert('User added!')
      setNewUser({ username: '', password: '', email: '', role: 'student' }) // reset form
      setShowForm(false)
      fetchUsers() // refresh list
    } catch (err) {
      // alert('Error adding user')
      if (err.response && err.response.data && err.response.data.error) {
        alert("Error: " + err.response.data.error)
      } else {
        alert('Error adding user. Check details.')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8000/api/users/delete/${id}/`)
        // refresh list
        fetchUsers()
      } catch (err) {
        alert('Error deleting user')
      }
    }
  }

  return (
    <div className="mt-5">
      <h2>User Management (Admin)</h2>
      <Link to="/" className="btn btn-outline-primary mb-3 me-2">Back to Home</Link>
      <button onClick={() => setShowForm(!showForm)} className="btn btn-success mb-3">
        {showForm ? 'Cancel' : 'Add New User'}
      </button>
      
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4>Add User</h4>
            <form onSubmit={handleAddUser}>
              <div className="row">
                <div className="col">
                  <input type="text" placeholder="Username" className="form-control" required 
                    value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
                </div>
                <div className="col">
                  <input type="email" placeholder="Email" className="form-control" required 
                    value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                </div>
                <div className="col">
                  <input type="password" placeholder="Password" className="form-control" required 
                    value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
                </div>
                <div className="col">
                  <select className="form-control" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col">
                  <button type="submit" className="btn btn-primary">Create User</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                {/* cannot delete other admins or self for now, just hiding button for admins */}
                {u.role !== 'admin' && (
                  <button onClick={() => handleDelete(u.id)} className="btn btn-danger btn-sm">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsers
