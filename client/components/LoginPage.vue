<template>
<v-form ref="form">
    <v-container>
      <h1> Login </h1>
      <v-flex xs12 sm6 offset-sm3>
        <v-alert :color="color"
        :value="alert"
        :type="type">
        {{ userMessage }}
        </v-alert>
            <v-text-field
            name="email"
            v-model="email"
            label="Email"
            required>
            </v-text-field>
            <v-text-field
                v-model="password"
                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                :type="show1 ? 'text' : 'password'"
                name="password"
                label="Password"
                @click:append="show1 = !show1">
            </v-text-field>
            <v-btn :disabled="disabledBtn" @click="submit">submit</v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-flex>
    </v-container>
  </v-form>

</template>

<script>
import { LoginUser } from '../api/user';

export default {
  name: 'login',
  data() {
    return {
        alert:false,
        color:'',
        type: 'info',
        userMessage:'',
        disabledBtn: false,
        show1: false,
        email: '',
        password: ''
    };
  },
  methods: {
      submit () {
        const data = {
            'email': this.email,
            'password': this.password
          };
          const message=LoginUser(data);
          message.then((result) => {
            if(result.message==='Authorization successful')
            {
              this.alert = true;
              this.color = "green";
              this.type = "success";
              this.userMessage = result.message+', Welcome '+result.username;
              this.$store.state.Username = result.username;
              setTimeout(()=> {
                this.$router.replace({ name: 'qrcode' });
                }, 1500);
            }
            else{
              this.alert = true;
              this.color = "red";
              this.type = "error";
              this.userMessage = result.message;
              if(result.message==='Failed too many times, wait 1 minute') {
                this.disabledBtn = true;
                setTimeout(() => {
                this.alert = false;
                this.disabledBtn = false;
                }, 60000);
              }
              
            }
          });
      },
      clear () {
        this.alert = false;
        this.userMessage = '';
        this.$refs.form.reset();
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
