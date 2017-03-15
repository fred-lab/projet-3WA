<template>
    <!--<section class="preview"  v-if="galleries.length > 0">-->
        <!--<div class="focus">-->
            <!--<gallery-preview :path="galleries[0].pictures[0].path" :title="galleries[0].pictures[0].title" :route="'#'" :galleryTitle="galleries[0].title"></gallery-preview>-->
        <!--</div>-->

        <!--<div class="grid">-->
            <!--<div class="row">-->
                <!--<div class="item">-->
                    <!--<gallery-preview :path="galleries[1].pictures[0].path" :title="galleries[1].pictures[0].title" :route="'#'" :galleryTitle="galleries[1].title"></gallery-preview>-->
                <!--</div>-->
                <!--<div class="item">-->
                    <!--<gallery-preview :path="galleries[2].pictures[0].path" :title="galleries[2].pictures[0].title" :route="'#'" :galleryTitle="galleries[2].title"></gallery-preview>-->
                <!--</div>-->
            <!--</div>-->
            <!--<div class="row">-->
                <!--<div class="item">-->
                    <!--<gallery-preview :path="galleries[3].pictures[0].path" :title="galleries[3].pictures[0].title" :route="'#'" :galleryTitle="galleries[3].title"></gallery-preview>-->
                <!--</div>-->
                <!--<div class="item">-->
                    <!--<gallery-preview :path="galleries[4].pictures[0].path" :title="galleries[4].pictures[0].title" :route="'#'" :galleryTitle="galleries[4].title"></gallery-preview>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</section>-->
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                galleries: []
            }
        },
        created () {
            axios.get('/preview').then( ({data}) => this.galleries = data)
        }
    }
</script>

<style lang="scss">
    .preview {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;

        .focus {
            margin: 2em 0;
        }
    }
    .row{
        display: flex;
    }
    .item {
        width: 48em;
        height: 32em;
        margin: 1em 2em;
    }
</style>