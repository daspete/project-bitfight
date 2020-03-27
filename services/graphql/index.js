import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
import Router from './router'
import { execute, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'

class GraphQLService {
    constructor(config){
        this.config = config
        this.server = this.config.server
        
        this.apollo = null
        this.graphRouter = null

        this.middleware = null

        this.runtimeModules = []

        this.contextData = {}
        this.providers = {}

        this.pubSub = new PubSub()

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

        for(let i = 0; i < this.graphRouter.ModuleProviders.length; i++){
            const module = this.graphRouter.ModuleProviders[i].module
            if(module.provider){
                this.providers[module.provider.name] = new module.provider()
            }
            
        }

        this.apollo = new ApolloServer({
            introspection: true,
            schema: mainModule.schema,
            debug: process.env.NODE_ENV !== 'production',
            context: ({ req }) => {
                let context = { 
                    req, 
                    pubSub: this.pubSub,
                    ...this.contextData, 
                    ...mainModule.context,
                }

                Object.keys(this.providers).map((providerName) => {
                    this.providers[providerName].SetContext(context)
                })

                context = {
                    ...context,
                    ...this.providers
                }

                return context
            }
        })

        this.middleware = this.apollo.getMiddleware({
            path: this.config.prefix,
            bodyParserConfig: { limit: '64mb' }
        })

        this.server.app.use((req, res, next) => {
            return this.middleware(req, res, next)
        })

        new SubscriptionServer({
            execute,
            subscribe,
            schema: mainModule.schema,
            ...mainModule.subscriptions
        }, {
            server: this.server.server,
            path: this.config.subscriptionPrefix
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