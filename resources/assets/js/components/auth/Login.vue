<template>
    <section class="user-login">
        <form @submit.prevent="login">
            <div class="form-login">
                <input type="email" v-model="email">
            </div>
            <div class="form-login">
                <input type="password" v-model="password">
            </div>
            <div class="form-login">
                <input type="submit" value="Connexion" @click="login">
            </div>
        </form>
    </section>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                email: '',
                password: '',
                errors: {}
            }
        },
        methods: {
            login(){
                let data ={
                    client_id: 2,
                    client_secret: 'f6EHTKqa1wMkx5Rx43HHxU5zkmrooM5BpXGEqxLf',
                    grant_type: 'password',
                    username: this.email,
                    password: this.password
                }
                axios.post('/oauth/token', data).then(
                        ({data}) => this.$auth.setToken(data.access_token, data.expires_in),
                        (errors) => this.errors = errors.response.data
                ).then(
                        _=>{
                            if(this.$route.name == "studio.login"){
                                this.$router.push({ name: 'studio.gallery.index'})
                            }
                            // A MODIFIER QUAND BOOK SERA DISPO
//                            if(this.$route.name == "book.login"){
//                                this.$route.push({ name: 'book'})
//                            }
                        }
                )
//                axios.get('/api/user')
//                        .then(response => {
//                            console.log('response ',response.data);
//                        });
            }
        }
    }
</script>

<style lang="scss">
    .form-login input{
        @import "../../../sass/_variables.scss";

        color: $primary-text-color;
    }
</style>