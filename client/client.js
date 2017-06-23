//import { TAPi18n } from 'meteor/tap:i18n';
//import { HTTP } from 'meteor/http'
//var http = require('http');
const serverUrl = "http://127.0.0.1";

if(Meteor.isClient) {
    //Router.route('/',function(){
    //    this.render('Home', {data: {title: 'Home'}});
    //});
    Router.configure({
  	// the default layout
  		layoutTemplate: 'mainNav'
	  });
	
    Router.route('/', function () {
  		this.render('firstPage');
  		this.layout('mainNav');
	  });
 
	  Router.route('/second', function () {
  		this.render('secondPage');
  		this.layout('mainSide');
	  });

    var getData = {
       data: {
          "url": serverUrl//"http://localhost"
       }
    }

    var config = {
      "appId": "wxfb9fe9700108fe06",
      success: function() {
        console.log('success');
        var w = this;
        var img = 'http://pic1.ooopic.com/uploadfilepic/shiliang/2009-10-05/OOOPIC_00cyl_20091005e2c6eb1c889e342e.jpg';
        //sugar method
        w.shareOnMoment({
          title: 'test title',
          type: 'link',
          success: function() {
            console.log('share on moment success');
          },
          cancel: function() {
            console.log('share on moment canceled');
          },
          imgUrl: img
        });

        //or call directly
        w.callWechatApi('onMenuShareAppMessage', {
          title: 'test title',
          type: 'link',
          desc: 'share description',
          success: function() {
            console.log('share on chat success');
          },
          cancel: function() {
            console.log('share on chat canceled');
          },
          imgUrl: img
        });
      },
      error: function(err) {
        console.error(err)
      },
      debug: true
    };

    $.ajax({
      type: 'GET',
      url: 'http://127.0.0.1/restapi/getSignature',
      dataType: 'text',
      data: {
        url: serverUrl//"http://localhost"
      },
      success: function(data) {
        signature = data; 
        console.log("signature is:", signature);
        config.nonceStr = data.nonceStr;
        config.signature = data.signature;
        config.timestamp = data.timestamp;
        config.jsApiList = ['hideMenuItems', 'onMenuShareTimeline', 'chooseCard', 'addCard', 'openCard'];
        window.wechatObj = new WechatJSSDK(config); 
      }
    });


  Meteor.call('getSignature', {
      url: 'http://127.0.0.1'
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // success!
        console.log("return val is: ", JSON.stringify(res));
      }
    });

    Template.firstPage.events({
        'click #login': function (e,t) {
          console.log("click wechat login");
          Meteor.call('getOath', {
              }, (err, res) => {
                if (err) {
                  console.log(err);
                } else {
                  // success!
                  console.log("return val is: ", res);
                  window.location.href = res;
                }
          });
        }
    })    
}