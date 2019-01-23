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
                    <qrcode-vue v-if="qrCode !== null" :value="this.qrCode" size="200" level="M"></qrcode-vue>
                    <br>
                    <v-flex xs8 offset-xs2>
                        <v-text-field v-model="code" label="Enter The Code" box clearable></v-text-field>
                    </v-flex>
                    <v-btn outline round :disabled="disabledBtn" color="green" @click="Validate()" dark>
                        <v-icon>check_circle</v-icon> Insert
                    </v-btn>
                    <v-dialog v-model="dialog" persistent max-width="400px">
                        <v-btn slot="activator" outline round color="red" dark>
                            <v-icon>remove_circle</v-icon> Reset
                        </v-btn>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Renter your email and passport</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container grid-list-md>
                                    <v-layout wrap>
                                        <v-flex xs12>
                                            <v-text-field v-model="email" name="email" label="Email" required></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field v-model="password"
                                                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                                                :type="show1 ? 'text' : 'password'"
                                                name="password"
                                                label="Password"
                                                @click:append="show1 = !show1" required></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                                <small>*This form allows for reseting QR code</small>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
                                <v-btn color="blue darken-1" flat @click="Reset()">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <br>
                    <br>
                </v-card>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
import { GetQrCode, Enable2FA, ValidateCode, ResetQRCode } from '../api/user.js';
import QrcodeVue from 'qrcode.vue';

export default {
    name: 'qrcode',
    data() {
        return {
            email: '',
            show1: false,
            password:'',
            dialog: false,
            message:'',
            qrCode: null,
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
                    if(response.qrcode!== null) {
                        this.qrCode =  response.qrcode;
                    }
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
                    const message = 'Code is Validated!';
                    this.ShowSuccess(message);
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
        ShowSuccess(message)
        {
            this.alert = true;
            this.authMessage=message;
            this.color='green';
            this.type='success';
        },
        Reset() {
            const data = {
                email: this.email,
                password: this.password
            }
            this.dialog =false;
            const res = ResetQRCode(data);
            res.then((response) => {
                if(response.status === false) {
                    this.ShowError(response.message);
                }
                if(response.status === true) {
                    this.ShowSuccess(response.message);
                     const res = GetQrCode();
                        res.then((response) => {
                            this.message = response.enabled;
                            if ( response.enabled === true ) {
                                if(response.qrcode!== null) {
                                    this.qrCode =  response.qrcode;
                                }
                        }
            });

                }

            });
        }
    }
}
</script>
