import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'
import UserProvider from './provider'

export default {
    autoload: true,
    typeDefs,
    resolvers,
    provider: UserProvider,
    imports: []
}