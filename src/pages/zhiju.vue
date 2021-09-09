<!-- cnc.vue-->
<template>
   <div class="hello" >
        <div class="fixed">
            <!-- 标题 -->
            <div class="title" >{{title}}</div>
            <div class="block no-print">
                <div >
                    <span class="demonstration " ></span>
                    <!-- 日期查询 -->
                    <el-date-picker @change="change" v-model="value1" clearable type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
                    <!-- 查找定位 -->
                    <el-button type="primary" plain class="btn btn-primary" @click="dialogFormVisibles">查找</el-button>
                    <el-dialog title="查找数据" ref="contents" class="fixeds" width='750px' :append-to-body="true" :close-on-click-modal="false" v-dialogDrag :modal="false" :visible.sync="dialogFormVisible">
                        <div style="display:flex">
                            <el-input v-model="content" placeholder="请输入内容"></el-input>
                            <el-button @click="contentAll">查找本页</el-button>
                            <el-button @click="contentAlls">查找全部</el-button>
                            <el-button plain type="primary" :disabled="downs" @click="contentOne">保存</el-button>
                        </div>
                        <!-- 查找定位数据表格 -->
                        <el-table @row-click="contentClick" :data="contentDatas" height="500px" style="width: 100%">
                            <el-table-column prop="riqi" sortable label="日期" > </el-table-column>
                            <el-table-column  prop="gongdan" label="工单号" > </el-table-column>
                            <el-table-column  prop="xinghao" label="型号"  > </el-table-column>
                            <el-table-column  prop="shuliang" label="数量" > </el-table-column>
                            <el-table-column  prop="wancheng" label="完成数量" > </el-table-column>
                            <el-table-column  prop="quxiao" label="取消数量" >
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.trues==1&scope.row.a==false&scope.row.quxiao==''"  plain type="primary" @click="jisuan(scope.row,scope.$index)" >计算</el-button>
                                    <span v-if="scope.row.trues==0">{{scope.row.quxiao}}</span>
                                    <el-input v-if="scope.row.trues==1&scope.row.a==true&scope.row.quxiao!=''" v-model="scope.row.quxiao" @blur="max(scope.row,scope.$index)" placeholder="请输入内容"></el-input>
                                    <span v-if="scope.row.trues==1&scope.row.a!=true&scope.row.quxiao!=''">{{scope.row.quxiao}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column  prop="jiaoqi" label="交期" > </el-table-column>
                        </el-table>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>
                    <!-- 设置表格样式 -->
                   <div class="moble_hidden">
                        <span>背景<colorPicker v-model="BGcolor"  v-on:change="headleChangeBGColor"></colorPicker></span>
                        <span> 字体<colorPicker v-model="color"  v-on:change="headleChangeColor"></colorPicker></span>
                        <span>加粗<el-switch v-model="value2" @change="blod" active-color="#13ce66"> </el-switch></span>
                    </div>
                </div>
                <!-- 保存打印等按钮 -->
                <div style="margin-left:5px" class="moble_hidden">
                    <el-button plain type="primary" @click="click" id="export-file" class="btn btn-primary">导出</el-button>
                    <el-button plain type="primary" @click="down" :disabled="downs" id="export-down" class="btn btn-primary">保存</el-button>
                    <el-tooltip class="item" effect="dark" content="如果行数过多显示不全请下载后打印" placement="top-start">
                        <el-button plain type="primary" @click="onPrint" >打印</el-button>
                    </el-tooltip>
                    <el-button plain type="primary" @click="clerk" >清屏</el-button>
                </div>
            </div>
       
        </div>
        <!-- 表格插件使用 -->
        <div id="hot-preview" ref="print"><HotTable :root="root" ref="testHot" :settings="hotSettings" ></HotTable> </div>
  </div>
</template>

<script>
    // 表格插件调用
    import { HotTable } from '@handsontable-pro/vue'
    import '../../node_modules/handsontable-pro/dist/handsontable.full.css'
    import Handsontable from 'handsontable-pro'
    // 时间函数调用
    import * as getData from '../api/getDate';
    //   vue实例赋值给_this
    var _this = {}
    let that = null
  export default {
    //实例初始化数据
    data: function() {
      return {
        downs:false,//阻止连续保存
        quxiaoas:0,//取消数量计算初始值
        erpId:'治具',//部门代号
        cxDowns:false,//取消数量是否可编辑
        erpName:'治具',//部门名字
        maxyps:0,//样品最大编号
        title:'治具生产计划',//标题
        permissions:'',//用户名权限
        value1: '',//选择日期初始值
        paican:[],//已排产列表
        // 查找=================================================
        height:'',//查找弹出框初始高度
        contentData: [],//查找下一个数列
        contentDatas: [],//查找全部数列
        content:'',//查找的内容
        dialogFormVisible: false,//查找弹出框展示隐藏z
        contentIndex:0,//查找index
        // 样式====================================================
        index:0,//样式递增
        value: '小四',//默认字体大小
        value2: false,//是否加粗
        biaoqian:0,//是否有数据
        color:'black',//默认字体颜色
        BGcolor:'white',//默认背景颜色
        blodstate:[],//加粗状态
        sizestate:[],//加粗状态
        BGstate:[],//背景class集合
        state:[],//背景class集合
        options: this.$store.state.options,//字体大小
        // 表格数据、、、===============================================
        column:'',//选中行
        row:'',//选中列
        root: 'test-hot',//r表格refs
        hotSettings: {
            data: [],// 表格数据
            startRows: 500,//行列范围
            startCols: 13,
            minRows: 500, //最小行
            minCols: 14,//最小列
            minSpareCols: 14,//列留白
            minSpareRows: 0,//行留白 
            autoWrapRow: true,//自动换行
            filters: true,//开启筛选
            manualColumnMove: true, //手动移动列
            manualRowMove: true,//手动移动行   
            manualColumnResize: true,//手工更改列距
            manualRowResize: true,//手动更改行距
            columnSorting: true,//排序
            stretchH: 'all',//根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展
            fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
            rowHeaderWidth: 30,//序号栏宽度
            rowHeaders: true,//展示序列号
            colHeaders:['生产日期', '订单号', '治具型号', '数量','完成数量','取消数量','交期', '备注','申请人', '工程师','备注',],//自定义列表头or 布尔值
            enterMoves: {row: 0, col: 1},
            // 标题筛选
            contextMenu: _this.util.contextMenu(_this),//右键菜单
            columns: [//添加每一列的数据类型和一些配置
                {data: 'riqi',type: "date",dateFormat: "YYYY-MM-DD"}, //时间
                {data: 'gongdan',type: "autocomplete",filter: true,source: ['Z']},//批号
                {data: 'xinghao'},//产品型号
                {data: 'shuliang'}, //数量
                {data: 'wancheng'}, //完成数量
                {data: 'quxiao'}, //取消数量
                {data:'jiaoqi',type: "date",dateFormat: "YYYY-MM-DD"},
                {data: 'beizhu'},//申请人v
                {data: 'zhuangtai'},//工程师
                {data: 'pihao'},//工程师
                {data: 'mingxi'},//工程师
                
            ],
           
           
            // 样式
            afterSelectionEnd: function(row, column,row2,column2){_this.util.afterSelectionEnd(this,_this,row, column,row2,column2) },
            //黏贴前
            beforePaste:function(){this.Paste = 1},
            // 初始化行
            cells: function(row, col, prop) {
                var cellProperties = {};
                let time = getData.dateUtils.today({ymrSign:true})
                cellProperties.readOnly= true;
                _this.$store.state.label.forEach((item)=>{
                    if(item.name =='治具'){
                        _this.permissions = item
                        if(item.增加 ==1||item.修改==1||item.特权==1){
                            cellProperties.readOnly= false;
                        }
                    }
                })
                if(this.instance.getSourceData()[row].times<time&prop!='wancheng'&prop!='quxiao'){
                        cellProperties.readOnly= true
                    }
                if(prop=='wancheng'){
                    cellProperties.readOnly= true
                }
                if(this.instance.getSourceData()[row].times>=time||this.instance.getSourceData()[row].wancheng==undefined){
                    if(prop=='quxiao'){
                        cellProperties.readOnly= true
                    }
                    
                }
                return cellProperties;
            },
            // 数据改变后
            afterChange(changes, source) {
                _this.a = this
                 var reg = new RegExp("^\\d+(\\.\\d+)?$");//正则判断是不是数字 reg.test(newValue) == true
                 let time = getData.dateUtils.today({ymrSign:true})
                 var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;//时间正则
                if(changes){
                 
                    changes.forEach(([row,prop,oldValue,newValue]) => {
                        this.getSourceData()[row].caozuoshijian = time
                        if(prop == 'gongdan'&newValue!=''){
                             _this.maxyps+=1
                            let max = _this.maxyp + _this.maxyps*1
                            if(!isNaN(max)){
                                function PrefixZero(num, n) { return (Array(n).join(0) + num).slice(-n);}
                                this.getSourceData()[row].gongdan = 'ZJ'+PrefixZero(max, 6)
                            }else{
                            this.getSourceData()[row].gongdan = ''
                            _this.$dialog({ message: '编号出错,请尝试刷新或者联系管理员'});
                        }
                            
                            this.getSourceData()[row].caozuoshijian = time
                            if(this.getSourceData()[row].riqi==undefined){
                                if(row==0){
                                    _this.$dialog({ message: '请先输入日期' });
                                    this.getSourceData()[row].gongdan =''
                                    this.render();
                                    return
                                }else{
                                    if(this.getSourceData()[row-1].riqi<time){
                                        _this.$dialog({ message: '日期不能小于当天日期'+time });
                                        this.getSourceData()[row].gongdan =''
                                        this.render();
                                    }
                                }
                            }
                           
                           
                            
                        }
                        if(prop == 'shuliang'){
                            if(reg.test(newValue) == true&newValue*1>0){

                            }else{
                                if(reg.test(newValue) == false||newValue*1<=0){
                                    this.getSourceData()[row].shuliang = ''
                                    _this.$dialog({ message: '必须是纯数字或者大于0' });
                                }
                            }
                        }
                        if(prop=='quxiao'){
                            if(reg.test(newValue) == true){
                                let a = this.getSourceData()[row].shuliang-this.getSourceData()[row].wancheng
                                if(newValue>a){
                                    this.getSourceData()[row].quxiao = ''
                                    _this.$dialog({ message: '最大取消值为'+a});
                                }
                            }else{
                                this.getSourceData()[row].quxiao = ''
                                _this.$dialog({ message: '必须是纯数字或者大于0' });
                            }
                            
                        }
                        // 生产日期逻辑判断
                        if(prop == 'riqi'){
                                this.getSourceData()[row].caozuoshijian = time
                            var isDateTime = reDateTime.test(newValue);
                            if(isDateTime){
                                if(newValue<time){
                                    this.getSourceData()[row].riqi = ''
                                    _this.$dialog({ message: '日期不能小于当天日期'+time });
                                }
                                if(this.getSourceData()[row].jiaoqi!=''){
                                    
                                    if(newValue>this.getSourceData()[row].jiaoqi){
                                        _this.$dialog({ message: '交期不能大于日期' });
                                        this.getSourceData()[row].jiaoqi = ''
                                    }
                                }
                            }else{
                                this.getSourceData()[row].riqi = ''
                                _this.$dialog({ message: '日期格式不对：'+time });
                            }
                        }
                        
                        // 交期逻辑判断
                        if(prop == 'jiaoqi'){
                            let minValue = []
                            this.getSourceData().forEach((item,index)=>{
                                    if(index<=row){
                                        if(item.riqi){
                                            minValue.push({
                                                id:row - index,
                                                data:item.riqi
                                            })
                                        }
                                    }
                                })
                                
                                minValue = minValue.sort(//排序
                                    (pre, cur) => pre.id - cur.id
                                );
                                
                                if(minValue!=''&&newValue!=''){
                                    if(minValue[0].data>newValue){
                                        // _this.$toast('交期不能小于生产日期'); 
                                        _this.$dialog({ message: '交期不能小于生产日期' });
                                        this.getSourceData()[row].jiaoqi = ''
                                    }
                                
                                }else{
                                    if(minValue ==''){
                                        // _this.$toast('生产日期不能为空'); 
                                        _this.$dialog({ message: '生产日期不能为空'});
                                        this.getSourceData()[row].jiaoqi = ''
                                    }
                                }
                                var isDateTime = reDateTime.test(newValue);
                                if(!isDateTime){
                                    this.getSourceData()[row].jiaoqi = ''
                                    _this.$dialog({ message: '交期格式不对'+time });
                                }
                            
                        }
                    })
                }
                 this.render();
            },
            // 删除数据
            afterRemoveRow(index){_this.util.afterRemoveRow(_this,index)},
           
        }
      };
    },
    // 实例创建前
    beforeCreate(){ _this = this; },
    // 实例创建完
    created(){
        this.$store.state.path = window.location.hash.split('/')[1]
        this.util.GetData(this)
        //样品最大编号
        this.$api.get('/api/Planmaxbh',{bm:'ZJ'},res=>{
            this.maxyp = JSON.parse(res.data).Table[0].最大工单号==null?0:JSON.parse(res.data).Table[0].最大工单号
            console.log(this.maxyp)
        })
    },
    // 方法
    methods:{
        //取消数量计算
        jisuan(e,v){
            let quxiao = e.shuliang.replace(/\s+/g, "")*1-e.wancheng
            this.quxiaoas=1
            this.contentDatas[v].quxiao=quxiao
            this.contentDatas[v].a=true
        },
        //输入取消数量判断是否超出
        max(e,v){
            let quxiao = e.shuliang.replace(/\s+/g, "")*1-e.wancheng
            if(e.quxiao>quxiao){
                console.log(quxiao)
                this.$dialog({ message: '不能大于'+quxiao });
                this.contentDatas[v].quxiao=quxiao
            }
        },
        //显示隐藏查找弹出框
        dialogFormVisibles(){
            this.dialogFormVisible=true
            if(this.wailian!=-1){
                let value = this.hotSettings.columns[this.wailians].data
                if(value=='gongdan'||value=='jiaoqi'||value=='xinghao'){
                    this.content = this.a.getSourceData()[this.wailian][value]
                }else{
                    this.content = this.a.getSourceData()[this.wailian].gongdan
                }
                this.contentAlls()
                this.quxiaoas=0
                this.aids = this.a.getSourceData()[this.wailian]
            }
        },
        // 表格查找全部数据函数
        contentAll(){
            let a= []
            this.contentData.forEach((item)=>{
                if(item.gongdan.indexOf(this.content)!=-1||item.jiaoqi.indexOf(this.content)!=-1||item.xinghao.indexOf(this.content)!=-1){
                    a.push(item)
                }
            })
            this.contentDatas = a
        },
        // 表格查找全部数据函数定位
        contentClick( row, column, event){
            _this.a.scrollViewportTo(row.row,row.col,false,true);
            _this.a.selectCell(row.row,row.col);
        },
        // erp全部数据查找
        contentAlls(){
            let a= []
            this.chax.forEach((item)=>{
                if(item.gongdan.indexOf(this.content)!=-1||item.jiaoqi.indexOf(this.content)!=-1||item.xinghao.indexOf(this.content)!=-1){
                    a.push(item)
                }
            })
            this.contentDatas = a
        },
        // 取消数量计算保存
        contentOne(){_this.util.contentOne(this)},
        
        //打印
        onPrint() {this.util.onPrint(this,this.title) },
        //背景颜色选择器
        headleChangeBGColor(e){let a = 'BG';let b = 'BG,';this.util.style(a,b,e,_this);this.util.headleChangeBGColor(_this,e,'zhiju',1);_this.a.render()},
        //字体颜色选择器
        headleChangeColor(e){let a = 'color';let b = 'color,';this.util.style(a,b,e,_this);this.util.headleChangeColor(_this,e,'zhiju',1);_this.a.render()},
        //加粗
        blod(e){let a = 'blod';let b = 'blod,';this.util.style(a,b,e,_this);this.util.blod(_this,e,'zhiju',1);_this.a.render()},
        // 字体大小
        size(e){let a = 'size';let b = 'size,';this.util.style(a,b,e,_this);this.util.size(_this,e,'zhiju',1);_this.a.render()},
        // 保存文件
        //保存
        down(){_this.util.down(this,'http://www.zanty.net:8124?date=')},
        
        // 下载文件
       click(){this.util.click(_this,this.title) },
        // 清空查询数据
        clerks(){location.reload();},
        // 清空内容
        clerk(){ _this.a.loadData(null) },
       
        // 日期筛选
        change(e){
          _this.util.change(e,this,'zhiju')
          this.maxyps = 0
            //样品最大编号
        this.$api.get('/api/Planmaxbh',{bm:'ZJ'},res=>{
            this.maxyp = JSON.parse(res.data).Table[0].最大工单号==null?0:JSON.parse(res.data).Table[0].最大工单号
        })
        },

        
    },
    // 监视
    watch:{
        '$store.state.height': {
            immediate: true,
            handler(newValue) {
                this.height = newValue
            }
        },

    },
    // 注册组件
    components: {
      HotTable
    }
  }
</script>
