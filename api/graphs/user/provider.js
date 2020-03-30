import DataProvider from '~~/services/mongodb/dataprovider'

export default class UserProvider {
    users = []

    constructor(){
        this.context = null
        this.pubSub = null

        this.dataprovider = new DataProvider({
            collection: 'users'
        })
    }

    SetContext(context){
        this.context = context
        this.pubSub = this.context.pubSub
    }

    async GetUserById(id){
        return await this.dataprovider.FindById(id)
    }

    async GetUsers(){
        return await this.dataprovider.Find()
    }

    async RegisterUser(user){
        user = await this.dataprovider.Create(user)
        
        this.users.push(user)

        this.pubSub.publish('USER_REGISTERED', { UserRegistered: user })

        return user
    }




}