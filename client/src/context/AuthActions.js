export const LoginStart = (userCredentials) => {
    return {
        type: "LOGIN_START"
    }
}

export const LoginSuccess = (user) => {
    return {
        type: "LOGIN_SUCCESS",
        payload: user
    }
}

export const LoginFailure = (error) => {
    return {
        type: "LOGIN_FAILURE",
        payload: error
    }
}

export const Follow = (userCredentials) => {
    return {
        type: "FOLLOW",
        payload: userCredentials
    }
}
export const UnFollow = (userCredentials) => {
    return {
        type: "UNFOLLOW",
        payload: userCredentials
    }
}