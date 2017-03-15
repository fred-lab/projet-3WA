<template>
    <div class="gallery-show">
        <form ref="form">
            <div class="info-gallery">
            <!--editing inline gallery-->
                <div class="form-item">
                    <input name="title" type="text" class="field" :class="{editing: target == 'title'}"
                           v-model.trim="gallery.title" v-focus="target == 'title'"
                           @blur="onSave" @keyup.enter="onSave" @keyup.esc="onAbort">
                    <span class="field consigne" :class="{editing: target == 'title'}">ctrl+enter pour enregistrer</span>
                    <h1 class="label" data-key="title" @dblclick="onEdit">{{ gallery.title}}</h1>
                </div>
                <div class="form-item">
                <textarea name="description" class="field area" :class="{editing: target == 'description'}"
                          v-model.trim="gallery.description" v-focus="target == 'description'" v-area
                          @blur="onSave" @keyup.ctrl.enter="onSave" @keyup.esc="onAbort">
                </textarea>
                    <span class="field consigne" :class="{editing: target == 'description'}">ctrl+enter pour enregistrer</span>
                    <p class="label" data-key="description" @dblclick="onEdit" v-if="gallery.description">{{ gallery.description }}</p>
                    <p class="label" data-key="description" @dblclick="onEdit" v-else>Aucune description</p>
                </div>


                <div class="is-public">
                    <span class="public-label">Afficher la galerie publiquement ?</span>
                    <label for="true">Oui</label>
                    <input type="radio" id="true" name="public" value="1" v-model="gallery.public" data-key="public"
                           @focus="onEdit" @change="onSave">
                    <label for="false">Non</label>
                    <input type="radio" id="false" name="public" value="0" v-model="gallery.public" data-key="public"
                           @focus="onEdit" @change="onSave">
                </div>

                <div class="details">
                    <div class="form-item">
                        <span class="additionnal-info">Galerie créé le : {{ gallery.created_at}} </span>
                        <span class="additionnal-info">Dernière modification : {{ gallery.updated_at }}</span>
                    </div>

                    <div class="form-item">
                        <span class="additionnal-info">Date du shooting :
                            <input name="date" type="date" class="field" :class="{editing: target == 'date'}"
                                   v-model="gallery.date" v-focus="target == 'date'"
                                   @blur="onSave" @change="onSave" @keyup.esc="onAbort">

                            <span v-if="gallery.date != null">{{ gallery.date}}</span>
                            <span v-else class="label" data-key="date" @dblclick="onEdit">Non renseigné</span>
                        </span>
                    </div>

                    <div class="form-item">
                        <span class="additionnal-info">Lieu du shooting :
                            <input name="city" type="text" class="field" :class="{editing: target == 'city'}"
                                   v-model="gallery.city" v-focus="target == 'city'"
                                   @blur="onSave" @keyup.enter="onSave" @keyup.esc="onAbort" placeholder="Ville">

                            <span class="label" data-key="city" @dblclick="onEdit" v-if="gallery.city != null">
                                {{ gallery.city }}
                            </span>
                            <span v-else class="label" data-key="city" @dblclick="onEdit">Non renseigné</span>
                        </span>
                    </div>

                    <div class="form-item">
                    <span class="additionnal-info">Coût du shooting :
                    <input name="price" type="text" class="field" :class="{editing: target == 'price'}"
                           v-model="gallery.price" v-focus="target == 'price'"
                           @blur="onSave" @keyup.enter="onSave" @keyup.esc="onAbort" placeholder="Prix en €">

                    <span class="label" data-key="price" @dblclick="onEdit" v-if="gallery.price != null">{{ gallery.price }}€</span>
                    <span v-else   class="label" data-key="price" @dblclick="onEdit">Non renseigné</span>
                    </span>
                    </div>
                </div>



            <span class="destroy" @click="destroyGallery" title="Supprimer cette galerie ?">
                <i class="fa fa-trash" aria-hidden="true"></i>
            </span>
            </div>

            <div v-for="picture in gallery.pictures" class="admin-picture" :class="{ focus: picture.has_focus == 1 }">
                <span class="destroy" @click="destroyPicture(picture)" title="Supprimer cette photo ?">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </span>
                <img :src="picture.path + '/' + picture.title" :alt="gallery.title">
                <div class="info-picture">
                    <span>Nom : {{picture.title}}</span>
                    <span>Nom original : {{picture.original_name}}</span>
                    <span>Ajouter le : {{ picture.created_at}}</span> <br>
                    <!--editing inline picture-->
                    <textarea class="field" :class="{editing: target == picture.id}"
                              v-model.trim="picture.description" v-focus="target == picture.id"
                              @keyup.ctrl.enter="pictureUpdate(picture)" @blur="pictureUpdate(picture)" @keyup.esc="onAbort">
                    </textarea>
                    <span class="field consigne" :class="{editing: target == picture.id}">ctrl+enter pour enregistrer</span>

                    <span class="editable">
                        <span class="label" v-if="!picture.description" :data-key="picture.id"
                              @dblclick="pictureEdit(picture, $event)"> Aucun description
                        </span>
                        <span class="label" v-else :data-key="picture.id" data-field="description" @dblclick="pictureEdit(picture, $event)">
                            Description : {{ picture.description}}
                        </span>
                    </span>


                    <br><span>Dimensions : (Largeur) {{ picture.width}}px * (Hauteur) {{ picture.height }}px</span>
                    <span v-if="picture.has_focus == 1">Ceci est la photo de prévisualisation de cette galerie</span>

                    <div v-if="picture.has_focus < 1">
                        <label for="focus">Faire de cette photo l'aperçu de la galerie :</label>
                        <input type="radio" data-key="focus" id="focus" name="focus" @change="isFocus(picture, $event)"
                        :checked="picture.id == focus">
                        <span class="validation" v-show="picture.id == focus" @click="onSave">Valider</span>
                        <span class="validation" v-show="picture.id == focus" @click="focus = oldValue">Annuler</span>
                    </div>
                    <div class="is-visible" v-if="picture.has_focus < 1">
                        <span class="visible-label" v-show="!picture.visible">Cocher pour afficher la photo publiquement :</span>
                        <span class="visible-label" v-show="picture.visible">Décocher pour masquer la photo publiquement :</span>
                        <input type="checkbox" v-model="picture.visible" :data-key="picture.id" data-field="visible"
                               @change="visibiltyUpdate(picture)">
                    </div>
                </div>
            </div>
            <div class="new-upload">
                <span>Ajouter de nouvelles photos à la galerie :</span>
                <input type="file" multiple name="pictures[]" @change="submit()">
                <span class="validation" v-show="upload" @click="onUpload">Envoyer</span>
            </div>
        </form>
    </div>
