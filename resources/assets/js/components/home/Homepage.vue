<template>
    <section class="preview"  v-if="galleries.length > 0" v-wheel="onMove" v-touch="onMove">
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
                    <transition appear v-if="!trigger" @before-enter="left" @enter="enter" @before-leave="beforeLeave" @leave="leave" >
                        <div class="item" data-level="1">
                            <gallery-preview :path="galleries[1].pictures[0].path" :filename="galleries[1].pictures[0].thumb_name"
                                             :slug="galleries[1].slug" :category="category(galleries[1].category_id)" :title="galleries[1].title"></gallery-preview>
                        </div>
                    </transition>
                    <transition appear v-if="!trigger" @before-enter="right" @enter="enter"  @leave="leave">
                        <div class="item" data-level="1">
                            <gallery-preview :path="galleries[2].pictures[0].path" :filename="galleries[2].pictures[0].thumb_name"
                                             :slug="galleries[2].slug" :category="category(galleries[2].category_id)" :title="galleries[2].title"></gallery-preview>
                        </div>
                    </transition>
                </div>
                <div class="row">
                    <transition appear v-if="!trigger" @before-enter="left" @enter="enter"  @leave="leave">
                        <div class="item" data-level="2">
                            <gallery-preview :path="galleries[3].pictures[0].path" :filename="galleries[3].pictures[0].thumb_name"
                                             :slug="galleries[3].slug" :category="category(galleries[3].category_id)" :title="galleries[3].title"></gallery-preview>
                        </div>
                    </transition>
                    <transition appear v-if="!trigger" @before-enter="right" @enter="enter"  @leave="leave">
                        <div class="item" data-level="2">
                            <gallery-preview :path="galleries[4].pictures[0].path" :filename="galleries[4].pictures[0].thumb_name"
                                             :slug="galleries[4].slug" :category="category(galleries[4].category_id)" :title="galleries[4].title"></gallery-preview>
                        </div>
                    </transition>
                </div>
            </div>

        <section class="category-nav">
            <div class="grid">
                <div class="row-category">
                    <div class="category-item">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'portrait'}}" class="category-wrapper">
                            <img src="/assets/img/desktop/intro_desktop.jpg" alt="Portrait" class="category-picture">
                            <span class="category-title">Portrait</span>
                        </router-link>
                    </div>
                    <div class="category-item">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'voyage'}}" class="category-wrapper">
                            <img src="/assets/img/desktop/footer_desktop.jpg" alt="Voyage" class="category-picture">
                            <span class="category-title">Voyage</span>
                        </router-link>
                    </div>
                </div>
                <div class="row-category">
                    <div class="category-item">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'street'}}" class="category-wrapper">
                            <img src="/assets/img/desktop/concert_desktop.jpg" alt="Street" class="category-picture">
                            <span class="category-title">Street</span>
                        </router-link>
                    </div>
                    <div class="category-item">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'mariage'}}" class="category-wrapper">
                            <img src="/assets/img/desktop/mariage_desktop.jpg" alt="Mariage" class="category-picture">
                            <span class="category-title">Mariage</span>
                        </router-link>
                    </div>
                </div>
            </div>
        </section>
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
                grid: true
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
            left(el){
                el.style.opacity = 0
                el.style.transform = "translateX(-200px)"
                console.log('before', el)
            },
            right(el){
                el.style.opacity = 0
                el.style.transform = "translateX(200px)"
                console.log('before', el)
            },
            enter(el, done){
                let level = el.dataset.level
                let delay

                level == 1 ? delay = 400 : delay = 600

                setTimeout(_=>{
                    el.style.opacity = 1
                    el.style.transform = "translateX(0px)"
                    el.style.transition = "transform .5s ease-out, opacity 1s ease-in-out"
                    console.log('enter', el)
                }, delay)
                done()
            },
            beforeLeave(el){
                el.style.opacity = 1
                el.style.transform = "translateX(0px)"
                el.style.transition = "transform .5s ease-out, opacity 1s ease-in-out"
                console.log('before-leave',el)
            },
            leave(el, done){
                setTimeout(_=>{
                    el.style.opacity = 0
                    el.style.transform = "translateX(200px)"
                    el.style.transition = "transform .5s ease-out, opacity 1s ease-in-out"
                    console.log('leave',el)
                }, 500)
                done()
            },
//            afterLeave(el){
//                el.style.opacity = 0
//                el.style.transform = "translateX(0px)"
//                el.style.transition = "transform 2s ease-out, opacity 1s ease-in-out"
//                console.log('after-leave',el)
//            },
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

            onMove(direction){
//                console.log('wheel', direction)

                let scrollPosition = window.pageYOffset

                if( direction === 'down' && this.trigger){
                    this.trigger = false
                    this.grid = true
                }
                if( direction === 'up' && !this.trigger && scrollPosition === 0){
                    this.trigger = true
                    this.grid = false
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
                        this.trigger = true
                        console.log('pageup', this.preventUp)
                    }
                    // tant que la position n'est pas à 0, empêche l'affichage de la partie 1
                    if((pageUp || shiftSpace || up ) && !this.trigger && position > 0){
                        this.preventUp = false
                        console.log('prevent', this.preventUp)
                    }
                    // page Down & space navigation, prevent shift event when shift+space is trigger
                    if((pageDown || space || down) && this.trigger && !shift){
                        event.preventDefault()
                        this.trigger = false
                        console.log('pagedown')
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

    .category-nav{
        margin: 1em 0;
    }
    .category-item{
        display: flex;
        justify-content: center;
        height: 8rem;
        margin: 1em;
        font-size: 0.5em;

        .category-title {
            position: absolute;
            z-index: 3;
            color: $secondary-text-color;

            border-style: solid;
            font-size: 3em;
            padding: 0.5em 2em;
            border-radius: 2em;
            text-shadow: 2px 2px 5px rgba(0,0,0,0.5);
            transition: all 0.7s;
        }

        &:hover .category-title{
             color: $info-color;
             transition: all 0.3s;
         }
    }
    .category-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        text-align: center;
        box-shadow: #968e95 7px 7px 15px;
        transition: all 1s;
    }

    .category-picture {
        max-width: 100%;
        transition: all 1s;
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

        .category-nav{
            margin: 2em 0;
        }
        .category-title{
            font-size: 3em;
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
        .category-nav{
            margin: 5em 0;
        }
        .category-item{
            height: 16rem;
        }
        .category-title{
            font-size: 5em!important;
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
        .row-category{
            flex-direction: row;
        }
        .category-nav{
            margin: 10em 0;
        }
        .category-item{
            margin: 2em 1em;
        }
        .category-title{
            font-size: 7em!important;
        }
    }

    /** screen > 1600px **/
    @media only screen and (min-width: 1600px){
        .row{
            flex-direction: row;
        }
    }
</style>