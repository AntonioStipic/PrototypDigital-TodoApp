export const signInAction = (email: string, password: string) => {
    return { type: "SIGN_IN", payload: { email, password } };
}

export const signUpAction = (email: string, password: string) => {
    return { type: "SIGN_UP", payload: { email, password } };
}

export const signOutAction = () => {
    return { type: "SIGN_OUT" };
}