<template>
    <section class="preview"  v-if="galleries.length > 0">
        <!--<pre>{{galleries}}</pre>-->
        <div class="focus">
            <gallery-preview :path="galleries[0].pictures[0].path" :filename="galleries[0].pictures[0].title"
                             :slug="galleries[0].slug" :category="category(galleries[0].category_id)" :title="galleries[0].title"
                             :width="galleries[0].pictures[0].width"
            ></gallery-preview>
        </div>

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
                <div class="row">
                    <div class="item size">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'portrait'}}" class="gallery-wrapper">
                            <img src="/assets/img/desktop/intro_desktop.jpg" alt="Portrait" class="gallery-picture">
                            <span class="category-title">Portrait</span>
                        </router-link>
                    </div>
                    <div class="item size">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'voyage'}}" class="gallery-wrapper">
                            <img src="/assets/img/desktop/footer_desktop.jpg" alt="Voyage" class="gallery-picture">
                            <span class="category-title">Voyage</span>
                        </router-link>
                    </div>
                </div>
                <div class="row">
                    <div class="item size">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'street'}}" class="gallery-wrapper">
                            <img src="/assets/img/desktop/concert_desktop.jpg" alt="Street" class="gallery-picture">
                            <span class="category-title">Street</span>
                        </router-link>
                    </div>
                    <div class="item size">
                        <router-link :to="{name: 'gallery.category', params:{ category: 'mariage'}}" class="gallery-wrapper">
                            <img src="/assets/img/desktop/mariage_desktop.jpg" alt="Mariage" class="gallery-picture">
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
        margin-bottom : 10em;

        .focus {
            margin: 2em 0 5em 0;
        }
    }
    .row{
        display: flex;
    }
    .item {
        display: flex;
        justify-content: center;
        width: 45vw;
        height: 32rem;
        margin: 5rem 1rem;
        font-size: 0.5em;
    }
    .size{
        width: 48vw;
        height: 16rem;
        margin: 2em 1em;

        .category-title {
            position: absolute;
            z-index: 3;
            color: $secondary-text-color;

            border-style: solid;
            font-size: 7em;
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
</style>