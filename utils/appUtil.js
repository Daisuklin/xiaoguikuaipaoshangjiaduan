const requestUrlList=()=> {
  var logisticsUrl = 'https://logistics.xiaoguikuaipao.com/'
  var requestUrl = 'https://api.xiaoguikuaipao.com/'
 
  var captcha = logisticsUrl + "api/v1/captcha";  //短信验证码接口 
  var login = logisticsUrl + "api/v1/users/auth/unionLogin";  //登陆接口 post password username
  var bindMobile = logisticsUrl + "api/v1/users/bind/mobile";  /*绑定手机接口 { "code": "string", "mobile": "string", "openId": "string","unionId": "string" }*/


  var userInfoByEncryptedDataUrl = requestUrl + "api/v1/wxapp/storeUserInfo";  //商家版解密获取用户信息EncryptedData
  var tokenUrl = requestUrl + "api/v1/shopMc/memberInfo";  //商店信息
  var goodsList = requestUrl + "api/v1/good/list";//登陆商品列表接口 
  var code2session = requestUrl + "api/v1/wxapp/storeCode2session";  //商家版得到用户 unionid 
  var memberInfo = requestUrl + "api/v1/shopMc/memberInfo";  //微信unionId获取member信息 {"unionId":"","isStore":""}
/***业务接口 */
  var memberOffLinePickOrders = requestUrl + "api/v1/shopMc/memberOffLinePickOrders"  //商家拣货验货列表:packer(检货人)，auditer(验货人)可选
  var pickOrderStatus = requestUrl + "api/v1/shopMc/pickOrderStatus" // 拣货验货状态修改
  var pickingOrderInAll = requestUrl + "api/v1/shopMc/pickingOrderInAll" // 返回拣货员汇总
  var pickOrderDetail = requestUrl + "api/v1/shopMc/pickOrderDetail" // 拣货验货订单详情(小程序用)
  var checkOrder = requestUrl + "api/v1/shopMc/checkOrder" // 拣货提交w完成
  var serialOrder = requestUrl + "api/v1/shopMc/serialOrder" // 拣货提交w完成
  var orders = requestUrl + "api/v1/shopMc/orders" // 进行中
  var cancelPickOrder = requestUrl + "api/v1/shopMc/cancelPickOrder" // 取消订单

  return {
    userInfoByEncryptedDataUrl: userInfoByEncryptedDataUrl,
    goodsListUrl: goodsList,
    loginUrl: login,
    tokenUrl: tokenUrl,
    captchaUrl: captcha,
    code2sessionUrl:code2session,
    memberInfo: memberInfo,
    bindMobileUrl: bindMobile,
    memberOffLinePickOrders: memberOffLinePickOrders,
    pickOrderStatus: pickOrderStatus,
    pickOrderDetail: pickOrderDetail,
    pickingOrderInAll: pickingOrderInAll,
    checkOrder: checkOrder,
    serialOrder: serialOrder,
    orders: orders,
    cancelPickOrder: cancelPickOrder,
  }
}

