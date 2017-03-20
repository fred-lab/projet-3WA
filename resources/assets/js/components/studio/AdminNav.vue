<template>
    <nav class="admin-nav">
        <h2>Galleries</h2>
        <!--<a href="{{ route('gallery.index') }}" title="Index des galleries" >Index des galleries</a>-->
        <!--<a href="{{ route('gallery.create') }}" title="Créer une gallerie" >Créer une gallerie</a>-->
        <router-link :to="{ name: 'studio.gallery.index' }" title="Index des galleries" exact>Index des galleries</router-link>
        <router-link :to="{ name: 'studio.gallery.create' }" title="Créer une gallerie">Créer une gallerie</router-link>
        <h2>Utilisateurs</h2>
        <a href="#" title="Work in progress">Liste des utilisateurs</a>
        <a href="#" title="Work in progress">Ajouter un utilisateur</a>
        <h2>messages</h2>
        <router-link :to="{ name: 'studio.messages.index' }" title="Index des messages">Boites de réception</router-link>
    </nav>
</template>

<script type="text/babel">
    export default{

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .admin-nav {

        h2{
            align-self: center;
            color: $secondary-text-color;
        }

            a{
                color:$primary-text-color; //White;
            }
    }
</style>