<template>
    <section class="preview"  v-if="galleries.length > 0">
        <!--<pre>{{galleries}}</pre>-->
        <!--{{galleries[0].pictures[0].path}}-->
        <div class="focus">
            <gallery-preview :path="galleries[0].pictures[0].path" :filename="galleries[0].pictures[0].title"
                             :slug="galleries[0].slug" :category="category(galleries[0].category_id)" :title="galleries[0].title"></gallery-preview>
        </div>

        <div class="grid">
            <div class="row">
                <div class="item">
                    <gallery-preview :path="galleries[1].pictures[0].path" :filename="galleries[1].pictures[0].title"
                                     :slug="galleries[1].slug" :category="category(galleries[1].category_id)" :title="galleries[1].title"></gallery-preview>
                </div>
                <div class="item">
                    <gallery-preview :path="galleries[2].pictures[0].path" :filename="galleries[2].pictures[0].title"
                                     :slug="galleries[2].slug" :category="category(galleries[2].category_id)" :title="galleries[2].title"></gallery-preview>
                </div>
            </div>
            <div class="row">
                <div class="item">
                    <gallery-preview :path="galleries[3].pictures[0].path" :filename="galleries[3].pictures[0].title"
                                     :slug="galleries[3].slug" :category="category(galleries[3].category_id)" :title="galleries[3].title"></gallery-preview>
                </div>
                <div class="item">
                    <gallery-preview :path="galleries[4].pictures[0].path" :filename="galleries[4].pictures[0].title"
                                     :slug="galleries[4].slug" :category="category(galleries[4].category_id)" :title="galleries[4].title"></gallery-preview>
                </div>
            </div>
        </div>
    </section>
</template>

<script type="text/babel">
    export default {
        data() {
            return {
                galleries: [],
                categories:[
                    { id:1, value:'portrait'},
                    { id:2, value:'voyage'},
                    { id:3, value:'mariage'},
                    { id:4, value:'street'}
                ]
            }
        },
        methods:{
            category(category_id){
                for(let key in this.categories){
                    if(this.categories[key].id == category_id){
                        return this.categories[key].value
                    }
                }
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