</template>

<script type="text/babel">
    export default{
        data(){
            return{
                gallery: {},
                target: null,
                oldValue: null,
                checked: false,
                upload: false,
                focus: null
            }
        },
        created(){
            axios.get('/studio/gallery/'+this.$route.params.id)
                    .then(({data}) => {
                        this.gallery = data
                        this.setFocus(data)
                    })
        },
        mounted(){
            console.log('composant monté')

        },
        methods:{
            onEdit (e){
                this.target = e.target.dataset.key

                for (let key in this.gallery){
                    if (key == this.target){
                        this.oldValue = this.gallery[key]
                    }
                }
            },
            pictureEdit (picture, e){
                this.target = e.target.dataset.key

                if (e.target.dataset.field == 'description'){
                    this.oldValue = picture.description
                }
                else if(e.target.dataset.field == 'visible'){
                    this.oldValue = picture.visible
                }

            },
            form(){
                let formData = new FormData(this.$refs.form)
                formData.append('_method', 'PUT')
                formData.append('category', this.gallery.category_id)
                formData.append('has_focus', this.focus)
                formData.delete('focus')

                return formData
            },
            onSave(){
                let formData = this.form()

                for (let key in this.gallery){
                    if (key == this.target && this.gallery[key] != this.oldValue ){
                        axios.post('/studio/gallery/'+this.gallery.id, formData)
                    }
                }

                if(this.target == 'focus'  && this.focus != this.oldValue){
                    axios.post('/studio/gallery/'+this.gallery.id, formData)

                    for (let key in this.gallery.pictures){
                        if(this.gallery.pictures[key].id != this.focus && this.gallery.pictures[key].has_focus == 1){
                            this.gallery.pictures[key].has_focus = 0
                        }
                        else if(this.gallery.pictures[key].id == this.focus && this.gallery.pictures[key].has_focus == 0){
                            this.gallery.pictures[key].has_focus = 1
                        }
                    }
                }

                this.target = null
                this.oldValue = null
            },
            pictureUpdate(picture){
                if(this.target == picture.id && picture.description != this.oldValue){
                    axios.patch('/studio/picture/'+picture.id, {
                        description: picture.description,
                        visible:     picture.visible
                    })
                }

                this.target = null
                this.oldValue = null
            },
            visibiltyUpdate(picture){
                axios.patch('/studio/picture/'+picture.id, {
                    description: picture.description,
                    visible:     picture.visible
                })
            },
            onUpload(){
                let formData = this.form()

                if(formData.getAll('pictures[]')[0].size > 0){
                    axios.post('/studio/gallery/'+this.gallery.id, formData).then(({data}) => this.gallery = data)
                }
                this.upload = false
            },
            onAbort(){
                if(isNaN(this.target)){
                    for (let key in this.gallery){
                        if (key == this.target){
                            this.gallery[key] = this.oldValue
                        }
                    }
                }
                else{
                    for (let key in this.gallery.pictures){
                        if (this.gallery.pictures[key].id == this.target){
                            this.gallery.pictures[key].description = this.oldValue
                        }
                    }
                }

                this.target = null
                this.oldValue = null
            },
            destroyGallery (){
                const prompt = confirm("Voulez-vous supprimer cette galerie ?\nCette action est irreversible !")

                if (prompt){
                    axios.delete('/studio/gallery/'+this.gallery.id).then(this.$router.push({name : 'gallery.index' }))
                }
            },
            destroyPicture(picture){

                if (picture.has_focus == 1 && this.gallery.pictures.length > 1){
                    alert("Vous ne pouvez pas supprimer l'image de preview de la galerie")
                    console.log('image preview')
                }
                else if (this.gallery.pictures.length == 1) {
                    alert("La galerie doit avoir au moins une photo, vous ne pouvez pas supprimer cette dernière photo.")
                    this.destroyGallery()

                    console.log('dernière image')
                }
                else{
                    var prompt = confirm("Voulez-vous supprimer cette photo ?\nCette action est irreversible !")

                    console.log(this.gallery.pictures.indexOf(picture) )
                    console.log('suppression classique image')
                }

                if (prompt){
                    axios.delete('/studio/picture/'+picture.id).then(console.log('photo supprimée'))
                }
                this.gallery.pictures.splice(this.gallery.pictures.indexOf(picture), 1)
            },
            isFocus(picture, event){
                this.target = event.target.dataset.key

                this.oldValue = this.focus
                this.focus = picture.id
            },
            setFocus(data){
                for (let key in data.pictures){
                    if (data.pictures[key].has_focus == 1){
                        this.focus = data.pictures[key].id
                    }
                }
            },
            submit(){
                this.upload = true
            },
            console(){
                return console.log('toto')
            }
        }
    }
