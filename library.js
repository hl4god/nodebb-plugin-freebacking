"use strict";
var User = module.parent.require('./user'),
    db = module.parent.require('./database'),
    meta = module.parent.require('./meta'),
    nconf = module.parent.require('nconf'),
    async = module.parent.require('async'),
    request = module.parent.require('request'),
    fs = require("fs"),
    hole = nconf.get("hole")
    holeSite = hole.holeSite,
    creditUrl = hole.creditUrl,
    pfsFile = hole.pfsFile,
    pfsPwd = hole.pfsPwd,
    Plugin ={};

// 奖励威望值时 ，同时在平台上奖励积分
//plugins.fireHook('action:rewards.award:' + reward.rid, {uid: uid, reward: rewardData[rewards.indexOf(reward)]});
Plugin.award = function(params,callback){
  //用户UID
  console.log("params 20:",params);
  console.log("callback 20:",callback);
 var uid = params.uid;
 var credit = params.reward;

 awardCredit({uid:uid,credit:credit},function(err){
   if(callback){
     callback(err);
   }
 });
};

function awardCredit(body,callback){
  request({
    method:'POST',
    baseUrl:holeSite,
    url:creditUrl,
    json:true,
    body:body,
    agentOptions:{
      pfx:fs.readFileSync(pfsFile),
      passphrase:pfsPwd,
      securityOptions: 'SSL_OP_NO_SSLv3'
  }
},function(err, httpResponse, res){
  if(err){
    return callback(err);
  }
  callback(null,body);
  });
}
