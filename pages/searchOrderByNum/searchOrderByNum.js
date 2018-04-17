var appUtil = require("../../utils/appUtil.js")
var formart = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    order: {}
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
    console.info(options.id)
    appUtil.controllerUtil.pickOrderDetail({
      "order_id": Number(options.id)
      ,"bingYanHuo":1,
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

      }else{
        wx.showLoading({
          title: '订单码无效！',
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
  onShow: function (options) {
    //this.onLoad(options);
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
  addOrderGoodLongTap: function (barCode) {
    var orderInfo = this.data.order;
    orderInfo.extend_order_goods.forEach(function (good) {
      if (good.goods_barcode == barCode) {
        good.checkCount = good.goods_num;
        good.isLongTap = 1;  
      }
    })
    this.setData({
      order: orderInfo
    })
  },
  removeOrderGoodLongTap: function (barCode) {
    var orderInfo = this.data.order;
    orderInfo.extend_order_goods.forEach(function (good) {
      if (good.goods_barcode == barCode) {
        good.checkCount = 0;
        good.isLongTap = undefined;
      }
    })
    this.setData({
      order: orderInfo
    })
  },
  addOrderGoodCheckCount: function (barCode, count) {
    var orderInfo = this.data.order;
    orderInfo.extend_order_goods.forEach(function (good) {
      if (good.goods_barcode == barCode) {
        if (good.checkCount < good.goods_num) {
          good.checkCount = ((good.goods_num > (good.checkCount + count)) ? (good.checkCount + count) : good.goods_num);
        } else {
          wx.showToast({
            icon: "loading",
            title: '商品数量已够!',
          })
        }
      }
    })
    this.setData({
      order: orderInfo
    })
  },
  submitBarCodeBtn: function () {
    var barCode = this.data.inputValue;
    this.addOrderGoodCheckCount(barCode, 1)
    this.setData({
      inputValue: null
    });
  },
  longTapBtn:function(e){
    var thisPage=this;
    var　event=e;
    wx.showModal({
      title: '提示',
      content: '是否直接审核通过！',
      success: function (res) {
        if (res.confirm) {
          thisPage.addOrderGoodLongTap(event.target.dataset.barcode)
        } else if (res.cancel) {
          thisPage.removeOrderGoodLongTap(event.target.dataset.barcode)
        }
      }
    })
  
    
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
      newGood.isLongTap = g.isLongTap;
      goodList.push(newGood)
    })

    newObject.extend_order_goods = goodList;
    console.info("newObject:" + JSON.stringify(newObject))
    
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
    wx.showModal({
      title: '提示',
      content: '确认提交订单？',
      success: function (res) {
        if (res.confirm) {
          appUtil.controllerUtil.setCheckOrder(JSON.parse(json_data), function (res) {
            if (res.data.succeeded) {
              wx.showToast({
                duration: 5000,
                title: '订单成功提交！',
                complete: function () {
                  wx.navigateBack({})
                }
              })

            } else {
              wx.showToast({
                icon: "loading",
                title: '订单提交失败！',
              })
            }
          }) 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
    

  }, changeZiTiOrderStatus: function (e) {
    var newObject = new Object();
    newObject.order_id = this.data.order.order_id
    newObject.order_sn = this.data.order.order_sn
    var goodList = new Array();
    this.data.order.extend_order_goods.forEach(function (g) {
      var newGood = new Object();
      newGood.goods_id = g.goods_id;
      newGood.goods_num = g.goods_num;
      newGood.checkCount = g.checkCount;
      newGood.isLongTap = g.isLongTap;
      goodList.push(newGood)
    })

    newObject.extend_order_goods = goodList;
    console.info("newObject:" + JSON.stringify(newObject))

    var newObject = new Object();
    newObject.order_id = this.data.order.order_id
    newObject.order_sn = this.data.order.order_sn
    var goodList = new Array();
    this.data.order.extend_order_goods.forEach(function (g) {
      var newGood = new Object();
      newGood.goods_id = g.goods_id;
      newGood.goods_num = g.goods_num;
      newGood.checkCount = g.goods_num;
      goodList.push(newGood)
    })

    newObject.extend_order_goods = goodList;
    var json_data = JSON.stringify(newObject);

    appUtil.controllerUtil.setCheckOrder(JSON.parse(json_data), function (res) {
      if (res.data.succeeded) {
        wx.showToast({
          duration:5000,
          title: '订单成功提交！',
          complete: function () {
            wx.navigateBack({})
          }
        })

      } else {
        wx.showToast({
          icon: "loading",
          title: '订单提交失败！',
        })
      }
    })

  }
})