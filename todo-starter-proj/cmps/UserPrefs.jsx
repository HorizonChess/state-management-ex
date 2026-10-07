const { useEffect } = React
const { useSelector } = ReactRedux

// Applies the logged-in user's saved color prefs to the whole page; renders nothing
export function UserPrefs() {
    const prefs = useSelector(storeState =>
        storeState.loggedinUser ? storeState.loggedinUser.prefs : null)

    useEffect(() => {
        applyPrefs(prefs)
    }, [prefs])

    return null
}

// Empty strings remove the inline style, falling back to the stylesheet
export function applyPrefs(prefs) {
    document.body.style.color = prefs ? prefs.color : ''
    document.body.style.backgroundColor = prefs ? prefs.bgColor : ''
}
