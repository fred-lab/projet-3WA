<template>
    <div class="home-nav">
        <router-link :to="{name: 'homepage'}" class="logo">Bokeh<span>licious</span></router-link>

        <nav class="main-nav" role="navigation">
            <router-link :to="{name: 'gallery.category', params:{ category: 'portrait'}}" title="Les galeries 'Portraits'" replace>Portraits</router-link>
            <router-link :to="{name: 'gallery.category', params:{ category: 'voyage'}}" title="Les galeries 'Voyage'" replace>Voyage</router-link>
            <router-link :to="{name: 'gallery.category', params:{ category: 'street'}}" title="Les galeries 'Street'" replace>Street</router-link>
            <router-link :to="{name: 'gallery.category', params:{ category: 'mariage'}}" title="Les galeries 'Mariage'" replace>Mariage</router-link>
            <router-link :to="{name: 'about'}" title="A propos">A propos</router-link>
            <router-link :to="{name: 'contact'}" title="Contact">Contact</router-link>
        </nav>
    </div>
</template>

<script type="text/babel">
    export default{

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";
    .home-nav{
        display: flex;
        justify-content: space-between;

        width: 100%;
        height: 2.5em;
    }
    .logo {
        margin-left: 2rem;

        text-align: center;
        font-family: $title-font;
        font-size: 2em;
        line-height: 1.1em;
        color: #000000;


        span {
            font-family: $handwrite-font;
            color: $secondary-text-color;
            font-weight: bold;
        }
    }
    .main-nav {
        margin-right : 10em;



        a {
            display: inline-block;

            width: 5rem;
            height: 2rem;

            margin: 0 1.5rem;

            text-align: center;
            line-height: 2rem;
            font-size: 1.2em;
            color: $secondary-text-color;

            transition: all .5s ease;

            &:hover{
                 font-size: 1.1em;
                 text-shadow: 1px 1px 2px grey;
                 transition: all .3s ease;
             }
        }




    }
</style>