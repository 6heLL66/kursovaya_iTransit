const defaultState = {
    isAuthUser: false,
    isAuthAdmin: false
}

function reducer(state = defaultState, action) {
    switch (action.type) {
        case "AUTH_USER":
            state.isAuthUser = true
            return state
        case "AUTH_ADMIN":
            state.isAuthAdmin = true
            return state
        case "LOGOUT_USER":
            state.isAuthUser = false
            return state
        case "LOGOUT_ADMIN":
            state.isAuthAdmin = false
            return state
        default:
            return state
    }
}

export default reducer