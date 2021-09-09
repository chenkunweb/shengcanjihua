//store.js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{
        userid:'WoBuShiDouHao', 
        height:'',
        options: [
            {value: '56px',label: '初号'}, 
            {value: '48px',label: '小初'}, 
            {value: '34.7px',label: '一号'}, 
            {value: '32px',label: '小一'}, 
            {value: '29.3px',label: '二号'},
            {value: '24px',label: '小二'},
            {value: '21.3px',label: '三号'},
            {value: '20px',label: '小三'},
            {value: '18.7px',label: '四号'},
            {value: '16px',label: '小四'},
            {value: '14px',label: '五号'},
            {value: '12px',label: '小五'},
            {value: '10px',label: '六号'},
            {value: '8.7px',label: '小六'},
            {value: '7.3px',label: '七号'},
            {value: '6.7px',label: '八号'},
        ],
        
    }
})

export default store