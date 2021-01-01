
export default async function auth(token, dispatch) {
    const body = JSON.stringify({ token })
    console.log(body)
    const response = await fetch("/api/auth/auth", {
        method: "POST",
        body,
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()

    if (data.data) {
        dispatch({ type: "AUTH_USER" })
    }
    else {
        dispatch({ type: "LOGOUT_USER" })
        localStorage.removeItem("token")
    }
}