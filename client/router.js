import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/LoginPage.vue';
import Home from './components/Homepage.vue';
import SignUp from './components/SignUp.vue';
import QRcode from './components/Qrcode.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
    {
        path: '/',
        redirect: 'home'
    },
    {
        path:"/login",
        name:"login",
        component: Login
    },
    {
        path:"/home",
        name:"home",
        component: Home
    },
    {
        path:"/signup",
        name:"signup",
        component: SignUp
    },
    {   
        path:"/qrcode",
        name:"qrcode",
        component:QRcode
    }
    ]
});
export default router;