<template>
    <div class="gallery-form">
        <form @submit.prevent="onSubmit" ref="form">
            <h1>Création d'une galerie</h1>
            <div class="form-item">
                <input name="title" type="text" id="title" placeholder="Quel est le titre de la galerie (obligatoire)" v-model="title">
            </div>

            <div class="form-item">
                <textarea name="description" id="description" placeholder="Décrivez cette galerie (optionnel)"></textarea>
            </div>

            <div class="form-item">
                <span>Choix de la catégorie :</span>
                <select name="category">
                    <option v-for="category in categories" :value="category.value">{{ category.name }}</option>
                </select>
            </div>

            <div class="form-item">
                <label for="upload">Ajouter de nouvelles photos à la gallerie</label><br>
                <input type="file" multiple name="pictures[]" id="upload" @change="onUpload()">
                <span v-if="countFiles > 1">{{ countFiles }} fichiers sélectionnés</span>
                <span v-else>{{ countFiles }} fichier sélectionné</span>
            </div>

            <div class="form-aside">
                <div class="form-item">
                    <input :type="date" name="date" placeholder="Date du shooting (optionnel)"
                           @focus="date = 'date'" @blur="date = 'text'">
                </div>
                <div class="form-item">
                    <input type="text" name="city" placeholder="Lieu du shooting (optionnel)">
                </div>
                <div class="form-item">
                    <input type="number" name="price" placeholder="Coût du shooting en € (optionnel)">
                </div>
            </div>

            <div class="form-item public">
                <span>Cocher pour publier publiquement automatiquement la galerie</span>
                <input type="checkbox" name="public" :value="public" v-model="public" :true-value="1" :false-value="0">
            </div>

            <div class="form-submit">
                <span v-if="!valid" class="empty">Choisir un titre et sélectionner des fichiers pour pouvoir enregistrer la gallerie</span>
                <input type="submit" value="Enregistrer" v-else>
            </div>


        </form>
    </div>
</template>

<script type="text/babel">
    export  default{
        data (){
            return {
                categories: [
                    { name: 'Portrait', value: 1},
                    { name: 'Voyage', value: 2},
                    { name: 'Mariage', value: 3},
                    { name: 'Street', value: 4}
                ],
                upload: false,
                countFiles: 0,
                date: 'text',
                title: '',
                public: 0
            }
        },
        computed:{
            valid : function(){
                return this.upload && this.title
            }
        },
        methods:{
            onSubmit: function (){
                /**
                 * this.$refs.form correspond au formulaire, sélectionner dans le DOM, passer en argument
                 * du constructeur FormData pour récupérer tout les champs du formulaire et les passer dans la requête AJAX
                 **/
                let formData = new FormData(this.$refs.form)

                if(formData.get('title') && formData.getAll('pictures[]').length > 0){
                    axios.post('/studio/gallery', formData)
                            .then( ({data}) => this.$router.push({
                                name: 'studio.gallery.show',
                                params: { id: data.id}
                            }))
                }
            },
            onUpload (){
                this.upload = true
                let formData = new FormData(this.$refs.form)
                this.countFiles = formData.getAll('pictures[]').length
            }
        }
    }
</script>

<style lang="scss">
.gallery-form{
    display: flex;
    flex-flow: column;
    align-items: center;
    margin: 2em 2em 15em 2em;
    text-align: center;

    h1,
    select,
    input[type="file"]{
        color: #fff;
    }

    .form-item{
        margin: 2em;

        span{
            padding: 0.8em;
            color: #fff;
        }
    }

    input[type="text"]{
        width: 30vw;
    }
    select,
    input[type="file"]{
        background-color: #4e4466;
        margin: 0 auto;
    }
    input[type="file"]{
        display: none;
    }

    textarea{
        width: 30vw;
        height: 10vw;
    }

    input[type="submit"]{
        width: 10vw;
        height: 3vw;
        background-color: transparent;
        color: #fff;
        border-style: solid;
        border-radius: 10em;
        transition: all 0.5s linear;

        &:hover{
             background-color: #5bbf5b;
             transition: all 0.5s linear;
         }
    }

    label{
        width: 25em;
        color: #ffffff;
        border-style: dashed;
        border-radius: 10em;
        padding: 0.5em;
        margin: 0 auto;
        cursor: pointer;
        transition: all 0.5s linear;

        &:hover{
            border-style: solid;
            transition: all 0.5s linear;
         }

    }
    input, textarea{
        padding: 0.8em;
    }
    .public{
        display: inline-block;
    }
    input[type="checkbox"]{
        padding: 0.8em;
    }

    .form-submit{
        display: flex;
        justify-content: center;
    }
    .empty{
        color: #ff3f49;
    }
}
</style>