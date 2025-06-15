import { HttpError } from 'http-errors'

export function isErrorInstanceOfHttpError(error: unknown): error is HttpError {
    return error instanceof Error && 'status' in error
}
