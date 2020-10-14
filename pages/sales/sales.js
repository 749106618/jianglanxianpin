// pages/sales/sales.js
const app = getApp();
const {request} = require('../../utils/api1')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2020年06月',
    imgHeader:app.imgHeader
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y =date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    that.setData({
      ym:Y+'-'+M,
      dateTime:Y+'-'+M
    })
    dataList(that)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择日期
  bindDateChange: function(e) {
    var that = this
    var data = e.detail.value;
    var yy = data.split('-')[0] + '年'
    var mm = data.split('-')[1] + '月'
    data = yy + mm
    that.setData({
      dateTime:e.detail.value,
      date: data,
    })
    dataList(that)
  },
  //跳转商户详情
  junpDetail:function(e){
    var uid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../sales_detail/sales_detail?uid='+uid,
    })
  },
  //跳转小程序码
  junpQr:function(){
    wx.navigateTo({
      url: '../sales_qrcode/sales_qrcode?inviteCode='+this.data.dataList.inviteCode,
    })
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  }
})

function dataList (that) {
  var param = {
    dateStr:that.data.dateTime
  }
  request.apiGet1('sales/saleInfo',param).then(res=>{
    that.setData({
      dataList:res.data
    })
  })
}