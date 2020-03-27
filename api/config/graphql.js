import 'dotenv/config'

export default {
    prefix: process.env.GRAPHQL_PREFIX || '/graphql',
    subscriptionPort: process.env.API_SUBSCRIPTION_PORT || 3050,
    subscriptionPrefix: process.env.API_SUBSCRIPTION_PREFIX || '/subscriptions'

}