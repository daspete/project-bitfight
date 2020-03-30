import DataProvider from '~~/services/mongodb/dataprovider'

export default class RoomProvider {
    rooms = []

    constructor(){
        this.context = null
        this.pubSub = null

        this.dataprovider = new DataProvider({
            collection: 'rooms'
        })
    }

    SetContext(context){
        this.context = context
        this.pubSub = this.context.pubSub
    }

    async GetRooms(){
        return await this.dataprovider.Find()
    }

    async AddRoom(room){
        room = await this.dataprovider.Create(room)
        
        this.rooms.push(room)

        this.pubSub.publish('ROOM_ADDED', { RoomAdded: room })

        return room
    }




}