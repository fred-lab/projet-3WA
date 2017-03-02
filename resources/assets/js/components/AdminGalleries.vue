<template>
    <div class="admin-galleries">
        <h2>Galleries via AJAX</h2>
        <!--<pre>{{galleries}}</pre>-->
        <div class="gallery-item" v-for="gallery in galleries">

            <img v-for="picture in gallery.pictures" :src="picture.path +'/'+ picture.thumb_name" :alt="picture.title">
            <div class="gallery-info">
                <p>Gallerie : {{ gallery.title}}</p>
                <p>Description : {{ gallery.description }}</p>
                <p>Date du shooting : {{ gallery.date }}</p>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                galleries: []
            }
        },
        created(){
            axios.get('preview-all').then( ({data}) => this.galleries = data)
        }
    }
</script>

<style lang="scss">

</style>