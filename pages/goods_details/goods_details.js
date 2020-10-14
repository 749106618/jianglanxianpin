// pages/goods_details/goods_details.js
const {request} = require('../../utils/api1.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: false,
    current: 0,
    index:1,
    autoplay:false,//上面为轮播设置
    imgHeader: app.imgHeader,
    quantity:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var cartNum = parseInt(wx.getStorageSync('cartNum'));
    that.setData({
      options:options,
      cartNum: cartNum
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //轮播右下角初始数字
    that.setData({
      current: 0,
      index:1
    })
    
    dataList(that)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果铺联采',
      path: 'pages/goods_details/goods_details?shopId=' + this.data.options.shopId
    }
  },
  //滑动轮播时切换数字
  changeSwiper:function(e){
    this.setData({
      index: e.detail.current + 1
    })
  },
  junpCard:function(){
    wx.switchTab({
      url: '../shop_cart/shop_cart',
    })
  },
  //添加购物车
  addCard:function(){
    var that = this;
    var param = {
      quantity: that.data.quantity,
      id: that.data.options.shopId
    }
    app.showLoading()
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var quantity = parseInt(that.data.quantity)
        var a = cartNum + quantity
        wx.setStorageSync('cartNum', a)
        that.setData({
          cartNum: a
        })
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  addCard1:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    var param = {
      quantity: 1,
      id: id
    }
    request.apiPost2('cart/add', param).then(res => {
      if (res.type == "success") {
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var a = cartNum + 1
        wx.setStorageSync('cartNum', a)
        that.setData({
          cartNum: a
        })
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  //点击推荐商品重新加载商品详情
  reLoad:function(e){
    var id = e.currentTarget.dataset.id;
    var a = 'options.shopId'
    this.setData({
      [a]:id
    })
    dataList(this)
  },
  // 添加购物车时加减
  updNum:function(e){
    var that = this;
    var type = e.currentTarget.dataset.type;
    var quantity = that.data.quantity;
    if(type=='jia'){
      //加
      that.setData({quantity:quantity+1})
    }else{
      //减
      if (quantity!=1){
        that.setData({ quantity: quantity - 1 })
      }
    }
  },
  //输入数量
  updInput:function(e){
    var quantity = parseInt(e.detail.value);
    if(quantity<=0){
      quantity=1
    }
    this.setData({quantity:quantity})
  },
  //分享二维码
  createPoster: function () {
    var that = this;
    var jsonObject = { "shopId": that.data.options.shopId }
    var param = { jsonObject: JSON.stringify(jsonObject) }
    request.apiPost('/weixin/setScene', param).then(res => {
      // 小程序带参res.key
      var param1 = {
        page: String(that.route),
        scene: res.key,
        width: '300',
        auto_color: 'false',
        line_color: '{"r":0,"g":0,"b":0}',
        is_hyaline: 'false',
        companyId: ''
      };
      app.showLoading();
      request.apiPost('weixin/getWXACodeUnlimit', param1).then(res1 => {
        console.log(res1)
        that.setData({
          shareImg: res1.img,
          shareview: true,
        })
      })
    })
  },
  hideshareview: function () {
    this.setData({
      shareview: false,
    })
  }
})

function dataList(that) {
  let param = {
    goodsId: that.data.options.shopId
  }
  app.showLoading()
  request.apiGet('goods/goodsInfo', param).then(res => {
    if (res.statusCode == 200) {
      res.data.goodsInfo.showImageUrl = res.data.goodsInfo.showImageUrl.split(',')
      var reg = new RegExp('<img', 'g')
      var reg1 = new RegExp('<p', 'g')
      var nodes = res.data.goodsInfo.content;
      nodes = nodes.replace(reg, '<img style="max-width:100%;height:auto" ');
      nodes = nodes.replace(reg1, '<p style="width:100vw;"')
      that.setData({
        Goods: res.data.goodsInfo,
        nodes: nodes,
        Goodstj: res.data.recommend
      })
    }
  })
}