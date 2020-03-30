import { GraphQLModule } from '@graphql-modules/core'

import * as typeDefs from './schema.graphql'
import resolvers from './resolvers'

import UserGraph from '../user'

export default new GraphQLModule({
    typeDefs,
    resolvers,
    context: (ctx) => { return { ...ctx } },
    imports: [UserGraph]
})