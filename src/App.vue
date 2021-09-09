
<template>
  <div id="app" >
    <router-view/>
  </div>
</template>

<script>
// App.vue
export default {
  name: 'App',
  mounted(){
    
   
    
  },
 created() {
  
        //刷新不丢失store状态
        //在页面加载时,读取sessionStorage里的状态信息
        if (sessionStorage.getItem('userinfo')) {
            this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('userinfo'))));
        }

        //在页面刷新时,将vuex里的信息保存到sessionStorage里
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('userinfo', JSON.stringify(this.$store.state));
        });
    }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
  }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  /* overflow-y: hidden */
}
.handsontable tr td.htInvalid{
  background-color: #fff !important
}

</style>