const controllerUtil={
  login:(paras,callback)=>{
    //请求登陆接口
    wx.request({
      url: requestUrlList().loginUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success:function(data){
        callback(data);
      }
    })
  },
  getUserTokenController:(paras,callback)=>{
    //请求token
    wx.request({
      url: requestUrlList().tokenUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success:function(data){
        callback(data);
      }
    })
  },
  getMemberInfoController:(paras,callback)=>{
    //请求token
    wx.request({
      url: requestUrlList().memberInfo,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success:function(data){
        callback(data);
      }
    })
  },
  sendValidate:(paras,callback)=>{
    //发送验证码
    wx.request({
      url: requestUrlList().captchaUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }
    })
  },
  getDemodifier:(paras,callback)=>{
    //解码Unicode
    wx.request({
      url: requestUrlList().userInfoByEncryptedDataUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }
    })
  },
  bindMobile: (paras, callback) => {
    //解码Unicode
    wx.request({
      url: requestUrlList().bindMobileUrl,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
      },
      success: function (res) {
        callback(res.data);
      }
    })
  }, 
  getUserOpenIdController: (paras, callback)=>{
    wx.request({
      url: requestUrlList().code2sessionUrl,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web'
      },
      success: function (res) {
        callback(res)
      }
    });
  },
  /**业务接口  begin**/
  getMemberOffLinePickOrders: (paras, callback) => {
    //audit_status   0.未捡货，1。检货中 2.待验货 3.已验货
    //unionid:  登陆用户Id
    //store_id  商店号
    //currentPage  当前页 1开始
    //isCollect:1 
    wx.request({
      url: requestUrlList().memberOffLinePickOrders,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
        
      }
    });
  },
  getOrders: (paras, callback) => {
    //currentPage  当前页 1开始
    wx.request({
      url: requestUrlList().orders,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  getPickingOrderInAll: (paras, callback) => {
    wx.request({
      url: requestUrlList().pickingOrderInAll,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  setPickOrderStatus: (paras, callback) => {
    //order_sn  订单号
    //"audit_status":1, 0.未捡货，1。检货中 2.待验货 3.已验货
    //"type":1 1表示检货修改，2表示验货状态修改
    wx.request({
      url: requestUrlList().pickOrderStatus,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  setCancelPickOrder: (paras, callback) => {
    //order_sn  订单
    wx.request({
      url: requestUrlList().cancelPickOrder,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web'
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  setCheckOrder: (paras, callback) => {
    //order_sn  订单号
    //"audit_status":1, 0.未捡货，1。检货中 2.待验货 3.已验货
    //"type":1 1表示检货修改，2表示验货状态修改
    wx.request({
      url: requestUrlList().checkOrder,
      data: paras,
      method: "post",
      header: {
        'content-type': 'application/json', // 默认值
        shopMcAuthorization: appUtils.getTokenData(),
        'api': 'web'
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  pickOrderDetail: (paras, callback) => {
    //order_sn  订单号
    wx.request({
      url: requestUrlList().pickOrderDetail,
      data: paras,
      method: "get",
      header: {
        'content-type': 'application/json', // 默认值
        'api': 'web',
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    });
  },
  getSerialOrder: (paras, callback) => {
    //解码Unicode
    wx.request({
      url: requestUrlList().serialOrder,
      data: paras,
      method: "POST",
      header: {
        'content-type': 'application/json',// 默认值
        "api": "web",
        shopMcAuthorization: appUtils.getTokenData()
      },
      success: function (res) {
        if (typeof (res.data.error) != 'undefined' && res.data.error != null && res.data.error.code == '401') {
          wx.showToast({
            title: '登录失效',
            icon: "loading",
            duration: 800,
          })
          setTimeout(function () {
            wx.clearStorage("token");
            wx.clearStorage("blackUserInfo")
            wx.reLaunch({
              url: '/pages/login/index/index',
            })
          }, 1000);
        } else {
          callback(res)
        }
      }
    })
  },
  /**业务接口  end**/


}


const appUtils={
  getBlackUser: () => {
    //返回平台用户信息
    return (undefined != typeof (wx.getStorageSync("blackUserInfo")) && wx.getStorageSync("blackUserInfo") != null) ? wx.getStorageSync("blackUserInfo") : null;
  },
  setBlackUser: val => {
   //设置平台用户信息
    wx.setStorageSync("blackUserInfo", val);
  }
  ,
  getStorageUser:()=>{
    //得到本地保存的用户信息，拿去不到为null
    return (undefined != typeof (wx.getStorageSync("userInfo")) && wx.getStorageSync("userInfo")!= null) ? wx.getStorageSync("userInfo"):null;
  },
  setStorageUser: val => {
    //保存的用户信息
    wx.setStorageSync("userInfo", val);
  }
  , setEncryptedData: val => {
    //保存的用户加密信息 
      wx.setStorageSync("encryptedData", val);
  }
  , getEncryptedData: () => {
    //得到的用户加密信息
    return (undefined != typeof (wx.getStorageSync("encryptedData")) && wx.getStorageSync("encryptedData") != null) ? wx.getStorageSync("encryptedData") : null;
  }
  , setUnionIdData: val => {
    //保存的unionid
    wx.setStorageSync("unionid", val);
  }
  , getUnionIdData: () => {
    //得到的用户unionid
    return (undefined != typeof (wx.getStorageSync("unionid")) && wx.getStorageSync("unionid") != null) ? wx.getStorageSync("unionid") : null;
  }
  , setOpenIdData: val => {
    //保存的openid
    wx.setStorageSync("openid", val);
  }
  , getOpenIdData: () => {
    //得到的用户openid
    return (undefined != typeof (wx.getStorageSync("openid")) && wx.getStorageSync("openid") != null) ? wx.getStorageSync("openid") : null;
  }, 
  setSessionkeyData: val => {
    //保存的sessionkey
    wx.setStorageSync("sessionkey", val);
  }
  , getSessionkeyData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("sessionkey")) && wx.getStorageSync("sessionkey") != null) ? wx.getStorageSync("sessionkey") : null;
  },
  setTokenData: val => {
    //保存的sessionkey
    wx.setStorageSync("token", val);
  }
  , getTokenData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("token")) && wx.getStorageSync("token") != null) ? wx.getStorageSync("token") : null;
  },
  setMemberInfoData: val => {
    //保存的sessionkey
    wx.setStorageSync("memberInfo", val);
  }
  , getMemberInfoData: () => {
    //得到的用户sessionkey
    return (undefined != typeof (wx.getStorageSync("memberInfo")) && wx.getStorageSync("memberInfo") != null) ? wx.getStorageSync("memberInfo") : null;
  }
}

module.exports = {
  appUtils: appUtils,
  ajaxUrls: requestUrlList,
  controllerUtil: controllerUtil
}