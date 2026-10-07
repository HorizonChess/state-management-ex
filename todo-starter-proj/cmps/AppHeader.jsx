const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter
const { useSelector } = ReactRedux

import { UserMsg } from "./UserMsg.jsx"
import { Progress } from "./Progress.jsx"
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/user.actions.js'


export function AppHeader() {
    const navigate = useNavigate()
    const user = useSelector(storeState => storeState.userModule.loggedinUser)

    function onLogout() {
        logout()
            .then(() => {
                showSuccessMsg('Logged out')
                navigate('/auth')
            })
            .catch(() => showErrorMsg('Cannot log out'))
    }
    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Todo App</h1>
                <Progress />
                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/todo" >Todos</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                </nav>
                {user ?
                    <section className="user-info">
                        <Link to={`/user/${user._id}`} className="user-name">Hello {user.fullname}</Link>
                        <span className="user-balance">Balance: {user.balance}</span>
                        <button onClick={onLogout}>Logout</button>
                    </section> :
                    <NavLink to="/auth" className="login-link">Login</NavLink>}
            </section>
            <UserMsg />
        </header>
    )
}
