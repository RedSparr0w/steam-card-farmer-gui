
var SteamUser = require('steam-user');
var Steam = SteamUser.Steam;
var request = require('request');
var Cheerio = require('cheerio');
var fs = require("fs");

var client = new SteamUser({"enablePicsCache": true,"promptSteamGuardCode":false});

var g_Jar = request.jar();
request = request.defaults({"jar": g_Jar});
var g_Page = 1;
var g_Start;
var g_Progress;
var g_TotalProgress;
var g_CheckTimer;
var g_OwnedApps = [];

function login() {
	client.logOn({
		"accountName": username,
		"password": password
	});
}
client.on('steamGuard', function(domain, callback, lastcode) {
	callback(code);
});

client.once('appOwnershipCached', function() {
	checkMinPlaytime();
});

client.on('error', function(e) {
	console.log(e);
	shutdown(1);
});

function checkMinPlaytime() {
	client.webLogOn();
	client.once('webSession', function(sessionID, cookies) {
		cookies.forEach(function(cookie) {
			g_Jar.setCookie(cookie, 'https://steamcommunity.com');
		});
		request("https://steamcommunity.com/my/badges/?p="+page, function(err, response, body) {
			if(err || response.statusCode != 200) {
				log("Couldn't request badge page: " + (err || "HTTP error " + response.statusCode) + ". Retrying in 10 seconds...");
				setTimeout(checkMinPlaytime(page), 10000);
				return;
			}
			
			html = html+body;
			
			var lowHourApps = [];
			
			var $ = Cheerio.load(html);
			
			describe('Preparing CSGOParser',function() {
				it('Data Initialized', function() {
					$('.badge_row').length>0 ? return true : return false;
				});
			
			} 
			//checkCardApps();
		});
	});
}
/*
function checkCardApps() {
	$('#LoadingWindow').fadeIn(250);
	if(g_CheckTimer) {
		clearTimeout(g_CheckTimer);
	}
	log("Checking card drops...");
	$('#LoadingWindow p').html("Checking card drops...");
	
	client.webLogOn();
	client.once('webSession', function(sessionID, cookies) {
		cookies.forEach(function(cookie) {
			g_Jar.setCookie(cookie, 'https://steamcommunity.com');
		});
		
		request("https://steamcommunity.com/my/badges/?p="+g_Page, function(err, response, body) {
			if(err || response.statusCode != 200) {
				log("Couldn't request badge page: " + (err || "HTTP error " + response.statusCode));
				checkCardsInSeconds(30);
				return;
			}
			
			var appsWithDrops = 0;
			var totalDropsLeft = 0;
			var appLaunched = false;
			
			var $_ = Cheerio.load(body);
			var infolines = $_('.progress_info_bold');
			
			for(var i = 0; i < infolines.length; i++) {
				var match = $_(infolines[i]).text().match(/(\d+) card drops? remaining/);
				
				var href = $_(infolines[i]).closest('.badge_row').find('.badge_title_playgame a').attr('href');
				if(!href) {
					continue;
				}
				
				var urlparts = href.split('/');
				var appid = parseInt(urlparts[urlparts.length - 1], 10);
				
				if(!match || !parseInt(match[1], 10) || g_OwnedApps.indexOf(appid) == -1) {
					continue;
				}
				
				appsWithDrops++;
				totalDropsLeft += parseInt(match[1], 10);
				
				if(!appLaunched) {
					appLaunched = true;
					
					var title = $_(infolines[i]).closest('.badge_row').find('.badge_title');
					title.find('.badge_view_details').remove();
					title = title.text().trim();
					
					log("Idling app " + appid + " \"" + title + "\" - " + match[1] + " drop" + (match[1] == 1 ? '' : 's') + " remaining");
					client.gamesPlayed(parseInt(appid, 10));
					$('#CurrentAppWindow img').attr("src","http://cdn.akamai.steamstatic.com/steam/apps/" + appid + "/header.jpg");
					$('#CurrentAppWindow h4').html(title);
					$('#CurrentAppWindow p').html(match[1] + " drop" + (match[1] == 1 ? '' : 's') + " remaining");
				}
			}
			//fadeout loading window
			log(totalDropsLeft + " card drop" + (totalDropsLeft == 1 ? '' : 's') + " remaining across " + appsWithDrops + " app" + (appsWithDrops == 1 ? '' : 's') + " (Page " + g_Page + ")");
			if(totalDropsLeft == 0) {
				if ($_('.badge_row').length/250 == Math.round($_('.badge_row').length/250)){
					log("No drops remaining on page "+g_Page);
					g_Page++;
					log("Checking page "+g_Page);
					checkMinPlaytime();
				} else {
					log("All card drops recieved!");
					log("Shutting Down.")
					//shutdown(0);
				}
			} else {
				$('.Window').fadeOut(250);
				$('#CurrentAppWindow').fadeIn(250);
				checkCardsInSeconds(1200); // 20 minutes to be safe, we should automatically check when Steam notifies us that we got a new item anyway
			}
		});
	});
}

function checkCardsInSeconds(seconds) {
	g_CheckTimer = setTimeout(checkCardApps, (1000 * seconds));
	g_Start = Date.now();
}

process.on('SIGINT', function() {
	log("Logging off and shutting down");
	shutdown(0);
});
*/
function shutdown(code) {
	client.logOff();
	client.once('disconnected', function() {
		process.exit(code);
	});

	setTimeout(function() {
		process.exit(code);
	}, 500);
}
login();