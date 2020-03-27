export default (error, context) => {
    try{
        console.log(JSON.stringify(error))
        console.log(error.graphQLErrors)
        console.log(error.networkError.result.errors)
    }catch(err){
        // console.log(err);
    }

    console.log('TODO:: make a redirect to an error page', error)


    context.error({ statusCode: 500, message: 'Server error' })
}