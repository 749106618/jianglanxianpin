// pages/login/login.js
const app = getApp();
const {request} = require('../../utils/api1.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendTime: '获取验证码',
    snsMsgWait: 60,
    smsFlag:false,
    code:"",
    tel:"",
    ycCode:false,//是否为邀请二维码/链接进入
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      options:options
    })
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
      wx.setStorageSync('ycode',scene)
    }
    wx.checkSession({
      success:function(res){
        console.log(res)
      },
      fail: function(res){
        console.log(res)
      }
    })
    //先调用一下getUserInfo接口 已注册跳转首页
    wx.login({
      success: function (res) {
        var param = { code: res.code }
        request.apiGet('/weixin/getUserInfo', param).then(res1 => {
          var flag = res1.data.flag;
          var isBusiness = res1.data.isBusiness;
          if (!flag) {
          //去login
          } 
          else if (flag && isBusiness) {
            wx.setStorageSync('token', res1.data.token)
            //跳转首页
            wx.switchTab({
              url: '../index/index',
            })
          } 
          else if(flag && !isBusiness){
            //跳到完善信息
            wx.navigateTo({
              url: '../sales_add/sales_add',
            })
          }
        })
      }
    })
  },
  //输入
  setinput:function(e){
    let temp = {}
    temp[e.currentTarget.dataset.type] = e.detail.value
    this.setData(temp)
  },
  //发送验证码
  sendCode:function(){
    var that = this;
    if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.data.tel))) {
      this.toast('手机号输入错误');
      return;
    }
    var inter = setInterval(function () {
      this.setData({
        smsFlag: true,
        sendTime: this.data.snsMsgWait + 's后重发',
        snsMsgWait: this.data.snsMsgWait - 1
      });
      if (this.data.snsMsgWait < 0) {
        clearInterval(inter)
        this.setData({
          sendTime: '获取验证码',
          snsMsgWait: 60,
          smsFlag: false
        });
      }
    }.bind(this),1000);
    var param = { tel:that.data.tel}
    request.apiPost('/weixin/getVerifyCode',param).then(res=>{
      
    })
  },
  //提交
  submit:function(e){
    var that = this;
    if (e.detail.userInfo) {
      if (that.data.tel != "" && that.data.code != ""){
        wx.login({
          success: function(loginRes) {
            var param ={
              code : loginRes.code,
              verifyCode:that.data.code,
              phone:that.data.tel,
              iv:e.detail.iv,
              encrypteData:e.detail.encryptedData
            }
            request.apiPost('/weixin/login', param).then(res => {
              var sid = res.sid;
              if (sid != undefined) {
                wx.setStorageSync('sid', res.sid)
                wx.setStorageSync('token', res.token)
                wx.navigateTo({
                  url: '../sales_add/sales_add',
                })
              }else{
                wx.navigateTo({
                  url: '../sales_add/sales_add',
                })
              }
            })
          }
        })
      }else{
        wx.showToast({
          title: '请完善信息',
          icon:'none'
        })
      }
    }
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
  toast: function (msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000,
      mask: true
    })
  },
  junptext:function(){
    wx.navigateTo({
      url: '../text/text',
    })
  }
})

