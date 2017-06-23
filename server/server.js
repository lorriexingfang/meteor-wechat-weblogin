const serverUrl = "http://127.0.0.1";

if(Meteor.isServer) {
   // When Meteor starts, create new collection in Mongo if not exists.
    //Meteor.startup(function () {
    
        const Wechat = require('./lib/wechat-lib');
        const path = require("path");
        const http = require("http");
        const debug = require('debug')('wechat');

        const cookieParser = require('cookie-parser');
        
        const MongoStore = Wechat.MongoStore;
        const FileStore = Wechat.FileStore;

        const wx = new Wechat({
          "wechatToken": "hello2017",
          "appId": "wxfb9fe9700108fe06",
          "appSecret": "a30a4e32fe4307fbc068474ca924d2a9",
          "wechatRedirectUrl": "http://127.0.0.1/oauth",
          // store: new MongoStore({limit: 5}),
          store: new FileStore({interval: 1000 * 60 * 3}),
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

    Router.route('/restapi/getSignature',{where: 'server'})
    .get(function() {
        var url = this.request.query.url;
        wx.jssdk.getSignature(url).then((data) => {
            console.log('OK', data);
            //res.json(data);
            //return this.response.end(res.json(data));
            return this.response.end(JSON.stringify(data));
        }, (reason) => {
            console.error(reason);
            //return this.response.end(res.json(reason));
            return this.response.end(JSON.stringify(reason));
        });
    })

    Router.route('/oauth',{where: 'server'})
    .get(function() {       
        var code = this.request.query.code;
        //set session's openid to: var openid = this.request.session;
        var openid = this.request.session;
        var response = this.response;

        console.log("open id is : ", openid);
        console.log("code is : ", code);


        wx.oauth.getUserInfo(code, openid)
        .then(function(userProfile) {
          console.log("the user profile is: ", userProfile);

          //set openid to session to use in following request
          //this.request.session.openid = userProfile.openid;
          var wechatInfo = JSON.stringify(userProfile);
          console.log("user profile is: ", wechatInfo);
          //response.end('<head><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style type="text/css">body{margin: 0}\r\n.head{width:100%; height:40px;font-size:16px; line-height:40px; position:fixed; left:0; top:0; border:none; text-align:center; background: #01CEED; z-index: 999;opacity: 0.99;}\r\n.head strong{font-size: 16px; color: #fff}\r\n.pay-return{width: 100%; text-align: center; padding-top: 100px;color: #706B66;}\r\n\r\n.pay-return span{display: block;margin-bottom: 10px;}</style></head><body><div class="pay changePage"><div class="head"><strong>Please wait...</strong></div></div><div style="display:none;"><form id ="oauth2_submit" name="oauth2_submit" method="GET" action="/oauth2/wechat/result"><input name="id" type="text" value="'+id+'" /></form></div><script>document.forms["oauth2_submit"].submit();</script></body>');
          //response.writeHead(302, {'Location': '/'});
          response.end(' <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1.0, user-scalable=no"><title>succssfully log into </title></head><body><h2>User profile:</h2><p>'+wechatInfo+'</p><p><a id="backToHome" href="http://127.0.0.1/">Back to the post</a></p><script>document.getElementById("backToHome").click()</script></body>');
          //});
        });
        //Router.go("/firstPage")
    })




    Meteor.methods({
      getSignature: function(data) {
        this.unblock();
        //console.log("in get-signature func, val is: ",req.query);
        return Meteor.wrapAsync(function(callback) {
            wx.jssdk.getSignature(data.url).then((result) => {
                console.log('OK', result);
                //res.json(data);
                callback && callback(null, result);
                //callback(result;
            }, (reason) => {
                console.error(reason);
                //res.json(reason);
                callback && callback(null, result);
            });
        })();
      },
      getOath: function(data) {
        this.unblock();
        console.log("pass in data");
        return Meteor.wrapAsync(function(callback) {
            //const implicitOAuthUrl = wx.oauth.generateOAuthUrl("http://127.0.0.1/implicit-oauth", "snsapi_base");
            const oauthUrl = wx.oauth.snsUserInfoUrl;
            //const implicitOAuth= implicitOAuthUrl;
            console.log("The oath url is: ", oauthUrl);
            callback && callback(null, oauthUrl);
        })();
      }
    })

}