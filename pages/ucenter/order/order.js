var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({
  data: {
    listUrl: "",
    isAdmin: false,
    orderList: [],
    showType: 0,
    page: 1,
    size: 10,
    totalPages: 1,
    orderList: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let that = this
    that.getHistoryList()
    that.initUserStatusInfo()
    try {
      var tab = wx.getStorageSync('tab');
      this.setData({
        showType: tab
      });
    } catch (e) {}
    // 加载list
  },
  initUserStatusInfo() {
    var that = this
    let userLoginInfo = wx.getStorageSync("userInfo")
    if (userLoginInfo) {
      console.log("userLoginInfo", userLoginInfo)
      that.setData({
        userInfo: userLoginInfo
      })
      // 0是普通用户,1是管理
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
  getHistoryList() {

    var that = this;
    // 管理员
    if (that.data.isAdmin) {
      that.data.listUrl = 'http://zzfron.w1.luyouxia.net:80/ouye/server/user/list/history/' + '1'
    } else {
      // 员工
      that.data.listUrl = api.getSelectedMeal
    }
    util.request(that.data.listUrl)
      .then(function (res) {
        console.log("rss", res)
        that.setData
        that.setData({
          historyGoodsList: that.data.orderList.concat(res),
          total: res[0].total
        });
      });
    let userId = 1
    console.log("(api.GetHistoryListItem", api.GetHistoryListItem)
    util.request(api.GetHistoryListItem, userId).then(function (res) {
      console.log("res", res)
      // if (res.errno === 0) {
      //   console.log(res.data);
      //   that.setData({
      //     orderList: that.data.orderList.concat(res.data.data),
      //     totalPages: res.data.totalPages
      //   });
      // }
    });
    // ​/ouye​/server​/user​/list​/history​/{id}
    // 查看历史套餐
  },
  getOrderList() {
    let that = this;
    util.request(api.OrderList, {
      showType: that.data.showType,
      page: that.data.page,
      size: that.data.size
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: that.data.orderList.concat(res.data.data),
          totalPages: res.data.totalPages
        });
      }
    });
  },
  onReachBottom() {
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getOrderList();
    } else {
      wx.showToast({
        title: '没有更多订单了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },
  switchTab: function (event) {
    let showType = event.currentTarget.dataset.index;
    this.setData({
      orderList: [],
      showType: showType,
      page: 1,
      size: 10,
      totalPages: 1
    });
    this.getOrderList();
  },
  // “去付款”按钮点击效果
  payOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.index;
    util.request(api.OrderPrepay, {
      orderId: orderId
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        const payParam = res.data;
        console.log("支付过程开始");
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.packageValue,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log("支付过程成功");
            util.redirect('/pages/ucenter/order/order');
          },
          'fail': function (res) {
            console.log("支付过程失败");
            util.showErrorToast('支付失败');
          },
          'complete': function (res) {
            console.log("支付过程结束")
          }
        });
      }
    });

  },
  // “取消订单”点击效果
  cancelOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.index;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderCancel, {
            orderId: orderId
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “取消订单并退款”点击效果
  refundOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.index;

    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderRefund, {
            orderId: orderId
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '取消订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “删除”点击效果
  deleteOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.index;

    wx.showModal({
      title: '',
      content: '确定要删除此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            orderId: orderId
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '删除订单成功'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  // “确认收货”点击效果
  confirmOrder: function (e) {
    let that = this;
    let orderId = e.currentTarget.dataset.index;

    wx.showModal({
      title: '',
      content: '确认收货？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderConfirm, {
            orderId: orderId
          }, 'POST').then(function (res) {
            if (res.errno === 0) {
              wx.showToast({
                title: '确认收货成功！'
              });
              util.redirect('/pages/ucenter/order/order');
            } else {
              util.showErrorToast(res.errmsg);
            }
          });
        }
      }
    });
  },
  detailExpress: function (e) {
    let orderId = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/ucenter/expressInfo/expressInfo?orderId=' + orderId
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.setData({
      orderList: [],
      page: 1,
      size: 10,
      totalPages: 1
    });
    this.getOrderList();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})