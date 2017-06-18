<template>
    <section class="category-nav">
        <div class="grid" v-scroll="getPosition">
            <transition-group tag="div" class="row-category" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div class="category-item" data-order="0" key="1st" v-show="triggerNav">
                    <router-link :to="{name: 'gallery.category', params:{ category: 'portrait'}}" class="category-wrapper">
                        <img src="/assets/img/desktop/intro_desktop.jpg" alt="Portrait" class="category-picture">
                        <span class="category-title">Portrait</span>
                    </router-link>
                </div>
                <div class="category-item" data-order="1" key="2nd" v-show="triggerNav">
                    <router-link :to="{name: 'gallery.category', params:{ category: 'voyage'}}" class="category-wrapper">
                        <img src="/assets/img/desktop/footer_desktop.jpg" alt="Voyage" class="category-picture">
                        <span class="category-title">Voyage</span>
                    </router-link>
                </div>
            </transition-group>
            <transition-group tag="div" class="row-category" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <div class="category-item" data-order="2" key="3rd" v-show="triggerNav">
                    <router-link :to="{name: 'gallery.category', params:{ category: 'street'}}" class="category-wrapper">
                        <img src="/assets/img/desktop/concert_desktop.jpg" alt="Street" class="category-picture">
                        <span class="category-title">Street</span>
                    </router-link>
                </div>
                <div class="category-item" data-order="3" key="4th" v-show="triggerNav">
                    <router-link :to="{name: 'gallery.category', params:{ category: 'mariage'}}" class="category-wrapper">
                        <img src="/assets/img/desktop/mariage_desktop.jpg" alt="Mariage" class="category-picture">
                        <span class="category-title">Mariage</span>
                    </router-link>
                </div>
            </transition-group>
        </div>
    </section>
</template>

<script type="text/babel">
    export default {
        props: ["show"],
        data(){
            return {
                triggerNav: false
            }
        },
        methods:{
            setMove(el, left, right, up){
                return el.dataset.order % 2 == 0 ? el.style.transform = "translate("+left+"," +up+")" : el.style.transform = "translate("+right+"," +up+")"
            },
            beforeEnter(el){
                this.setMove(el, '-100px', '100px', '600px')
                el.style.opacity = 0
            },
            enter(el, done){
                const delay = el.dataset.order * 100

                setTimeout(_=>{
                    el.style.opacity = 1
                    el.style.transform = "translate(0px)"
                    el.style.transition = "transform .7s ease, opacity .7s ease-out"
                }, delay)
                done()
            },
            leave(el, done){
                const delay = (el.dataset.order * 100)

                setTimeout(_=>{
                    el.style.opacity = 0
                    this.setMove(el, '-300px', '300px', '-400px')
                    el.style.transition = "transform .7s ease, opacity .5s ease-out"
                }, delay)
            },
            getPosition(event, el){
                if(window.innerWidth > 960){
                    //si le document est plus haut que la grille
                    if (window.innerHeight > el.clientHeight && this.show){
                        // si le bas de la grille est inférieur à la hauteur du document, toute la grille est donc dans la fenêtre
                        this.triggerNav = el.getBoundingClientRect().bottom < window.innerHeight
                    }
                }
                else{
                    if(window.innerHeight > (el.clientHeight / 2) && this.show){
                        this.triggerNav = el.firstElementChild.getBoundingClientRect().bottom < window.innerHeight
                    }
                }
            }
        }

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

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

    /** Responsive **/
    /** screen > 320px **/
    @media only screen and (min-width: 320px){
        .category-nav{
            margin: 2em 0;
        }
        .category-title{
            font-size: 3em;
        }
    }

    /** screen > 460px **/
    @media only screen and (min-width: 460px){
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

    /** screen > 960px **/
    @media only screen and (min-width: 960px){
        .row-category{
            flex-direction: row;
        }
        .category-item{
            margin: 2em 1em;
        }
        .category-title{
            font-size: 7em!important;
        }
    }
</style>