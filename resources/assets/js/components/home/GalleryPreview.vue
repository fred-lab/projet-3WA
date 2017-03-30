<template>
    <router-link :to="{name: 'gallery.show', params:{category: category, slug: slug}}" class="gallery-wrapper">
        <img :src="path + '/' + filename" :alt="title" class="gallery-picture">
        <span class="gallery-title">{{ title }}</span>
    </router-link>
</template>

<script type="text/babel">
    export default {
        props: ['slug', 'category', 'filename', 'path', 'title']
    }
</script>

<style lang="scss" >
    @import "../../../sass/_variables.scss";

    .gallery-wrapper {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        text-align: center;
        box-shadow: #968e95 7px 7px 15px;
        transition: all 1s;

        /*width: inherit;*/
        height: inherit;

    &:hover {
        transform: scale(0.98, 0.98);
        box-shadow: none;
        transition: all 1s;
     }

    &:hover .gallery-title {
         opacity:100;
         color: $secondary-text-color;
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
        z-index: 3;
        opacity: 0;
        filter: blur(6px);
        transition: all 0.7s;

        width: inherit;

        color: white;
        font-size: 4em;
        line-height: 2em;
        font-family: $title-font;

        border-style: solid;
        padding: 0.5em 2em;
    }

</style>