<template>
    <div class="gallery-form">
        <form @submit="onSubmit">
            <label for="category">Modification de la catégorie :</label>
            <select name="category" id="category">
                <option v-for="(index, category) in categories" :value="index" :selected="index == gallery.category_id">{{ category }}</option>
            </select>
            <label for="title">Modification du titre :</label>
            <input type="text" id="title" v-model="gallery.title">
            <label for="description">Modification de la description :</label>
            <textarea name="description" id="description" placeholder="Décrivez cette galerie (optionnel)" v-model="gallery.description"></textarea>

            <p>Modification des photos de la gallerie</p>
            <picture-form :pictures="gallery.pictures"></picture-form>

            <label for="upload">Ajouter de nouvelles photos à la gallerie :</label>
            <input type="file" multiple="multiple" name="pictures[]" id="upload">
            
            <input type="submit" value="Modifier">
        </form>
    </div>
</template>

<script type="text/babel">
    export  default{
        data (){
            return {
                categories: [
                        'Portrait',
                        'Voyage',
                        'Mariage',
                        'Street'
                ],
                gallery: []
            }
        },
        methods:{
            onSubmit: () => console.log('formulaire envoyé')
        },
        created () {
            axios.get('/gallery').then( ({data}) => this.gallery = data)
        }
    }
</script>

<style lang="scss">

</style>