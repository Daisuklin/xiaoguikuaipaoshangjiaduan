// pages/login/login.js
var appUtil = require("../../utils/appUtil.js")
var app = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    memberInfo:{},
    isCatchGoods: false,
    isCheckGoods: false,
    inputOrderNum:"",
    showInputOrderNumWindow:false,
    isLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '拼命加载中',
    })
    if (appUtil.appUtils.getUnionIdData() == null || appUtil.appUtils.getUnionIdData() == "") {
      
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      var memberInfo=  appUtil.appUtils.getMemberInfoData()
      this.setData({
        memberInfo: memberInfo,
        isLogin: true,
        userInfo: appUtil.appUtils.getStorageUser(),
        isCatchGoods: (memberInfo.type == "all" ? true : (memberInfo.type == "pickup"?true:false)),
        isCheckGoods: (memberInfo.type == "all" ? true : (memberInfo.type == "verify" ? true : false)),
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     
   },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },
  /**监听点击登录按钮 */
  SearchQrCode: function (e) {
    // console.info(JSON.stringify(e));
    wx.scanCode({
      // onlyFromCamera: true,
      success: (res) => {
        if (res.errMsg == "scanCode:ok"){
          var id = res.result.split("/")[res.result.split("/").length - 1];
          wx.navigateTo({
            url: '../searchOrderByNum/searchOrderByNum?id=' + id,
          })
        }else{
          wx.showModal({
            title: '提醒',
            content: '查询不到当前订单号!',
          })
        }
        
      }
    })
  },
  toCatchGoodsList:function(e){
    //拣货列表
   this.ChangePage('../carchOrderList/carchOrderList')
  }, toSearchOrder: function (e) {
   //扫码验货
    this.ChangePage('../orderInfo/orderInfo')
  }
  , toInputOrderNum: function (e) {
    //输单验货
    this.setData({
      showInputOrderNumWindow: !this.data.showInputOrderNumWindow
    })


    //this.ChangePage('../searchOrderByNum/searchOrderByNum')
  }, toOrderDetail: function (e) {
    //订单详情
    this.ChangePage('../orderDetailList/orderDetailList')
  }, toServiceTel: function (e) {
    //拨打电话
    wx.makePhoneCall({
      phoneNumber: "400-660-9727"
    })
  }
  ,ChangePage:function(url){
    wx.navigateTo({
      url: url,
    })
  },
  inputOrderNumWindwoClearFun:function(){
    this.setData({
      inputOrderNum: "",
      showInputOrderNumWindow: false
    })
  },
  inputOrderNumWindwoSubmitBtnFun: function () {
    var thisPage=this;
   //提交订购单Controller
    appUtil.controllerUtil.getSerialOrder({
      "store_id": appUtil.appUtils.getMemberInfoData().store_id,
      "order_serial": this.data.inputOrderNum.replace("#","")
    }, function (res){
      console.info("返回：",res);
      if (res.data.succeeded) {
        thisPage.setData({
          showInputOrderNumWindow: false
        })
        wx.navigateTo({
          url: '../searchOrderByNum/searchOrderByNum?id=' + res.data.data.order_id,
        })
      }else{
        wx.showToast({
          icon:"loading"
          ,title: '查不到验货单！'
        })
      }
    })

  },
  //输单单号处理
  bindKeyInput: function (e) {
    var inputOrderNum = ((e.detail.value == null || typeof (e.detail.value)=='undefined') ? "" : e.detail.value)
    if (inputOrderNum.indexOf("#")>-1){
      inputOrderNum= e.detail.value.replace("#", "")
    } 
    this.setData({
      inputOrderNum: inputOrderNum
    })
  },
  clearUserInfoBtn:function(){
    wx.clearStorage("token");
    wx.clearStorage("blackUserInfo")
    wx.reLaunch({
      url: '/pages/login/index/index',
    })
  }

})