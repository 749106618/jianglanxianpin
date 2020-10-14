//index.js
const app = getApp()
const { request } = require('../../utils/api1.js')
Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: false,
    interval: 3000,
    duration: 1000,//这行上面全是轮播参数
    imgHeader: getApp().imgHeader,
    view:true,//tab切换 true=view1 flase=view2 
    notice:false,//公告弹窗 true弹窗
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        // 获取可使用窗口高度
        let clientHeight = res.windowHeight;
        // 获取可使用窗口宽度
        let clientWidth = res.windowWidth;
        // 算出比例    
        let ratio = 750 / clientWidth;
        // 算出高度(单位rpx)    
        let Wheight = clientHeight * ratio;
        that.setData({ Wheight: clientHeight })
      },
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: true
        })
      },
      fail: function (res) {
        that.setData({
          token: false
        })
      }
    })
   this.setData({
     options:options
   })
  },
  onShow:function(){
    var that = this
    goodList(that);
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: true
        })
      },
      fail: function (res) {
        that.setData({
          token: false
        })
      }
    })
  },
  //跳转全部商品
  junpAll(){
    wx.reLaunch({
      url: '../all_shop/all_shop?id=8',
    })
  },
  
  //tab切换
  tabView:function(e){
    var view = JSON.parse(e.currentTarget.dataset.id)
    this.setData({
      view:view
    })
  },
  //公告显隐
  notice:function(e){
    var notice = JSON.parse(e.currentTarget.dataset.id)
    this.setData({
      notice: notice
    })
  },
  //点击添加购物车
  addCart:function(e){
    var that = this;
    var param = {
      quantity: 1,
      id: e.currentTarget.dataset.id
    }
    app.showLoading()
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
        })
        //加入购物车成功修改tabBar数据
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum + 1
        wx.setStorageSync('cartNum', carNum1)
        wx.setTabBarBadge({
          index: 2, //图标下标是从0开始，2代表第3个图标
          text: '' + carNum1 + '',
        })
      }
    })
  },
  //商品跳转全部商品
  junpDetails: function (e) {
    var id = e.currentTarget.dataset.x;
    var idy = e.currentTarget.dataset.y;
    wx.reLaunch({
      url: '../all_shop/all_shop?id=' + id + '&idy='+idy,
    })
  },
  //导航跳转全部商品
  junpAllIndex(e) {
    var id = e.currentTarget.dataset.x;
    wx.reLaunch({
      url: '../all_shop/all_shop?id=' + id,
    })
  },
  //轮播图跳转
  junpUrl: function (e) {
    var url = e.currentTarget.dataset.caption;
    var url1 = url.split('/')[0]
    if (url1 == 'http:' || url1 == 'https:') {
      wx.navigateTo({
        url: '../junp/junp?pUrl=' + url,
      })
    } else if (url1 == '..') {
      wx.navigateTo({
        url: url,
      })
    } else {
      console.log(url)
    }
  },
  onShareAppMessage(){
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  },
  juan: function() {
    var token = wx.getStorageSync('token');
    this.setData({
      popupWindow: false
    })
  },
  //领券
  junpSplist: function() {
    var that = this;
    var thad = this
    var token = that.data.token;
    console.log(token)
    if (token) {
      //领卷
        this.setData({
          popupWindow: false
        })
        if (JSON.parse(this.data.popupWindow1)) {
          var param = {}
          app.showLoading()
          request.apiGet('coupon/provideCoupon', param).then(res => {
            that.setData({
              popupWindow: false
            })
            wx.navigateTo({
              url: '../shopping_list/shopping_list',
            })
          })
        }
    }else{
      wx.login({
        success: function (res) {
          var param = { code: res.code }
          request.apiGet('/weixin/getUserInfo', param).then(res1 => {
            var flag = res1.data.flag;
            var isBusiness = res1.data.isBusiness;
            if (!flag) {
            //去login
            wx.navigateTo({
              url: '../login/login',
            })
            } 
           else if (flag && isBusiness) {
              wx.setStorageSync('token', res1.data.token)
              that.onLoad();
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
    }
  }
})

//加载
function goodList(that) {
  var token = ''
  if (that.data.token) {
    token = wx.getStorageSync('token')
  }
  let param = {
    longitude: 112.93134,
    latitude: 28.23529,
    isSwitch: false,//不清空购物车
    token: token
  }
  app.showLoading()
  request.apiPost('index/showIndex', param).then(res => {
    wx.setStorageSync('cartNum', res.cartNum)
    if (res.cartNum != 0) {
      wx.setTabBarBadge({
        index: 2, //图标下标是从0开始，2代表第3个图标
        text: '' + res.cartNum + '',
      })
    } else {
      wx.setTabBarBadge({
        index: 2,
        text: '0',
      })
    }
    //导航栏限制7个
    var styleList1 = res.styleList;
    var styleList = styleList1.splice(0,7)
    that.setData({
      dataList: res,
      styleList: styleList,
      popupWindow: JSON.parse(res.popupWindow),
      popupWindowImg: res.popupWindowImg,
      popupWindow1: JSON.parse(res.popupWindow),
      isReceivedCoupon:JSON.parse(res.isReceivedCoupon)
    })
  })
}