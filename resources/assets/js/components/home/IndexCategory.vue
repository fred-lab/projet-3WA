<template>
    <section class="index-category">
        <div class="category-item" v-for="gallery in galleries">
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
                var categoryId = 0;
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

</style>