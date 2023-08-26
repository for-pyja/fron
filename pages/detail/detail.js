var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');

Page({
  data: {
    isAdmin:true,
    commentValue:0,
    id: 1,
    image: '/static/images/meal.png',
    mealName: '',
    mealDescription: '',
    mealScore: 5,
    supplierName: '',
    supplierAddress: '',
    supplierMobile: '',
    supplierEmail: '',
    supplierScore: 5
  },
  // 评分
  onChangeCommentValue:function(event){
    var that = this;
    this.setData({
      commentValue: event.detail
    });
    console.log("评分数值",that.data.commentValue)
    let UpdateCommentParams={
      mealId:that.data.id,
      score:that.data.commentValue
    }
    // 加入餐池请求
    // let idList=[that.data.id]
    util.request(api.updateCommentValue, 
      UpdateCommentParams
    ).then(function (res) {
      console.log("res",res)
              wx.showToast({
          title: '评分成功',
        },2000)
    });
  },
  initUserStatusInfo(){
    var that=this
    let userLoginInfo=wx.getStorageSync("userInfo")
    if(userLoginInfo){
      console.log("userLoginInfo",userLoginInfo)
  that.setData({
    userInfo:userLoginInfo
  })
  // 0是普通用户,1是管理
  if(that.data.userInfo.userLevel){
    that.setData({
      isAdmin:true
    })
  }else{
    that.setData({
      isAdmin:false
    })
  }
    }
  },
  chooseMeal: function () {
    var that = this;
    let chooseMealParams= {
      description: that.data.mealDescription,
      id: that.data.id,
      imageAddress: that.data.supplierAddress,
      name: that.data.name,
      supplierId: '1' //拿不到供应商id
    }
    // 加入餐池请求
    util.request(api.ChooseMeal 
  ,chooseMealParams, 'POST').then(function (res) {
              wx.showToast({
          title: '添加套餐成功',
          complete: function () {
            wx.navigateBack();
          }
        },2000)
    });
  },
  // 加入餐池
  addToCart: function () {
    var that = this;
    // 加入餐池请求
    // let idList=[that.data.id]
    util.request(api.addMealPool, 
      [that.data.id]
    , 'POST').then(function (res) {
              wx.showToast({
          title: '加入餐池成功',
          complete: function () {
            wx.navigateBack();
          }
        },2000)
    });
  },
  // 获取商品信息
  getGoodsInfo: function () {
    var that = this;
    util.request(api.MealDetail, {
      id: that.data.id
    }).then(function (res) {
      console.log("1111111111",res)
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
this.initUserStatusInfo()
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