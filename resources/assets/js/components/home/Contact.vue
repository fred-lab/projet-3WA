<template>
    <section class="contact-view">
        <form @submit.prevent="onSubmit">
            <div class="form-group">

                <h2>Envie d'une collaboration ? Laissez-moi un message :</h2>

                <div class="form-element">
                    <div class="form-element">
                        <input id="name" data-key="name" type="text" v-model.trim="name"
                               @focus="focus($event)" @blur="target = null"
                        :class="{solid: name}">
                        <label for="name"
                               :class="{ select: target == 'name' || name}">
                                Votre nom
                            <span class="form-error" v-for="error in errors.name">{{ error }}</span>
                        </label>
                    </div>
                    <div class="form-element">
                        <input id="email" data-key="email" type="email" v-model.trim="email"
                               @focus="focus($event)" @blur="target = null"
                        :class="{solid: name}">
                        <label for="email":class="{select: target == 'email' || email}">
                            Votre Email<span class="form-error" v-for="error in errors.email">{{ error }}</span>
                        </label>
                    </div>
                </div>
                <div class="form-element">
                    <input id="title" data-key="title" type="title" v-model.trim="title"
                           @focus="focus($event)" @blur="target = null"
                           :class="{solid: name}">
                    <label for="title":class="{select: target == 'title' || title}">
                        Sujet<span class="form-error" v-for="error in errors.title">{{ error }}</span>
                    </label>
                </div>
                <div class="form-element">
                    <textarea id="message" data-key="message" v-model.trim="message" @focus="focus($event)"
                              @blur="target = null" :class="{solid: message}"></textarea>
                    <label for="message" :class="{select: target == 'message' || message}">
                        Votre message
                        <span class="form-error" v-for="error in errors.message">{{ error}}</span>
                    </label>
                </div>
                <span class="form-error" v-for="error in errors.spam">{{ error }}</span>
                <span class="form-success" v-show="success" @click="success ='' ">{{ success }}</span>
                <span class="counter" v-show="target == 'message'">{{ message.length }}/1000 caractères</span>
                <div class="form-element">
                    <input type="submit" value="Envoyer" :disabled="disabled">
                </div>
            </div>
        </form>
    </section>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                name: '',
                email: '',
                title: '',
                message: '',
                target: null,
                errors: [],
                success: ''
            }
        },
        computed:{
            disabled : function() {
                return Object.entries(this.errors).length > 0
            }
        },
        methods:{
            onSubmit(){
                if(this.name && this.email && this.message){

                    axios.post('/message', {
                        name: this.name,
                        email:   this.email,
                        title: this.title,
                        message: this.message
                    }).then(
                            _ => {
                                this.success = 'Votre message a été bien été envoyé'
                                this.name = this.email = this.title = this.message = ''
                            },
                            (error) => {this.errors = error.response.data
                                console.log('error ',error.response.data)}
                    )
//                            .catch((error) => console.log('e ',error.response.data.error))
                }
                else{
                    console.log('contenu vide')
                }
            },
            focus: function(e){
                this.target = e.target.dataset.key
                this.errors =[]
                this.success = ''
            }
        },
        created(){
            console.log('component created')
        }
    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";
    
    .contact-view{
        display: flex;
        justify-content: center;
        padding: 15em 0;

        background-image: url("/assets/img/desktop/concert_desktop.jpg");
        background-repeat: no-repeat;

        .form-group{
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            width: 100vw;
            height: 30vw;

            font-size: 1.2rem;
            color: $primary-text-color;
            background-image: url("/assets/img/desktop/bck_contact_desktop.png");
            background-repeat: no-repeat;

            .form-element{
                display: flex;
                position: relative;
                padding: 1vw 2vw;

                label{
                    position: absolute;
                    top: 1.5em;
                    cursor: pointer;

                    transition: all 0.5s ease-in;
                }
            }
            .counter{
                color: rgba(255,255,255, 0.5);
                top: 65.5em;
                left: 50%;
            }
        }
    }
    h2{
        align-self: center;
        font-size: 1.2rem;
    }
    input,
    textarea{
        padding: 0.5em 0em;
        background-color: transparent;
        color: transparent;
        cursor: pointer;

        border-bottom:thin solid $primary-text-color!important;

        &:focus {
             color: $primary-text-color;
             transition: color 0.3s ease-out;
             transition-delay: 0.3s;

                /*+ label {*/
                 /*animation-name: move;*/
                  /*animation-duration: 0.3s;*/

                 /*transition: all 0.3s ease-in;*/
                /*}*/

        }
    }

    input:not([type="submit"]){
        width: 30vw;
    }
    textarea{
        width: 64vw;
        height: 10vw;
    }
    #title{
        width: 64vw;
    }

    input[type="submit"]{
        padding: 0.5em 0.8em;
        background-color: transparent;
        color: #fff;
        border-style: solid;
        border-radius: 10em;
        box-shadow: 1px 1px 2px grey;
        transition: all 0.5s linear;
        text-shadow: 1px 1px 2px grey;

            &:disabled{
                cursor: not-allowed;
             }
    }
    .select{
        position: absolute;
        top: 0em!important;
        transition: all 0.3s ease-in;
    }
    .solid{
        color: $primary-text-color!important;
    }
    .form-error,
    .form-success{
        padding-left: 1em;
        font-size: 0.9rem;
    }
    .form-error{
        color: #ff3654;
    }
    .form-success{
        color: #26ee77;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
        transition: background-color 500000s ease-in-out 0s;
        -webkit-text-fill-color: #fff !important;
    }
</style>