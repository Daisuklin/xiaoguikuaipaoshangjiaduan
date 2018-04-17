// pages/carchOrderList/carchOrderList.js
var appUtil = require("../../utils/appUtil.js")
var formart = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLastPage:false,
    pageInfo:{
      order_receiving:0,
      "audit_status": 0,
      currentPage:1,
      "store_id": appUtil.appUtils.getMemberInfoData().store_id,
      pageSize:10
    },
    orderList:{}
  },
  orderitem:{
    order_id:null,
    order_sn:null,
    date_time:null,
    order_serial:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  initPage:function(){
    this.setData({
          pageInfo:{
          order_receiving: 0,
          "audit_status": 0,
          currentPage:1,
          "store_id": appUtil.appUtils.getMemberInfoData().store_id,
          pageSize:10
        }
    })
  },
  loadListFun:function(callBack){
    var thisPage = this; 
   // console.info("thisPage.data.pageInfo" + JSON.stringify(thisPage.data.pageInfo))  
    appUtil.controllerUtil.getMemberOffLinePickOrders(thisPage.data.pageInfo, function (res) {
     // console.info("res:" + JSON.stringify(res))
      callBack(res)
    })
  },
  onLoad: function (options) {
    this.initPage()
    var thisPage=this;   
    this.setData({
      orderList: {}
    })
    wx.showLoading({
      title: '拼命加载中',
    })
    this.loadListFun(function(res){
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  publicGrabGoodFun:function(e){
    console.info(e.currentTarget.id)
  },
  // 抢单
  setCatchOrderToUser:function(e){
    console.info(e.currentTarget.id)
    var thisEvent=e;
    var thisPage = this;
    wx.showLoading({
      title: '抢单中',
    })
    appUtil.controllerUtil.setPickOrderStatus({
      "audit_status": 1,
      "order_sn": e.currentTarget.id,
      "type": 1
    }, function (res) {
      wx.hideLoading();
      if (res.data.succeeded){
        wx.showToast({
          title: '订单抢单成功！',
        })
        thisPage.removeOrdereByOrderSn(thisEvent.currentTarget.id)
      }else{
        wx.showToast({
          icon:"loading",
          title: '订单已被秒抢！',
        })
      }
      
    })
   
    
  },
  removeOrdereByOrderSn: function (order_sn){
    var orderList = [];
    this.data.orderList.forEach(function (t) {
      if (order_sn != t.order_sn){
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

  onPullDownRefresh: function () {
    wx.showToast({
      title: '加载中...',
      icon: "loading",
    })
    var thisPage = this;
    thisPage.data.isLastPage = false;
    thisPage.data.pageInfo.currentPage = 1
    this.loadListFun(function (res) {
      thisPage.setData({
        orderList: res.data.data
      })
    });
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var thisPage = this;
    setTimeout(function () {
      if (thisPage.data.isLastPage != true) {
        wx.showToast({
          title: '加载中...',
          icon: "loading",
        })
        thisPage.data.pageInfo.currentPage = thisPage.data.pageInfo.currentPage + 1
        thisPage.loadListFun(function (res) {
          thisPage.data.isLastPage = true;
          thisPage.addNextPageOrderToOrderList(res.data.data)
        })
      }
    }, 500)

  },

})