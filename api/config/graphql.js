import 'dotenv/config'

export default {
    prefix: process.env.GRAPHQL_PREFIX || '/graphql'
}