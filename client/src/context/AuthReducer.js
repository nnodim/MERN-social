const AuthReducer = (state = {
    user: null,
    error: false,
    isFetching: false,
}, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                error: false,
                isFetching: true,
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                error: false,
                isFetching: false,
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                error: action.payload,
                isFetching: false,
            };
        case "FOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    following: state.user.following
                        ? [...state.user.following, action.payload]
                        : [action.payload],
                },
            };
        case "UNFOLLOW":
            return {
                ...state,
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(
                        (following) => following !== action.payload
                    ),
                },
            };
        case "LOGOUT":
            return {
                user: null,
                error: false,
                isFetching: false,
            };
        default:
            return state;
    }
};

export default AuthReducer