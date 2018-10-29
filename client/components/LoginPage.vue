<template>
<v-form ref="form">
    <v-container>
      <h1> Login </h1>
      <p> {{ userMessage }} </p>
        <v-flex xs12 sm6 offset-sm3>
            <v-text-field
            v-model="email"
            label="Email"
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
import { LoginUser } from '../api/user';

export default {
  name: 'login',
  data() {
    return {
        userMessage:'',
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
            if(result==='Authorization successful')
            {
              this.userMessage = result;
              // const token=localStorage.getItem('token');
              //needed code to check if user has enabled 2FA
              //when response is returned redirect him to qrcode page
              setTimeout(()=> {
                this.$router.replace({ name: 'qrcode' });
                }, 3000);
            }
            else{
              this.userMessage = 'Authorization Failed';
            }
          });
      },
      clear () {
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
