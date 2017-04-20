<template>
    <div class="picture">
        <img :src="path + '/' + filename" :alt="title" :title="title">
    </div>
</template>

<script type="text/babel">
    export default{
        props: ['path', 'filename', 'title']
    }
</script>

<style lang="scss">
    .picture img{
        max-width: 100%;
    }
</style>