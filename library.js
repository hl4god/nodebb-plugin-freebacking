"use strict";
var User = module.parent.require('./user'),
    db = module.parent.require('./database'),
    meta = module.parent.require('./meta'),
    nconf = module.parent.require('nconf'),
    async = module.parent.require('async'),
    request = module.parent.require('request'),
    fs = require("fs"),
    hole = nconf.get("hole"),
    holeSite = hole.holeSite,
    creditUrl = hole.creditUrl,
    pfxFile = hole.pfxFile,
    pfxPwd = hole.pfxPwd,
    Plugin ={};

// 奖励威望值时 ，同时在平台上奖励积分
//plugins.fireHook('action:rewards.award:' + reward.rid, {uid: uid, reward: rewardData[rewards.indexOf(reward)]});
Plugin.award = function(params,callback){
  //params 124: { uid: 2, reward: { reputation: '1' } }
//  console.log("params 20:",params);
 var uid = params.uid;
 var credit = parseInt(params.reward.reputation);
 User.getUserFields(uid,['username'],function(err,user){
   if(err && callback){
     return callback(err);
   }
   awardCredit({uid:user.username,credit:credit},function(err){
     if(callback){
       callback(err);
     }
   });
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
      pfx:fs.readFileSync(pfxFile),
      passphrase:pfxPwd,
      securityOptions: 'SSL_OP_NO_SSLv3'
  }
},function(err, httpResponse, res){
  if(err){
    return callback(err);
  }
  console.log('nodebb-plugin-freebacking res51:',res);
  callback(null,res);
  });
}

module.exports = Plugin;
