var appUtil = require("../../../utils/appUtil.js")
var formart = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    order:{}
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var thisPage = this;
    var key = "catch_" + Number(options.id)
    if (typeof (wx.getStorageSync(key)) != "undefined" && wx.getStorageSync(key) != null && wx.getStorageSync(key) != ""){
      this.setData({
        order: wx.getStorageSync(key)
      })
      wx.hideLoading()
    }else{
      appUtil.controllerUtil.pickOrderDetail({
        "order_id": Number(options.id)
      }, function (res) {

        if (res.data.succeeded) {
          thisPage.setData({
            order: res.data.data
          })
          thisPage.data.order.extend_order_goods.forEach(function (good) {
            good['checkCount'] = 0;
          })
          thisPage.setData({
            order: thisPage.data.order
          })
          wx.hideLoading()
        }
      })
    }
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
    var orderid = this.data.order.order_id
    wx.removeStorageSync("catch_" + orderid)
    console.info("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.order!=null){
      var orderid = this.data.order.order_id
      wx.setStorageSync("catch_" + orderid, this.data.order)
    }
    console.info("onUnload")
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
  addOrderGoodCheckCount: function (barCode,count){
    var orderInfo = this.data.order;
    orderInfo.extend_order_goods.forEach(function (good) {
      if (good.goods_barcode == barCode) {
        if (good.checkCount < good.goods_num ){
          good.checkCount = ((good.goods_num > (good.checkCount + count)) ? (good.checkCount + count) : good.goods_num);
        }else{
          wx.showToast({
            icon: "loading",
            title: '该商品数已够！',
          })
        }
     
      }
    })
    this.setData({
      order: orderInfo
    })

   // console.info(JSON.stringify(this.data.order.extend_order_goods))
  },
  submitBarCodeBtn:function(){
    var barCode=  this.data.inputValue;
    this.addOrderGoodCheckCount(barCode, 1)
    this.setData({
      inputValue: null
    });
  },
  SearchQrCode: function (e) {
    //console.info("商品扫码")
    wx.scanCode({
      // onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        if (res.errMsg=="scanCode:ok"){
          this.addOrderGoodCheckCount(res.result, 1)
        }
        
      }
    })
  }, changeOrderStatus:function(e){
    
    var allCheckOk=true;
    this.data.order.extend_order_goods.forEach(function (good) {
      if (good.checkCount != good.goods_num){
        allCheckOk=false;
      }
    })
    if (!allCheckOk){
      wx.showToast({
        icon: "loading",
        title: '商品数有误！',
      })
      return false;
    }
    var newObject=new Object();
    newObject.order_id = this.data.order.order_id
    newObject.order_sn = this.data.order.order_sn
    var goodList=new Array();

    
    this.data.order.extend_order_goods.forEach(function(g){
      var newGood= new Object();
      newGood.goods_id = g.goods_id;
      newGood.goods_num = g.goods_num;
      newGood.checkCount = g.checkCount;
      goodList.push(newGood)
    })
    
    newObject.extend_order_goods = goodList;
    var json_data = JSON.stringify(newObject); 
   // console.info(json_data)
    appUtil.controllerUtil.setCheckOrder(JSON.parse(json_data), function (res) {
      if (res.data.succeeded) {
        wx.showToast({
          duration: 5000,
          title: '订单提交成功',
          complete:function(){
            wx.navigateBack({
              url: '../myCatchOrderList/myCatchOrderList',
            })
          }
        })

         //跳转到我的进行中页面 
      } else {
        wx.showToast({
          icon: "loading",
          title: '订单提交失败！',
        })
      }
    }) 

     
  }
})