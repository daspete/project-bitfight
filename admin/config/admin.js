import 'dotenv/config'

export default {
    globalName: 'manabloxadmin',

    server: {
        port: process.env.ADMIN_PORT || 3001,
        host: process.env.ADMIN_IP || '127.0.0.1'
    },

    env: {

    },

    srcDir: 'admin',
    buildDir: 'build/admin',

    modulesDir: ['./node_modules'],

    build: {
        extractCSS: process.env.NODE_ENV !== 'development',

        splitChunks: {
            layouts: true,
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

}