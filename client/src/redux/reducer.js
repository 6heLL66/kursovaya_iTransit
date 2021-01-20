const defaultState = {
    isAuthUser: false,
    userId: null,
    role: null,
    theme: "light",
    language: "rus",
    selected: []
}

function reducer(state = defaultState, action) {
    switch (action.type) {
        case "AUTH_USER":
            state.isAuthUser = true
            state.userId = action.payload.id
            state.role = action.payload.role
            return state
        case "LOGOUT_USER":
            state.isAuthUser = false
            state.user = null
            return state
        case "SELECT_USER":
            state.selected = [...state.selected, action.payload]
            return state
        case "UNSELECT_USER":
            state.selected = state.selected.filter((e) => {
                return e !== action.payload
            })
            return state
        case "SELECT_ALL":
            state.selected = action.payload
            return state
        case "UNSELECT_ALL":
            state.selected = []
            return state
        case "SET_THEME":
            state.theme = action.payload
            return state
        case "SET_LANGUAGE":
            state.language = action.payload
            return state
        default:
            return state
    }

}

export default reducer