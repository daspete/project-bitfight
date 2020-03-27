export default {
    Query: {
        Users(root, args, { UserProvider }){
            return UserProvider.GetUsers()
        }
    },

    Mutation: {
        async RegisterUser(root, { data }, { pubSub, UserProvider, AuthProvider }){
            return await UserProvider.RegisterUser(data)
        }
    },

    Subscription: {
        UserRegistered: {
            subscribe(root, args, { pubSub }, info){
                return pubSub.asyncIterator(['USER_REGISTERED'])
            }
        }
    },

    User: {

    }
}