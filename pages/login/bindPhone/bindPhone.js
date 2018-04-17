// pages/login/bindPhone/bindPhone.js
var appUtil = require("../../../utils/appUtil.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:null,
    sendBtntext:"获取验证码",
    validateCode:"",
    time:60,
    disabled:false
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
    console.info("onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.info("onHide")
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
  ,sendMessage:function(e){
    var thisPage=this;
    if (thisPage.data.phone == null || thisPage.data.phone == ""){
      wx.showToast({
        title:"电话号码为空！",
        icon:"loading"
      })
      return false;
    }
  
    appUtil.controllerUtil.sendValidate({
      mobile: this.data.phone,
      type:"bind"
    },function(data){
      thisPage.changeValidateMessage(thisPage.data.time)
    })
  },
  changeValidateMessage:function(time){
    var thisPage=this;
    thisPage.setData({
      disabled:true
    })
    thisPage.data.time = time;
    if(time!=0){
      thisPage.data.time = thisPage.data.time-1;
      console.info("倒计时(" + thisPage.data.time + ")")
     // thisPage.data.sendBtntext = "倒计时(" + thisPage.data.time +")";
      thisPage.setData({
        sendBtntext: "倒计时(" + thisPage.data.time + ")"
      })
      setTimeout(function(){
        thisPage.changeValidateMessage(thisPage.data.time)
      }, 1000);
     
    }else{
      thisPage.setData({
        disabled: false,
        sendBtntext: "获取验证码",
        time: 60,
      })
      
    }
  },
  sumbitValidate:function(e){
    var validateCode=this.data.validateCode;
    var phone = this.data.phone;
     
    
    appUtil.controllerUtil.bindMobile({
      "code": validateCode,
      "client":"web",
      "mobile": phone,
      "openId": appUtil.appUtils.getOpenIdData(),
      "unionId": appUtil.appUtils.getUnionIdData()
    }, function (data) {
      console.info(JSON.stringify(data))
      if (data.succeeded==true){
        appUtil.appUtils.setBlackUser(data.data.data);
        appUtil.controllerUtil.getUserTokenController({
          unionId: appUtil.appUtils.getUnionIdData(),
          isStore: 1
        }, function (res) {
          appUtil.appUtils.setTokenData(res.data.data.member.member_token);
          wx.navigateTo({
            url: '../../index/index',
          })
        })
      }else{
        wx.showToast({
          title: data.message.descript,
          icon: "loading"
        })
        return false;
      }
     
    })
  }
  ,setInputPhon:function(e){
    this.setData({
      phone: e.detail.value
    })
  }
  , setInputValidateCode:function(e){
    this.setData({
      validateCode: e.detail.value
    })
  }
})