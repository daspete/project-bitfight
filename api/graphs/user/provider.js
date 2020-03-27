export default class UserProvider {
    users = []

    constructor(){
        this.context = null
        this.pubSub = null
    }

    SetContext(context){
        this.context = context
        this.pubSub = this.context.pubSub
    }

    GetUsers(){
        return this.users
    }

    RegisterUser(user){
        user._id = new Date().getTime()
        
        this.users.push(user)

        this.pubSub.publish('USER_REGISTERED', { UserRegistered: user })

        return user
    }




}