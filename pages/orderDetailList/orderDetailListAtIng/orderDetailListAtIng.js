var appUtil = require("../../../utils/appUtil.js")
var formart = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage: false,
    pageInfo: {
      currentPage: 1,
      pageSize: 100,
      "store_id": appUtil.appUtils.getMemberInfoData().store_id
    },
    orderList: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  initPage: function () {
    this.setData({
      pageInfo: {
        currentPage: 1,
        pageSize: 100,
        "store_id": appUtil.appUtils.getMemberInfoData().store_id
      }
    })
  },
  loadListFun: function (callBack) {
    var thisPage = this;
    // console.info("thisPage.data.pageInfo" + JSON.stringify(thisPage.data.pageInfo))  
    appUtil.controllerUtil.getOrders(thisPage.data.pageInfo, function (res) {
      // console.info("res:" + JSON.stringify(res))
      callBack(res)
    })
  },
  onLoad: function (options) {
    this.initPage()
    var thisPage = this;
    this.setData({
      orderList: {}
    })
    wx.showLoading({
      title: '拼命加载中',
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
    wx.hideLoading()
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
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
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
  publicGrabGoodFun: function (e) {
    console.info(e.currentTarget.id)
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

  } 
  ,toCarchOrder: function (e) {
    wx.navigateTo({
      url: '../../carchOrderList/catchOrderDetail/catchOrderDetail?id=' + e.currentTarget.id,
    })

  }, setClearCarchOrder: function (e) {
    var thisPage = this;
    var thisEvent = e;
    var paremt = {
      order_sn: Number(e.currentTarget.id)
    }
    appUtil.controllerUtil.setCancelPickOrder(paremt, function (res) {
      if (res.data.succeeded) {
        thisPage.removeOrdereByOrderSn(thisEvent.currentTarget.id)
      }
    })
  }, toCheckOrder: function (e) {
    wx.navigateTo({
      url: '../../searchOrderByNum/searchOrderByNum?id=' + e.currentTarget.id,
    })
  }, setClearCheckOrder: function (e) {
    var thisPage=this;
    var thisEvent=e;
    var paremt = {
      order_sn: Number(e.currentTarget.id)
    }
    appUtil.controllerUtil.setCancelPickOrder(paremt, function (res) {
    
      if (res.data.succeeded){
        thisPage.removeOrdereByOrderSn(thisEvent.currentTarget.id)
      }
    })
  }

})