</script>

<style lang="scss">
    @import "../../sass/_variables.scss";
    .gallery-show{
        text-align: center;

        line-height: 2em;
        color:#000;

        .focus{
            color: $primary-text-color;
            background-color: $secondary-text-color!important;
        }

        h1, input[name="title"]{
            font-size: 3em;
            color: $secondary-text-color;
            text-align: center;
        }

        p{
            color:#000;
        }

        .info-gallery{
            position: relative;
            display: flex;
            flex-flow: column;
            width: 80%;

            padding: 1em;
            margin: 3em auto;

            text-align: left;
            background-color: $primary-text-color; //White;

            .destroy{
                visibility: hidden;
                opacity: 0;
                position: absolute;
                top: -0.2em;
                right: -1.2em;
                width: 1em;
                margin: 0em;

                font-size: 5em;
                color: $primary-text-color;

                cursor: pointer;
                transition: all 0.5s;
            }

            &:hover .destroy{
                 visibility: visible;
                 opacity: 100;
                 transition: all 0.3s;
             }
        }


        .admin-picture{
            position: relative;
            display: inline-flex;
            flex-flow: column;
            align-items: center;
            padding: 0.8em;
            margin: 1em;
            background-color: #fff;
            text-align: left;

                span{
                    width: 50%;
                    margin-right: 10em;
                }

                .destroy{
                    visibility: hidden;
                    opacity: 0;
                    position: absolute;
                    top: -0.2em;
                    right: -1.2em;
                    width: 1em;
                    margin: 0em;

                    font-size: 5em;
                    color: $primary-text-color;

                    cursor: pointer;
                    transition: all 0.5s;
                }

                &:hover .destroy{
                     visibility: visible;
                     opacity: 100;
                     transition: all 0.3s;
                 }
            }
    }

    .editable:hover .label:after{
        content: '\f040';
        font-family: FontAwesome;
        position: absolute;
        font-size: 0.8rem;
        margin: 0 0 0 0.8em;
        color: #3c3f41;
    }
    textarea, input{
        outline: none;
        border: none;
        resize: none;
    }
    .details{
        display: flex;
        justify-content: space-between;
    }
    .form-item{
        text-align: center;
        display: flex;
        flex-flow: column;

        .additionnal-info{
            justify-content: space-between;
        }

        &:hover .label:after{
             content: '\f040';
             font-family: FontAwesome;
            position: absolute;
            font-size: 0.8rem;
            margin: 0 0 0 0.8em;
            color: #3c3f41;
         }
    }
    .area{
        width: 100%;
        height: 8em;
    }
    input[name="title"] + .editing{
        display: block;
    }
    .field{
        display: none;
    }

    .label{
        cursor: pointer;
        text-shadow: none;
    }

    .consigne{
        font-size: 0.8em;
    }

    .editing {
        display: inline;
    }

    .editing + .label {
        display: none;
    }
    .additionnal-info{
        font-size: 0.8em;
    }

    .validation{
        padding: 0.3em 1em;
        margin: 0 0.5em!important;
        border-radius: 1em;

        background-color: #e65e5e;
        color: $primary-text-color;
        text-align: center;
        cursor: pointer;
        transition: all 0.5s;

        &:hover{
            background-color: #5bbf5b;
            transition: all 0.3s;
         }
    }
    .visible-label{
        display: inline-block;
        width: 23em!important;
        margin: 0!important;
    }
    .public-label{
        display: inline-block;
        width: 17em;
    }
    .new-upload{
        width: 80%;
        padding: 2em;
        margin: 3em auto 10em;

        background-color: #fff
    }
</style>