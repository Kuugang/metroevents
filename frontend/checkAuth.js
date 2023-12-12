//this is not secure, im only verifying the token if it is valid

function decodeJWT(token) {
    try {
        const decodedToken = parseJWT(token);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

function parseJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error parsing JWT:", error);
        throw error;
    }
}

const getTokenFromCookie = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(cookie => cookie.startsWith('auth='));

    if (tokenCookie) {
        return tokenCookie.split('=')[1];
    }
    return null;
};

const checkAuthentication = () => {
    const token = getTokenFromCookie()
    if(token == null)return false
    if(decodeJWT(token) != null)return true;
    else return false;
};

export default {
    checkAuthentication,
};
