export default class AuthProvider {
    tokens = {
        'dfkjghfdjhgfd': 'dfkghjfdkj hsdfkljdsflkjh'
    }

    constructor(){
        this.context = null
        this.pubSub = null
    }

    SetContext(context){
        this.context = context
        this.pubSub = this.context.pubSub
    }

    Login(){
        return this.tokens
    }




}