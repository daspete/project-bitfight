import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
import Router from './router'

class GraphQLService {
    constructor(config){
        this.config = config
        this.server = this.config.server
        
        this.apollo = null
        this.graphRouter = null

        this.middleware = null

        this.runtimeModules = []

        this.contextData = {}

        this.graphRouter = new Router(this, config.graphs)
    }

    async Start(){
        let mainModule = new GraphQLModule({
            imports: [
                ...this.graphRouter.Modules,
                ...this.runtimeModules
            ]
        })

        this.apollo = undefined

        this.apollo = new ApolloServer({
            introspection: true,
            schema: mainModule.schema,
            debug: process.env.NODE_ENV !== 'production',
            context: ({ req }) => {
                return { req, ...this.contextData, ...mainModule.context }
            }
        })

        this.middleware = this.apollo.getMiddleware({
            path: this.config.prefix,
            bodyParserConfig: { limit: '64mb' }
        })

        this.server.app.use((req, res, next) => {
            return this.middleware(req, res, next)
        })
    }

    SetContextData(data){
        this.contextData = {
            ...this.contextData,
            ...data
        }
    }

    AddGraphModule(graph){
        this.runtimeModules.push(this.graphRouter.AddGraphModule(graph))
        this.Start()
    }
}

export default GraphQLService