import {useCallback, useState} from "react"


export const useRequest = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const request = useCallback(async (url, method = "GET", body = null, headers = {}) => {
        setLoading(true)
        try {
            if (body && headers["Content-Type"] === "application/json") {
                body = JSON.stringify(body)
            }
            const response = await fetch(url, { method, body, headers })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Что-то пошло не так")
            }
            setLoading(false)
            setError(null)
            setSuccess("Регистрация прошла успешно.")
            return data
        } catch(e) {
            setLoading(false)
            setSuccess(false)
            setError(e.message)
        }
    }, [])

    return { loading, error, request, success }
}