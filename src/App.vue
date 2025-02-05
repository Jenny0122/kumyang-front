<script setup>
import Search from './components/Search.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <RouterView />
    </div>
  </header>

</template>

<style>
@import './assets/css/default.css';
@import 'assets/css/search_sty.css';
@import './assets/css/jquery-ui.css';


.logo {
  display: block;
  margin: 0 auto 2rem;
}

a {
  text-decoration: none;
}
</style>

<!--@media (min-width: 1024px) {-->
<!--header {-->
<!--display: flex;-->
<!--place-items: center;-->
<!--padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--}-->

<!--header .wrapper {-->
<!--display: flex;-->
<!--place-items: flex-start;-->
<!--flex-wrap: wrap;-->
<!--}-->
<!--}-->