import { userService } from "../services/user.service.js"
import { utilService } from "../services/util.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, Link } = ReactRouterDOM
const { useSelector } = ReactRedux

export function UserDetails() {
    const { userId } = useParams()
    const [user, setUser] = useState(null)
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)

    // The full user (with activities) is only needed here, so load it from the service
    useEffect(() => {
        userService.getById(userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load user')
            })
    }, [userId])

    if (!user) return <div>Loading...</div>

    const isOwnPage = loggedinUser && loggedinUser._id === user._id
    // On your own page, the store's balance is always filled in and stays live
    const balance = isOwnPage ? loggedinUser.balance : user.balance
    const activities = user.activities || []
    return (
        <section className="user-details">
            <h1>{user.fullname}</h1>
            <p>Balance: {balance}</p>

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
