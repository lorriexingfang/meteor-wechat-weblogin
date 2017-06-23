const serverUrl = "http://127.0.0.1/";
var wx;

if(Meteor.isServer) {
    Meteor.startup(function () {
        const Wechat = require('./lib/wechat-lib');
        const path = require("path");
        const http = require("http");
        const debug = require('debug')('wechat');

        const cookieParser = require('cookie-parser');
        
        const MongoStore = Wechat.MongoStore;
        const FileStore = Wechat.FileStore;

        wx = new Wechat({
            "wechatToken": "hello2017",
            "appId": "wxfb9fe9700108fe06",
            "appSecret": "a30a4e32fe4307fbc068474ca924d2a9",
            "wechatRedirectUrl": serverUrl + "oauth",
            // store: new MongoStore({limit: 5}),
            store: new FileStore({interval: 1000 * 60 * 3}),
        });
    });

 /*   
      const wx = new JSSDK({
          "wechatToken": "hello2017",
          "appId": "wxfb9fe9700108fe06",
          "appSecret": "a30a4e32fe4307fbc068474ca924d2a9",
          "wechatRedirectUrl": "http://127.0.0.1/oauth",
          // store: new MongoStore({limit: 5}),
          store: new FileStore({interval: 1000 * 60 * 3}),
      });

      const path = Meteor.npmRequire("path");
      const http = Meteor.npmRequire("http");
      const cookieParser = Meteor.npmRequire('cookie-parser');
  
      //const MongoStore = Wechat.MongoStore;
      const FileStore = wx.store;
*/    

/*
    Router.route('/restapi/getSignature',{where: 'server'})
    .get(function() {
        var url = this.request.query.url;
        wx.jssdk.getSignature(url).then((data) => {
            console.log('OK', data);
            return this.response.end(JSON.stringify(data));
        }, (reason) => {
            console.error(reason);
            return this.response.end(JSON.stringify(reason));
        });
    })
*/

    Router.route('/oauth',{where: 'server'})
    .get(function() {       
        var code = this.request.query.code;
        var openid = null;
        var response = this.response;

        wx.oauth.getUserInfo(code, openid)
        .then(function(userProfile) {
            var userOpenid = userProfile.openid;
            var wechatInfo = JSON.stringify(userProfile);
            console.log("user profile is: ", wechatInfo);
            //set openid to session to use in following request
            var setLocalStorage = 'localStorage.setItem("existOpenId", "'+userOpenid+'");';
            response.end('<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.0, user-scalable=no"><title>succssfully log into </title></head><body><div><div class="head"><strong>Please wait...</strong></div></div><div style="display:none;"><h2>User profile:</h2><p>'+wechatInfo+'</p><p><a id="backToHome" href="http://127.0.0.1/">Back to the post</a></p><script>'+setLocalStorage+'document.getElementById("backToHome").click();</script></div></body>');
            //response.end('<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.0, user-scalable=no"><title>succssfully log into </title></head><body><div><div class="head"><strong>Please wait...</strong></div></div><div style="display:none;"><h2>User profile:</h2><p>'+wechatInfo+'</p><p><a id="backToHome" href="http://127.0.0.1/">Back to the post</a></p><script>localStorage.setItem("_wechat_openid", '+userProfile.openid+');document.getElementById("backToHome").click();</script></div></body>');
        });
    })

    Meteor.methods({
        /*Method call for get signature*/
        /*
        getSignature: function(data) {
          this.unblock();
          return Meteor.wrapAsync(function(callback) {
              wx.jssdk.getSignature(data.url).then((result) => {
                  console.log('OK', result);
                  callback && callback(null, result);
              }, (reason) => {
                  console.error(reason);
                  callback && callback(null, result);
              });
          })();
        },
        */
        getOathCache: function(data) {
            this.unblock();
            return Meteor.wrapAsync(function(callback) {
                //wx.oauth.getUserInfo(null, "1234") // for testing openid expires purpose
                wx.oauth.getUserInfo(null, data.openid)
                .then(function(userProfile) {
                    console.log(JSON.stringify(userProfile));
                    callback && callback(null, userProfile);
                }).catch(reason => {
                    //need to get new code
                    console.log("openid is expired: " + reason);
                    callback && callback(null, "newcode");
                });
            })();
        },
        getOath: function() {
            this.unblock();
            return Meteor.wrapAsync(function(callback) {
                const oauthUrl = wx.oauth.snsUserInfoUrl;
                callback && callback(null, oauthUrl);
            })();
        }
    })
}