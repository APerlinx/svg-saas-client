import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { User } from './types/user'

interface LoginResponse {
  token: string
}

function App() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      const response = await axios.post<LoginResponse>(
        'http://localhost:4000/auth/login',
        {
          email,
          password,
        }
      )
      localStorage.setItem('token', response.data.token)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login failed:', error.response?.data)
      } else {
        console.error('Login failed:', error)
      }
    }
  }

  const me = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }
      const response = await axios.get<User>('http://localhost:4000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Failed to fetch user data:', error.response?.data)
      } else {
        console.error('Failed to fetch user data:', error)
      }
    }
  }

  return (
    <div className="flex flex-col justify-self-center items-center gap-4 mt-12">
      <h1>User Login form</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="hover:bg-blue-700 cursor-pointer">
          Login
        </button>
      </form>
      <button onClick={me} className="hover:bg-blue-700 cursor-pointer">
        Get My Info
      </button>
    </div>
  )
}

export default App
