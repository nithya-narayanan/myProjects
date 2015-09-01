var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);        
    },
    onDeviceReady: function() {
        // enable in-app browser
        window.open = cordova.InAppBrowser.open;
        //trigger search when enter is pressed too
        $("#searchInput").keypress(function(event){
            if(event.keyCode == 13){
                $("#searchSubmit").click();                
            }
        });
    }
};

function shareButtonClicked(shareMsg, title){  
    var fbLoginSuccess = function (userData) {
        facebookConnectPlugin.showDialog( 
        {
            method: "feed",
            link: shareMsg,
            caption: title
        }, 
        function (response) { alert("successfully shared Deal") },
        function (response) { alert("There was an error in sharing the deal "+JSON.stringify(response)) });
    }

    facebookConnectPlugin.login(["public_profile"],
            fbLoginSuccess,
            function (error) { alert("error in login!" + error) }
    );

}

function shareMessage(mediaName, userMessage){
var fbLoginSuccess = function (userData) {
            alert("UserInfo: " + JSON.stringify(userData));
        }

        facebookConnectPlugin.login(["public_profile"],
            fbLoginSuccess,
            function (error) { alert("" + error) }
            );

        //send a photo to user's feed
        facebookConnectPlugin.showDialog( 
         {
        method: "feed",
        name:'Test Post',
        message: userMessage,    
        caption: 'Testing using phonegap plugin',
        description: 'Posting photo using phonegap facebook plugin'
         }, 
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
}

function openPage(url){
    window.open(url);
}


//**************************************************
//content from grabDeals.js
//**************************************************

var feedcontainer = document.getElementById("feed");
var feedurl; //= "http://rssfeeds.s3.amazonaws.com/goldbox"
var feedlimit = 30;

window.onload = function() {
    showNavigationBar();
}

/*this function fetches rss feeds*/
function rssfeedsetup(feedType) {
    //clear previously fetched feeds
    clearFeeds();
        //set url to default url if the request is not from search
        if(feedurl === undefined){
            feedurl = "http://rssfeeds.s3.amazonaws.com/goldbox";
        }
    
        var feedpointer = new google.feeds.Feed(feedurl);
        feedpointer.setNumEntries(feedlimit);
        feedpointer.load(feedType);
        feedurl = undefined;
    }

/*function used to clear old results*/
function clearFeeds(){
        if( document.getElementsByClassName('feedContainer') !== null){
            $('.feedContainer').empty();
        }
        if(document.getElementById('searchInput') !== null){
            document.getElementById('searchInput').value = "";
        }
    }

/*returns data to be displayed*/
function getContent(entry){
        return entry.content;
    }

function searchDeals(){
        var searchStringInput = document.getElementById('searchInput').value;
        var sortByInput = document.getElementById('sortByInput').value;
        feedurl = "http://www.amazon.com/rss/tag/"+searchStringInput+"/"+sortByInput;
        rssfeedsetup(showAllDeals);        
    }

function getfeedContentHTML(feedContent, feedUrl, url){
        var result;

    result = '<div class="ui-block-b" id="itemDetails">';
    result = result + feedContent;
    result = result + '<button id="grabDealButton" onclick="openPage(\''+url+'\')" >Grab Deal</button></div></div></div>';
    return result;
}

function getImageUrl(feedContent){
    var result, anchorTagStartIndex, anchorTagEndIndex; 
    
    anchorTagStartIndex = feedContent.search("<a"); 
    anchorTagEndIndex = feedContent.search("</a>");
    result = feedContent.slice(anchorTagStartIndex, anchorTagEndIndex);
    result = result + '</a>';
    return result; 
}

function getImageUrlHTML(imageUrl){
    var result;
    
    result = '<div class="ui-grid-b dealContentAndImageContainer"><div class="ui-block-a" id="itemImage">';
    result = result + imageUrl;
    result = result + '</div>';
    return result;
}

function getTitle(entry){
    var result = entry.title;
    return result;
}

function getTitleHTML(title, shareMessage){
    var result;
 result = '<div class="itemContainer"><div class="ui-grid-solo titleContainer"><div class="ui-block-a"><div class="ui-bar ui-bar-a" id="feedTitle">';
 result = result + title;

 //replace all the "" characters in the title and message as it creates error
 shareMessage = shareMessage.replace(/"/g, "");
 title = title.replace(/"/g, "");
 result = result + '<a href="#" class="ui-btn ui-btn-inline ui-btn-icon-right" onclick="shareButtonClicked(\''+shareMessage+'\', \''+title+'\')" id="shareButton" name="'+shareMessage+'"></a>';
 result = result + '</div></div>';
 result = result + '</div>';  
 return result;
}

function setpageFullContent (pageFullContent){
    var element = '.feedContainer';

    $(element).html(pageFullContent);             
    $(element).trigger('create');
}

function getFeedSortedByDate(feed){
    var feedSortedByDate = feed.sort(function(a,b){
        var temp1 = new Date(a.publishedDate);
        var temp2 = new Date(b.publishedDate);
        return temp2 - temp1;
    });
    
    return feedSortedByDate;
}

function showLatestDeals(result) {
    "use-strict";
    if(!result.error){
        var feed = result.feed.entries;
    var feedSortedByDate = getFeedSortedByDate(feed);
    
    
    var feedTitle, feed, feedContent, feedImageUrl, feedImageUrlHTML, feedTitleHTML, feedURL;
    var pageFullContent = '';

    
    for (var iterator = 0; iterator < feedSortedByDate.length; iterator++) {
        var entry = feedSortedByDate[iterator];
        

        // GET IMAGE
        feedContent = getContent(entry);
        feedImageUrl = getImageUrl(feedContent);
        feedImageUrlHTML = getImageUrlHTML(feedImageUrl);
        // GET TITLE
        feedTitle = getTitle(entry);
        feedTitleHTML = getTitleHTML(feedTitle, entry.link);
        // GET CONTENT
        feedContent = feedContent.replace(feedImageUrl, "");
        feedURL = getURL(feedImageUrl);
        feedContentHTML = getfeedContentHTML(feedContent, feedURL, entry.link);
        
        
        pageFullContent = pageFullContent + feedTitleHTML + feedImageUrlHTML
        + feedContentHTML;
    }

    setpageFullContent(pageFullContent);        
}else
alert("Error fetching feeds!");
}

function getURL(feedImageUrl){
    "use-strict";
    var imageTagStart, imageTagEnd, imgURL;
    imageTagStart = feedImageUrl.search("<img");
    imageTagEnd = feedImageUrl.search("</a>");
    imgURL = feedImageUrl.slice(imageTagStart, imageTagEnd);
    //remove the </a> tag. So that you can hard code it between button tag later
    feedImageUrl = feedImageUrl.replace("</a>",""); 
    return feedImageUrl.replace(imgURL,"");
}
function showAllDeals(result) {
    if (!result.error) {
        var feedTitle, feed, feedContent, feedImageUrl, feedImageUrlHTML, feedTitleHTML, feedURL;
        var pageFullContent = '';
        var feed = result.feed;
        
        if(feed.entries.length > 0){
            for (var iterator = 0; iterator < feed.entries.length; iterator++) {
                var entry = feed.entries[iterator];

            
            // GET IMAGE
            feedContent = getContent(entry);
            feedImageUrl = getImageUrl(feedContent);
            feedImageUrlHTML = getImageUrlHTML(feedImageUrl);
            // GET TITLE
            feedTitle = getTitle(entry);
            feedTitleHTML = getTitleHTML(feedTitle, entry.link);
            // GET CONTENT
            feedContent = feedContent.replace(feedImageUrl, "");
            feedURL = getURL(feedImageUrl);
            feedContentHTML = getfeedContentHTML(feedContent, feedURL, entry.link);
            
            pageFullContent = pageFullContent + feedTitleHTML + feedImageUrlHTML
            + feedContentHTML;
        }

        setpageFullContent(pageFullContent);
    } else{
            alert("sorry! no items to display");
    }
}else{
            alert("Error fetching feeds!");
}
}

/* this function shows the navbar for every page. Avoids redundant code*/
function showNavigationBar(){
    "use-strict";
    var navigationBarContent ='<nav>'
    +'<div data-role="navbar">'
    +'<ul>'
    +'<li><a href="#home" id="navTab" onclick="clearFeeds()" >Home</a></li>'
    +'<li><a href="#allDeals" id="navTab" onclick="rssfeedsetup(showAllDeals)">All Deals</a></li>'
    +'<li><a href="#allDeals" id="navTab" onclick="rssfeedsetup(showLatestDeals)">New Deals</a></li>'
    +'<li><a href="#about" id="navTab">About</li>'
    +'</ul>'
    +'</div>'
    +'</nav>';
    
    $('.navigationBar').html(navigationBarContent);
    $('.navigationBar').trigger('create');
}