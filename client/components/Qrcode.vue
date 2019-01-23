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
                        <v-icon>check_circle</v-icon> Insert
                    </v-btn>
                    <v-btn outline round color="red" @click="Dec()" dark>
                        <v-icon>remove_circle</v-icon> Reset
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
        Validate() {
            const data = {
                qrcode: this.qrCode,
                code: this.code
            }
            const res = ValidateCode(data);
            res.then((response) => {
                if(response.result) {
                    this.ShowSuccess();
                    setTimeout(()=> {
                    //redirect to UserPage
                    this.$router.replace({ name: 'userprofile' });
                    }, 1500);
                } else {
                    this.ShowError(response.message);
                    if(response.message === 'Failed too many times, wait 1 minute') {
                        this.DisableTheInput();
                    }
                }
            });   

        },
        DisableTheInput(){
            this.disabledBtn = true;
            setTimeout(() => {
                this.ShowError('Insert valid code');
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
        }
    }
}
</script>
