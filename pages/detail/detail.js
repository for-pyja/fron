var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

Page({
  data: {
    id: 1,
    image: '/static/images/icon_like.png',
    mealName: '',
    mealDescription: '',
    mealScore: 5,
    supplierName: '',
    supplierAddress: '',
    supplierMobile: '',
    supplierEmail: '',
    supplierScore: 5
  },

  // 获取商品信息
  getGoodsInfo: function () {
    var that = this;
    util.request(api.MealDetail, {
      id: that.data.id
    }).then(function (res) {
      that.setData({
        image: res.imageAddress,
        mealName: res.mealName,
        mealDescription: res.description,
        mealScore: res.mealScore,
        supplierName: res.supplierName,
        supplierAddress: res.supplierAddress,
        supplierMobile: res.supplierPhone,
        supplierEmail: res.supplierMail,
        supplierScore: res.supplierScore
      });
    });
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
      this.getGoodsInfo();
    }
  },

  onShow: function () {
    // 页面显示
  },

  //立即购买（先自动加入购物车）
  addFast: function () {


  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  onReady: function () {
    // 页面渲染完成

  },
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getGoodsInfo();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },

})