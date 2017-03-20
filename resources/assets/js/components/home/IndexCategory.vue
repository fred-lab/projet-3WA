<template>
    <section class="index-category">
        <div class="category-item" v-for="gallery in galleries">
            <gallery-preview :slug="gallery.slug" :category="1" :filename="gallery.pictures[0].title"
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
                ]
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
                var category = 0;
                for(let key in this.categories){
//                    console.log(this.$route.params.category)
//                    console.log(this.categories[key].value == this.$route.params.category)
                    if(this.categories[key].value == this.$route.params.category){
                        category = this.categories[key].id
                    }
                }
//                console.log(category)
                axios.get('category/'+category).then( ({data}) => this.galleries = data)
            }
        },
        created(){
            this.getIndexByCategory()
        }
    }
</script>

<style lang="scss">

</style>