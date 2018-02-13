
const vm = require('vm');
var webdriver = require('selenium-webdriver'),
by = webdriver.By,
Promise = require('promise'),
settings = require('./settings.json'),
    until = webdriver.until;

var log4js = require('log4js'); 
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('instabot.log'), 'instabot');
var logger = log4js.getLogger('instabot');
logger.setLevel('DEBUG');

var fs = require('fs');
var xpath_first_photo = '//*[@id="react-root"]/section/main/article/div[2]/div[1]/div[1]/div[1]/a/div[1]';

var xpath_like_class = '//div[@id="fb-root"]/following-sibling::div[1]/div/div/following-sibling::div[1]/div/article/div[2]/section[2]/a/span';
var xpath_like_button = '//div[@id="fb-root"]/following-sibling::div[1]/div/div/following-sibling::div[1]/div/article/div[2]/section[2]/a';
//var xpath_nextprev_buttons = '//div[@id="fb-root"]/following-sibling::div[1]/div/div/div/div/*';
///html/body/div[3]/div/div/div[1]/div/div/a[2]
var xpath_nextprev_buttons = '/html/body/div[3]/div/div/div[1]/div/div/a';
var xpath_subscribes_button = '/html/body/span/section/main/article/header/div[2]/ul/li[3]';
var xpath_subscribes_buttons = '//div[@id="fb-root"]/following-sibling::div[1]/div/div/following-sibling::div[1]/div/div[2]/ul/li[1]/div/div';
var xpath_account_name = '/html/body/div[3]/div/div[2]/div/article/header/div[2]/div[1]/div/a';
var browser = new webdriver
    .Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();

var timeunut = require("timeunit");
//browser.manage().timeouts().pageLoadTimeout(10, timeunut.SECONDS);
browser.manage().window().setSize(1200, 700);
browser.get('https://www.instagram.com/accounts/login/');
browser.sleep(settings.sleep_delay);
browser.findElement(by.name('username')).sendKeys(settings.instagram_account_username);
browser.findElement(by.name('password')).sendKeys(settings.instagram_account_password);
browser.findElement(by.xpath('//button')).click();
browser.sleep(settings.sleep_delay).then(function() {
  // like_by_nickname(0);
 like_by_tag(0);
 //like_for_people_by_tag(0);
 //  subscribe_by_tag(0);
//unsubscribe(0);
// unsubscribe2(1);
});

function getRandomInt(min, max) {
 // return Math.floor(Math.random() * (max - min + 1)) + min;
    return Math.random() * (50 - 45) + 45;
}

function like_by_tag(indexTag) {
    if (indexTag >= settings.instagram_tag_to_be_liked.length) {
        logger.info('Everything is done. Finishing...');
        browser.quit();
        return;
    }
    
    var promise = new Promise(function (resolve, reject) {

        var wait = getRandomInt(settings.sleep_min, settings.sleep_max);
    //    browser.sleep(wait);
        
        logger.info('Doing likes for: ' + settings.instagram_tag_to_be_liked[indexTag]);
        browser.get('https://instagram.com/explore/tags/' + settings.instagram_tag_to_be_liked[indexTag]).then(function(){

            browser.wait(until.elementLocated(by.xpath(xpath_first_photo)));
            browser.findElement(by.xpath(xpath_first_photo)).click().then(function () {
                like(resolve, 0, settings.like_depth_per_user);
            });
        });
        

    });
    
    promise.then(function() {
        indexTag++;
        like_by_tag(indexTag);
    });

}

function like_by_nickname(indexNickname) {
    if (indexNickname >= settings.instagram_accounts_to_be_liked.length) {
        logger.info('Everything is done. Finishing...');
        browser.quit();
        return;
    }
    var promise = new Promise(function (resolve, reject) {    
        browser.sleep(settings.sleep_delay);
        logger.info('Doing likes for: ' + settings.instagram_accounts_to_be_liked[indexNickname]);
        browser.get('https://instagram.com/' + settings.instagram_accounts_to_be_liked[indexNickname]);
        browser.sleep(settings.sleep_delay);
        browser.findElement(by.xpath(xpath_first_photo)).click().then(function () {
            like(resolve, 0, settings.like_depth_per_user);
        });
    });
    promise.then(function() {
        indexNickname++;
        like_by_nickname(indexNickname);
    });
};

