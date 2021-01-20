
export default async function auth(token, dispatch) {
    try {
        const body = JSON.stringify({ token })
        const res = await fetch("/api/auth/auth", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()

        console.log("auth", data)
        if (data.ok) {
            dispatch({ type: "AUTH_USER", payload: { id: data.user._id, role: data.user.role } })
            dispatch({ type: "SET_THEME", payload: data.user.theme })
            dispatch({ type: "SET_LANGUAGE", payload: data.user.language })
            return data
        } else {
            dispatch({type: "LOGOUT_USER"})
            dispatch({ type: "SET_THEME", payload: localStorage.getItem("theme") || "light" })
            dispatch({ type: "SET_LANGUAGE", payload: localStorage.getItem("language") || "rus" })
        }
    } catch (e) {
        console.log(e)
    }
}