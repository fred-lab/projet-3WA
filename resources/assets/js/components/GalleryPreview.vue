<template>
    <a :href="route" class="gallery-wrapper" :style="{ height : ratio + 'vw'}">
        <img :src="path + '/' + title" :alt="title" class="gallery-picture" ref="picture">
        <span class="gallery-title">{{ galleryTitle }}</span>
        <p>{{ratio}}</p>
    </a>
</template>

<script type="text/babel">
    export default {
        props: ['path', 'title', 'route', 'galleryTitle'],
        data(){
            return {
                width: 0,
                height: 0,
                ratio: 0
            }
        },
        mounted(){
            console.log(this.$refs.picture)
            this.width = this.$refs.picture.naturalWidth
            this.height = this.$refs.picture.naturalHeight
            this.ratio = Math.round((this.height / this.width) * 10000)/100
        }
    }
</script>

<style lang="scss" >
    .gallery-wrapper {
        display: inline-flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        text-align: center;
        box-shadow: #968e95 7px 7px 15px;
        transition: all 1s;

        width: inherit;
        height: inherit;

    &:hover {
        transform: scale(0.98, 0.98);
        box-shadow: none;
        transition: all 1s;
     }

    &:hover .gallery-title {
         opacity:100;
         color: #FF0C64;
         filter: blur(0px);
         transition: all 1s;
     }

    &:hover .gallery-picture {
         filter: blur(6px);
         transition: all 0.3s;
     }
    }
    .gallery-picture {
        max-width: 100%;
        transition: all 1s;
    }

    .gallery-title {
        position: absolute;
        left: 1px;
        z-index: 3;
        opacity: 0;
        filter: blur(6px);
        transition: all 0.7s;

        width: inherit;

        color: white;
        font-size: 3em;
        font-family: Caveat, 'cursive';
    }

</style>