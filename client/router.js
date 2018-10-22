import Vue from 'vue';
import Router from 'vue-router';
import Login from './components/LoginPage.vue';
import Home from './components/Homepage.vue';

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
    }
    ]
});
export default router;