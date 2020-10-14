// pages/confirm_order/confirm_order.js
let { request } = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    conData: {},
    name: "",
    txt: "",
    tel: "",
    discountId: "",
    orderprice: '',
    youf: 0,
    couponId: '',
    order_create: [],//确认订单接口返回值
    backurl: '',//返回地址
    memo:'',//买家留言
    check:1,//1配送 2自提
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();
    var that = this;
    that.setData({
      options: options,
      imgHeader: app.imgHeader
    })
  },
  onShow:function(){
    var app = getApp();
    var that = this;
    confirm(that, that.data.check)
  },
  onShareAppMessage: function () {
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  },
  //买家留言
  setFont:function(e){
    var memo = e.detail.value
    this.setData({ memo: memo})
  },
  //切换地址
  junpReceivingAddress: function () {
    var data = this.data
    var couponId = data.conData.couponCode;
    if (couponId){
      couponId = data.conData.couponCode.id
    }else{
      couponId=''
    }
    wx.navigateTo({
      url: '../address/address?orderId=' + data.options.orderId + "&flag=1&a=1&couponId=" + couponId,
    })
  },
  //支付
  zhezshow1: function () {
    var that = this;
    var app = getApp()
    var txt = that.data.txt;
    if (txt == '') {
      wx.showToast({
        title: '请选择地址',
        icon: "none"
      })
    } else {
      var couponId = '';
      if (that.data.options.couponId == undefined) {
        couponId = ''
      } else {
        couponId = that.data.options.couponId
      }
      if (that.data.conData.couponCode != null && that.data.conData.couponCode != undefined) {
        couponId = that.data.conData.couponCode.id;
      }
      var receiverId = '';
      if (that.data.options.receiverId == undefined) {
        receiverId = ''
      } else {
        receiverId = that.data.options.receiverId
      }
      if (that.data.conData.receiver != null && that.data.conData.receiver != undefined) {
        receiverId = that.data.conData.receiver.id;
      }
      var memo, shippingMethodName;
      if(that.data.check=='2'){
        memo = '果铺自提'
        shippingMethodName =2
      }else{
        memo = '果铺配送'
        shippingMethodName = 1
      }
      var param = {
        receiverId: receiverId,
        orderId: that.data.options.orderId,
        couponId: couponId,
        clientName:'GPLC',
        memo: memo,
        shippingMethodName: shippingMethodName
      }
      app.showLoading()
      request.apiPost2('/order/create',param).then(res=>{
        //修改tabBar
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum - that.data.conData.order.quantity;
        wx.setStorageSync('cartNum', carNum1)
        if (res.type == "success") {
          //可能存在Content-Type请求头方式报错
          var param1 = { url: String(that.route).replace(/pages/, '..')}
          app.showLoading()
          request.apiPost('weixin/getConfig', param1).then(res1=>{
            var data1 = res1.data;
            //这里可以修改成res.
            var param2 = {
              prepay_id: res.prepay_id,
              nonceStr: res.nonceStr,
              clientName: 'GPLC'
            }
            app.showLoading()
            request.apiGet2('/order/pay', param2).then(res2=>{
              console.log(res)
              var data2 = res2.data
              console.log(data2.timeStamp + '...' + data2.nonceStr + '...' + data2.package + '...' + data2.signType + '...' + data2.paySign)
              wx.requestPayment({
                timeStamp: data2.timeStamp,
                nonceStr: data2.nonceStr,
                package: data2.package,
                signType: data2.signType,
                paySign: data2.paySign,
                success: function (res) {
                  wx.navigateTo({
                    url: '../order_list/order_list?type=unshipped&index=2',
                  })
                }, fail: function () {
                  wx.showToast({
                    title: '支付失败',
                    icon: "none"
                  })
                  wx.navigateTo({
                    url: '../order_list/order_list?type=unpaid&index=1',
                  })
                }
              })
            })
          })
        }
        else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      })
    }
  },
  junpShopList: function () {
    wx.navigateTo({
      url: '../shopping_list/shopping_list?orderId=' + this.data.options.orderId + '&receiverId=' + this.data.options.receiverId + '&flag=1',
    })
  },
  //自提/配送
  changeType: function (e) {
    var type = parseInt(e.currentTarget.dataset.check);
    var that = this
    if (type == 1 && that.data.check != 1) {
      //配送
      confirm(that,type)
      this.setData({
        check: type,
      })
    }
    if (type == 2 && that.data.check != 2) {
      confirm(that,type)
      this.setData({
        check: type,
      })
    }
  }
})

//加载
function confirm(that, shippingMethodName) {
  var couponId = '';
  if (that.data.options.couponId == undefined) {
    couponId = ''
  }else{
    couponId = that.data.options.couponId
  }
  var receiverId = '';
  if (that.data.options.receiverId == undefined) {
    receiverId = ''
  } else {
    receiverId = that.data.options.receiverId
  }
  var param = { 
    orderId: that.data.options.orderId, 
    receiverId: receiverId, 
    couponId: couponId,
    shippingMethodName: shippingMethodName
  }
  app.showLoading()
  request.apiGet2('order/info',param).then(res=>{
    console.log(res)
    var add = 0;
    if (res.data.receiver == undefined || res.data.receiver == null) {
      add = 1;
    }
    var name, txt, tel;
    if (add == 1) {
      name = ""
      tel = ""
      txt = "请点击这里设置地址"
      youf = 0
    } else {
      name = "收货人: " + res.data.receiver.consignee;
      tel = res.data.receiver.phone
      txt = res.data.receiver.area + res.data.receiver.address
    }
    that.setData({
      conData: res.data,
      name: name,
      tel: tel,
      txt: txt,
    })
    // receiverId: res.data.receiver.id
    if (that.data.txt != null || that.data.txt != undefined || that.data.txt != "") {
      var youf;
      var address1 = String(that.data.txt);
      var address = address1.split("/")[0]
      if (address == "西藏自治区" || address == "内蒙古自治区" || address == "新疆维吾尔自治区" || address == "吉林省" || address == "黑龙江") {
        youf = res.data.order.freight
      } else {
        youf = 0
      }
      var orderprice = (parseFloat(that.data.conData.order.amountPayable) - parseFloat(that.data.conData.order.freight)).toFixed(2)
      that.setData({
        youf: youf,
        orderprice: orderprice
      })
    }
  })
}
