<template>
    <v-form>
        <v-container>
            <v-flex xs12 sm6 offset-sm3>
                <h2>Two Factor Authentication</h2>
                <p> Enabled: {{ message }} </p>

                <v-card v-if="message === false">
                    Do you wanna enable it?
                    <v-btn outline round  color="green" @click="EnableIt()" small dark>
                        <v-icon>check_circle</v-icon> Yes
                    </v-btn>
                    <v-btn outline round color="red" @click="Continue()" dark>
                        <v-icon>remove_circle</v-icon> No
                    </v-btn>
                </v-card>
                <v-card v-else>
                    <v-alert :color="color" :value="alert" :type="type">
                        {{ authMessage }}
                    </v-alert>
                    <br>
                    <qrcode-vue :value="this.qrCode" size="200" level="M"></qrcode-vue>
                    <br>
                    <v-flex xs8 offset-xs2>
                        <v-text-field v-model="code" label="Enter The Code" box clearable></v-text-field>
                    </v-flex>
                    <v-btn outline round :disabled="disabledBtn" color="green" @click="Validate()" dark>
                        <v-icon>check_circle</v-icon>
                    </v-btn>
                    <v-btn outline round color="red" @click="Dec()" dark>
                        <v-icon>remove_circle</v-icon>
                    </v-btn>
                    <br>
                    <br>
                </v-card>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
import { GetQrCode, Enable2FA, ValidateCode } from '../api/user.js';
import QrcodeVue from 'qrcode.vue';

export default {
    name: 'qrcode',
    data() {
        return {
            message:'',
            qrCode: '',
            code: '',
            disabledBtn: false,
            allowedTries: 4,
            authMessage: '',
            alert: false,
            color: '',
            type: 'info'
        }
    },
    components: {
        QrcodeVue
    },
    created: function() {
        if (this.$store.state.Username === null) {
            this.$router.replace({ name: 'home' });
        } else {
            const res = GetQrCode();
            res.then((response) => {
                this.message = response.enabled;
                if ( response.enabled === true ) {
                    this.qrCode =  response.qrcode;
                }
        });
        // add a code that check if user has failed 2fa too many times
        }   
    },
    methods: {
        EnableIt() {
            const data = { enabled: true };
            const res = Enable2FA(data);
            res.then((response) => {
                this.message = response.data.enabled;
                this.qrCode = response.data.qrcode;
            });
        },
        Validate() {
            const data = {
                qrcode: this.qrCode,
                code: this.code
            }
            if (this.code) {
                this.alert=false;
                const reply = this.CheckTries();
                if(reply.isAllowed) {
                    this.$store.state.SecondAuthentiactionTries++;
                    //Validate the code
                    const res = ValidateCode(data);
                    res.then((response) => {
                            if(response.result) {
                                this.$store.state.SecondAuthentiactionTries--;
                                this.ShowSuccess();
                                //redirect to UserPage
                            } else {
                                this.ShowError(reply.message);
                            }
                        });
                } else {
                    this.ShowError(reply.message);
                    //disable input button and show timer of 1 minute
                    // add v-progress-circular
                    //this.disabledBtn = true;
                }
            } else {
                const errmessage = 'Enter Valid Code.';
                this.ShowError(errmessage);
                
            }
        },
        ShowError(message) {
            this.alert = true;
            this.authMessage=message;
            this.color='red';
            this.type='error';
        },
        ShowSuccess()
        {
            this.alert = true;
            this.authMessage='Code is Validated!';
            this.color='green';
            this.type='success';
        },
        Dec() {
            //method currently works to decrement user tries
            this.$store.state.SecondAuthentiactionTries--;
            console.log(this.$store.state.SecondAuthentiactionTries);
        },
        Continue() {
            //get to user profile without 2FA
        },
        CheckTries() {
            
            const tries = this.$store.state.SecondAuthentiactionTries;
            const numbOfTries = this.allowedTries - tries;
            if ( numbOfTries > 0)
            {
                const data = {
                    isAllowed: true,
                    numbOfTries: numbOfTries,
                    message: (numbOfTries-1)+' attempts remaining'
                }
                return data;

            } else {
                const data = {
                    isAllowed: false,
                    numbOfTries: numbOfTries,
                    message: 'Too many attempts, wait 1 minute',
                    timeStamp: Math.floor(Date.now() /1000)

                }
                return data;
            }
        }
    }
}
</script>
