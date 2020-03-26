import { spawn } from 'child_process'

export default async ({ name, command, params }) => {
    return new Promise((resolve, reject) => {
        const child = spawn(command, params)

        child.stdout.on('data', (data) => {
            console.log(`[${ new Date().toISOString() }] [${ name }] ${ data }`.replace('\n', ''))
        })

        child.stderr.on('data', (data) => {
            console.log(`${ data }`)
        })

        child.on('close', (code) => {
            if(code != 0){
                reject()
            }else{
                resolve()
            }
        })
    })
}