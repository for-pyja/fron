var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  historyOrderBarCode:"",
     isAdmin:false,
      userInfo: {
        nickName: '点击登录',
        avatarUrl: '/static/images/avatar.png',
        userLevelDesc:"" ,//用户类型
        // nickName:"",//用户名
        userLevel:""//用户等级,
      },
      order: {
        unpaid: 0,
        unship: 0,
        unrecv: 0,
        uncomment: 0
      },
    MyMenus: [
      { url: "/pages/ucenter/collect/collect", pic:"icon_collect.png",name:"商品收藏"},
      { url: "/pages/ucenter/footprint/footprint", pic: "footprint.png", name: "浏览足迹" },
      { url: "/pages/groupon/myGroupon/myGroupon", pic: "group.png", name: "我的拼团" },
      { url: "/pages/ucenter/address/address", pic: "address.png", name: "地址管理" },
      { url: "/pages/ucenter/feedback/feedback", pic: "feedback.png", name: "意见反馈" },
      { url: "/pages/about/about", pic: "about_us.png", name: "关于我们" }
      // *,{ url: "/pages/about/about", pic: "comment.png", name: "使用帮助" }
      ],
      hasLogin: false,
      totalAmount: 0.00
  },
  /**
   * 历史取餐
   */
  initUserHistoryOderBarCode(){
    var that=this
    util.request(api.GetHistoryOrderBarCode+"/"+that.data.userInfo.userId).then(function (res) {
      let historyOrderBarCode=res
      that.setData({
        historyOrderBarCode:historyOrderBarCode
      })
      // if (res.errno === 0) {
      //   that.setData({
      //     order: res.data.order,
      //     totalAmount: res.data.totalAmount,
      //     remainAmount: res.data.remainAmount,
      //     couponCount: res.data.couponCount
      //   });
      // }
    });

  },
  /**
   * 初始化用户登录信息
   */
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
that.initUserHistoryOderBarCode()
  }
},
  /**
   * 页面跳转
  */
  goPages:function(e){
    console.log();
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.initUserStatusInfo()
    console.log("that.data.admin",that.data.isAdmin)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  onShow:function(){
    var that=this
    that.initUserStatusInfo()
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });

      let that = this;
      util.request(api.UserIndex).then(function (res) {
        if (res.errno === 0) {
          that.setData({
            order: res.data.order,
            totalAmount: res.data.totalAmount,
            remainAmount: res.data.remainAmount,
            couponCount: res.data.couponCount
          });
        }
      });
    }
    that.initUserStatusInfo()
  },

  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

  },
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goBrokerage() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/brokerage/main/main"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goOrder() {
    if (this.data.hasLogin) {
      try {
        wx.setStorageSync('tab', '0');
      } catch (e) {

      }
      wx.navigateTo({
        url: "/pages/ucenter/order/order"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goAfterSale: function () {
    wx.showToast({
      title: '目前不支持',
      icon: 'none',
      duration: 2000
    });
  }
})