function like(resolve, index, max_likes) {
    browser.getCurrentUrl().then(function(url) {
        logger.debug('Current url:   ' + url);

        browser.wait(until.elementLocated(by.className('_eszkz _l9yih')));
		
        browser.findElement(by.className('_eszkz _l9yih')).getAttribute('class').then(function(classname) {
            logger.debug('CSS Classname: ' + classname);
			                try{ browser.findElement(by.className('_eszkz _l9yih')).click();}
			                catch (WebDriverException){

                            }
                    browser.sleep(settings.sleep_delay);
          //  if (settings.smart_like_mode && (classname.indexOf('whiteoutSpriteHeartFull') > 0)) {
          //      logger.info('Already liked. Stopping...');
         //       resolve();
         //       return;
         //   } else {
         //       if (classname.indexOf('whiteoutSpriteHeartOpen') > 0) {
         //           browser.findElement(by.xpath(xpath_like_button)).click();
         //           browser.sleep(settings.sleep_delay);
         //       };
                // Analyzing "Next" button availability
            browser.wait(until.elementLocated(by.className('coreSpriteRightPaginationArrow')));
                browser.findElement(by.className('coreSpriteRightPaginationArrow')).then(function(buttons) {
                    logger.debug('Buttons: ' + buttons + ', Photo Index: ' + index);

                        buttons.click().then(function() {
                            // if we exceed maximum likes depth, stop like this current user.

                            logger.debug('fffff');
                            index++;
                            if (index == max_likes) {
                                resolve();
                                return;
                            }
                            like(resolve, index, max_likes);
                        });

                });
         //   }
        });
    });
}

function subscribe_by_tag(indexSubscribe) {
    if (indexSubscribe >= settings.like_depth_per_user) {
        logger.info('Everything is done. Finishing...');
        browser.quit();
        return;
    }

    var promise = new Promise(function (resolve, reject) {

        browser.sleep(settings.sleep_delay);

        browser.get('https://instagram.com/explore/tags/интуитивноепитание');

        var wait = getRandomInt(settings.sleep_min, settings.sleep_max);
        browser.sleep(wait);
        logger.info(wait);

        browser.findElement(by.xpath(xpath_first_photo)).click().then(function () {
            console.log(browser.findElement(by.xpath(xpath_first_photo)));
            subscribe(resolve, 0, settings.like_depth_per_user);
            indexSubscribe++;
        });

    });
    //
    // promise.then(function() {
    //     subscribe_by_tag(indexSubscribe);
    // });

}

function subscribe(resolve, index, max_subscribes){
    browser.getCurrentUrl().then(function(url) {
        logger.debug('Current url:   ' + url);
        browser.sleep(settings.sleep_delay);

        var ah57t = isElementExists(browser, '_ah57t');
        if (ah57t != 0) {
            browser.findElement(by.className('_ah57t')).getAttribute('class').then(function(classname) {
                if (classname.indexOf('_84y62')==0) {
                    logger.info('Already subscribe. Stopping...');
                    browser.findElements(by.xpath(xpath_nextprev_buttons)).then(function (buttons) {
                        logger.debug('Buttons: ' + buttons.length + ', Photo Index: ' + index);
                        if (((index == 0) && (buttons.length == 1)) || (buttons.length == 2)) {
                            buttons[buttons.length - 1].click().then(function () {
                                index++;
                                if (index == max_subscribes) {
                                    resolve();
                                    return;
                                }
                                subscribe(resolve, index, max_subscribes);
                            });
                        } else {
                            logger.info('Next button does not exist. Stopping...');
                            resolve();
                            return;
                        }
                    });
                } else {

                    logger.debug('CLICK SUBSCRIBE BUTTON!');
                    browser.findElement(by.className('_ah57t')).click();
                    browser.findElement(by.className('_4zhc5')).getAttribute('title').then(function(title) {
                        fs.appendFileSync("hello.txt",','+title);
                    });

                    browser.sleep(settings.sleep_delay);

                    browser.findElements(by.xpath(xpath_nextprev_buttons)).then(function (buttons) {
                        logger.debug('Buttons: ' + buttons.length + ', Photo Index: ' + index);
                        if (((index == 0) && (buttons.length == 1)) || (buttons.length == 2)) {
                            buttons[buttons.length - 1].click().then(function () {
                                index++;
                                if (index == max_subscribes) {
                                    resolve();
                                    return;
                                } else {
                                    subscribe(resolve, index, max_subscribes);
                                }

                            });
                        } else {
                            logger.info('Next button does not exist. Stopping...');
                            resolve();
                            return;
                        }
                    });
                }

            });
        }

    });
}

