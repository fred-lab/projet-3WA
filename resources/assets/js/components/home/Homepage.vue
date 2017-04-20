<template>
    <section class="preview"  v-if="galleries.length > 0">
        <transition name="focus-slide" appear>
            <div class="focus">
                <gallery-preview :path="galleries[0].pictures[0].path" :filename="galleries[0].pictures[0].title"
                                 :slug="galleries[0].slug" :category="category(galleries[0].category_id)" :title="galleries[0].title"
                                 :width="galleries[0].pictures[0].width"
                ></gallery-preview>
            </div>
        </transition>

        <div class="grid">
            <div class="row">
                <div class="item">
                    <gallery-preview :path="galleries[1].pictures[0].path" :filename="galleries[1].pictures[0].thumb_name"
                                     :slug="galleries[1].slug" :category="category(galleries[1].category_id)" :title="galleries[1].title"></gallery-preview>
                </div>
                <div class="item">
                    <gallery-preview :path="galleries[2].pictures[0].path" :filename="galleries[2].pictures[0].thumb_name"
                                     :slug="galleries[2].slug" :category="category(galleries[2].category_id)" :title="galleries[2].title"></gallery-preview>
                </div>
            </div>
            <div class="row">
                <div class="item">
                    <gallery-preview :path="galleries[3].pictures[0].path" :filename="galleries[3].pictures[0].thumb_name"
                                     :slug="galleries[3].slug" :category="category(galleries[3].category_id)" :title="galleries[3].title"></gallery-preview>
                </div>
                <div class="item">
                    <gallery-preview :path="galleries[4].pictures[0].path" :filename="galleries[4].pictures[0].thumb_name"
                                     :slug="galleries[4].slug" :category="category(galleries[4].category_id)" :title="galleries[4].title"></gallery-preview>
                </div>
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
                ]
            }
        },
        methods:{
            category(category_id){
                for(let key in this.categories){
                    if(this.categories[key].id == category_id){
                        return this.categories[key].value
                    }
                }
            }
        },
        created () {
            axios.get('/api/preview').then( ({data}) => this.galleries = data)
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

    /**
    * Transition
    **/

    /** Focus Slide Blur **/

    .focus-slide-enter-active{
        opacity: 100;
        /*filter: blur(0px);*/
        animation: slide-in 1.2s linear;
        /*transform: scale(1, 1);*/
        transition: opacity 0.5s ease-out;
    }
    .focus-slide-leave-active{
        transition: all 0.3s ease-in;
    }
    .focus-slide-enter{
        z-index: 33;
        opacity: 0;
        /*filter: blur(16px);*/
        /*transform: scale(0.5, 0.5);*/
    }

    @keyframes slide-in {
        0%{
            transform:  scale(0.9, 0.9);
            filter: blur(16px);
        }
        30%{
            transform:  scale(0.9, 0.9);
            filter: blur(20px);
        }
        50%{
            transform: scale(0.85, 0.85);
            filter: blur(10px);
        }
        60%{
            transform: scale(0.9, 0.9);
            filter: blur(24px);
        }
        80%{
            transform: scale(1.1, 1.1);
            filter: blur(6px);
        }
        85%{
            transform:  scale(1, 1);
            filter: blur(10px);
        }
        100%{
            transform: scale(1, 1);
            filter: blur(0);
        }
    }

</style>