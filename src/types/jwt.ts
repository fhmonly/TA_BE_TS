export type TRefreshToken = {
    id: number;
}

export type TAccessToken = TRefreshToken & {
    email: string;
}