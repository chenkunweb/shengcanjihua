// Uint.js
import * as getData from './getDate';
import html2canvas from 'html2canvas';
import printJs from 'print-js';

// 页面数据获取========================================================================================
function getDate(_this){
    _this.$api.get('/api/Plangetyd','',res=>{
        _this.maxyd = JSON.parse(res.data).Table[0].Expr1==null?0:JSON.parse(res.data).Table[0].Expr1
    })
}
// 页面工具包逻辑=======================================================================================
//右键菜单 contextMenu
function contextMenu(_this){
    return {
        items: {
            "cut": {name: '剪切'},
            "copy": {name: '复制' ,},
            
           
            "sp1": { name: '---------' },
            "row_above": {
                name: '上方插入一行',
                disabled: function () { 
                    if(this.getSelectedLast()[0] === 0){
                        return true
                    }else{
                        let today = getData.dateUtils.today({ymrSign:true})
                        return this.getSourceData()[this.getSelectedLast()[0]-1].times < today; 
                    }
                    
                }
            },
            "row_below": {
                 name: '下方插入一行' ,
                 disabled: function () { 
                    let today = getData.dateUtils.today({ymrSign:true})
                    return this.getSourceData()[this.getSelectedLast()[0]].times < today||this.getSourceData()[this.getSelectedLast()[0]+1].times==undefined;
                    
                }
            },
            "col_left": { name: '左方插入列' },
            "col_right": { name: '右方插入列' },
            "sp2": { name: '---------' },
            "remove_row": {
                name: '删除行' ,
                disabled: function () { 
                    return _this.permissions.删除 !=1&&_this.permissions.特权!=1
                
            }},
            "undo": {name: ['撤销']},
            "redo": {name: ['恢复撤销']},
            "make_read_only": {name: ['只读']},
        }
    }
}

