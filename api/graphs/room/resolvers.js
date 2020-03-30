export default {
    Query: {
        async Rooms(root, args, { RoomProvider }){
            return await RoomProvider.GetRooms()
        }
    },

    Mutation: {
        async AddRoom(root, { data }, { pubSub, RoomProvider }){
            return await RoomProvider.AddRoom(data)
        }
    },

    Subscription: {
        RoomAdded: {
            subscribe(root, args, { pubSub }, info){
                return pubSub.asyncIterator(['ROOM_ADDED'])
            }
        }
    },

    Room: {
        async owner(parent, args, { pubSub, UserProvider}, info){
            if(parent.owner){
                return await UserProvider.GetUserById(parent.owner)
            }
        },

        async users(parent, args, { pubSub, UserProvider }, info){
            if(!parent.users) return []
            return parent.users
        }
    }
}