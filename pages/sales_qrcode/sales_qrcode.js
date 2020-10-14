// pages/sales_qrcode/sales_qrcode.js
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
    that.setData({
      options:options
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  back:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //保存图片
  saveImg: function () {
    var that = this;
    var downloadUrl = that.data.imgHeader+that.data.qrcode;
    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }

    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          console.log("1-没有授权《保存图片》权限");
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log("2-授权《保存图片》权限成功");
              downloadImage(downloadUrl, that);
            },
            fail() {
              // 用户拒绝了授权  
              console.log("2-授权《保存图片》权限失败");
              // 打开设置页面  
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting: success");
                },
                fail: function (data) {
                  console.log("openSetting: fail");
                }
              });
            }
          })
        } else {
          console.log("1-已经授权《保存图片》权限");
          downloadImage(downloadUrl, that)
        }
      },
      fail(res) {
        console.log("getSetting: success");
        console.log(res);
      }
    })
  },
})
function dataList(that) {
  var param = {
    token:wx.getStorageSync('token'),
    scene:that.data.options.inviteCode,
    page:'pages/login/login',
    width:'300',
    auto_color: 'false',
    line_color: '{"r":0,"g":0,"b":0}',
    is_hyaline: 'false',
  }
  request.apiPost('sales/getSaleWXACodeUnlimit',param).then(res=>{
    that.setData({
      qrcode:res.img
    })
  })
}

// 下载文件 
function downloadImage(imageUrl, that) {
  wx.downloadFile({
    url: imageUrl,
    success: function (res) {
      console.log("下载文件：success");
      console.log(res);

      // 保存图片到系统相册  
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(res) {
          console.log("保存图片：success");
          wx.showToast({
            title: '保存成功',
          });
          that.setData({
            onOff: true
          })
        },
        fail(res) {
          console.log("保存图片：fail");
          console.log(res);
          that.setData({
            onOff: true
          })
        }
      })
    },
    fail: function (res) {
      console.log("下载文件：fail");
      console.log(res);
      that.setData({
        onOff: true
      })
    }
  })
}