// 样式 afterSelectionEnd
//ps:that=插件实例
//ps:_this=vue实例
//ps:row=起始行坐标
//ps:column=起始列坐标
//ps:row2=结束行坐标
//ps:column2=结束列坐标
function afterSelectionEnd(that,_this,row, column,row2,column2){
   
    that.copyRow = row
    _this.wailian = row
    _this.wailians = column
    var item = [row,column,row2,column2];
    var startRow = Math.min(item[0], item[2]);
    var endRow = Math.max(item[0], item[2]);
    var startCol = Math.min(item[1], item[3]);
    var endCol = Math.max(item[1], item[3]);
    let rowIndexs = []
    for (var rowIndex = startRow; rowIndex <= endRow; rowIndex += 1) {rowIndexs.push(rowIndex)}
    let columnIndexs = []
    for (var columnIndex = startCol; columnIndex <= endCol; columnIndex += 1) {columnIndexs.push(columnIndex)}
    _this.row =rowIndexs
    _this.column = columnIndexs
    _this.value2 =false
    _this.color ='black'//默认字体颜色
    _this.BGcolor ='white'//默认背景颜色
    _this.value =  '小四'
    let data = []
    if(columnIndexs == 4&&rowIndexs.length!=1){
        for (var i = 0; i < rowIndexs.length; i += 1) {
            var item = rowIndexs[i];
            if(that.getSourceData()[item].shuliang!=undefined){ data.push(that.getSourceData()[item].shuliang) }
        }
    }
    if(data!=''){
        let num = data.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue))
        _this.$toast('总共为'+num);
    }
    // 重置背景颜色
    if(_this.BGstate){
        _this.BGstate.forEach((item)=>{
            if(item.columnIndexs.toString().indexOf(column)!=-1&&item.rowIndexs.toString().indexOf(row)!=-1){_this.BGcolor =item.state }
        })
    }
    // 重置字体颜色
    if(_this.state){
        _this.state.forEach((item)=>{
            if(item.columnIndexs.toString().indexOf(column)!=-1&&item.rowIndexs.toString().indexOf(row)!=-1){_this.color =item.state}
        })
    }
    // 重置加粗
    if(_this.blodstate){
        _this.blodstate.forEach((item)=>{
           
            if(item.columnIndexs.toString().indexOf(column)!=-1&&item.rowIndexs.toString().indexOf(row)!=-1){
                if(item.columnIndexs==column&item.rowIndexs[0]==row){
                    _this.value2 =item.state
                }
                
            }
        })
    }
    // 重置字体大小
    if(_this.sizestate){
        _this.sizestate.forEach((item)=>{
            if(item.columnIndexs.toString().indexOf(column)!=-1&&item.rowIndexs.toString().indexOf(row)!=-1){_this.value =item.state}
        })
    }
}
//数据发送改变后=================
//ps:changes=改变的数据源
//ps:that=插件实例
//ps:_this=vue实例
function afterChange(changes,that,_this) {
    // that==this
    // _this==vue this
    _this.a = that
    var reg = new RegExp("^\\d+(\\.\\d+)?$");//正则判断是不是数字 reg.test(newValue) == true
    var reDateTime = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;//时间正则
    let time = getData.dateUtils.today({ymrSign:true})
    if(changes){
        
        _this.hotSettings.columns.forEach((item,index)=>{
          if(item.data=='shuliang'){
            //   console.log(item)
              _this.errColumn = index
          }         
        })
        changes.forEach(([row,prop,oldValue,newValue]) => {
            that.getSourceData()[row].caozuoshijian = time
            if(prop=='gongdan'){
                let a = /^[a-zA-Z\u4e00-\u9fa5]{1}/
                function containsNumber(str) {
                    return !!str.match(/\d/g);
                }
                console.log(newValue)
                console.log(containsNumber(newValue))
                console.log(a.test(newValue))
                if(a.test(newValue)){
                    that.getSourceData()[row].diandu = '电镀'  
                    console.log(newValue) 
                    if(newValue.indexOf('样品')!=-1){
                        _this.maxyps+=1
                        // _this.maxyp = undefined
                        let max = _this.maxyp*1 + _this.maxyps*1
                        that.getSourceData()[row].caozuoshijian = time
                        console.log(max)
                        console.log(!isNaN(max))
                        if(!isNaN(max)){
                            if(_this.erpId=='样品'){
                           
                                function PrefixZero(num, n) { return (Array(n).join(0) + num).slice(-n);}
                                that.getSourceData()[row].gongdan = 'Y'+PrefixZero(max, 6)
                                
                            }else{
                                that.getSourceData()[row].gongdan = '样品'+max
                            }
                        }else{
                            that.getSourceData()[row].gongdan = ''
                            _this.$dialog({ message: '编号出错,请尝试刷新或者联系管理员'});
                        }
                        
                    }else if(newValue.indexOf('外单')!=-1){
                        _this.maxyds+=1
                        let max = _this.maxyd*1 + _this.maxyds*1
                        if(!isNaN(max)){
                            if(_this.erpId=='WC11'){
                                that.getSourceData()[row].gongdan = 'DY'+max
                            }else{
                                that.getSourceData()[row].gongdan = '外单'+max
                            }
                        }else{
                            that.getSourceData()[row].gongdan = ''
                            _this.$dialog({ message: '编号出错,请尝试刷新或者联系管理员'});
                        }
                        
                        
                        that.getSourceData()[row].caozuoshijian = time
                    }else{
                        that.getSourceData()[row].gongdan = ''
                        _this.$dialog({ message: '请输入正确的工单号'});
                    }
                    
                }
                if(that.getSourceData()[row].riqi==undefined){
                    if(row==0){
                        _this.$dialog({ message: '请先输入日期' });
                        that.getSourceData()[row].gongdan =''
                        that.render();
                        return
                    }else{
                        if(that.getSourceData()[row-1].riqi<time){
                            _this.$dialog({ message: '日期不能小于当天日期'+time });
                            that.getSourceData()[row].gongdan =''
                            that.render();
                            return
                        }
                    }
                }
                let list
                _this.Tablelist.forEach((item)=>{
                    if(newValue.split('%')[0].replace(/\s+/g, "") == item.工单号.replace(/\s+/g, "")){
                        list = item
                    }
                })
                console.log(list)
                if(list){
                    if(list.生产部门!=_this.erpId&&_this.erpId!='WC11'){
                        console.log(_this.erpId)
                        console.log(list.生产部门)
                        if(_this.util.bumen(list.生产部门)!=undefined){
                            _this.$dialog.confirm({ message: '该工单号是'+_this.util.bumen(list.生产部门).name+'车间的，是否在本车间做单' }).then(() => {
                                that.getSourceData()[row].gongdan = list.工单号
                                that.getSourceData()[row].pihao = list.生产批号
                                that.getSourceData()[row].xinghao = list.零件说明
                                that.getSourceData()[row].daima = list.零件代码
                                that.getSourceData()[row].id = list.记录号
                                that.getSourceData()[row].maxnums = list.计划数量*1-list.取消数量*1-list.已排产*1+list.已取消*1
                                that.getSourceData()[row].shuliang = list.计划数量*1-list.取消数量*1-list.已排产*1+list.已取消*1
                                if(_this.erpId!='WC11'&_this.erpId!='WC01'&_this.erpId!='WC04'&_this.erpId!='WC05'){
                                    that.getSourceData()[row].diandu = '电镀'
                                }
                                
                                that.render();
                            })
                            .catch(() => {
                                that.getSourceData()[row].gongdan = ''
                                that.render();
                            });
                        }else{
                            that.getSourceData()[row].gongdan = ''
                            _this.$dialog({ message: '该工单不符合要求'});
                        }
                        
                    }else{
                        console.log('aaa')
                        that.getSourceData()[row].gongdan = list.工单号
                        that.getSourceData()[row].pihao = list.生产批号
                        that.getSourceData()[row].xinghao = list.零件说明
                        that.getSourceData()[row].daima = list.零件代码
                        that.getSourceData()[row].maxnums = list.计划数量*1-list.取消数量*1-list.已排产*1+list.已取消*1
                        that.getSourceData()[row].shuliang = list.计划数量*1-list.取消数量*1-list.已排产*1+list.已取消*1
                        that.getSourceData()[row].id = list.记录号
                        if(_this.erpId!='WC11'&_this.erpId!='WC01'&_this.erpId!='WC04'&_this.erpId!='WC05'){
                            that.getSourceData()[row].diandu = '电镀'
                        }
                        console.log(that.getSourceData()[row])
                    }
                    
                }
            }
            if(prop=='shuliang'){
                if(reg.test(newValue)== true){
                    _this.errRow = row
                    let maxnums = that.getSourceData()[row].maxnums
                    console.log(maxnums)
                    if(newValue>maxnums*1){
                        _this.headleChangeBGColor('#ff1e02',2)
                    }else{
                        _this.headleChangeBGColor('#ffffff',2)
                        
                    }
                }else{
                    that.getSourceData()[row].shuliang = ''
                    _this.$dialog({ message: '必须是纯数字或者大于0' });
                }
                
                // that.getSourceData()[row].maxnums=maxnums*1-newValue*1
                
            }
            if(prop=='quxiao'){
                if(reg.test(newValue) == true){
                    let a = that.getSourceData()[row].shuliang-that.getSourceData()[row].wancheng
                    if(newValue>a){
                        that.getSourceData()[row].quxiao = ''
                        _this.$dialog({ message: '最大取消值为'+a});
                    }
                }else{
                    that.getSourceData()[row].quxiao = ''
                    _this.$dialog({ message: '必须是纯数字或者大于0' });
                }
                
            }
            // 生产日期逻辑判断
            if(prop == 'riqi'){
                that.getSourceData()[row].caozuoshijian = time
                var isDateTime = reDateTime.test(newValue);
                if(isDateTime){
                    if(newValue<time){
                        that.getSourceData()[row].riqi = ''
                        _this.$dialog({ message: '日期不能小于当天日期'+time });
                    }
                    if(that.getSourceData()[row].jiaoqi!=''){
                        
                        if(newValue>that.getSourceData()[row].jiaoqi){
                            _this.$dialog({ message: '交期不能大于日期' });
                            that.getSourceData()[row].jiaoqi = ''
                        }
                    }
                }else{
                    that.getSourceData()[row].riqi = ''
                    _this.$dialog({ message: '日期格式不对：'+time });
                }
            }
            // 交期逻辑判断
            if(prop == 'jiaoqi'){
                let minValue = []
                that.getSourceData().forEach((item,index)=>{
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
                            _this.$dialog({ message: '交期不能小于生产日期' });
                            that.getSourceData()[row].jiaoqi = ''
                        }
                    
                    }else{
                        if(minValue ==''){
                            _this.$dialog({ message: '生产日期不能为空'});
                            that.getSourceData()[row].jiaoqi = ''
                        }
                    }
                    var isDateTime = reDateTime.test(newValue);
                    if(!isDateTime){
                        that.getSourceData()[row].jiaoqi = ''
                        _this.$dialog({ message: '交期格式不对'+time });
                    }
                
            }
        })
        that.render();
    }
}

