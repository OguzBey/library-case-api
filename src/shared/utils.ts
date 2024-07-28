export const to = <T, E = Error>(promise: Promise<T>): Promise<{ error: E } | { result: T }> => promise.then((result: T) => ({ result })).catch((error: E) => ({ error }));
