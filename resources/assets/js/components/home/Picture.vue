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

</style>