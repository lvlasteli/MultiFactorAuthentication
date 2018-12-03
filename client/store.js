import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        Username: null,
        FirstAuthentiactionTries: 0,
        SecondAuthentiactionTries: 0,
    }
});
export default store;