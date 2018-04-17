// pages/carchOrderList/myCatchOrderList/myCatchOrderList.js
var appUtil = require("../../../utils/appUtil.js")
var formart = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage: false,
    pageInfo: {
      packer: appUtil.appUtils.getMemberInfoData().member_id,
      order_receiving: 1,
      "audit_status": 1,
      "currentPage": 1,
      "store_id": appUtil.appUtils.getMemberInfoData().store_id,
       pageSize: 10
    }, orderList: {}
  },
  initPage: function () {
    this.setData({
      pageInfo: {
        packer: appUtil.appUtils.getMemberInfoData().member_id,
        order_receiving: 1,
        "audit_status": 1,
        "currentPage": 1,
        "store_id": appUtil.appUtils.getMemberInfoData().store_id,
        pageSize: 10
      }
    })
  },
  loadListFun: function (callBack) {
    var thisPage = this;
    appUtil.controllerUtil.getMemberOffLinePickOrders(thisPage.data.pageInfo, function (res) {
      callBack(res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPage()
    var thisPage = this;
    this.setData({
      orderList: {}
    })
    wx.showLoading({
      title: '加载中...',
    })
    this.loadListFun(function (res) {
      thisPage.setData({
        orderList: res.data.data
      })
    });
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.onLoad(options);
    wx.hideLoading()
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
  
  }, 
  setCatchOrderToUser:function(e){
    var thisEvent=e;
    wx.showToast({
      icon: "loading",
      title: '加载中...',
      mask:true
    })
    wx.navigateTo({
      url: '../catchOrderDetail/catchOrderDetail?id=' + e.currentTarget.id
    })
  },
  addNextPageOrderToOrderList: function (nextPageOrderPage) {
    var orderList = this.data.orderList;
    nextPageOrderPage.forEach(function (t) {
      thisPage.data.isLastPage = false;
      orderList.push(t)
    });
    this.setData({
      orderList: orderList
    })
  },
  lower: function (e) {
    if (this.data.isLastPage != true) {
      var thisPage = this;
      this.data.pageInfo.currentPage = this.data.pageInfo.currentPage + 1
      this.loadListFun(function (res) {
        thisPage.data.isLastPage = true;
        thisPage.addNextPageOrderToOrderList(res.data.data)
      })
    }

  }, toOrderCollect: function () {
    wx.showToast({
      icon: "loading",
      title: '加载中...',
      mask: true
    })
    wx.navigateTo({
      url: '../orderCollect/orderCollect',
    })
  }
  ,remvoeCatchOrder: function (e) {
    var thisPage = this;
    var thisEvent = e;
      var paremt={
        order_sn: e.currentTarget.dataset.sn
      }
      wx.showModal({
        title: '提示',
        content: '确认取消订单?',
        success: function (res) {
          if (res.confirm) {
            appUtil.controllerUtil.setCancelPickOrder(paremt, function (res) {
              if (res.data.succeeded) {
                thisPage.removeOrdereByOrderSn(thisEvent.currentTarget.dataset.sn)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
     
  },
  removeOrdereByOrderSn: function (order_sn) {
    var orderList = [];
    this.data.orderList.forEach(function (t) {
      if (order_sn != t.order_sn) {
        orderList.push(t)
      }
    });
    this.setData({
      orderList: orderList
    })
  },
})