<template>
    <div class="home-nav" v-click-outside="closeMenu">
        <router-link :to="{name: 'homepage'}" class="logo" exact @click.native="homepage">Bokeh<span>licious</span></router-link>

        <transition-group name="fade-nav" tag="nav" :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave"
                          class="main-nav" role="navigation">
            <span class="burger" @click="dropMenu" key="burger"><span class="breadcrumb">{{target}}</span><i :data-value="target" class="fa fa-bars" aria-hidden="true"></i></span>
            <template v-if="toggle">
                    <router-link :to="{name: 'gallery.category', params:{ category: 'portrait'}}" title="Les galeries 'Portraits'" exact @click.native="dropMenu" key="portrait" data-key="0" data-value="Portraits">Portraits</router-link>
                    <router-link :to="{name: 'gallery.category', params:{ category: 'voyage'}}" title="Les galeries 'Voyage'" exact  @click.native="dropMenu" key="voyage" data-key="1" data-value="Voyage">Voyage</router-link>
                    <router-link :to="{name: 'gallery.category', params:{ category: 'street'}}" title="Les galeries 'Street'" exact  @click.native="dropMenu" key="street" data-key="2" data-value="Street">Street</router-link>
                    <router-link :to="{name: 'gallery.category', params:{ category: 'mariage'}}" title="Les galeries 'Mariage'" exact  @click.native="dropMenu" key="mariage" data-key="3" data-value="Mariage">Mariage</router-link>
                    <router-link :to="{name: 'about'}" title="A propos" @click.native="dropMenu" key="about" data-key="4" data-value="A propos">A propos</router-link>
                    <router-link :to="{name: 'contact'}" title="Contact" @click.native="dropMenu" key="contact" data-key="5" data-value="Contact">Contact</router-link>
            </template>
        </transition-group>
    </div>
</template>

<script type="text/babel">
    export default {
        data(){
            return {
                toggle: false,
                window: 0,
                target: ''
            }
        },
        watch:{
            window(){
                return this.window < 1150 ? this.toggle = false : this.toggle = true
            }
        },
        methods:{
            dropMenu(e){
                this.window > 1150 ? this.toggle = true :  this.toggle = !this.toggle
                this.target = e.target.dataset.value
            },
            closeMenu(){
                if(this.window < 1150)
                    this.toggle ? this.toggle = false : null
            },
            homepage(){
                this.closeMenu()
                this.target =''
            },
            getWindowWidth(){
                this.window = window.innerWidth
            },
            beforeEnter(el){
                let style = el.style
                this.window < 1150 ? style.height = style.padding = 0 : null
                style.opacity = 0
            },
            enter(el, done){
                const delay = el.dataset.key * 70
                let style = el.style

                setTimeout(_=>{
                    this.window < 1150 ? style.height = 3+'rem' : null
                    this.window < 1150 ? style.padding = '0.8rem 0' : null
                    style.opacity = 1
                    style.transition = 'height 0.3s ease-out, padding 0.3s ease-out, opacity 0.6s ease-out'
                }, delay)
            },
            leave(el, done){
                const delay = (el.dataset.key * 0.7) * 20
                let style = el.style


                setTimeout(_=>{
                    style.height = 0
                    style.padding = 0
                    style.opacity = 0
                    style.transition = 'height 0.6s ease-out, padding 0.6s ease-out, opacity 0.3s linear'
                }, delay)
            }
        },
        mounted(){
            this.$nextTick(_=>{
                window.addEventListener('resize', this.getWindowWidth)
                this.getWindowWidth()
            })
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.getWindowWidth)
        }
    }
</script>

<style lang="scss">
    @import "../../../sass/_variables.scss";
    header{
        height: 5em;
    }

    .home-nav{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        width: 100%;
    }
    .logo {
        align-self: flex-start;

        margin-left: 2rem;

        text-align: center;
        font-family: $title-font;
        font-size: 2em;
        line-height: 1.1em;
        color: #000000;

        &:hover{
             font-size: 1.9em;
             text-shadow: 1px 1px 2px grey;
             transition: all .3s ease;
         }


        span {
            font-family: $handwrite-font;
            color: $secondary-text-color;
            font-weight: bold;
        }
    }
    .burger{
        display: inline-block;
        opacity: 1;
        font-size: 1.8rem;
        line-height: 2.5rem;
        padding: 0 1.5rem;
        color: $secondary-text-color;
        text-shadow: 1px 1px 2px grey;
        cursor: pointer;
        align-self: center;
        /*transition: opacity 0.7s ease-out*/
    }
    .breadcrumb{
        font-size: 1.5rem;
        padding: 0 1em;
        font-style: italic;
        color: $info-color;
    }
    .main-nav{
        display: inline-flex;
        flex-direction: column;
        align-items: flex-end;

        .router-link-active{
            font-style: italic;
            color: $info-color;
            outline: none;
        }

        a{
            display: inline-block;
            width: 15rem;
            /*padding: 0.8rem 0;*/
            z-index : 3;
            text-align: center;
            font-size: 1.2em;
            color: $secondary-text-color;
            background-color: $primary-text-color;
            box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24), 0 1.5px 6px rgba(0, 0, 0, 0.12);
        }
        &:first-child{
            background-color: green;
         }
    }



    /** Responsive **/
    /** screen > 432px **/
    @media only screen and (min-width: 432px){
        header{
            height: 2.5em;
        }
        .home-nav{
            height: 2.5em;
            flex-wrap: nowrap;
            justify-content: space-between;
        }
        .burger{
            align-self: flex-end;
        }
    }

    /** screen > 1150px **/
    @media only screen and (min-width: 1150px){
        .home-nav{
            flex-direction: row;
            justify-content: space-between;
        }
        .burger{
            display: none;
        }
        .main-nav {
            flex-direction: row;
            align-items: center;
            margin-right : 10em;

            a {
                display: inline-block;

                width: 5rem;
                height: 2rem;
                padding: 0;
                margin: 0 1.5rem;
                box-shadow: none;

                transition: all .5s ease;

                &:hover{
                     font-size: 1.1em;
                     text-shadow: 1px 1px 2px grey;
                     transition: all .3s ease;
                }
            }
        }
    }
</style>