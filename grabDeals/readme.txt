Please do the following before emulating.

step 1)cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin/ --variable APP_ID="823958557725473" --variable APP_NAME="grabDeals"
step 2)cordova plugin add cordova-plugin-inappbrowser
step 3)cordova plugin add org.apache.cordova.splashscreen
step 4)replace my www folder and config.xml
step 5)cordova platform add android
step 6)cordova emulate android

PS: My facebook-share implementation finally worked. I had to change the hash-key in the developer.facebook.com website.And lo! it started working.
