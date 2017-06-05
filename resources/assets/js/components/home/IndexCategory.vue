<template>
    <section class="index-category" :key="category">
        <div class="category-preview" v-for="gallery in galleries">
            <gallery-preview :slug="gallery.slug" :category="category" :filename="gallery.pictures[0].title"
                             :path="gallery.pictures[0].path" :title="gallery.title"></gallery-preview>
        </div>
    </section>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                galleries: [],
                categories:[
                    { id:1, value:'portrait'},
                    { id:2, value:'voyage'},
                    { id:3, value:'mariage'},
                    { id:4, value:'street'}
                ],
                category: ''
            }
        },
        watch: {
            '$route' (to, from){
                if (from.params.category !== to.params.category) {
                    this.getIndexByCategory()
                }
            }
        },
        methods: {
            getIndexByCategory(){
                /** category_id = int **/
                let categoryId = 0;
                for(let key in this.categories){
                    if(this.categories[key].value == this.$route.params.category){
                        categoryId = this.categories[key].id
                        this.category = this.categories[key].value
                    }
                }
                axios.get('/api/category/'+categoryId).then( ({data}) => this.galleries = data)
            }
        },
        created(){
            this.getIndexByCategory()
        }
    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .index-category{
        display: flex;
        flex-flow: column;
        align-items: center;
        padding-bottom: 5em;
    }
    .category-preview{
        padding: 2em 0;
        font-size: 0.4em;

        .gallery-wrapper{
            height: auto!important;
        }
    }

    /** Responsive **/
    /** screen > 440px **/
    @media only screen and (min-width: 440px){
        .category-preview{
            font-size: 0.6em;
        }
    }
    /** screen > 960px **/
    @media only screen and (min-width: 960px){
        .category-preview{
            font-size: 0.8em;
        }
        .index-category{
            padding-bottom: 10em;
        }
    }
    /** screen > 1200px **/
    @media only screen and (min-width: 1200px){
        .category-preview{
            font-size: 1em;
        }
    }

</style>