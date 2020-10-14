const {request} = require('../../utils/api1.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
  data: {
    showCard: true,//空订单显隐 true隐藏
    showCard1:true,
    imgHeader: app.imgHeader,
    page:0,
    pagesize:10,
    isEnd:false,//是否到底
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options:options
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    orederList1(that)
    orederList2(that)
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
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  },
  onUnload() {
    wx.reLaunch({
      url: '../user_index/user_index'
    })
  },
  //跳转申请售后
  junpReund(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../refund/refund?orderid='+id,
    })
  },
  junpOrder(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order_details/order_details?orderId=' + id,
    })
  }
})
//售后申请列表
function orederList1(that){
  if(that.data.isEnd){
    wx.hideLoading();
    return
  }else{
    app.showLoading()
    var param = { page: that.data.page, pagesize: that.data.pagesize, type:'canrefund'}
    request.apiPost2('/order/orderlist', param).then(res => {
      var showCard = true
      if (res.page.records.length==0){
        showCard = false
      }
      that.setData({
        dataList1: res.page.records,
        showCard: showCard
      })
    })
  }
}
//售后记录
function orederList2(that) {
  if (that.data.isEnd) {
    wx.hideLoading();
    return
  } else {
    app.showLoading()
    var param1 = { page: that.data.page, pagesize: that.data.pagesize, type: 'refund' }
    request.apiPost2('/order/orderlist', param1).then(res => {
      var showCard1 = true
      if (res.page.records.length == 0) {
        showCard1 = false
      }
      that.setData({
        dataList2: res.page.records,
        showCard1: showCard1
      })
    })
  }
}