//删除数据===================
//ps:_this=vue实例
//ps:index=元数据下标
function afterRemoveRow(_this,index){
        let datas = []
        _this.row.forEach((item)=>{
            if(_this.dateList[item]!=undefined){
                let list = _this.dateList[item]
                datas.push({
                    A00:list.记录号*1,
                    A01:_this.erpId,//车间 WC12 WC12 WC12 WC04 WC12 WC11 WC12
                    A02:list.生产日期||' ',//日期 _this.data
                    A03:list.工单号||' ',//工单 item.gongdan
                    A04:list.生产批号||' ',//批号 item.pihao
                    A05:' ',//电镀种类
                    A06:list.物料编码||' ',//物料编码
                    A07:list.产品型号||' ',//产品型号 item.xinghao
                    A08:list.数量||' ',//数量 item.number
                    A09:list.状态||' ',//状态 list.state
                    A10:list.交期||' ',//交期, list.jiaoqi
                    A11:'del',//增删改
                    A12:list.备注||' ',//备注 list.beizhu
                    A13:list.物料配套明细||' ',//物料配配明细 list.mingxi
                    A14:list.物料配套明细1||' ',//物料配配明细 list.mingxi
                    A15:list.物料配套明细2||' ',//物料配配明细 list.mingxi
                    A16:list.物料配套明细3||' ',//物料配配明细 list.mingxi
                    A17:' ',//单位
                    A18:item.diandu||' ',
                    A19:list.字体颜色||' ',
                    A20:list.取消数量||' ',
                    A21:list.创建人||' ',
                })
              
                
            }
            
        })
        datas.forEach((item)=>{
            _this.dateList.splice(index, 1)
            _this.$api.post('api/Plansave1',item,res=>{})
        })
}
// 页面样式操作================================================================================
//是否加粗
function style(a,b,e,_this){

    let style = []
    _this.column.forEach((item)=>{
        style.push(item+'-'+e)
    })
    _this.row.forEach((item)=>{
        
        if(_this.a.getSourceData()[item][a]==undefined||_this.a.getSourceData()[item][a]==''){
            _this.a.getSourceData()[item][a] = b+style
        }else{
            let p = _this.a.getSourceData()[item][a].split(',')
            style.forEach((items)=>{
                if(_this.a.getSourceData()[item][a].indexOf(items.split('-')[0])!=-1){//修改
                    p.forEach((itemss,indexss)=>{
                        if(items.split('-')[0]==itemss.split('-')[0]){
                            p[indexss]=items
                        }
                    })
                }else{//新增
                    p.push(items)
                }

            })
            let id = 0
            p.forEach((items,index)=>{
                
                if(p[0]=='blod'){
                    // if(index!=0){
                        if(items.indexOf('false')!=-1){
                            id+=1
                        }
                    // }
                }
                if(p[0]=='BG'){
                    // if(index!=0){
                        if(items.indexOf('#ffffff')!=-1){
                            id+=1
                        }
                    // }
                }
                if(p[0]=='color'){
                    // if(index!=0){
                        if(items.indexOf('#000000')!=-1){
                            id+=1
                        }
                    // }
                }
               
                
            })
            if(id==p.length-1){
                p=''
            }
            
            _this.a.getSourceData()[item][a] = p.toString()
        }
    })
}
function blod(_this,e,clas,god){
  let today = getData.dateUtils.today({ymrSign:true})
  let hot3 = _this.$refs.testHot.hotInstance
  let styleSheets = document.styleSheets[0];
  let indexs = styleSheets.length;
  // 加粗切换
  let font
  if(e ==true){
      font = 'bold'
  }else{
      font = 'normal'
  }
  
  // 获取选中的每个单元格，赋值class
  let blod = []
  if(_this.row.length ==1||_this.column.length == 1){
      if(_this.row.length ==1){
          _this.column.forEach((item)=>{
              blod.push({
                  blod:'blod'+_this.row+item+clas,
                  rowIndexs:_this.row,
                  columnIndexs:item
              })
              
          })
      }else{
          _this.row.forEach((item)=>{
              blod.push({
                  blod:'blod'+item+_this.column+clas,
                  rowIndexs:item,
                  columnIndexs:_this.column
              })
          })
      }
      
  }else{
      _this.row.forEach((item)=>{
          _this.column.forEach((items)=>{
              blod.push({
                  blod:'blod'+item+items+clas,
                  rowIndexs:item,
                  columnIndexs:items
              })
          })
      })
  }
  _this.index+=1//切换的index递增
  //添加class,设置加粗样式
  blod.forEach((item)=>{
      const rule = item.blod + '-' + _this.index
      _this.blodstate.push({
          state:e,
          rowIndexs:item.rowIndexs,
          columnIndexs:item.columnIndexs
      })
      let BGcolor = '.BG'+item.rowIndexs+item.columnIndexs+clas//颜色class
      let color = '.color'+item.rowIndexs+item.columnIndexs+clas//字体class
      let size = '.size'+item.rowIndexs+item.columnIndexs+clas//字体classcos
     
      let BGclass
      for(var i =0;i<styleSheets.cssRules.length;i++){
          if(styleSheets.cssRules[i].selectorText!=undefined){
              
              if(styleSheets.cssRules[i].selectorText.indexOf(BGcolor)!= -1){
                  
                  BGclass = styleSheets.cssRules[i].selectorText
                  break
              }
          }
      }
      if(BGclass!=undefined){
          BGclass = BGclass.split('.')[1]
      }
      let colorclass
      for(var i =0;i<styleSheets.cssRules.length;i++){
          if(styleSheets.cssRules[i].selectorText!=undefined){
              
              if(styleSheets.cssRules[i].selectorText.indexOf(color)!= -1){
                  
                  colorclass = styleSheets.cssRules[i].selectorText
                  break
              }
          }
      }
    
      if(colorclass!=undefined){
          colorclass = colorclass.split('.')[1]
      }
      
      let sizeclass
      for(var i =0;i<styleSheets.cssRules.length;i++){
          if(styleSheets.cssRules[i].selectorText!=undefined){
              
              if(styleSheets.cssRules[i].selectorText.indexOf(size)!= -1){
                  
                  sizeclass = styleSheets.cssRules[i].selectorText
                  break
              }
          }
      }
      if(sizeclass!=undefined){
          sizeclass = sizeclass.split('.')[1]
      }
     
      if(god==1){
        hot3.getSourceData()[item.rowIndexs].caozuoshijian = today
      }
      
      hot3.setCellMeta(item.rowIndexs,item.columnIndexs,'className',rule+' '+BGclass+' '+colorclass+' '+sizeclass)
      if(styleSheets.insertRule){
          styleSheets.insertRule("."+rule+`{font-weight:${font}`, indexs);
      }else{  
          styleSheets.addRule("."+rule, `font-weight:${font}`, indexs);
      }
      
  })
//   hot3.render();
}
// 改变字体大小
function size(_this,e,clas,god){
    let today = getData.dateUtils.today({ymrSign:true})
  let hot3 = _this.$refs.testHot.hotInstance
                let styleSheets = document.styleSheets[0];
                let indexs = styleSheets.length;
                let blod = []
                if(_this.row.length ==1||_this.column.length == 1){
                    if(_this.row.length ==1){
                        _this.column.forEach((item)=>{
                            blod.push({
                                blod:'size'+_this.row+item+clas,
                                rowIndexs:_this.row,
                                columnIndexs:item
                            })
                            
                        })
                    }else{
                        _this.row.forEach((item)=>{
                            blod.push({
                                blod:'size'+item+_this.column+clas,
                                rowIndexs:item,
                                columnIndexs:_this.column
                            })
                        })
                    }
                    
                }else{
                    _this.row.forEach((item)=>{
                        _this.column.forEach((items)=>{
                            blod.push({
                                blod:'size'+item+items+clas,
                                rowIndexs:item,
                                columnIndexs:items
                            })
                        })
                    })
                }
                _this.index+=1//切换的index递增
                //添加class,设置加粗样式
                blod.forEach((item)=>{
                    const rule = item.blod + '-' + _this.index
                    _this.sizestate.push({
                        state:e,
                        rowIndexs:item.rowIndexs,
                        columnIndexs:item.columnIndexs
                    })
                    let BGcolor = '.BG'+item.rowIndexs+item.columnIndexs+clas//颜色class
                    let color = '.color'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let blod = '.blod'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let BGclass//背景颜色
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(BGcolor)!= -1){
                                
                                BGclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(BGclass!=undefined){
                        BGclass = BGclass.split('.')[1]
                    }
                    let colorclass//颜色
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(color)!= -1){
                                
                                colorclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(colorclass!=undefined){
                        colorclass = colorclass.split('.')[1]
                    }
                    let blodclass//加粗
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(blod)!= -1){
                                
                                blodclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(blodclass!=undefined){
                        blodclass = blodclass.split('.')[1]
                    }
                    if(god==1){
                        hot3.getSourceData()[item.rowIndexs].caozuoshijian = today
                      }
                    hot3.setCellMeta(item.rowIndexs,item.columnIndexs,'className',rule+' '+BGclass+' '+colorclass+' '+blodclass)
                    if(styleSheets.insertRule){
                        styleSheets.insertRule("."+rule+`{font-size:${e}`, indexs);
                    }else{  
                        styleSheets.addRule("."+rule, `font-size:${e}`, indexs);
                    }
                    
                })
                // hot3.render();
}
// 改变字体颜色
function headleChangeColor(_this,e,clas,god){
    let today = getData.dateUtils.today({ymrSign:true})
  let hot3 = _this.$refs.testHot.hotInstance
                let styleSheets = document.styleSheets[0];
                let indexs = styleSheets.length;
                // 获取选中的每个单元格，赋值class
                let blod = []
                
                if(_this.row.length ==1||_this.column.length == 1){
                    if(_this.row.length ==1){
                        _this.column.forEach((item)=>{
                            blod.push({
                                blod:'color'+_this.row+item+clas,
                                rowIndexs:_this.row,
                                columnIndexs:item
                            })
                            
                        })
                    }else{
                        _this.row.forEach((item)=>{
                            blod.push({
                                blod:'color'+item+_this.column+clas,
                                rowIndexs:item,
                                columnIndexs:_this.column
                            })
                        })
                    }
                    
                }else{
                    _this.row.forEach((item)=>{
                        _this.column.forEach((items)=>{
                            blod.push({
                                blod:'color'+item+items+clas,
                                rowIndexs:item,
                                columnIndexs:items
                            })
                        })
                    })
                }
                _this.index+=1//切换的index递增
                //添加class,设置加粗样式
                blod.forEach((item)=>{
                    const rule = item.blod + '-' + _this.index
                    _this.state.push({
                        state:e,
                        rowIndexs:item.rowIndexs,
                        columnIndexs:item.columnIndexs
                    })
                    let BGcolor = '.BG'+item.rowIndexs+item.columnIndexs+clas//颜色class
                    let blod = '.blod'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let size = '.size'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let BGclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(BGcolor)!= -1){
                                
                                BGclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(BGclass!=undefined){
                        BGclass = BGclass.split('.')[1]
                    }
                    let blodclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(blod)!= -1){
                                
                                blodclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(blodclass!=undefined){
                        blodclass = blodclass.split('.')[1]
                    }
                    let sizeclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(size)!= -1){
                                
                                sizeclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(sizeclass!=undefined){
                        sizeclass = sizeclass.split('.')[1]
                    }
                    if(god==1){
                        hot3.getSourceData()[item.rowIndexs].caozuoshijian = today
                      }
                    hot3.setCellMeta(item.rowIndexs,item.columnIndexs,'className',rule+' '+BGclass+' '+blodclass+' '+sizeclass)
                    if(styleSheets.insertRule){
                        styleSheets.insertRule("."+rule+`{color:${e} !important`, indexs);
                    }else{  
                        styleSheets.addRule("."+rule, `color:${e} !important`, indexs);
                    }
                    
                })
                // hot3.render();   
}
// 改变背景颜色
function headleChangeBGColor(_this,e,clas,god,err){
    let row = _this.row,column = _this.column
    if(err==2){
        row = [_this.errRow]
        column = [_this.errColumn]
    }
    let today = getData.dateUtils.today({ymrSign:true})
    let hot3 = _this.$refs.testHot.hotInstance
    let styleSheets = document.styleSheets[0];
    let indexs = styleSheets.length;
    // 获取选中的每个单元格，赋值class
    let blod = []
               
    if(row.length ==1||column.length == 1){
        if(row.length ==1){
            column.forEach((item)=>{
                blod.push({
                    blod:'BG'+row+item+clas,
                    rowIndexs:row,
                    columnIndexs:item
                })
                
            })
        }else{
            row.forEach((item)=>{
                blod.push({
                    blod:'BG'+item+column+clas,
                    rowIndexs:item,
                    columnIndexs:column
                })
            })
        }
        
    }else{
        row.forEach((item)=>{
            column.forEach((items)=>{
                blod.push({
                    blod:'BG'+item+items+clas,
                    rowIndexs:item,
                    columnIndexs:items
                })
            })
        })
    }
                _this.index+=1//切换的index递增
                //添加class,设置样式
                blod.forEach((item)=>{
                    const rule = item.blod + '-' + _this.index
                    _this.BGstate.push({
                        state:e,
                        rowIndexs:item.rowIndexs,
                        columnIndexs:item.columnIndexs
                    })
                    let color = '.color'+item.rowIndexs+item.columnIndexs+clas//颜色class
                    let blod = '.blod'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let size = '.size'+item.rowIndexs+item.columnIndexs+clas//字体class
                    let colorclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(color)!= -1){
                                
                                colorclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(colorclass!=undefined){
                        colorclass = colorclass.split('.')[1]
                    }
                    let blodclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(blod)!= -1){
                                
                                blodclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(blodclass!=undefined){
                        blodclass = blodclass.split('.')[1]
                    }
                    let sizeclass
                    for(var i =0;i<styleSheets.cssRules.length;i++){
                        if(styleSheets.cssRules[i].selectorText!=undefined){
                            
                            if(styleSheets.cssRules[i].selectorText.indexOf(size)!= -1){
                                
                                sizeclass = styleSheets.cssRules[i].selectorText
                                break
                            }
                        }
                    }
                    if(sizeclass!=undefined){
                        sizeclass = sizeclass.split('.')[1]
                    }
                    if(god==1){
                        hot3.getSourceData()[item.rowIndexs].caozuoshijian = today
                      }
                    hot3.setCellMeta(item.rowIndexs,item.columnIndexs,'className',rule+' '+colorclass+' '+blodclass+' '+sizeclass)
                    if(styleSheets.insertRule){

                        styleSheets.insertRule("."+rule+`{background-color:${e} !important`, indexs);
                    }else{  
                        styleSheets.addRule("."+rule, `background-color:${e} !important`, indexs);
                    }
                    
                })
                // hot3.render();
}
//下载文件
function click(_this,title){
  let time = getData.dateUtils.today({ymrSign:true})
  var exportPlugin1 = _this.a.getPlugin('exportFile');
  exportPlugin1.downloadFile('csv', {
      bom: 'UTF-8',
      columnDelimiter: ',',
      columnHeaders: true,
      rowHeaders:false,
      exportHiddenColumns: false,
      exportHiddenRows: false,
      fileExtension: 'csv',
      filename: title+time,
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
  });
}
//打印
function onPrint(_this,title) {
    const printContent = _this.$refs.print;
    // 获取dom 宽度 高度
    const width = printContent.clientWidth;
    const height = printContent.clientHeight;
    // 创建一个canvas节点
    const canvas = document.createElement('canvas');

    const scale = 4; // 定义任意放大倍数，支持小数；越大，图片清晰度越高，生成图片越慢。
    canvas.width = width * scale; // 定义canvas 宽度 * 缩放
    canvas.height = height * scale; // 定义canvas高度 *缩放
    canvas.style.width = width * scale + 'px';
    canvas.style.height = height * scale + 'px';
    canvas.getContext('2d').scale(scale, scale); // 获取context,设置scale

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 获取滚动轴滚动的长度
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft; // 获取水平滚动轴的长度

    html2canvas(printContent, {
      canvas,
      backgroundColor: null,
      useCORS: true,
      windowHeight: document.body.scrollHeight,
      scrollX: -scrollLeft, // 解决水平偏移问题，防止打印的内容不全
      scrollY: -scrollTop
    }).then((canvas) => {
      const url = canvas.toDataURL('image/png')
      printJS({
        printable: url,
        type: 'image',
        header: title, // 标题
        headerStyle:'text-align: center;margin:0px',
     
        style: '@page{size:auto;margin: 0cm 1cm 0cm 1cm;}' // 去除页眉页脚
      })
    }).catch(err=>{
      console.error(err);
    })
}
//获取url地址参数
function parse_url(params){ 
    var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)", "i");//解析url地址
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
       
        return decodeURIComponent(r[2]);
    }
    return null;
}
 
