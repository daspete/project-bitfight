export default {
    Query: {
        async Users(root, args, { UserProvider }){
            return await UserProvider.GetUsers()
        }
    },

    Mutation: {
        async RegisterUser(root, { data }, { pubSub, UserProvider, AuthProvider }){
            return await UserProvider.RegisterUser(data)
        }
    },

    Subscription: {
        UserRegistered: {
            subscribe(root, args, context, info){
                return context.pubSub.asyncIterator(['USER_REGISTERED'])
            }
        }
    },

    User: {

    }
}