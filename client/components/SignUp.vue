<template>
  <v-form ref="form" v-model="valid" lazy-validation>
      <v-container>
        <h1>Sign Up </h1>
        <p> {{ userMessage }}</p>
        <v-flex xs12 sm6 offset-sm3>
            <v-text-field
            v-model="username"
            :rules="nameRules"
            :counter="10"
            label="Username"
            required>
            </v-text-field>
            <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required>
            </v-text-field>
            <v-text-field
            v-model="password"
            :append-icon="show1 ? 'visibility_off' : 'visibility'"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            @click:append="show1 = !show1"
            label="Password"
            required>
            </v-text-field>
            <v-btn
            :disabled="!valid"
            @click="submit">
            submit
            </v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-flex>
      </v-container>
  </v-form>
</template>

<script>
  import { SingUp } from '../api/user.js'
import { setTimeout } from 'timers';

  export default {
    data: () => ({
      userMessage: '',
      show1: false,
      valid: false,
      password: '',
      username: '',
      nameRules: [
        v => !!v || 'Userame is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
    }),

    methods: {
      submit () {
        const data = {
          "email": this.email,
          "username": this.username,
          "password": this.password
        }
        const message=SingUp(data);
        message.then((result) => {
          this.userMessage = result;
          if(result === "User Created")
          {
            setTimeout(()=> {
            this.$router.replace({ name: 'login' });
            }, 1500);
          }
        });
      },
      clear () {
        this.userMessage = '';
        this.$refs.form.reset();
      }
    }
  }
</script>