// 日期处理函数
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
//部门名称筛选
function bumen (fid){
    let name = [
        {name:'注塑',id:'WC01'},
        {name:'五金',id:'WC02'},
        {name:'机加',id:'WC03'},
        {name:'电线',id:'WC04'},
        {name:'电装',id:'WC05'},
        {name:'电镀',id:'WC11'},
        {name:'宗联机',id:'WC12'},
       
    ]
    let id
    name.forEach((item)=>{
        if(fid==item.id||fid==item.name){
            id=item
        }
    })
    return id
}
//数据保存
function down(_this,link){
    if(_this.permissions.增加 ==1||_this.permissions.修改==1||_this.permissions.特权==1){
        let time = getData.dateUtils.today({ymrSign:true})
        let times = getData.dateUtils.today({allTimeSign:true})
        let reports
        if(_this.reportTo!=undefined){reports = _this.reportTo.toString().replace(/,/g,"|")}else{reports = ''}
        let maxtime =  _this.a.getSourceData().map(item=>{if(item.riqi){ return new Date(item.riqi) } })
        let maxtimes = []
        maxtime.forEach((item)=>{ if(item!=undefined){  maxtimes.push(item) } })
        let latest = new Date(Math.max.apply(null,maxtimes));
        let maxData = _this.util.dateFormat("YYYY-mm-dd", latest)
        let data = []
        let dataa = ''
        let datab = ''
        let list = []
        _this.a.getSourceData().forEach((item,index)=>{
            if(item.riqi){_this.data = item.riqi}
           
            if(item.caozuoshijian == time&item.gongdan!=''&item.gongdan!=undefined){
                list.push(index)
                if(_this.data&&_this.a.getSourceData()[0].riqi){
                    let BG='',color='',blod='',size=''
                    if(item.BG){BG = '/'+item.BG}
                    if(item.color){color = '/'+item.color}
                    if(item.blod){blod = '/'+item.blod }
                    if(item.size){size = '/'+item.size }
                    let style = `true${BG}${color}${blod}${size}`
                    if(item.gongdan){
                        if(item.shuliang){
                            if(item.jiaoqi){
                            data.push({
                                    A00:item.id*1||' ',
                                    A01:_this.erpId,//车间 WC02 WC02 WC03 WC04 WC02 WC11 WC12
                                    A02:_this.data||' ',//日期 __this.data
                                    A03:item.gongdan||' ',//工单 item.gongdan
                                    A04:item.pihao||' ',//批号 item.pihao
                                    A05:item.type||' ',//电镀种类
                                    A06:item.daima||' ',//物料编码
                                    A07:item.xinghao||' ',//产品型号 item.xinghao
                                    A08:item.shuliang||' ',//数量 item.number
                                    A09:item.zhuangtai||' ',//状态 item.state
                                    A10:item.jiaoqi||' ',//交期, item.jiaoqi
                                    A11:' ',//增删改
                                    A12:item.beizhu||' ',//备注 item.beizhu
                                    A13:item.mingxi||' ',//物料配配明细 item.mingxi
                                    A14:item.mingxi1||' ',//物料配配明细 item.mingxi
                                    A15:item.mingxi2||' ',//物料配配明细 item.mingxi
                                    A16:item.mingxi3||' ',//物料配配明细 item.mingxi
                                    A17:item.danwei||' ',//单位 item.mingxi
                                    A18:item.diandu||' ',
                                    A19:style,
                                    A20:item.quxiao||' ',
                                    A21:_this.userName
                                })
                               dataa = {
                                    date:times,
                                    puser:parse_url('userid'),
                                    mname:'生产计划',
                                    pto:reports,
                                    ptext:_this.userName+'发表了生产计划#生产计划：'+_this.title+'#截止日期：'+maxData,
                                    dress:link+time,
                                }
                                datab  = {
                                    access_token:_this.$store.state.access_token,
                                    touser:reports,
                                    page:'pages/index/index',
                                    title:'生产计划',
                                    description:times,
                                    key:_this.userName+'发表了',
                                    value:_this.title+',截止日期：'+maxData
                                }
                            }else{
                                _this.$dialog({ message: '没有交期在'+(index + 1)+'行' });
                            }
                        }else{
                            _this.$dialog({ message: '没有数量在'+(index + 1)+'行' });
                        }
                    }else{
                        _this.$dialog({ message: '没有工单号在'+(index + 1)+'行' });
                    }
                }else{
                    _this.$dialog({ message: '没有生产日期在'+(index + 1)+'行' });
                }
            }
        })
        console.log(data)
        if(list.length == data.length){
            if(data.length ==0){
                _this.$dialog({ message: '没有改动数据，不需要保存' });
            }else{
                _this.downs =true
                data.forEach((item,index)=>{
                    let trues = 0
                    if(item.A02<time){
                        trues=1
                    }
                    _this.chax.push({
                        id:null,
                        jiaoqi:item.A10,
                        xinghao:item.A07,
                        danwei:item.A17,
                        quxiao:item.A20,
                        beizhu:item.A12,
                        style:item.A19,
                        wancheng:'',
                        gongdan:item.A03,
                        shuliang:item.A08,
                        diandu:item.A18,
                        daima:item.A06,
                        mingxi:item.A13,
                        mingxi1:item.A14,
                        mingxi2:item.A15,
                        mingxi3:item.A16,
                        zhuangtai:item.A09,
                        pihao:item.A04,
                        riqi:item.A02,
                        type:item.A05,
                        bumen:_this.erpId,
                        trues:trues,
                        a:false
                    })
                    console.log(item)
                    _this.$api.post('api/Plansave1',item,res=>{
                        _this.$dialog({ message: '保存成功'});
                        let data = {  A01:item.A01,  A02:item.A02,  A03:item.A03,  }
                        _this.$api.get('api/Plansave1',data,res=>{
                            _this.a.getSourceData()[list[index]].id = JSON.parse(res.data).Table[0].记录号
                            let cax = {
                                交期:item.A10,
                                产品型号:item.A07,
                                创建人:item.A21,
                                单位:item.A17,
                                取消数量:item.A20,
                                备注:item.A12,
                                字体颜色:item.A19,
                                工单号:item.A03,
                                是否电镀:item.A18,
                                物料编码:item.A06,
                                物料配套明细:item.A13,
                                物料配套明细1:item.A14,
                                物料配套明细2:item.A15,
                                物料配套明细3:item.A16,
                                状态:item.A09,
                                生产批号:item.A04,
                                生产日期:item.A02,
                                电镀种类:item.A05,
                                记录号:JSON.parse(res.data).Table[0].记录号,
                                车间:_this.erpId,
                            }
                            _this.dateList.push(cax)
                            _this.downs =false 
                            console.log(_this.a.getSourceData()[list[index]])
                        })
                    }) 
            })
                _this.$api.post('api/PushMes',dataa,res=>{ })
                if(_this.reportTo!=undefined){
                    _this.$api.post('/api/Message',datab,res=>{})
                }
                
            }
            
            
        }else{
        }
    }else{
        _this.$toast('没有保存的权限,请联系管理员');
    }
}
//查询
function change(e,_this,clas){
    _this.a.loadData(null)
    let time = getData.dateUtils.today({ymrSign:true})
    function starts(a){
        let time = new Date(a)
        let getFullYear = time.getFullYear()
        let getMonth = time.getMonth()+1
        let getDate = time.getDate()
        if(getMonth<10){getMonth = '0'+getMonth}
        if(getDate<10){getDate = '0'+getDate }
        return getFullYear+'-'+getMonth+'-'+getDate
    }
    let data = { date1:starts(e[0]),date2:starts(e[1]),wc:_this.erpId}
            console.log(data)
            _this.$api.get('/api/planget',data,res=>{
                console.log(JSON.parse(res.data).Table)
                if(JSON.parse(res.data).Table!=''){
                    _this.biaoqian = 1
                    _this.dateList =  JSON.parse(res.data).Table
                    JSON.parse(res.data).Table.forEach((item,index)=>{
                        let 生产日期 = item.生产日期?item.生产日期.replace(/\s+/g, ""):item.生产日期
                        let 工单号 = item.工单号?item.工单号.replace(/\s+/g, ""):item.工单号
                        let 生产批号 = item.生产批号?item.生产批号.replace(/\s+/g, ""):item.生产批号
                        let 产品型号 = item.产品型号?item.产品型号.replace(/\s+/g, ""):item.产品型号
                        let 状态 = item.状态?item.状态.replace(/\s+/g, ""):item.状态
                        let 备注 = item.备注?item.备注.replace(/\s+/g, ""):item.备注
                        let 交期 = item.交期?item.交期.replace(/\s+/g, ""):item.交期
                        let 物料编码 = item.物料编码?item.物料编码.replace(/\s+/g, ""):item.物料编码
                        let 电镀 = item.是否电镀?item.是否电镀.replace(/\s+/g, ""):item.是否电镀
                        let 单位 = item.单位?item.单位.replace(/\s+/g, ""):item.单位
                        let 物料配套明细 = item.物料配套明细?item.物料配套明细.replace(/\s+/g, ""):item.物料配套明细
                        let 物料配套明细1 = item.物料配套明细1?item.物料配套明细1.replace(/\s+/g, ""):item.物料配套明细1
                        let 物料配套明细2 = item.物料配套明细2?item.物料配套明细2.replace(/\s+/g, ""):item.物料配套明细2
                        let 物料配套明细3 = item.物料配套明细3?item.物料配套明细3.replace(/\s+/g, ""):item.物料配套明细3
                        let 电镀种类 = item.电镀种类?item.电镀种类.replace(/\s+/g, ""):item.电镀种类
                        let 记录号 = item.记录号
                        let style
                        if(item.字体颜色==null){style = 'false'
                        }else{style = item.字体颜色.split('/')
                        }
                        if(style[0]=='true'){
                            if(style.length>1){
                                
                                style.forEach((items,indexs)=>{
                                    if(indexs!=0){
                                        let list = items.split(',')
                                        list.forEach((itemss,indexss)=>{
                                            if(indexss!=0){
                                                _this.row = [index]
                                                _this.column = [itemss.split('-')[0]*1]
                                                if(list[0]=='BG'){
                                                    _this.a.getSourceData()[index].BG =  items.replace(/\s+/g, "")
                                                    _this.util.headleChangeBGColor(_this,itemss.split('-')[1],clas,2) 
                                                }
                                                if(list[0]=='color'){
                                                    _this.a.getSourceData()[index].color =  items.replace(/\s+/g, "")
                                                    _this.util.headleChangeColor(_this,itemss.split('-')[1],clas,2) 
                                                }
                                                if(list[0]=='blod'){
                                                    
                                                    _this.a.getSourceData()[index].blod =  items.replace(/\s+/g, "")
                                                    _this.util.blod(_this,JSON.parse(itemss.split('-')[1]),clas,2) 
                                                }
                                                if(list[0]=='size'){
                                                    _this.a.getSourceData()[index].size =  items.replace(/\s+/g, "")
                                                    _this.util.size(_this,itemss.split('-')[1],clas,2) 
                                                }
                                            }
                                        })
                                        
                                    }
                                })
                            }
                        }
                        if(_this.erpId!='样品'&_this.erpId!='治具'&_this.erpId!='仓库'){
                                _this.Tablelist.forEach((items)=>{
                                    if(items.工单号==item.工单号.replace(/\s+/g, "")){
                                        let maxnums = items.计划数量*1-item.已排产*1+item.已取消*1
                                        // console.log(maxnums)
                                        if(maxnums>=0&item.字体颜色.indexOf('ff1e02')!=-1){
                                            // console.log(maxnums)
                                            _this.row = [index]
                                            _this.column = [4]
                                            _this.a.getSourceData()[index].BG =  'BG,4-#ffffff'
                                            console.log('aaa')
                                            _this.util.headleChangeBGColor(_this,'#ffffff',clas,2) 
                                            _this.a.render()
                                        }
                                        _this.a.getSourceData()[index].maxnums = maxnums
                                    }
                                })
                        }
                        
                        
                       
                        if(index == 0){
                            _this.a.getSourceData()[index].riqi = 生产日期
                            _this.daytimes = 生产日期
                        }else{
                            if( _this.daytimes != 生产日期){
                                _this.a.getSourceData()[index].riqi = 生产日期
                                _this.daytimes = 生产日期
                            }
                        }
                        let wancheng = item.完成数量==null?'':item.完成数量*1
                        let quxiao = item.取消数量==null?'':item.取消数量*1
                        // if(item.完成数量==null){wancheng=''}
                        if(item.取消数量==null){quxiao=''}
                       
                        _this.contentData.push({
                            riqi:生产日期,
                            gongdan:工单号,
                            pihao:生产批号,
                            xinghao:产品型号,
                            zhuangtai:状态,
                            bezhu:备注,
                            jiaoqi:交期,
                            diandu:电镀,
                            danwei:单位,
                            daima:物料编码,
                            mingxi:物料配套明细,
                            mingxi1:物料配套明细1,
                            mingxi2:物料配套明细2,
                            mingxi3:物料配套明细3,
                            shuliang:item.数量*1,
                            wancheng:wancheng,
                            quxiao:quxiao,
                            type:电镀种类,
                            row:index.toString()
                        })
                        _this.a.getSourceData()[index].times = 生产日期
                        _this.a.getSourceData()[index].gongdan = 工单号
                        _this.a.getSourceData()[index].pihao = 生产批号
                        _this.a.getSourceData()[index].xinghao = 产品型号
                        _this.a.getSourceData()[index].shuliang = item.数量*1
                        _this.a.getSourceData()[index].olds = item.数量*1
                        _this.a.getSourceData()[index].wancheng = wancheng
                        _this.a.getSourceData()[index].quxiao = quxiao
                        _this.a.getSourceData()[index].zhuangtai = 状态
                        _this.a.getSourceData()[index].beizhu = 备注
                        _this.a.getSourceData()[index].jiaoqi = 交期
                        _this.a.getSourceData()[index].daima = 物料编码
                        _this.a.getSourceData()[index].id =  记录号
                        _this.a.getSourceData()[index].diandu =  电镀
                        _this.a.getSourceData()[index].danwei =  单位
                        _this.a.getSourceData()[index].type =  电镀种类
                        _this.a.getSourceData()[index].mingxi =  物料配套明细
                        _this.a.getSourceData()[index].mingxi1 =  物料配套明细1
                        _this.a.getSourceData()[index].mingxi2 =  物料配套明细2
                        _this.a.getSourceData()[index].mingxi3 =  物料配套明细3
                        

                    })
                     _this.a.render()
                }else{
                    _this.a.loadData(null)
                    _this.biaoqian = 2
                }
            })
           
}
//取消数量计算保存
function contentOne(_this,clas){
    _this.cxDowns =true
  
    let nills = false

    _this.contentDatas.forEach((item)=>{
        if(item.id==null){
            nills=true
        }
    })
    _this.contentDatas.forEach((item)=>{
      
        
        
        if(item.quxiao){
            if(item.a){
                console.log(item)
                let data = {
                    A00:item.id*1||' ',
                    A01:item.bumen||' ',//车间 WC02 WC02 WC03 WC04 WC02 WC11 WC12
                    A02:item.riqi||' ',//日期 __this.data
                    A03:item.gongdan||' ',//工单 item.gongdan
                    A04:item.pihao||' ',//批号 item.pihao
                    A05:item.type||' ',//电镀种类
                    A06:item.daima||' ',//物料编码
                    A07:item.xinghao||' ',//产品型号 item.xinghao
                    A08:item.shuliang||' ',//数量 item.number
                    A09:item.zhuangtai||' ',//状态 item.state
                    A10:item.jiaoqi||' ',//交期, item.jiaoqi
                    A11:' ',//增删改
                    A12:item.beizhu||' ',//备注 item.beizhu
                    A13:item.mingxi||' ',//物料配配明细 item.mingxi
                    A14:item.mingxi1||' ',//物料配配明细 item.mingxi
                    A15:item.mingxi2||' ',//物料配配明细 item.mingxi
                    A16:item.mingxi3||' ',//物料配配明细 item.mingxi
                    A17:item.danwei||' ',//单位 item.mingxi
                    A18:item.diandu||' ',
                    A19:item.style||' ',
                    A20:item.quxiao||' '
                }
                _this.$api.post('api/Plansave1',data,res=>{
                    _this.$dialog({ message: '保存成功'}) 
                    _this.cxDowns =false
                    _this.dialogFormVisible=false
                    _this.content = ''
                    let maxnums
                    if(nills==true){
                        maxnums = _this.aids.maxnums*1+item.quxiao*1
                    }else{
                        maxnums = _this.aids.maxnums*1+_this.aids.shuliang*1+item.quxiao*1
                    }
                    if(maxnums>=0&_this.aids.BG.indexOf('ff1e02')!=-1){
                        _this.row = [_this.wailian]
                        _this.column = [4]
                        _this.a.getSourceData()[_this.wailian].BG =  'BG,4-#ffffff'
                        _this.util.headleChangeBGColor(_this,'#ffffff',clas,2) 
                        _this.a.render()
                    }
                    _this.a.getSourceData()[_this.wailian].maxnums = maxnums
                    _this.a.getSourceData().forEach((itemss,index)=>{
                        if(item.id==itemss.id){
                            console.log(index)
                            console.log(itemss)
                            itemss.quxiao = item.quxiao*1
                            _this.a.render()
                        }
                    })
                })
               
            }
            
            // console.group(_this.Tablelist)
            
        }
    })
}
async function GetData(_this){
    console.log(_this)
    // 获取用户信息
    let access_token_data = { corpid : 'ww4b634cb35b1893b8',  corpsecret:'bFQsey2uIhGOvfCb_4o9VA7RW1Nlxe5n9CFanLBxt2U' }
    let access_token = JSON.parse(await _this.$api.api.get('/api/weixin',access_token_data)).access_token
    let userlist_data={access_token:access_token,department_id:1,fetch_child:1,}
    let userlist = JSON.parse(await _this.$api.api.get('/api/userlist',userlist_data)).userlist
    _this.$store.state.userList = userlist
    _this.$store.state.access_token = access_token

    let afterMonthLasts = getData.dateUtils.afterMonthLasts({ymrSign:true})//两个月后最后一天
    let yesterday = getData.dateUtils.beforeFiveday({ymrSign:true})
    console.log(yesterday)
    let listtimes = [yesterday,afterMonthLasts.split('-')[0]+'-'+(afterMonthLasts.split('-')[1])+'-'+yesterday.split('-')[2]]
    let today = getData.dateUtils.today({ymrSign:true})
    //获取用户名汇报权限
    let reportto_data={ userid:parse_url('userid'), modu:'消息推送授权-前台-生产计划-'+_this.erpName }
    let reportto = JSON.parse(await _this.$api.api.get('/api/reportto',reportto_data)).Table[0]
    let reportTo = []
    let userName
    console.log(reportto)
    userlist.forEach((item)=>{
        if(item.userid == parse_url('userid')){userName = item.name}
        if(reportto!=undefined){
            if(reportto.汇报给ID=='all'){
                reportTo.push(item.userid)
           }else{
                reportTo = reportto.汇报给ID 
           }
        }
    })
    _this.reportTo = reportTo
    _this.userName = userName
    
    
    //获取工单筛选数据
    let Twos = JSON.parse(await _this.$api.api.get('/api/Twos','')).Table
    console.log(Twos)
    let lists
    if(_this.erpId!='WC11'){
        if(_this.erpId=='仓库'||_this.erpId=='治具'){
            lists = ['样品']
            if(_this.erpId=='治具'){
                lists = ['治具']
            }
        }else{
            if(_this.erpId=='采购'){
                let caigou = JSON.parse(await _this.$api.api.get('/api/PO','')).Table
                console.log(caigou)
                _this.Tablelist = caigou
                lists =caigou.map((item)=>{ return item.订单号+'%'+item.物料说明 })
            }else{
                _this.Tablelist = Twos
                lists =Twos.map((item)=>{ return item.工单号+'%'+item.零件说明 })
                let yangp = ['样品','外单']
                lists = yangp.concat(lists)
            }
            
        }
        
    }else{
        let job = JSON.parse(await _this.$api.api.get('/api/job','')).Table
        job.forEach((item)=>{
            item.取消数量 = ''
            item.已排产 = ''
            item.已取消 = ''
        })
        _this.Tablelist = job.concat(Twos)
        lists =job.concat(Twos).map((item)=>{ return item.工单号+'%'+item.零件说明 })
        let yangp = ['外单']
        lists = yangp.concat(lists)
    }
    
    
    
    
    
    _this.hotSettings.columns[1].source = lists
    _this.change(listtimes)
    _this.value1 = listtimes
    
    //查询工单，取消数量
    let Plangetp_data = { date1:'', wc:_this.erpId, job:'', date2:'',  }
    let Plangetp = JSON.parse(await _this.$api.api.get('/api/Plangetp',Plangetp_data)).Table
    let chax=[]
    Plangetp.forEach((item)=>{
        
        let list = item.工单号.replace(/\s+/g, "")
        if(list=='57995'){
            console.log(item)
        }
        let trues = 0
        if(item.生产日期.replace(/\s+/g, "")<today){
            trues=1
        }
        let quxiao = item.取消数量==null?'':item.取消数量.replace(/\s+/g, "")
        chax.push({
            id:item.记录号, jiaoqi:item.交期, xinghao:item.产品型号, danwei:item.单位, quxiao:quxiao, beizhu:item.备注, style:item.字体颜色,
            wancheng:item.完成数量*1, gongdan:list, shuliang:item.数量, diandu:item.是否电镀, daima:item.物料编码, mingxi:item.物料配套明细,
            mingxi1:item.物料配套明细1, mingxi2:item.物料配套明细2, mingxi3:item.物料配套明细3, zhuangtai:item.状态, pihao:item.生产批号,
            riqi:item.生产日期, type:item.电镀种类, bumen:_this.erpId, trues:trues, a:false
        })
    })
    _this.chax = chax
    
}


  
  // 将全局公共方法，组合成一个对象，并暴露出去
  export default {
    blod,
    size,
    headleChangeBGColor,
    headleChangeColor,
    click,
    parse_url,
    dateFormat,
    style,
    getDate,
    contextMenu,
    afterSelectionEnd,
    bumen,
    onPrint,
    afterChange,
    afterRemoveRow,
    down,
    change,
    contentOne,
    GetData
  }