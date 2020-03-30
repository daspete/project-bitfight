import { ApolloServer } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
// import Router from './router'
import { execute, subscribe } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'

let providers = []
const providerFiles = require.context('../../api/graphs', true, /provider\.js$/)
providerFiles.keys().map((key) => { providers.push(providerFiles(key).default) })

class GraphQLService {
    constructor(params){
        this.config = params.config
        this.modules = params.modules
        this.server = params.server
        this.providers = providers
        

        this.pubSub = new PubSub()

        this.mainModule = null
        this.apollo = null
        this.middleware = null

        this.context = {
            pubSub: this.pubSub   
        }

        this.providers = this.providers.map((provider) => {
            return new provider()
        })
    }

    async Start(){
        this.providers.map((provider) => {
            this.context[provider.constructor.name] = provider
        })

        this.mainModule = new GraphQLModule({
            context: (ctx) => {
                const contextData = { ...ctx, ...this.context }
                this.providers.map((provider) => { provider.SetContext(contextData) })

                return contextData
            },
            imports: [
                ...this.modules
            ]
        })

        this.apollo = new ApolloServer({
            introspection: true,
            schema: this.mainModule.schema,
            debug: process.env.NODE_ENV !== 'production',
            context: (context) => {

                let contextData = {
                    ...context,
                    ...this.context
                }

                return contextData
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
            schema: this.mainModule.schema,
            ...this.mainModule.subscriptions,
            onConnect: (connectionParams, webSocket, context) => {
                context = { ...context, ...this.context }
                return context
            },
            onDisconnect: (webSocket, context) => {}
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