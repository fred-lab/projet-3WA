<template>
    <section class="gallery-view">
        <div class="gallery-picture" v-for="picture in gallery.pictures">
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
            axios.get('/gallery/'+this.$route.params.slug).then(({data}) => this.gallery = data)
        }

    }
</script>

<style lang="scss">

</style>