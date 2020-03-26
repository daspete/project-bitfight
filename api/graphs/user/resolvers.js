export default {
    Query: {
        async Users(root, args, context, info){
            return [{
                _id: '875894375dfljksgsd',
                username: 'testuser',
                personal: {
                    firstname: 'test',
                    lastname: 'user'
                },
                email: 'daspetemail@gmail.com'
            }]
        }
    },

    User: {

    }
}