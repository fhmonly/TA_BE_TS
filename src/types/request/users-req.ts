export type TCreateUserRequest = {
    name: string
    email: string
    password: string
    password_confirmation?: string
}