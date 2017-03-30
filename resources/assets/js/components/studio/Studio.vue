<template>
    <section class="admin-container">
        <div class="sidebar">
            <admin-nav></admin-nav>
        </div>
        <section class="admin-view">
            <router-view></router-view>
        </section>
    </section>
</template>

<script>
    export default{
        data(){
            return{

            }
        },
        created(){
            console.log('studio open')
        }
    }
</script>

<style lang="scss">

</style>