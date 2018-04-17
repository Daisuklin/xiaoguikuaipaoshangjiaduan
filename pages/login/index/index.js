// pages/login/index/index.js
var appUtil=require("../../../utils/appUtil.js")

var app = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null
  },

  /** 5
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (appUtil.appUtils.getTokenData()){
      wx.redirectTo({
        url: '../../index/index',
      })
    }
    app = getApp();
    wx.login({
      success: res => {
        console.info(res);
        if (res.code) {
          //发起网络请求
          console.info("code:res.code" + res.code)
          
          appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
            console.info(JSON.stringify(res))
            appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
            appUtil.appUtils.setOpenIdData(res.data.data.openid);
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        console.info(JSON.stringify(res));

      }
    })
   
   // console.info(appUtil)
    // if (appUtil.appUtils.getStorageUser()!=null){
    //   wx.navigateBack();
    // }
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
  /**
   * 用户点击授权登录
   */
  ,getUserInfo:function(e){
    wx.showLoading({
      title: '登录中',
    })
    //得到微信返回用户信息
    if (e.detail.userInfo){
      //缓存微信用户
      appUtil.appUtils.setStorageUser(e.detail.userInfo);
      //缓存微信用户encryptedData
      appUtil.appUtils.setEncryptedData(e.detail.encryptedData)
      
      //解码encryptedData
      appUtil.controllerUtil.getDemodifier({
        "encryptedData": e.detail.encryptedData,
        "iv": e.detail.iv,
        "sessionKey": appUtil.appUtils.getSessionkeyData()
      },function(data){
        appUtil.appUtils.setUnionIdData(data.data.unionId);
        if (data.data.unionId==null){
          wx.hideLoading();
          wx.showToast({
            title: '网络链接太差！',
            icon: "loading"
          })
          wx.login({
            success: res => {
              console.info(res);
              if (res.code) {
                //发起网络请求
                console.info("code:res.code" + res.code)

                appUtil.controllerUtil.getUserOpenIdController({ code: res.code }, function (res) {
                  console.info(JSON.stringify(res))
                  appUtil.appUtils.setSessionkeyData(res.data.data.session_key);
                  appUtil.appUtils.setOpenIdData(res.data.data.openid);
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
              console.info(JSON.stringify(res));

            }
          })
          return false;
        }
        //查询店铺是否有当前员工
        appUtil.controllerUtil.getMemberInfoController(
          { "unionId": data.data.unionId, "isStore": 1 },function(dt){
            if (dt.data.succeeded){
              appUtil.appUtils.setMemberInfoData(dt.data.data.shopncStoreMember)
              //登录    
              appUtil.controllerUtil.login(
                {
                  "isStore": "1",
                  "openId": appUtil.appUtils.getOpenIdData(),
                  "type": "wechat",
                  "client": "web",
                  "sourceWechat": "wxapp",
                  "unionId": appUtil.appUtils.getUnionIdData()
                }
                , function (data) {
                  //console.info(JSON.stringify(data.data));
                  if (data.data.succeeded == false && data.data.error.code == 1000) {
                    //判断是否已经绑定过电话号码的用户
                    appUtil.appUtils.setBlackUser(data.data.data);
                    wx.navigateTo({
                      url: '../bindPhone/bindPhone'
                    })
                  } else {
                    appUtil.appUtils.setBlackUser(data.data.data);
                    appUtil.controllerUtil.getUserTokenController({
                      unionId: appUtil.appUtils.getUnionIdData(),
                      isStore: 1
                    }, function (res) {
                      appUtil.appUtils.setTokenData(res.data.data.shopncMember.member_token);
                      wx.redirectTo({
                        url: '../../index/index',
                      })
                    })
                  }
                }
              ) 
            }else{
              wx.hideLoading();
              wx.showToast({
                title: '系统没该员工！',
                icon:"loading"
              })
              return false;
            }
           
          }
        )
        
      })

     
    }else{
      wx.hideLoading();
    } 
  }
})