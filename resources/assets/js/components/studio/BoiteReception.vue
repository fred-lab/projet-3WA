<template>
    <section class="admin-messages">
        <h1>Boite de réception</h1>
        <div class="info-box" v-show="info" @click="onClose" @keyup.enter="onClose" @keyup.esc="onClose" @keyup.space="onClose">
            <div class="info-container">
                <div class="confirm-delete" v-if="confirmMessage">
                    <span>Supprimer ce message ?</span>
                    <span class="message-success" @click="confirmDelete">Oui</span>
                    <span class="message-danger"  @click="abortDelete">Non</span>
                </div>
                <div class="confirm-delete" v-if="banMessage">
                    <span>Bannir cette IP ?</span>
                    <span class="message-success" @click="confirmBan">Oui</span>
                    <span class="message-danger"  @click="abortBan">Non</span>
                </div>
                <div class="confirm-delete" v-if="massDeleteMessage || massBanMessage">
                    <span v-show="massDeleteMessage">Supprimer la sélection ?</span>
                    <span v-show="massBanMessage">Bannir la sélection ?</span>
                    <span class="message-success" @click="confirmSelection">Oui</span>
                    <span class="message-danger"  @click="abortSelection">Non</span>
                </div>
                <span class="info-success" v-show="success.length > 0">{{ success }}</span>
                <span class="info-errors" v-show="errors.length > 0">{{ errors }}</span>
            </div>
        </div>
        <div class="inbox-dashboard">
            <span class="select-all"><i class="fa fa-reply-all" aria-hidden="true"></i></span>
            <input type="checkbox" title="sélectionner tout" v-model="checkAll" value="true" @change="checkedAll">
            <span class="message-danger" @click="onMassDelete">Supprimer la sélection</span>
            <span class="message-danger" @click="onMassBan">Bannir la sélection</span>
        </div>
        <section class="message-group">
            <template v-for="message in messages">
                <div class="message-item">
                    <div class="message-selection">
                        <input type="checkbox" :value="message" v-model="checkbox">
                    </div>
                    <div class="message-preview" @click="toggleContent(message)" :class="{answered: message.answered}">
                        <span class="message-name" :title="message.name">{{ message.name }}</span>
                        <span class="message-email" :title="message.email">{{ message.email }}</span>
                        <span class="message-title" :title="message.title">{{ message.title }}</span>
                    </div>
                    <div class="message-action">
                        <span class="message-success" v-show="!message.answered" @click="replyTo(message)">Répondre</span>
                        <span class="message-danger" @click="onDelete(message)">Supprimer</span>
                        <span class="message-danger" @click="onBan(message)">Ban</span>
                    </div>
                </div>
                <div class="message-content" v-show="displayContent === message" @click="displayContent = null">
                    <p v-if="message.answered == 0">{{ message.message}}</p>
                    <div v-else>
                        <p class="answered">{{ message.answer }}</p>
                        <p> {{message.message}} </p>
                    </div>
                </div>
                <div class="message-reply" v-if="displayReply === message" >
                    <textarea v-model="reply" v-focus="displayReply === message" @blur="onClose" @keyup.esc="onClose" @keyup.ctrl.enter="onReply(message)"></textarea>
                    <span class="message-success" @click="onReply(message)">Envoyer</span>
                    <span class="message-danger" @click="onClose">Annuler</span>
                    <span class="counter" v-show="!info">{{ reply.length}} caractères - ESC pour fermer - CTRL+ENTER pour envoyer</span>
                </div>
            </template>
        </section>
    </section>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                messages: [],
                errors: [],
                success: [],
                target: null,
                info: false,
                confirmMessage: false,
                banMessage: false,
                massDeleteMessage: false,
                massBanMessage: false,
                selectAll: null,
                reply: '',
                displayReply: null,
                displayContent : null,
                checkbox: [],
                checkAll: false
            }
        },
        computed:{

        },
        methods:{
            checkedAll(){
                (this.checkAll) ? this.checkbox = this.messages : this.checkbox = []
            },
            replyTo(message){
                this.displayReply = this.displayContent= message
            },
            toggleContent(message){
                (this.displayContent === null) ? this.displayContent = message : this.displayContent = null;
            },
            onReply(message){
                if(this.reply){
                    axios.put('/studio/message/'+message.id, {
                        title: message.title,
                        reply: this.reply,
                        receiver: message.name,
                        replyMail: message.email,
                        quote: message.message
                    }).then(
                            (({data})=> this.success = data),
                            (errors)=> this.errors = errors.response.data
                    ).then(
                            _=>{
                                this.messages[this.messages.indexOf(message)].answer = this.reply
                                this.messages[this.messages.indexOf(message)].answered = true
                                this.info = true
                                setTimeout(this.onClose, 1500)
                            }
                    )
                }
            },
            focus(message){
                this.info = true
                this.target = message
            },
            onDelete(message){
                this.focus(message)
                this.confirmMessage = true
            },
            confirmDelete(){
                if(this.target != null){
                    axios.delete('/studio/message/'+this.target.id).then(
                            (({data}) => this.success = data),
                            (errors) => this.errors = errors.response.data
                    ).then(
                            _=> {this.messages.splice(this.messages.indexOf(this.target), 1)
                                this.confirmMessage = false
                                this.info = true
                                setTimeout(this.onClose, 1000)
                            }
                    )
                }
            },
            abortDelete(){
                this.target = null
                this.info = false
            },
            onMassDelete(){
                this.info = this.massDeleteMessage = true
            },
            onMassBan(){
                this.info = this.massBanMessage = true
                this.target = 'ip'
            },
            confirmSelection(){
                if(this.checkbox.length > 0){
                    let url = ''
                    let requestArray = []
                    for(let index in this.checkbox){
                        requestArray[index] = this.checkbox[index]
                    }

                    (this.target == 'ip') ? url = '/mass-ban' : url = '/mass-delete'

                    axios.post(url, requestArray).then(
                            (({data}) => this.success = data),
                            (errors) => this.errors = errors.response.data
                    ).then(
                            (_=>{
                                this.massDeleteMessage = this.massBanMessage =false
                               requestArray.forEach(
                                        (item) => {
                                            return this.messages = this.messages.filter(
                                                    (el) => el.id != item.id
                                            )
                                        }
                                )
                            })
                    ).then(
                            _=>{
                                requestArray=[]
                                this.target = null
                                this.info = true
                                setTimeout(this.onClose, 1000)
                            }
                    )
                }
            },
            onBan(message){
                this.focus(message)
                this.banMessage = true
            },
            confirmBan(){
                if(this.target != null){
                    axios.post('ban', {
                        ip: this.target.ip
                    }).then(
                            (({data}) => this.success = data),
                            (errors) => this.errors = errors.response.data
                    ).then(
                            _=> {this.messages = this.messages.filter((el)=> el.ip != this.target.ip)
                                this.banMessage = false
                                this.info = true
                                setTimeout(this.onClose, 1000)
                            }
                    )
                }
            },
            abortSelection(){
                this.abortDelete()
                this.checkbox = []
                this.massDeleteMessage = this.massBanMessage =false
            },
            abortBan(){
                this.abortDelete()
            },
            onClose(){
                this.info = this.massDeleteMessage = this.massBanMessage =false
                this.errors = this.success = this.checkbox = []
                this.displayReply = this.displayContent = null
                this.reply = ''
            }
        },
        created(){
            axios.get('/studio/message').then(
                    ({data}) => this.messages = data,
                    (errors) => this.errors = errors.response.data
            )
        }
    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .admin-messages{
        display: flex;
        flex-flow: column;
        align-items: center;

        h1{
            color: $primary-text-color;
        }

        input[type="checkbox"]{
            width: 2vw;
        }
    }
    .inbox-dashboard,
    .message-group{
        width: 100%;
        background-color: $primary-text-color;
    }
    .inbox-dashboard{
        margin-top: 2em;
        height: 3vw;
        line-height: 3vw;
        border-bottom-style: solid;
        border-width: thin;
        background-color: rgba(0, 0, 0, 0.5);

        .message-danger{
            margin: 0 2em;
        }
    }
    .message-group{
        display: flex;
        flex-flow: column;
    }
    .message-item{
        display: flex;
        heigth: 3vw;
        padding: 1em 0;
        border-style: solid;
        border-width: thin;

        span{
            display: inline-flex;
        }
    }
    .message-preview span{
        cursor: zoom-in;
    }
    .answered{
        color: $info-color!important;
    }
    .message-name{
        width: 6vw;
        overflow: hidden;
    }
    .message-email{
        width: 12vw;
        overflow: hidden;
    }
    .message-title{
        width: 48vw;
        margin-right: 1vw;
        overflow: hidden;
    }
    .message-content p{
        color: rgba(0,0,0, 0.5);
        text-shadow: none;
        line-height: 1.5em;
        padding: 0 2em;
        cursor: zoom-out;
    }
    .message-reply{
        background-color: rgba(0,0,0, 0.1);
        display: flex;
        align-items: flex-end;
        padding-bottom: 1em;

        textarea{
            width: 70vw;
            margin: 1em;
            padding: 0.5em 1em;
            line-height: 2em;
            color: #0F0F0F;
            cursor: text;
            background-color: $primary-text-color;
            border: thin solid $info-color!important;
        }

        span{
            margin: 1em;
            padding: 0.5em;
        }
    }
    .message-success,
    .message-danger{
        padding: 0 1em;
        border-radius: 5em;
        border-color: $primary-text-color;
        border-width: thin;
        color: $primary-text-color;
    }
    .message-success{
        background-color: $success-color;

        &:hover{
            border-color: $success-color;
            cursor: pointer;
         }
    }
    .message-danger{
        background-color: $danger-color;

        &:hover{
             border-color: $danger-color;
             cursor: pointer;
         }
    }
    .select-all{
        display: inline-block;
        margin-left: 1em;
        color: $primary-text-color;
        transform: rotate(-90deg);
    }
    .info-box{
        position: absolute;
        width: 120vw;
        height: 150vw;
        background-color: rgba(0, 0, 0, 0.5);
        cursor: pointer;

        .info-container{
            position: fixed;
            top: 20vw;
            left: 45vw;
            width: 20vw;
            height: 10vw;
            line-height: 10vw;
            text-align: center;
            background-color: $primary-text-color;
        }

        .info-success{
            color: $success-color;
        }
        .info-errors{
            color: $danger-color;
        }
    }
    .counter{
        position: absolute;
        left: 40%;
        font-size: 0.6em;
        color: rgba(0,0,0, 0.6)
    }
</style>