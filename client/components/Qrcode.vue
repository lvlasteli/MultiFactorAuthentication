<template>
    <v-form>
        <v-container>
            <v-flex xs12 sm6 offset-sm3>
                <h2>QR Code</h2>
                <p> Enabled: {{ message }} </p>
            </v-flex>
        </v-container>
    </v-form>
</template>

<script>
import { GetQrCode } from '../api/user.js';
export default {
    name: 'qrcode',
    data() {
        return {
            message:'',
        }
    },
    created: function()
    {
        const res = GetQrCode();
        res.then((response) => {
            this.message = response;
            if (response === true ) {
                const skey = localStorage.getItem('secretKey');
                console.log(skey);
                if (skey === null)
                {
                    RequestSecretKey();
                } else {
                    GenerateQRCode();
                }
            }
        });
    },
    methods: {
        RequestSecretKey() {

        },
        GenerateQRCode() {
            
        }

    }
}
</script>
