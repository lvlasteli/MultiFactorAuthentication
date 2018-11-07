<template>
  <v-toolbar dark>
    <v-btn @click="goTo('home')" large round>
      <img src="../assets/logo.png" width="40" height="40">
    </v-btn>
    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn v-if='Username === null' flat @click="goTo('login')">Login</v-btn>
      <v-btn v-if='Username === null' flat @click="goTo('signup')">Sign Up</v-btn>
      <v-menu v-if='Username !== null' bottom offset-y>
        <v-btn slot="activator" dark> {{ this.$store.state.Username }}
        </v-btn>
        <v-list dark>
          <v-list-tile @click="Logout('home')">
            <v-list-tile-title> LOGOUT </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
      return {
        User: "User"
      }
    },
    methods: {
        goTo(page)
        {
          this.$router.replace({ name: page });
        },
        Logout(page) {
          this.$store.state.Username = null;
          this.$router.replace({ name: page });
          this.localst
        }
        
    },
    computed: {
      Username() {
        return this.$store.state.Username
      }
    }
}
</script>

<style>

</style>
