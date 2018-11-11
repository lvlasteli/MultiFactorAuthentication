<template>
    <v-form>
        <v-container>
            <v-flex xs12 sm4 offset-sm4>
                <h2>Two Factor Authentication</h2>
                <p> Enabled: {{ message }} </p>
                <v-card v-if="message === false">
                    Do you wanna enable it?
                    <v-btn outline round  color="green" small dark>
                        <v-icon>check_circle</v-icon> Yes
                    </v-btn>
                    <v-btn outline round color="red" small dark>
                        <v-icon>remove_circle</v-icon> No
                    </v-btn>
                </v-card>
                <v-card v-else>
                    <canvas id="canvas"></canvas>
                    <v-flex xs6 offset-xs3>
                        <v-text-field label="Enter The Code" box clearable></v-text-field>
                    </v-flex>
                    <v-btn outline round  color="green" small dark>
                        <v-icon>check_circle</v-icon>
                    </v-btn>
                    <v-btn outline round color="red" small dark>
                        <v-icon>remove_circle</v-icon>
                    </v-btn>
                </v-card>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
import { GetQrCode, Enable2FA } from '../api/user.js';
import QRCode from 'qrcode';

export default {
    name: 'qrcode',
    data() {
        return {
            message:'',
            QRCode: ''
        }
    },
    created: function() {
        if (this.$store.state.Username === null) {
            this.$router.replace({ name: 'home' });
        } else {
            const res = GetQrCode();
            res.then((response) => {
                console.log(response);
                this.message = response.enabled;
                if ( response.enabled === true ) {
                    QRCode.toCanvas(document.getElementById('canvas'), response.qrcode);
                }
        });
        }   
    },
    methods: {
        EnableIt() {
            const data = true;
            Enable2FA(data);
        },
        Continue() {

        }
    }
}
</script>
