<template>
    <div class="page">
        <!-- {{ Users }} -->
    </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
    apollo: {
        $subscribe: {
            
            UserRegistered: {
                prefetch: false,
                query: gql`
                    subscription UserRegistered {
                        UserRegistered {
                            _id
                            personal {
                                firstname
                                lastname
                            }
                        }
                    }
                `,
                result(bla){
                    console.log('res', bla)
                }
            }
        },

        // Users: {
        //     fetchPolicy: 'no-cache',
        //     query: gql`
        //         query {
        //             Users {
        //                 _id
        //             }
        //         }
                
        //     `,
        // }
    }
}
</script>

<style lang="scss">
.page {
    color: darkgray;
}
</style>