// pages/sales_add/sales_add.js
const app = getApp();
const {request} = require('../../utils/api1')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgHeader:app.imgHeader,
    companyName:'',
    name:'',
    address:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'ycode',
      success: function (res) {
        that.setData({
          inviteCode: res.data
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getStorage({
      key: 'sid',
      success:function(res){

      },fail:function(res){
        wx.login({
          success:(res)=>{
            var param = {code:res.code}
            request.apiGet('/weixin/getOpenId',param).then(res1=>{
              wx.setStorageSync('sid', res1.data.sid)
            })
          }
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //输入
  setinput:function(e){
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  subimt:function(){
    var that =this;
    var sid = wx.getStorageSync('sid');
    var param = {
      sid:sid,
      companyName:that.data.companyName,
      name:that.data.name,
      address:that.data.address,
      inviteCode:that.data.inviteCode
    }
    if(param.companyName==''||param.name ==''||param.address==''){
      wx.showToast({
        title: '请完善信息',
        icon:'none'
      })
    }else{
      request.apiPost('weixin/setCompanyInfo',param).then(res=>{
        if(res.type=="success"){
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
    }
  }
})