<template>
    <section class="category-view">
        <div class="category-picture" v-for="picture in gallery.pictures">
            <picture :path="picture.path" :filename="picture.title" :title="gallery.title"></picture>
        </div>
    </section>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                gallery: []
            }
        },
        created(){
            axios.get('/api/gallery/'+this.$route.params.slug).then(({data}) => this.gallery = data)
        }

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .category-view{
        display: flex;
        flex-flow: column;
        align-items: center;
        padding-bottom: 15em;
    }
    .category-picture{
        padding: 2em 0;
    }

</style>