var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    isAdmin: false,
    goodsList: [],
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10,
    total: 1,
    iitem: {
      imageAddress: "../../static/images/meal.png"
    },
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    that.initUserStatusInfo()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });

    that.getGoodsList();

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    console.log(1);
    this.initUserStatusInfo()
  },
  onHide: function () {
    // 页面隐藏
  },
  initUserStatusInfo:function() {
    var that = this
    let userLoginInfo = wx.getStorageSync("userInfo")
    if (userLoginInfo) {
      console.log("userLoginInfo", userLoginInfo)
      that.setData({
        userInfo: userLoginInfo
      })
      // 0是普通用户,1是管理
      console.log("that.data.userInfo.userLevel", that.data.userInfo.userLevel)
      if (that.data.userInfo.userLevel) {

        that.setData({
          isAdmin: true
        })
      } else {
        that.setData({
          isAdmin: false
        })
      }
    }
  },
  getGoodsList: function () {
    var that = this;
    // TODO: mealpool api
    // 
    var poolUrl = ""
    console.log("that.isAdmin",that.isAdmin)
    if (!that.data.isAdmin) {
      console.log("admin")
      poolUrl = api.MealPool
      util.request(poolUrl)
        .then(function (res) {
          that.setData({
            goodsList: that.data.goodsList.concat(res),
          });
        });
    } else {
      console.log("user")
      poolUrl = api.MealPoolAdmin
      util.request(poolUrl, {
        page: that.data.page,
        size: that.data.size
      })
        .then(function (res) {
          that.setData({
            goodsList: that.data.goodsList.concat(res.data),
            total: res.pagination.total
          });
        });
    }

  },
  onUnload: function () {
    // 页面关闭
  },
  switchCate: function (event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id,
      goodsList: [],
      page: 1,
      total: 1
    });

    this.getCategoryInfo();
  },
  onReachBottom: function () {

    if (this.data.total >= this.data.size * this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getGoodsList();
    } else {
      wx.showToast({
        title: '已经到底了!',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      goodsList: [],
      page: 1,
      total: 1
    });
    this.getGoodsList();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

})