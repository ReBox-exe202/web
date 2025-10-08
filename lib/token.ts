// In-memory token holder used by axios without importing zustand (avoids circular deps)
let currentToken: string | null = null;

export function setToken(token: string | null) {
    currentToken = token;
}

export function getToken(): string | null {
    return currentToken;
}

// no default export
