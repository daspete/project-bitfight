import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'
import AuthProvider from './provider'

export default {
    autoload: true,
    typeDefs,
    resolvers,
    provider: AuthProvider,
    imports: []
}