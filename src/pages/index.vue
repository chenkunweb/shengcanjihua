<template>
     <div >
         <van-tabs @click="click" v-model="activeName" id="aaa">
            <van-tab  v-for="(item,index) in label" :title="item.name" :name="item.part" :key="index" id="aaa">
            </van-tab>
        </van-tabs>
        <router-view></router-view>
       
     </div>
   
</template>

<script>

export default {
    data(){
        return{
            activeName:'',//导航栏
            label:[],//导航栏列表
            list:[//导航栏赛选数据
                { name:'电装', part:'/zhuangpei', },
                { name:'电线', part:'/dianxian'},
                { name:'注塑', part:'/zhusu'},
                { name:'五金', part:'/wujin'},
                { name:'机加', part:'/jijia'},
                { name:'治具', part:'/zhiju'},
                { name:'样品',  part:'/yangpin'},
                { name:'仓库',  part:'/cangku'},
                { name:'采购',  part:'/caigou'},
                { name:'电镀', part:'/diandu'},
                { name:'宗联机', part:'/zonglianji'},
                { name:'宗联机配套', part:'/zonglianjipt'},
            ],
        }
    },
   
    created(){
        this.getData()
    },
    methods:{
        async getData(){
            //获取模块
            let mouse = JSON.parse(await this.$api.api.get('/api/MOUSER','')).Table
            let list = []
            mouse.forEach((item)=>{
                if(this.util.parse_url('userid') ==item.用户ID.replace(/\s+/g, "")){
                    this.list.forEach((items)=>{
                        if(item.模板ID.split('-')[2]){
                            if(items.name == item.模板ID.split('-')[2].replace(/\s+/g, "")&&item.查看*1!=0){
                                list.push({
                                    name:items.name,
                                    part:items.part,
                                    增加:item.增加.replace(/\s+/g, "")*1,
                                    删除:item.删除.replace(/\s+/g, "")*1,
                                    修改:item.修改.replace(/\s+/g, "")*1,
                                    查看:item.查看.replace(/\s+/g, "")*1,
                                    特权:item.特权.replace(/\s+/g, "")*1,
                                })
                            }
                        }
                    })
                }
            })
            let obj = {};

            let peon = list.reduce((cur,next) => {
                obj[next.name] ? "" : obj[next.name] = true && cur.push(next);
                return cur;
            },[]) //设置cur默认类型为数组，并且初始值为空的数组
            console.log(peon);
            this.label = peon
            this.$store.state.label = peon
            if(this.$store.state.path == undefined){
                this.$router.push({path:this.label[0].part})
                this.activeName = this.label[0].part
            }else{
                this.$router.push({path:'/'+this.$store.state.path})
                this.activeName = '/'+this.$store.state.path
            }
            
        },
        // 页面跳转
        click(name,title){  this.$router.push({path:name}) },
       
    }
}
</script>

<style>
.van-tabs{
    padding: 0;
    position: relative;
    /* margin: 0 0 15px; */
}
.van-tabs__nav{
white-space: nowrap;
    position: relative;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    /* float: left; */
    z-index: 2;
}
.van-tabs__wrap--scrollable .van-tab{
    padding: 0 20px;
    height: 40px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    position: relative;
}
.van-tabs__nav--line{
    background: none !important
}
.van-tabs__line{
    position: absolute;
    bottom: 15px;
    left: 0;
    height: 2px;
    background-color: #409EFF;
    z-index: 1;
    -webkit-transition: -webkit-transform .3s cubic-bezier(.645,.045,.355,1);
    transition: -webkit-transform .3s cubic-bezier(.645,.045,.355,1);
    transition: transform .3s cubic-bezier(.645,.045,.355,1);
    transition: transform .3s cubic-bezier(.645,.045,.355,1),-webkit-transform .3s cubic-bezier(.645,.045,.355,1);
    list-style: none;
}
.count_errors{
    background-color: red !important;
}
.count_yes{
    background-color: #fff !important;
}
*{
    margin: 0;
    padding: 0;
  }
  body{
      overflow: hidden;
  }
  .el-range-editor.el-input__inner {
      padding: 3px !important;
      width:220px !important
  }

