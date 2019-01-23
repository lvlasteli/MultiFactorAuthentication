<template>
    <v-form>
        <h2> You made it O7 </h2>
        <v-flex xs2 sm4 offset-sm4>
            <v-img src="https://pa1.narvii.com/6148/9ee6f9002d238e9864e5237112756ac15ca3fd2c_hq.gif">
                <div class="fill-height bottom-gradient"></div>
            </v-img>
      </v-flex>
    </v-form>
    
</template>

<script>
import { ConfirmAuth, ResetQRCode } from '../api/user.js';
require('dotenv').config();

export default {
    name: 'userprofile',
    data() {
        return {

        }
    },
    created: function() {
        const data = {
            bool: true
        }
        ConfirmAuth(data);
        ResetQRCode(data);
    }
}
</script>

