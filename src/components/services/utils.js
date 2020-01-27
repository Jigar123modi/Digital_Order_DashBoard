import decode from 'jwt-decode';

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const setAccessToken = (value) => {
    return localStorage.setItem("accessToken", value);
};

export const clearAccessToken = () => {
    localStorage.removeItem("accessToken");
};

export const isLoggedIn = () => {
    const accessToken = getAccessToken();
    return !!accessToken && !isTokenExpired(accessToken);
};

const isTokenExpired = (token) => {
    const expirationDate = getTokenExpirationDate(token);
    if (expirationDate < new Date()) {
        clearAccessToken();
    }
    return expirationDate < new Date();
}

export const decodeToken = () => {
    return decode(getAccessToken());
};

const getTokenExpirationDate = (encodedToken) => {
    try {
        const token = decode(encodedToken);
        if (!token.exp) {
            return null;
        }
        const date = new Date(0);
        date.setUTCSeconds(token.exp);
        return date;
    } catch (error) {
        return null
    }
}