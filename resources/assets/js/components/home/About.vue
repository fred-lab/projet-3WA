<template>
    <section class="about-view">
            <div class="about-text">
                <p>Je ne saurais me limiter à un style, tant diverses domaines de la photographie m'intrigue, il y a cet attrait pour les expression </p>

            </div>
    </section>
</template>

<script type="text/babel">
    export default{

    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";

    .about-view{
        display: flex;
        justify-content: center;
        height: 66vw;
        padding: 15em 0;

        background-image: url("/assets/img/desktop/mariage_desktop.jpg");
        background-repeat: no-repeat;
    }

    .about-text{
        width: 100%;
        padding: 2em 3em;
        text-align: center;
        font-size: 1.2rem;
        line-height: 3em;
        color: $primary-text-color;
        background-image: url("/assets/img/desktop/bck_about_desktop.png");
        background-repeat: no-repeat;
    }
</style>