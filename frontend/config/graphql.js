export default {
    cookieAttributes: {
        path: process.env.COOKIE_PATH || '/',
        domain: process.env.COOKIE_DOMAIN || 'localhost'
    },

    tokenName: process.env.APOLLO_TOKEN_NAME || 'manabloxtoken',

    includeNodeModules: true,

    errorHandler: '~/utils/graphqlerror.js',
    clientConfigs: {
        default: '~/config/graphql/clients/default.js'
    }
}