function unsubscribe(i) {
    var fileContent = fs.readFileSync("hello.txt", "utf8");

    var nameArray = fileContent.split(',');

    var promise = new Promise(function (resolve, reject) {

        browser.sleep(settings.sleep_delay);

        logger.info('Unsubscribe of : ' + nameArray[0]);
        browser.get('https://www.instagram.com/' + nameArray[0]);

        var wait = getRandomInt(settings.sleep_min, settings.sleep_max);
        browser.sleep(wait);
        logger.info(wait);

       // var frcv2  = isElementExists(browser, '_frcv2');
        //browser.sleep(wait);
       // logger.info(frcv2);

     //   if (frcv2) {
            browser.findElement(by.className('_frcv2')).getAttribute('class').then(function(classname) {
                if (classname.indexOf('_84y62')>0) {
                    logger.info('Already unsubscribe. Stopping...');
                } else {
                    browser.findElement(by.className('_frcv2')).click();
                    browser.sleep(settings.sleep_delay);
                }

                if (nameArray.length != 1) {
                    nameArray.splice(0,1);
                    fs.writeFileSync("hello.txt",nameArray.join(','));
                    unsubscribe( ++i );
                } else {
                    logger.info('Everything is done. Finishing...');
                    browser.quit();
                    return;
                }
            });

        //} else {
         //   logger.info('Button does not exist.');

           // browser.sleep(settings.sleep_delay);
            //nameArray.splice(0,1);
           // fs.writeFileSync("hello.txt",nameArray.join(','));
           // unsubscribe( ++i );
        //}

    });
}

function isElementExists(browser, classname) {

    try {
        browser.findElements(by.className(classname));
        return true;
    }catch (NoSuchElementException) {
        return false;
    }
}

function unsubscribe2(count){

    var promise = new Promise(function (resolve, reject) {

        browser.get('https://www.instagram.com/tsarevna_laygushka');
        browser.sleep(settings.sleep_delay);
        logger.info('Unsubscribe start');
        var wait = getRandomInt(settings.sleep_min, settings.sleep_max);
        browser.sleep(wait);
        logger.info(wait);

        browser.findElement(by.xpath(xpath_subscribes_button)).click().then(function () {
            browser.sleep(wait);
            browser.findElement(by.xpath(xpath_subscribes_buttons)).getAttribute('class').then(function(classname) {
              //  button.click();
                logger.debug(classname);
            });

        });
    });

}

function like_for_people_by_tag(indexTag){
    if (indexTag >= settings.like_depth_per_user.length) {
        logger.info('Everything is done. Finishing...');
        browser.quit();
        return;
    }

    var promise = new Promise(function (resolve, reject) {

        var wait = getRandomInt(settings.sleep_min, settings.sleep_max);

        logger.info('Doing likes for: ' + settings.instagram_tag_to_be_liked[2]);
        browser.get('https://instagram.com/explore/tags/' + settings.instagram_tag_to_be_liked[2]).then(function(){

            xpath_first_photo = '//*[@id="react-root"]/section/main/article/div[2]/div[1]/div['+(indexTag+1)+']/div[1]/a/div[1]';
            browser.wait(until.elementLocated(by.xpath(xpath_first_photo)));
            browser.findElement(by.xpath(xpath_first_photo)).click().then(function () {

                browser.wait(until.elementLocated(by.xpath(xpath_account_name)));
                browser.findElement(by.xpath(xpath_account_name)).click().then(function(){

                    browser.getCurrentUrl().then(function(url) {
                        browser.get(url);

                        var xpath_first_account_photo = '//*[@id="react-root"]/section/main/article/div/div[1]/div[1]/div[1]/a/div';

                        browser.wait(until.elementLocated(by.xpath(xpath_first_account_photo)));
                        browser.findElement(by.xpath(xpath_first_account_photo)).click().then(function (el) {

                           like(resolve, 0, 6);
                        });
                    });
                });
            });
        });
    });

    promise.then(function() {
        indexTag++;
        like_for_people_by_tag(indexTag);
    });
}