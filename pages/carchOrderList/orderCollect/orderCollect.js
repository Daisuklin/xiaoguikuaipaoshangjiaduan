var appUtil = require("../../../utils/appUtil.js")
var formart = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showOrderNumList:false,
    inputValue: "",
    name:"",
    goodsCount:0,
    orderNums:null,
    extend_order_goods:[]
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
    var thisPage = this;
    appUtil.controllerUtil.getPickingOrderInAll({
      store_id: appUtil.appUtils.getMemberInfoData().store_id,
      audit_status: 1,
      isCollect: 1
    }, function (res) {
      if (res.data.succeeded) {
        var  text=""
        res.data.data.orderIdList.forEach(function(t){
          text = text + '<h5 style="font-size:4vw; line-height:7vw;">' + t +'</h5>'
        })

        thisPage.setData({
          name:res.data.data.name,
          goodsCount: res.data.data.goods_count,
          orderNums: text,
          extend_order_goods: res.data.data.extend_order_goods
        })
       
        if (thisPage.data.extend_order_goods==null){
          return false;
        } 
        thisPage.data.extend_order_goods.forEach(function (good) {
          good['checkCount'] = 0;
        })
        thisPage.setData({
          extend_order_goods: thisPage.data.extend_order_goods
        })

      }
    })
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

  },
  more:function(){
      
  },
  showOrderNumWindow:function(){
    this.setData({
      showOrderNumList: !this.data.showOrderNumList
    })
  }
  ,addOrderGoodCheckCount: function (barCode, count) {
    var orderInfo = this.data;
    orderInfo.extend_order_goods.forEach(function (good) {
      if (good.goods_barcode == barCode) {
        if (good.checkCount < good.goods_num) {
          good.checkCount = ((good.goods_num > (good.checkCount + count)) ? (good.checkCount + count) : good.goods_num);
        } else {
          wx.showToast({
            icon: "loading",
            title: '该商品数量已够，无法继续添加！',
          })
        }
      }

      
    })
    this.setData({
      extend_order_goods: orderInfo.extend_order_goods
    })

    // console.info(JSON.stringify(this.data.order.extend_order_goods))
  },
  submitBarCodeBtn: function () {
    var barCode = this.data.inputValue;
    this.addOrderGoodCheckCount(barCode, 1)
    this.setData({
      inputValue: null
    });
  },
  SearchQrCode: function (e) {
    console.info("商品扫码")
    wx.scanCode({
      // onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        if (res.errMsg == "scanCode:ok") {
          this.addOrderGoodCheckCount(res.result, 1)
        }

      }
    })
  }, changeOrderStatus: function (e) {
    var allCheckOk = true;
    this.data.order.extend_order_goods.forEach(function (good) {
      if (good.checkCount != good.goods_num) {
        allCheckOk = false;
      }
    })
    if (!allCheckOk) {
      wx.showToast({
        icon: "loading",
        title: '单个商品数有误！',
      })
      return false;
    }
    var newObject = new Object();
    newObject.order_id = this.data.order.order_id
    newObject.order_sn = this.data.order.order_sn
    var goodList = new Array();


    this.data.order.extend_order_goods.forEach(function (g) {
      var newGood = new Object();
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
          title: '订单提交到验货流程成功！',
        })
      } else {
        wx.showToast({
          icon: "loading",
          title: '订单提交到验货流程失败！',
        })
      }
    })


  }
})