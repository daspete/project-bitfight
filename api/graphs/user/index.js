import { GraphQLModule } from '@graphql-modules/core'

import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'

export default new GraphQLModule({
    typeDefs,
    resolvers,
    context: (ctx) => { return { ...ctx } },
    imports: []
})