<template>
    <div class="picture-form">
        <form action="#">
            <div class="form-item" v-for="picture in pictures">
                <img :src="picture.path + '/' + picture.title" :alt="picture.title" :title="picture.title">
                <label for="focus">Choisir cette photo en preview de la gallerie</label>
                <input type="radio" id="focus" name="has_focus" :value="picture.id" :checked="picture.has_focus">
                <textarea name="description" placeholder="Ajouter une description à cette photo"></textarea>
            </div>
        </form>
    </div>
</template>

<script type="text/babel">
    export default {
        props: ['pictures'],
        data (){
            return {
                pictures: []
            }
        }
    }
</script>

<style lang="scss">

</style>