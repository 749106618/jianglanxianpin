// pages/address/address.js
const {request} = require('../../utils/api1.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isAddress:true,//是否有收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options == undefined) {
      options = {}
    }
    this.setData({
      options: options
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    addList(that)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  },
  //点击地址
  junpEditAddress1: function (e) {
    var index = e.currentTarget.dataset.index;
    var data = this.data;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      if (data.options.flag == "1") {
        if (data.options.a == '1') {
          //订单详情
          var a = 'options.orderId'
          var b = 'options.couponId'
          var c = 'options.receiverId'
          var d = 'options.shopId'
          prevPage.setData({
            [a]: data.options.orderId,
            [b]: data.options.couponId,
            [c]: data.addList[index].id,
            [d]: data.options.shopId
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          //返回商品详情
          var a = 'options.orderId'
          var b = 'options.couponId'
          var c = 'options.receiverId'
          prevPage.setData({
            [a]: data.options.orderId,
            [b]: data.options.couponId,
            [c]: data.addList[index].id,
          })
          wx.navigateBack({
            delta: 1
          })
        }
      } else {
        //runfund
        var c = 'options.orderId'
        var d = 'options.receiverId'
        prevPage.setData({
          [a]: data.options.orderId,
          [b]: data.addList[index].id,
        })
        wx.navigateBack({
          delta: 1
        })
      }
    }
  },
  //修改
  editaddress: function (e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var id = this.data.addList[index].id
    var data = this.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateTo({
        url: '../addAddress/addAddress?orderId=' + data.options.orderId + "&id=" + id + "&flag=" + data.options.flag + "&a=" + data.options.a,
      })
    } else {
      wx.navigateTo({
        url: '../addAddress/addAddress?id=' + id,
      })
    }
  },
  //新增
  junpEditAddress: function () {
    var data = this.data;
    if (data.options.orderId != null && data.options.orderId != "" & data.options.orderId != undefined && data.options.flag != null && data.options.flag != "" & data.options.flag != undefined) {
      wx.navigateTo({
        url: '../addAddress/addAddress?orderId=' + data.options.orderId + "&flag=" + data.options.flag + '&shopId=' + data.options.shopId,
      })
    } else {
      wx.navigateTo({
        url: '../addAddress/addAddress',
      })
    }
  }
})

function addList(that) {
  var param = {}
  app.showLoading()
  request.apiGet('receiver/list', param).then(res => {
    var isAddress =false
    if(res.data.list[0] !=undefined){
      isAddress = true
    }
    that.setData({
      addList: res.data.list,
      isAddress: isAddress
    })
  })
}