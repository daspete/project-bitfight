import 'dotenv/config'

export default {
    secret: process.env.AUTH_JWTSECRET || 'this-is-a-very-secure-string-which-protects-the-jwt',
    tokenLifeTime: parseInt(process.env.AUTH_JWT_TOKEN_LIFETIME) || (60 * 60 * 24 * 7), // default 7 days
    usernameField: process.env.AUTH_USERNAME_FIELD || 'email',
    passwordField: process.env.AUTH_PASSWORD_FIELD || 'password'
}