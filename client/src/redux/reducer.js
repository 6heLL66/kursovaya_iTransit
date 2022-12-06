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
            return {
                ...state,
                isAuthUser: true,
                userId: action.payload.id,
                role: action.payload.role,
            }
        case "LOGOUT_USER":
            return {...state, isAuthUser: false, user: null }
        case "SELECT_USER":
            return { ...state, selected: [...state.selected, action.payload]}
        case "UNSELECT_USER":
            return { ...state, selected: state.selected.filter((e) => {
                return e !== action.payload
            })}
        case "SELECT_ALL":
            return { ...state, selected: action.payload}
        case "UNSELECT_ALL":
            return  { ...state, selected: []}
        case "SET_THEME":
            return { ...state, theme: action.payload}
        case "SET_LANGUAGE":
            return { ...state, language: action.payload}
        default:
            return state
    }

}

export default reducer