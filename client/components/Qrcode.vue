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
            allowedTries: 3,
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
        // add a code that checks if user has failed 2fa too many times
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
        Continue() {
            //get to user profile without 2FA
        },
        CheckTries() {
            const tries = this.$store.state.SecondAuthentiactionTries;
            const numbOfTries = (this.allowedTries - tries);
            if ( numbOfTries > 0)
            {
                const data = {
                    isAllowed: true,
                    message: (numbOfTries)+' attempts remaining'
                }
                return data;
            } else {
                const data = {
                    isAllowed: false,
                    message: 'Too many attempts, wait 1 minute',
                    timeStamp: Math.floor(Date.now() /1000)
                }
                return data;
            }
        },
        Validate() {
            this.$store.state.SecondAuthentiactionTries++;
            const data = {
                qrcode: this.qrCode,
                code: this.code
            }
            if (this.code) {
                this.alert=false;
                if(this.$store.state.SecondAuthentiactionTries<=3) {
                    const reply2=this.CheckTries();
                    const res = ValidateCode(data);
                    res.then((response) => {
                            if(response.result) {
                                this.$store.state.SecondAuthentiactionTries--;
                                this.ShowSuccess();
                                //redirect to UserPage
                            } else {
                                this.ShowError(reply2.message);
                                if(reply2.isAllowed===false) {
                                    this.DisableTheInput();
                                }
                            }
                        });
                } else {
                    this.ShowError('Too many attempts, wait 1 minute');
                    //disable input button and show timer of 1 minute
                    this.DisableTheInput();
                    // add v-progress-circular
                    
                }
            } else {
                const errmessage = 'Enter Valid Code.';
                this.ShowError(errmessage);
            }
        },
        DisableTheInput(){
            this.disabledBtn = true;
            setTimeout(() => {
                this.$store.state.SecondAuthentiactionTries=2;
                const replay=this.CheckTries();
                this.ShowError(replay.message);
                this.disabledBtn = false;
            }, 60000);
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
            const reply=this.CheckTries();
            this.ShowError(reply.message);
            this.disabledBtn=false;
        }
    }
}
</script>
