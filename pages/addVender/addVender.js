// pages/addVender/addVender.js
var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var user = require('../../utils/user.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    venderName: "",
    venderPhoneNumber: "",
    venderEmail: "",
    venderLocation: "",
  },
  submit() {
    console.log("添加套餐", this.data)
    if (!this.data.venderName) {
      wx.showToast({
        title: "供应商名称不能为空",
        icon: "none"
      })
      return
    }
    if (!this.data.venderPhoneNumber) {
      wx.showToast({
        title: "供应商联系电话不能为空",
        icon: "none"
      })
      return
    }
    if (!this.data.venderEmail) {
      wx.showToast({
        title: "供应商邮箱不能为空",
        icon: "none"
      })
      return
    }
    if (!this.data.venderLocation) {
      wx.showToast({
        title: "供应商地址不能为空",
        icon: "none"
      })
      return
    }
    var that = this;
    // 加入餐池请求
    let addVenderParams={}
    addVenderParams.name=that.data.venderName
    addVenderParams.mobile=that.data.venderPhoneNumber
    addVenderParams.email=that.data.venderEmail
    addVenderParams.address=that.data.venderLocation
    addVenderParams.id=0
    util.request(api.AddVender,
      addVenderParams, 'POST').then(function (res) {
        console.log("添加",res)
      wx.showToast({
        title: '供应商添加成功',
        complete: function () {
          wx.navigateBack();
        }
      }, 2000)
    });
  },
  bindVenderNameInput(e) {
    this.setData({
      venderName: e.detail.value
    })
  },
  bindPhoneNumberInput(e) {
    this.setData({
      venderPhoneNumber: e.detail.value
    })
  },
  bindEmailInput(e) {
    this.setData({
      venderEmail: e.detail.value
    })
  },
  bindLocationInput(e) {
    this.setData({
      venderLocation: e.detail.value
    })
  },
  bindPickerChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
    // console.log(this.data.typeIndex, 11)
  },
  bindTextAreaInput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 上传照片
  chooseImg(e) {
    const _this = this;
    let imgs = this.data.imgs;
    let imgNumber = this.data.imgs.length; //当前已上传的图片张数
    if (imgNumber >= 3) {
      wx.showToast({
        title: "最多只能上传三张图片！",
        icon: "none"
      })
      return false;
    } else {
      imgNumber = 3 - imgNumber;
    };
    wx.chooseImage({ //打开本地相册选择图片
      count: imgNumber,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        for (let i = 0; i < tempFilePaths.length; i++) {
          imgs.push(tempFilePaths[i]);
        }
        _this.setData({ //赋值，回显照片
          imgs: imgs
        });
        let successUp = 0; //成功
        let failUp = 0; //失败
        let count = 0; //第几张
        let length = tempFilePaths.length; //总数
        _this.recursionUploading(tempFilePaths, successUp, failUp, count, length); //调用上传方法
      }
    })
  },
  //采用递归的方式上传图片
  recursionUploading(imgPaths, successUp, failUp, count, length) {
    let token = wx.getStorageSync('token');
    var _this = this;
    wx.showLoading({
      title: '正在上传第' + (count + 1) + '张',
    });
    wx.uploadFile({
      url: `${config.host}/oss/upload`,
      filePath: imgPaths[count],
      // formData: {
      //     userId: app.globalData.userMsg.userId
      // },
      name: "file",
      header: {
        'content-type': 'application/json',
        Authorization: token
      },
      success(e) {
        console.log(e)
        let path = _this.data.imgUrls;
        let obj = JSON.parse(e.data);
        if (obj.code == 200) {
          path.push(obj.data);
          _this.setData({
            imgUrls: path
          });
          console.log(_this.data.imgUrls, 1212121)
        }
        successUp++; //成功+1
      },
      fail(e) {
        // failUp++; //失败+1
      },
      complete(e) {
        count++; //下一张
        if (count == length) {
          wx.showToast({
            title: '上传成功',
          })
        } else {
          //递归调用，上传下一张
          _this.recursionUploading(imgPaths, successUp, failUp, count, length);
        }
      }
    })
  },
  // 预览大图
  lookBigImg(e) {
    let index = e.currentTarget.dataset.index; //索引
    let big = this.data.imgs[index];
    wx.previewImage({
      current: big, // 当前显示图片的http链接
      urls: this.data.imgs // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})