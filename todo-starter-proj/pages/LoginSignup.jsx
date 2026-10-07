import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { login, signup } from '../store/user.actions.js'

const { useState } = React
const { useNavigate } = ReactRouter

export function LoginSignup() {
    const navigate = useNavigate()

    const [isSignup, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        isSignup ? onSignup(credentials) : onLogin(credentials)
    }

    function onLogin(credentials) {
        login(credentials)
            .then(() => {
                showSuccessMsg('Logged in successfully')
                navigate('/todo')
            })
            .catch(() => showErrorMsg('Wrong username or password'))
    }

    function onSignup(credentials) {
        signup(credentials)
            .then(() => {
                showSuccessMsg('Signed in successfully')
                navigate('/todo')
            })
            .catch(err => showErrorMsg(err))
    }

    function toggleSignup(ev) {
        ev.preventDefault()
        setIsSignUp(prevIsSignup => !prevIsSignup)
    }

    return (
        <div className="login-page">
            <form className="login-form card form-stack" onSubmit={handleSubmit}>
                <h2>{isSignup ? 'Create an account' : 'Welcome back'}</h2>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignup && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button className="primary">{isSignup ? 'Sign up' : 'Log in'}</button>
                <div className="btns">
                    <a href="#" onClick={toggleSignup}>
                        {isSignup ?
                            'Already a member? Login' :
                            'New user? Signup here'
                        }
                    </a >
                </div>
            </form>
        </div >
    )
}