.van-tabs__wrap--scrollable .van-tab{
    flex: auto
}
.handsontableInputHolder .listbox,
.handsontableInputHolder .listbox .wtHolder,
.handsontableInputHolder .listbox .ht_master .htCore
  {
     min-width: 300px !important;
     
 }
 .van-tabs__nav--line {
    background: #f5f5f5;
  }
  
  .handsontable td.htInvalid{
    background-color: #fff !important;

  }
  #hot-display-license-info{
    display: none
  }

.van-tabs{
    /* position: fixed; */
    width: 100%;
    z-index: 140;
}
.ht_clone_left{
    z-index: 99 !important;
}
.fixed{
    /* position: fixed; */
    z-index: 140;
    background: #fff;
    top: 44px
}
#hot-preview{
    /* padding-top: 134px */
}

  .hello{
    position: relative;
  }
  .block{
      display: flex;
  }
  .el-button{
      padding: 10px 5px !important
  }
  .el-button+.el-button {
      margin-left: 0px !important
  }
  .el-dropdown{
    position: absolute;
    right: 0;
    top: 0;
  }
  .el-select {
      width: 60px
  }
  
  .el-input--suffix .el-input__inner{
      padding-right: 0px !important;
      padding-left: 5px !important
  }
  .el-input__suffix{
      right: 0px !important;
  }
  .m-colorPicker[data-v-11842410]{
      z-index: 1000;
      top:5px
  }
  .ht_clone_top{
     /* transform: none !important; */
     /* top: 134px!important; */
     /* position: fixed!important; */
     /* left: auto; */
     
  }
  .m-colorPicker .colorBtn[data-v-11842410]{
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    border-radius: 50%
}
.title {
    width: 100%;
    height: 50px;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
}
.el-dialog__body .el-input__inner{
    padding: 0px !important;
}
@media screen and (max-width: 1440px){
    .el-table{
        font-size: 12px !important;
    }
    .hello{width: 100%;margin: 0 auto;font-size: 12px}
   .htRowHeaders{
        height: 780px !important;
        overflow: hidden !important;
    }

}
@media screen and (min-width: 1441px) and (max-width: 1600px){
    .hello{width: 95%;margin: 0 auto;font-size: 13px}
    .el-table{
        font-size: 13px !important;
    }
    .htRowHeaders{
        height: 656px !important;
        overflow: hidden !important;
    }
}
@media screen and (min-width: 1601px){
    .hello{width: 90%;margin: 0 auto;font-size: 14px}
    .htRowHeaders{
        height: 836px !important;
        overflow: hidden !important;
    }
}

  /* .ht_clone_left .ht__highlight{
      height: 37px !important
  } */
  .ht_clone_left .wtHolder{
      width: 40px !important
  }



.ht_master .wtHolder::-webkit-scrollbar {
    display: none !important;
}
.el-dialog__wrapper{
    position:inherit !important; 
    top:inherit !important;
    right: inherit !important;
    bottom: inherit !important;
    left: inherit !important;
     overflow:inherit !important;
     margin: inherit !important;
}
.fixeds .el-dialog{
    position: fixed !important;
    top: 40px ; 
     left: 50%;
     z-index: 1111;
    transform: translate(-50%,0);
    margin-top: 15vh;
    width: 750px;
    /* top: 100px !important; */

}
.el-dialog__body{
    padding: 30px 20px 0px 20px !important;
    /* height: 100%; */
}
.handsontable th, .handsontable td{
    text-align: center !important;
}
@media screen and (max-width: 500px) {
    .moble_hidden{
        display: none
    }
    .fixeds .el-dialog{
        width: 500px !important;
    }
}
.pika-lendar{
    width: auto !important;
    margin: 0px !important;
}
</style>