<template>
    <v-form>
        <v-container>
            <v-flex xs12 sm6 offset-sm3>
                <h2>QR Code</h2>
                <p> Enabled: {{ message }} </p>
                <canvas id="canvas"></canvas>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
import { GetQrCode } from '../api/user.js';
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
        const res = GetQrCode();
        res.then((response) => {
            console.log(response);
            this.message = response.enabled;
            if ( response.enabled === true ) {
                QRCode.toCanvas(document.getElementById('canvas'), response.qrcode);
            }
        });
    }
}
</script>
