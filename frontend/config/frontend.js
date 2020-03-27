import 'dotenv/config'

import axios from 'axios'
import fs from 'fs'
import path from 'path'

import graphQLConfig from './graphql'

const FetchIntrospectionSchema = async () => {
    try {
        const response = await axios.post(process.env.API_URL, {
            query: `
                query {
                    __schema {
                        types {
                            kind
                            name
                            possibleTypes {
                                name
                            }
                        }
                    }
                }
            `
        })
    
        const fragmentTypes = response.data.data
    
        const schemaPath = path.join(process.cwd(), 'frontend', 'data')
    
        fs.writeFileSync(`${ schemaPath }/fragments.json`, JSON.stringify(fragmentTypes))
    }catch(err){

    }
}


export default async () => {
    console.log('fetching latest graphql introspection schema')
    await FetchIntrospectionSchema()

    return {
        globalName: 'bitfightfrontend',

        server: {
            port: process.env.FRONTEND_PORT || 3001,
            host: process.env.FRONTEND_IP || '127.0.0.1'
        },

        env: {
            API_URL: process.env.API_URL,
            COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
            COOKIE_PATH: process.env.COOKIE_PATH || '/',
            GRAPHQL_TOKEN_NAME: process.env.GRAPHQL_TOKEN_NAME || 'manablox',
        },

        srcDir: 'frontend',
        buildDir: 'build/frontend',

        modulesDir: ['./node_modules'],

        modules: [
            '@nuxtjs/device',
            '@nuxtjs/apollo',
            'cookie-universal-nuxt',
            'nuxt-basic-auth-module'
        ],

        build: {
            extractCSS: process.env.NODE_ENV !== 'development',

            splitChunks: {
                // layouts: true,
                pages: true,
                commons: true
            },

            loaders: {
                vue: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },

            extend(config, ctx) {
                // force loading svgs with html-loader
                const imageLoader = config.module.rules.find((loader) => { return loader.test.toString() == /\.(png|jpe?g|gif|svg|webp)$/i.toString() })
                imageLoader.test = /\.(png|jpe?g|gif|webp)$/
                config.module.rules.push({ test: /\.svg$/, loader: 'html-loader' });
            }
        },

        head: {
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1' },
                { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
            ],
            script: [
                // { src: 'https://cdn.polyfill.io/v2/polyfill.min.js?features=default,fetch,Object.entries' },
                // { src: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.4/ofi.min.js' }
            ]
        },

        apollo: graphQLConfig
    }
    

}