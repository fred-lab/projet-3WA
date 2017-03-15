<template>
    <div class="admin-galleries">
        <h1>Index des {{galleries.length}} galeries du site</h1>
        <div class="gallery-item" v-for="gallery in galleries" :class="{ private: !gallery.public}">
            <template  v-for="picture in gallery.pictures">
                <router-link :to="{name: 'gallery.show', params:{ id: gallery.id}}">
                    <div>
                        <img :src="picture.path +'/'+ picture.thumb_name" :alt="picture.title">
                    </div>
                    <div class="gallery-info">
                        <p><span>Gallerie </span>: {{ gallery.title}}</p>
                        <p v-if="gallery.description"><span>Description</span> : {{ gallery.description }}</p>
                        <p><span>Catégorie</span> : {{ category(gallery.category_id) }}</p>
                        <p v-if="gallery.date"><span>Date du shooting</span> : {{ gallery.date }}</p>
                        <p v-if="gallery.city "><span>Lieux du shooting</span> : {{ gallery.city }}</p>
                        <p v-if="gallery.price"><span>Coût du shooting</span> : {{ gallery.price }}€</p>
                        <p v-if="gallery.total_pictures > 0"><span>{{ gallery.total_pictures}} </span> photos</p>
                        <p v-if="gallery.public"><span>Galerie public</span></p>
                        <p v-else><span>Galerie privé</span></p>
                    </div>
                </router-link>
            </template>
        </div>
    </div>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                galleries: [],
                categories:[
                    { id:0, value:'Portrait'},
                    { id:1, value:'Voyage'},
                    { id:2, value:'Mariage'},
                    { id:3, value:'Street'}
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
        created(){
            axios.get('/studio/gallery').then( ({data}) => this.galleries = data)
        }
    }
</script>

<style lang="scss">
    @import "../../sass/_variables.scss";
    .admin-galleries{
        display: flex;
        flex-flow: column;
        align-items: center;
        margin: 1em 0 10em;

        h1{
            color: $primary-text-color;
        }
    }
    .gallery-item{
        display: flex;

        padding: 4em;
        margin: 2em;

        background-color: #FFFFFF;

        a{
            display: inline-flex;
        }

        .gallery-info {
            display: inline-flex;
            flex-flow: column;

            p{
                padding: 1em;
                color: #000000;
                text-shadow: none;

                span{
                    color: $secondary-text-color;
                }
            }
        }
    }
    .private{
        border-style: solid;
        border-color: $secondary-text-color;
        border-width: 0.2em;
    }
</style>