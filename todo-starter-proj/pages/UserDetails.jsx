import { userService } from "../services/user.service.js"
import { utilService } from "../services/util.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { updateUser } from "../store/user.actions.js"

const { useState, useEffect } = React
const { useParams, Link } = ReactRouterDOM
const { useSelector } = ReactRedux

export function UserDetails() {
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const [profileToEdit, setProfileToEdit] = useState(null)
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)

    // The full user (with activities) is only needed here, so load it from the service
    useEffect(() => {
        userService.getById(userId)
            .then(user => {
                setUser(user)
                const prefs = user.prefs || userService.getDefaultPrefs()
                setProfileToEdit({ fullname: user.fullname, ...prefs })
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load user')
            })
    }, [userId])

    function handleChange({ target }) {
        const { name, value } = target
        setProfileToEdit(prevProfile => ({ ...prevProfile, [name]: value }))
    }

    function onSaveProfile(ev) {
        ev.preventDefault()
        const { fullname, color, bgColor } = profileToEdit
        updateUser({ _id: user._id, fullname, prefs: { color, bgColor } })
            .then(() => {
                setUser(prevUser => ({ ...prevUser, fullname }))
                showSuccessMsg('Profile saved')
            })
            .catch(() => showErrorMsg('Cannot save profile'))
    }

    if (!user) return <div>Loading...</div>

    const isOwnPage = loggedinUser && loggedinUser._id === user._id
    // On your own page, the store's balance is always filled in and stays live
    const balance = isOwnPage ? loggedinUser.balance : user.balance
    const activities = user.activities || []
    return (
        <section className="user-details">
            <h1>{user.fullname}</h1>
            <p>Balance: {balance}</p>

            {isOwnPage &&
                <form className="profile-form" onSubmit={onSaveProfile}>
                    <h2>Profile</h2>
                    <label htmlFor="fullname">Name:</label>
                    <input value={profileToEdit.fullname} onChange={handleChange}
                        type="text" id="fullname" name="fullname" required />

                    <label htmlFor="color">Color:</label>
                    <input value={profileToEdit.color} onChange={handleChange}
                        type="color" id="color" name="color" />

                    <label htmlFor="bgColor">BG Color:</label>
                    <input value={profileToEdit.bgColor} onChange={handleChange}
                        type="color" id="bgColor" name="bgColor" />

                    <button>Save</button>
                </form>}

            <h2>Activities</h2>
            {activities.length ?
                <ul className="activity-list">
                    {activities.map((activity, idx) =>
                        <li key={activity.at + '-' + idx}>
                            <span className="activity-time">{utilService.getTimeAgo(activity.at)}: </span>
                            {activity.txt}
                        </li>
                    )}
                </ul> :
                <p>No activities yet</p>}

            <Link to="/todo">Back to todos</Link>
        </section>
    )
}
