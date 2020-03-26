import passport from 'passport'

import ExpressService from '~~/services/express'
import ExpressRouter from '~~/services/express/router'
import GraphQLService from '~~/services/graphql'
import AuthService from '~~/services/auth'

import expressConfig from './config/express'
import graphqlConfig from './config/graphql'
import authConfig from './config/auth'

const server = new ExpressService(expressConfig)

// create router
const routes = []
const routeFiles = require.context('./routes', true, /\.js$/)
routeFiles.keys().map((key) => { routes.push({ name: key, route: routeFiles(key).default }) })
const router = new ExpressRouter(server)
router.AddRoutes(routes)

// create graph routes
let graphs = []
const graphFiles = require.context('./graphs', true, /index\.js$/)
graphFiles.keys().map((key) => { graphs.push({ name: key.split('/').reverse()[1], module: graphFiles(key).default }) })
graphs = graphs.filter((graph) => { return graph.module.autoload == true })



// Start process
const StartServer = async () => {
    new AuthService(authConfig)
    const graphql = new GraphQLService({ ...graphqlConfig, server, graphs })

    server.Use(passport.initialize())

    server.Use('/healthcheck', (req, res, next) => { res.json(`api up`) })

    graphql.Start()
    server.Start()
}

StartServer()
