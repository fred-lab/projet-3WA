<template>
    <section class="user-login">
        <h1>Studio</h1>
        <form @submit.prevent="login">
            <div class="form-login">
                <input type="email" v-model="email">
            </div>
            <div class="form-login">
                <input type="password" v-model="password">
            </div>
            <div class="form-login">
                <span @click="login">Se Connecter</span>
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
    @import "../../../sass/_variables.scss";

    .user-login{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 5rem 0;

        h1{
            color: $primary-text-color;
            font-family: $title-font;
        }

        .form-login{
            display: flex;

            input{
                width: 20em;
                height: 3em;
                padding: 0.5em;
                margin: 1em 0;
                color: rgba(0,0,0,0.5);
            }
            span{
                display: inline-block;
                margin: 1em auto;
                padding: 0.5em 1em;
                color: $primary-text-color!important;
                font-size: 1.4em;
                font-weight: bold;
                background-color: $info-color;
                transition: color 0.3s ease-in;
                cursor: pointer;

                    &:hover{
                         color: $danger-color!important;
                         transition: color 0.5s ease-in;
                     }
            }
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            transition: background-color 500000s ease-in-out 0s;
            /*-webkit-text-fill-color: #fff !important;*/
        }
    }

</style>