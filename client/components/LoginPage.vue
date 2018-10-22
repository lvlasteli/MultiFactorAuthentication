<template>
<v-form ref="form">
    <v-container>
        <v-flex xs12 sm6>
            <v-text-field
            v-model="username"
            label="Username"
            required>
            </v-text-field>
            <v-text-field
                v-model="password"
                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                @click:append="show1 = !show1">
            </v-text-field>
            <v-btn @click="submit">submit</v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-flex>
    </v-container>
  </v-form>

</template>

<script>

export default {
  name: 'login',
  data() {
    return {
        show1: false,
        username: '',
        password: ''
    };
  },
  methods: {
      submit () {
        // if (this.$refs.form.validate()) {
        //   // Native form submission is not yet supported
        //   axios.post('/api/submit', {
        //     name: this.username,
        //     password: this.password,
        //   })
        // }
        window.alert("Username:"+ this.username + "\nPassword:"+this.password);
      },
      clear () {
        this.$refs.form.reset()
      }
  }
};
</script>

<style scoped>
#home {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
