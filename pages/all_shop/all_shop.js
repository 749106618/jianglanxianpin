// pages/all_shop/all_shop.js
let {request} = require('../../utils/api1.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    styles:[],//x列表
    stylesY:[],//y列表
    Goods:[],//商品列表
    page:0,//当前页
    goodsId:'',//当前id
    imgHeader: app.imgHeader,
    pj:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    //新用户进来隐藏价格
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          haveToken: true
        })
      },
      fail: function (res) {
        that.setData({
          haveToken: false
        })
      }
    })
    this.setData({ options: options })
    this.getGoodsStyles();
  },
  //x加载
  getGoodsStyles(){
    let that = this;
    app.showLoading()
    request.apiGet('goods/getGoodsStyles').then(res=>{
      if (res.statusCode == 200) {
          that.setData({styles:res.data.list})
          return res.data.list
      }
    }).then(result=>{
      if(that.data.options.id){
        console.log(result)
        var index = 0;
        for(var i =0;i<result.length;i++){
          if(result[i].id==that.data.options.id){
            index = i
          }
        }
        //默认用index分类加载商品列表
        that.getTypeByStyle('', that.data.options.id)
        this.setData({
          pj: 'pj' + index,
          goodsId: that.data.options.id
        })
      }else{
        //默认用第一个分类加载商品列表
        that.getTypeByStyle('', result[0].id)
        this.setData({
          pj:'pj0',
          goodsId: result[0].id
        })
      }
      
    })
  },
  //点击x y加载
  getTypeByStyle(e, detail){
    var that = this;
    var isclick;//是否可以点击
    var id,pj;
    if(detail!=undefined){
      id = detail
    }else{
      id = e.currentTarget.dataset.id
      that.setData({ goodsId:id})
      isclick = e.currentTarget.dataset.isclick,
      pj = "pj"+e.currentTarget.dataset.index
    }
    if (isclick!='1'){
      var param = { style: id }
      app.showLoading()
      request.apiGet('goods/getTypeByStyle', param).then(res => {
        var stylesY = res.data.list
        var goodsIdY = '';
        if (stylesY[0]!=undefined){
          if(that.data.options.idy!=undefined){
            goodsIdY = that.data.options.idy;
            that.getGoodsByType('', goodsIdY)
          }else{
            goodsIdY = stylesY[0].id;
            that.getGoodsByType('', goodsIdY)
          }
        }
        that.setData({ 
          stylesY:stylesY,
          goodsIdY: goodsIdY,
          page:0,//切换x轴时 商品的页数清0
          Goods:[],//切换x轴，清空商品
          xhide: 2,
          pj: pj
        })
      })
    }
  },
  // y点击 商品加载
  getGoodsByType(e,detail){
    var that = this;
    //清空首页代参
    that.setData({options:[]})
    var isclick;//是否可以点击
    var id;
    if (detail != undefined) {
      id = detail
    } else {
      id = e.currentTarget.dataset.id
      that.setData({ goodsIdY: id })
      isclick = e.currentTarget.dataset.isclick
    }
    if (isclick != '1') {
      var param = { 
        type: id,
        page:that.data.page,
        pagesize:50
      }
      app.showLoading()
      request.apiGet('goods/getGoodsByType', param).then(res => {
        that.setData({
          Goods: res.data.page.records,
        })
      })
    }
  },
  //加入购物车
  addCard: function (e) {
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
          duration: 2000
        })
        //设置tabBar
        var cartNum = parseInt(wx.getStorageSync('cartNum'));
        var carNum1 = cartNum + 1;
        wx.setStorageSync('cartNum', carNum1)
        wx.setTabBarBadge({
          index: 2,
          text: '' + carNum1 + '',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    let val = app.searchWord;
  },
  junpDetails: function (e) {
    wx.navigateTo({
      url: '../goods_details/goods_details?shopId=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page:this.data.page + 1
    })
    this.defaultGoods()
  },
  xhide:function(){
    this.setData({ xhide:2})
  },
  xshow:function(){
    this.setData({ xhide: 1 })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '果铺联采',
      path: "/pages/index/index"
    }
  }
})