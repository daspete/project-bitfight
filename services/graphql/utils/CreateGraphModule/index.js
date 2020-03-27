import { GraphQLModule } from '@graphql-modules/core'

export default (graph, router = null) => {
    let graphData = graph
    if(typeof graph.module !== 'undefined') graphData = graph.module

    let moduleData = { ...graphData }

    let moduleContext = {
        pubSub: router.graphService.pubSub,
    }

    if(graphData.context) moduleContext = graphData.context 

    moduleData.context = (ctx) => { 
        return { ...ctx, ...moduleContext } 
    }

    return new GraphQLModule({ ...moduleData })
}