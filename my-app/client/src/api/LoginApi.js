var users  = require("../data/test");

class LoginApi {
    doLogin = loginData => {
        if (
            users.hasOwnProperty( loginData.email ) &&
            users[loginData.email].password === loginData.password
        ) {
            return Promise.resolve({
                exists: true,
                jwt: users[loginData.email] // returns user information object
            });
        }
        return Promise.reject({
            exists: false,
            error: { message: "User does not exist. Please try again." }
        });
    };

    doSignup = ({ email, password, name, sid }) => {
        if (users.hasOwnProperty( email )) {
            return Promise.reject({
                exists: false,
                error: { message: "Email already exists. Please try again." }
            });
        }
        users[email] = {
            email: email,
            password: password,
            name: name,
            sid: sid
        };

        return Promise.resolve({
            message: "Success! Redirecting to the login page."
        });
    };

    lostPassword = ({ email }) => {
        return Promise.resolve({
            message: "A password reset email was sent."
        });
    }
}

export default new LoginApi();