<template>
  <v-toolbar dark>
    <v-btn @click="goTo('home')" large round>
      <img src="../assets/logo.png" width="40" height="40">
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat @click="goTo('login')">Login</v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
    name: 'Navbar',
    methods: {
        goTo(page)
        {
          this.$router.replace({ name: page});
        }
    }
}
</script>

<style>

</style>
