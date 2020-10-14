// pages/user_index/user_index.js
const app = getApp();
const {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,//吐槽模态框状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    var carNum1 = cartNum;
    wx.setTabBarBadge({
      index: 2,
      text: '' + carNum1 + '',
    })
    findUser(that);
    wx.getStorage({
      key: 'wxUserName',
      success: function (res) {
        that.setData({
          wxUserName: res.data
        })
      },
      fail: function (res) {

      }
    })
    wx.getStorage({
      key: 'wxUserAvatarUrl',
      success: function (res) {
        that.setData({
          wxUserAvatarUrl: res.data
        })
      },
      fail: function (res) {
    
      }
    })
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
  // 拨打电话
  createPoster: function () {
    wx.showModal({
      title: '确认操作',
      content: '确认拨打400-063-3337客服电话',
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-063-3337',
          })
        }
      }
    })
  },
  //显示模态框
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消吐槽
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认吐槽
  confirm: function () {
    var that = this;
    var conf = that.data.conf;
    if (conf != "" || conf != null) {
      var param = { text: conf}
      request.apiGet('complaints/toComplaints',param).then(res=>{
        console.log(res)
      })
    }
    this.setData({
      hiddenmodalput: true
    })
  },
  conf:function(e){
    var conf = e.detail.value
    this.setData({conf:conf})
  },
  junpOrder: function (e) {
    var index = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../order_list/order_list?index=' + index + '&type=' + type,
    })
  },
  junp:function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})

function findUser(that) {
  var param = {}
  app.showLoading()
  request.apiGet('/user/findUser', param).then(res => {
    that.setData({
      fundList: res.data
    })
  })
}