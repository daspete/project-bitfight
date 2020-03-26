import { Nuxt, Builder } from 'nuxt'

import ExpressService from '~~/services/express'
import ExpressRouter from '~~/services/express/router'

import expressConfig from './config/express'
import frontendConfig from './config/frontend'



const isDevMode = !(process.env.NODE_ENV == 'production')
frontendConfig.dev = isDevMode

const server = new ExpressService(expressConfig)

// create router
const routes = []
const routeFiles = require.context('./serverroutes', true, /\.js$/)
routeFiles.keys().map((key) => { routes.push({ name: key, route: routeFiles(key).default }) })
const router = new ExpressRouter(server)
router.AddRoutes(routes)

// Start process
const StartServer = async () => {
    const nuxt = new Nuxt(frontendConfig)

    const builder = new Builder(nuxt)
    await builder.build()


    server.Use('/healthcheck', (req, res, next) => { res.json(`frontend up`) })
    server.Use(nuxt.render)

    server.Start()
}

StartServer()
