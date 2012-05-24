### LoginSinaWB
  
#### usage

````js
var LoginSinaWB = require('LoginSinaWB');

LoginSinaWB.login(username,password,function(err,browser){
   browser.visit('http://weibo.com',function(){
       browser.wait(function(){
          console.log(browser.location.href); 
       });    
   }); 
});
````
  
#### dependent
  sha1
  zombie
