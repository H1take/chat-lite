export default (state, action) => {
    switch (action.type) {
        case "JOINED":
            return {
                ...state,
                joined: true,
                roomId: action.payload.roomId,
                userName: action.payload.userName
            }
        case "SET_USERS":
            return {
                ...state,
                users: action.payload
            }
        case "NEW_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        case "SET_DATA":
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            }
        default:
            return state;
    }
}