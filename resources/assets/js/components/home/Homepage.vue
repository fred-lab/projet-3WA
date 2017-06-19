<template>
    <section class="preview"  v-if="galleries.length > 0" v-wheel="onMove" v-touch="onMove" v-scroll="scrollNav">
        <transition name="slide-up" appear mode="out-in">
            <div class="focus" v-if="trigger" key="focus">
                <gallery-preview :path="galleries[0].pictures[0].path" :filename="galleries[0].pictures[0].title"
                                 :slug="galleries[0].slug" :category="category(galleries[0].category_id)" :title="galleries[0].title"
                                 :width="galleries[0].pictures[0].width"
                ></gallery-preview>
            </div>
        </transition>
        <!--<div class="hr" :style="{top: middlePage+'px'}">-->

        <!--</div>-->


            <div class="grid" key="grid-preview">
                <div class="row">
                    <transition appear mode="out-in" v-if="grid" @before-enter="enterLeft" @enter="enter" @leave="leaveLeft" >
                        <div class="item" data-level="1">
                            <gallery-preview :path="galleries[1].pictures[0].path" :filename="galleries[1].pictures[0].thumb_name"
                                             :slug="galleries[1].slug" :category="category(galleries[1].category_id)" :title="galleries[1].title"></gallery-preview>
                        </div>
                    </transition>
                    <transition appear mode="out-in" v-if="grid" @before-enter="enterRight" @enter="enter" @leave="leaveRight">
                        <div class="item" data-level="1">
                            <gallery-preview :path="galleries[2].pictures[0].path" :filename="galleries[2].pictures[0].thumb_name"
                                             :slug="galleries[2].slug" :category="category(galleries[2].category_id)" :title="galleries[2].title"></gallery-preview>
                        </div>
                    </transition>
                </div>
                <div class="row">
                    <transition appear mode="out-in" v-if="grid" @before-enter="enterLeft" @enter="enter" @leave="leaveLeft">
                        <div class="item" data-level="2">
                            <gallery-preview :path="galleries[3].pictures[0].path" :filename="galleries[3].pictures[0].thumb_name"
                                             :slug="galleries[3].slug" :category="category(galleries[3].category_id)" :title="galleries[3].title"></gallery-preview>
                        </div>
                    </transition>
                    <transition appear mode="out-in" v-if="grid" @before-enter="enterRight" @enter="enter" @leave="leaveRight">
                        <div class="item" data-level="2">
                            <gallery-preview :path="galleries[4].pictures[0].path" :filename="galleries[4].pictures[0].thumb_name"
                                             :slug="galleries[4].slug" :category="category(galleries[4].category_id)" :title="galleries[4].title"></gallery-preview>
                        </div>
                    </transition>
                </div>
            </div>

        <category-nav :show="grid"></category-nav>
    </section>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                galleries: [],
                categories:[
                    { id:1, value:'portrait'},
                    { id:2, value:'voyage'},
                    { id:3, value:'mariage'},
                    { id:4, value:'street'}
                ],
                trigger: true,
                //preventUp prévient le retour sur la 1ere partie de la page lors d'un event clavier
                preventUp: true,
                // grid, if true, show the preview section
                grid:false,
                mouseX: 0
            }
        },
        methods:{
            category(category_id){
                for(let key in this.categories){
                    if(this.categories[key].id == category_id){
                        return this.categories[key].value
                    }
                }
            },
            setDelay(el, firstStage, secondStage){
                return el.dataset.level == 1 ? firstStage : secondStage
            },
            enterLeft(el){
                el.style.opacity = 0
                el.style.transform = "translateX(-200px)"
//                console.log('before', el)
            },
            enterRight(el){
                el.style.opacity = 0
                el.style.transform = "translateX(200px)"
//                console.log('before', el)
            },
            enter(el, done){
                let delay = this.setDelay(el, 400, 600)

                setTimeout(_=>{
                    el.style.opacity = 1
                    el.style.transform = "translateX(0px)"
                    el.style.transition = "transform .5s ease-out, opacity 1s ease-in-out"
//                    console.log('enter', el)
                }, delay)
                done()
            },
            leaveLeft(el, done){
                let delay =this.setDelay(el, 0, 400)

                setTimeout(_=> {
                    el.style.opacity = 0
                    el.style.transform = "translateX(-300px)"
                    el.style.transition = "transform .5s ease-out, opacity .3s ease-in-out"
//                    console.log('transition')
                }, delay)

                setTimeout(_=>{
//                    console.log('leave-left',el)
                    done()
                }, 1000)
            },
            leaveRight(el, done){
                let delay =this.setDelay(el, 0, 400)

                setTimeout(_=> {
                    el.style.opacity = 0
                    el.style.transform = "translateX(300px)"
                    el.style.transition = "transform .5s ease-out, opacity .3s ease-in-out"
//                    console.log('transition')
                }, delay)

                setTimeout(_=>{
//                    console.log('leave-right',el)
                    done()
                }, 1000)
            },
//            getMiddlePosition(){
////                console.log('scroll', this.middlePage)
////                console.log(this.$refs.focus)
//                return this.middlePage = window.innerHeight / 2
//            },
//            setTrigger(event, el){
////                console.log('bottom',el.getBoundingClientRect().bottom)
////                console.log('middle ', this.middlePage)
////                return this.trigger = el.getBoundingClientRect().bottom < this.middlePage
////                this.trigger = !this.trigger
//            },
            showFocus(){
                this.grid = false
                setTimeout(_=>this.trigger = true, 800)
            },
            showPreview(){
                this.trigger = false
                this.grid = true
            },
            scrollNav(event, el){
                console.log('client x ', this.mouseX, document.body.clientWidth)
                //détecter si la souris est sur la scroll bar
                if(this.mouseX >= document.body.clientWidth){
                    console.log('clic sur la scroll bar ', this.mouseX)
                }
            },
            onMove(direction){
//                console.log('wheel', direction)

                let scrollPosition = window.pageYOffset

                if( direction === 'down' && this.trigger){
                    this.showPreview()
                }
                if( direction === 'up' && !this.trigger && scrollPosition === 0){
                    this.showFocus()
                }
            },
            keyNav(event){
                //Scroll position
                let position = window.pageYOffset
                // page up
                const pageUp = event.keyCode == 33
                //page down
                const pageDown = event.keyCode == 34
                //up
                const up = event.keyCode == 38
                //down
                const down = event.keyCode == 40
                //space
                const space = event.keyCode == 32
                //shift
                const shift = event.shiftKey
                // shift + space
                const shiftSpace = shift && space

                if(pageUp || pageDown || space || shiftSpace || up || down){
                    //Detect page up and page down navigation
                    if((pageUp || shiftSpace || up ) && !this.trigger && position == 0){
                        event.preventDefault()
                        this.$nextTick(_=> this.preventUp = true)
                        this.showFocus()
//                        console.log('pageup', this.preventUp)
                    }
                    // tant que la position n'est pas à 0, empêche l'affichage de la partie 1
                    if((pageUp || shiftSpace || up ) && !this.trigger && position > 0){
                        this.preventUp = false
//                        console.log('prevent', this.preventUp)
                    }
                    // page Down & space navigation, prevent shift event when shift+space is trigger
                    if((pageDown || space || down) && this.trigger && !shift){
                        event.preventDefault()
                        this.showPreview()
//                        console.log('pagedown')
                    }
//                    console.log('prevent final', this.preventUp)
                }
            }
        },
        created () {
            axios.get('/api/preview').then( ({data}) => this.galleries = data)
        },
        mounted(){
            this.$nextTick(_=>{

                document.addEventListener('keydown', this.keyNav)
                document.addEventListener('mousemove', e => this.mouseX = e.screenX)
                this.keyNav(window.Event)

            })
        },
        beforeDestroy() {
            document.removeEventListener('keydown', this.keyNav)
            document.removeEventListener('wheel', this.allowUp)
        }
    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";
    .preview {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .focus {
            margin: 2em 0 5em 0;

            a {
                height: inherit;
            }
            .gallery-title{
                font-size: 1rem;
            }
        }
    }
    .row,
    .row-category{
        display: flex;
        flex-direction: column;
    }
    .item {
        display: flex;
        justify-content: center;
        /*width: 45vw;*/
        /*height: 32rem;*/
        margin: 1rem 0.5rem;
        font-size: 0.5em;
    }

    .hr{
        position: fixed;
        /*top: 50em;*/
        z-index: 999;
        width: 100%;
        height: 5px;
        background-color: red;
    }

    /** Responsive **/
    /** screen > 320px **/
    @media only screen and (min-width: 320px){
        .focus .gallery-title{
            font-size: 1.5rem;
        }
    }

    /** screen > 460px **/
    @media only screen and (min-width: 460px){
        .preview{
            margin-bottom : 5em;
        }
        .focus .gallery-title{
            font-size: 1.7rem!important;
        }
    }
    /** screen > 580px **/
    @media only screen and (min-width: 580px){
        .focus .gallery-title{
            font-size: 2.2em!important;
        }
    }

    /** screen > 960px **/
    @media only screen and (min-width: 960px){
        .focus .gallery-title{
            font-size: 4em!important;
        }
        .item{
            margin: 2rem 1rem;
        }
        .preview{
            margin-bottom : 10em;
        }
    }

    /** screen > 1600px **/
    @media only screen and (min-width: 1600px){
        .row{
            flex-direction: row;
        }
    }
</style>