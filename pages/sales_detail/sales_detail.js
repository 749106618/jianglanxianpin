// pages/sales_detail/sales_detail.js
const app = getApp();
const {request} = require('../../utils/api1')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeader:app.imgHeader
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({options:options})
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    dataList(that);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  }
})

function dataList(that) {
  var param = {
    userId:that.data.options.uid
  }
  request.apiGet('sales/inviteUserInfo',param).then(res=>{
    that.setData({
      dataList:res.data
    })
  })
}