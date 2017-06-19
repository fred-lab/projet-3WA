<template>
    <div class="footer-view">
        <div>
            <router-link :to="{name: 'homepage'}">www.bokehlicous.fr</router-link>
        </div>


        <div>
            <a href="#" title="Lien vers ma page Facebook"><i class="fa fa-facebook-official" aria-hidden="true"></i></a>
            <a href="https://500px.com/fredography" title="Lien vers ma gallerie 500px"><i class="fa fa-500px" aria-hidden="true"></i></a>
        </div>

        <div>
            <router-link :to="{name: 'about'}" title="Je me présente !">A propos</router-link>
        </div>

        <div>
            <router-link :to="{name: 'contact'}" title="Faisons connaissance !">Contact</router-link>
        </div>

        <div>
            <p>© BOKEHLICIOUS ALL RIGHT RESERVED</p>
        </div>
    </div>
</template>

<script type="text/babel">
    export default{

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .footer-view {
        margin-top: 10em;
        display: flex;
        flex-flow: column;
        align-items: center;

        height: 25em;

        padding: 2em 0 2em 0;

        background-image: url("/assets/img/desktop/bck_footer_desktop.png");
        background-color: black;

        a {
            display: inline-block;

            margin: 1rem;
        }

        div{
            display: inline-flex;
        }

        p{
            font-size: 0.6rem;
            text-shadow: none;
        }
        a {
            display: inline-block;

            height: 2rem;
            width: 100%;

            line-height: 2rem;
            text-align: center;
            text-shadow: none;
            font-size: 1em;
            transition: all .5s ease;

            &:hover {
                 color: $secondary-text-color;
                 font-size: 0.95em;
                 transition: all .3s ease;
             }

            .fa{
                font-size: 2em;
            }
        }
    }
</style>