const serverUrl = "http://127.0.0.1";

if(Meteor.isClient) {
    Router.configure({
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

/* This is for using client side sdk code. To use it, pls put it in Meteor.startup() function

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

    var getData = {
       data: {
          "url": serverUrl//"http://localhost"
       }
    }

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
*/

/*
    Meteor.call('getSignature', {
      url: 'http://127.0.0.1'
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // success!
        console.log("return val is: ", JSON.stringify(res));
        //localStorage.setItem("test_signature", JSON.stringify(res.signature));        
        config.nonceStr = res.nonceStr;
        config.signature = res.signature;
        config.timestamp = res.timestamp;
        config.jsApiList = ['hideMenuItems', 'onMenuShareTimeline', 'chooseCard', 'addCard', 'openCard'];
        window.wechatObj = new WechatJSSDK(config); 
      }
    });
*/
    Template.firstPage.events({
        'click #login': function (e,t) {
            console.log("click wechat login");
            var curOpenId = localStorage.getItem("existOpenId");

            if (curOpenId && curOpenId != null) {
                console.log("it exists");
                Meteor.call('getOathCache', {
                    openid: curOpenId
                }, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("return val is: ", res);
                        Router.go("/")
                    }
                });
            } else {
                Meteor.call('getOath', (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("return val is: ", res);
                        window.location.href = res;
                    }
                });
            }
        }
    })    
}