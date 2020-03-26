import 'dotenv/config'

import ChildProcess from '~~/utils/childprocess'

const isDevMode = !(process.env.NODE_ENV == 'production')

const StartManablox = async () => {
    let startParams = ['dev']
    if(!isDevMode) startParams = ['build', '-r']

    if(process.env.API_ENABLED == 'true') ChildProcess({ name: 'manablox-api', command: 'manablox', params: [...startParams, 'api/api.js'] })
    if(process.env.ADMIN_ENABLED == 'true') ChildProcess({ name: 'manablox-admin', command: 'manablox', params: [...startParams, 'admin/admin.js'] })
    if(process.env.FRONTEND_ENABLED == 'true') ChildProcess({ name: 'manablox-frontend', command: 'manablox', params: [...startParams, 'frontend/frontend.js'] })
}

StartManablox()