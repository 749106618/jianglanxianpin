// pages/addAddress/addAddress.js
import areaList  from '../../utils/area.js';
const app = getApp();
const {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    phone:'',
    selectArea:'',//地区字符串
    addressDetail:'',//地址详情
    show: false,//是否显示省市选择组件
    areaList:'',//全省市集合
    isDefualtAdd:0,//是否默认地址
  },
  onChange(e) {
    // event.detail 为当前输入的值
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail
    this.setData(temp)
  },
  //地址三级联动事件
  showPopup() {
    this.setData({ show: true });
  },
  onCancel(){
    this.setData({ show: false });
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm(selectData){
    console.log(selectData)
    let areaArr =  selectData.detail.values
    let areaStr = ''
    areaArr.forEach((v)=>{
      console.log(v.name)
      areaStr+=v.name
    })
    this.setData({
      selectArea:areaStr,
      show: false
    })
  },
  //提交
  subimt(){
    //北京市/北京市市辖区/西城区
    var that = this;
    var app = getApp();
    var receiver = {};
    var id = that.data.options.id;
    receiver.phone = that.data.phone;               //电话
    receiver.consignee = that.data.username;        //姓名
    receiver.address = that.data.addressDetail;     //详细地址
    receiver.area = that.data.selectArea            //省市区
    receiver.isDefault = that.data.isDefualtAdd == 0 ? false : true;//默认地址
    if (receiver.phone == '' || receiver.consignee == '' || receiver.area == '' || receiver.address == '') {
      wx.showToast({
        title: '请继续完善信息',
        icon: 'none'
      })
    } else {
      var xrtext = /^0?(13|14|15|16|18|17|19)[0-9]{9}$/;
      if (xrtext.test(receiver.phone)) {
        if (id == null || id == '' || id == undefined) {
          saveaddress(that, receiver);
        }
        else {
          receiver.id = id;
          updateaddress(that, receiver)
        }
      } else {
        wx.showToast({
          title: '手机号码格式错误',
          icon: 'none'
        })
      }
    };
  },
  //默认地址
  ischeck(){
    var isDefualtAdd = this.data.isDefualtAdd;
    if (isDefualtAdd == 0) {
      isDefualtAdd = 1
    } else {
      isDefualtAdd = 0
    }
    this.setData({
      isDefualtAdd: isDefualtAdd
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let self = this;
    this.setData({
      areaList:areaList,//省市区List
      options:options
    })
    if (that.data.options.id != null) {
      editList(that)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  }
})

//加载
function editList(that) {
  wx.setNavigationBarTitle({
    title: '修改收货地址'
  })
  var param = { id: that.options.id }
  app.showLoading()
  request.apiGet('receiver/get', param).then(res => {
    var data = res.data;
    if (data.code == "100") {
      app.tokenInvalid()
      that.onLoad()
    }
    var isDefualtAdd;
    if (data.receiver.isDefault) {
      isDefualtAdd = 1
    } else {
      isDefualtAdd = 0
    }
    that.setData({
      phone: data.receiver.phone,
      username: data.receiver.consignee,
      addressDetail: data.receiver.address,
      selectArea: data.receiver.area,
      isDefualtAdd: isDefualtAdd
    })
  })
}

//添加地址
function saveaddress(that, receiver) {
  var param = JSON.stringify(receiver)
  app.showLoading()
  request.apiPost1('receiver/save', param).then(res => {
    var data = that.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  })
}

//修改地址
function updateaddress(that, receiver) {
  var param = JSON.stringify(receiver)
  app.showLoading()
  request.apiPost1('receiver/update', param).then(res => {
    var data = that.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  })
}