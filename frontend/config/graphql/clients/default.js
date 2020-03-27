import { BatchHttpLink } from 'apollo-link-batch-http'
import { ApolloLink, concat, split } from 'apollo-link'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import fragmentTypes from '../../../data/fragments.json'

const StripTypename = (obj, propToDelete) => {
    for(const property in obj){
        if(
            (typeof obj[property] === 'object' && typeof File == 'undefined') ||
            (typeof obj[property] === 'object' && !(obj[property] instanceof File))
        ){
            delete obj.property
            obj[property] = StripTypename(obj[property], propToDelete)
        }else{
            if(property === propToDelete) delete obj[property]
        }
    }

    return obj
}

export default ({ store }) => {
    const graphApiUrl = process.env.API_URL

    const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData: fragmentTypes })

    const cache = new InMemoryCache({
        fragmentMatcher: fragmentMatcher,
        dataIdFromObject(o){
            if(typeof o._id === 'undefined'){ return JSON.stringify(o) }
            return o._id
        }
    })

    const link = new BatchHttpLink({
        batchMax: 100,
        batchInterval: 1,
        uri: graphApiUrl
    })

    

    const httpLink = ApolloLink.split(
        operation => operation.getContext().hasUpload,
        createUploadLink({ uri: graphApiUrl }),
        link
    )

    const stripTypename = new ApolloLink((operation, forward) => {
        if(operation.variables){
            operation.variables = StripTypename(operation.variables, '__typename')
            
        }
        return forward ? forward(operation) : null
    })

    const wsLink = process.browser ? new WebSocketLink({
        uri: 'ws://192.168.1.6:3100/subscriptions',
        options: {
            reconnect: true,
        },
    }) : null

    const fullLink = process.browser ? split(
        ({ query }) => {
            const definition = getMainDefinition(query)

            return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        },
        wsLink,
        httpLink
    ) : httpLink

    return {
        defaultHttpLink: false,
        link: concat(stripTypename, ApolloLink.from([
            fullLink
        ])),
        
        fragmentMatcher,
        cache,
        defaultOptions: {
            query: {
                fetchPolicy: 'network-only'
            }
        }
    }
}