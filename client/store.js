import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        Username: null,
        SecondAuthentiactionTries: 0,
    }
});
export default store;