if (navigator.userAgent.match(/Android/)) {
   alert("Droid me baby", "whawha"); };
//______________________________________________________________________________
//_____________________ global button picture variables_________________________________
var cams; // create cams variable to store cams obj.
var loggedInUser ; // variable to store logged in user
var loggedInUserRole ; 
var loginVal;
var imagedirectory;
var toggle;  	
var	blank;
var stop; // stop all actions
var moveup; // tilt up
var movedown; // tilt down
var moveleft; // pan left
var moveright ; // pan right
var iron; // IR on
var iroff; // IR off
var zoomin; // Zoom in
var zoomout; // Zoom out
var washwipe;
var focusauto;
var focusman;
var focusnear;
var focusfar ;
var backlighton ;
var backlightoff ;
var zeroon ;
var zerooff ;
var	setpreset1;
var setpreset2;
var setpreset3;
var setpreset4;
var setpreset5;
var setpreset6;
var getpreset1;
var getpreset2;
var getpreset3;
var getpreset4;
var getpreset5;
var getpreset6;
var	hsweep;	 	
var	vsweep; 
var refresh ;
var fullscreen;
var nrTabs;
var camButtonsG1 ; // camera button list for group1 buttons
var camButtonsG2 ; // camera button list for group2 buttons

//________________________commands____________________________________
function loadImageConfig(data){
  // -- global variables ! (see top of document)
	toggle		= imagedirectory + data.config.screen.buttonpics.toggle; //  	
	stop        = imagedirectory + data.config.screen.buttonpics.stop; // stop all actions
	moveup	 	= imagedirectory + data.config.screen.buttonpics.moveup; // tilt up
	movedown	= imagedirectory + data.config.screen.buttonpics.movedown; // tilt down
	moveleft	= imagedirectory + data.config.screen.buttonpics.moveleft; // pan left
	moveright	= imagedirectory + data.config.screen.buttonpics.moveright; // pan right
	iron 	    = imagedirectory + data.config.screen.buttonpics.iron; // IR on
	iroff	    = imagedirectory + data.config.screen.buttonpics.iroff; // IR off
	zoomin      = imagedirectory + data.config.screen.buttonpics.zoomin; // Zoom in
	zoomout     = imagedirectory + data.config.screen.buttonpics.zoomout; // Zoom out
	focusfar    = imagedirectory + data.config.screen.buttonpics.focusfar;
	focusnear   = imagedirectory + data.config.screen.buttonpics.focusnear;
	focusauto   = imagedirectory + data.config.screen.buttonpics.focusauto;
	focusman    = imagedirectory + data.config.screen.buttonpics.focusman;
	washwipe    = imagedirectory + data.config.screen.buttonpics.washwipe;
	zeroon      = imagedirectory + data.config.screen.buttonpics.zeroon;
	zerooff     = imagedirectory + data.config.screen.buttonpics.zerooff;
	backlighton = imagedirectory + data.config.screen.buttonpics.backlighton;
	backlightoff= imagedirectory + data.config.screen.buttonpics.backlightoff;
	blank		= imagedirectory + data.config.screen.buttonpics.blank;
	setpreset1 	= imagedirectory + data.config.screen.buttonpics.setpreset1;
	setpreset2 	= imagedirectory + data.config.screen.buttonpics.setpreset2;
	setpreset3 	= imagedirectory + data.config.screen.buttonpics.setpreset3;
	setpreset4 	= imagedirectory + data.config.screen.buttonpics.setpreset4;
	setpreset5 	= imagedirectory + data.config.screen.buttonpics.setpreset5;
	setpreset6 	= imagedirectory + data.config.screen.buttonpics.setpreset6;
	getpreset1 	= imagedirectory + data.config.screen.buttonpics.getpreset1;
	getpreset2 	= imagedirectory + data.config.screen.buttonpics.getpreset2;
	getpreset3 	= imagedirectory + data.config.screen.buttonpics.getpreset3;
	getpreset4 	= imagedirectory + data.config.screen.buttonpics.getpreset4;
	getpreset5 	= imagedirectory + data.config.screen.buttonpics.getpreset5;
	getpreset6 	= imagedirectory + data.config.screen.buttonpics.getpreset6;
	hsweep	 	= imagedirectory + data.config.screen.buttonpics.hsweep; // horizontal sweep 
	refresh  	= imagedirectory + data.config.screen.buttonpics.refresh; // refresh video
	vsweep 		= imagedirectory + data.config.screen.buttonpics.vsweep; // vertical sweep
	fullscreen 	= imagedirectory + data.config.screen.buttonpics.fullscreen;
	configcam 	= imagedirectory + data.config.screen.buttonpics.backlighton;	
};
function picturesLookup(command) {
	switch (command) {
		case "toggle" :			return toggle; break; 
		case "blank" :			return blank; break; 
		case "stop" : 			return stop; break;
		case "moveup" : 		return moveup; break;
		case "movedown" : 		return movedown; break;
		case "moveleft" : 		return moveleft; break;
		case "moveright" : 		return moveright; break;
		case "iron" : 			return iron; break;
		case "iroff" :			return iroff; break;
		case "zoomin" : 		return zoomin; break;
		case "zoomout" : 		return zoomout; break;
		case "focusfar" : 		return focusfar; break;
		case "focusnear" : 		return focusnear; break;
		case "focusauto" : 		return focusauto; break;
		case "focusman" : 		return focusman; break;
		case "washwipe" : 		return washwipe; break;
		case "zeroon" :			return zeroon; break;
		case "zerooff" : 		return zerooff; break;
		case "backlighton" :	return backlighton; break;
		case "backlightoff" :	return backlightoff; break;
		case "setpreset1" 	:   return setpreset1; break; 
		case "setpreset2"	:   return setpreset2; break; 
		case "setpreset3" 	:   return setpreset3; break; 
		case "setpreset4" 	:   return setpreset4; break; 
		case "setpreset5" 	:   return setpreset5; break; 
		case "setpreset6" 	:   return setpreset6; break; 
		case "getpreset1" 	:   return getpreset1; break; 
		case "getpreset2" 	:   return getpreset2; break; 
		case "getpreset3" 	:   return getpreset3; break; 
		case "getpreset4" 	:   return getpreset4; break; 
		case "getpreset5" 	:   return getpreset5; break; 
		case "getpreset6" 	:   return getpreset6; break; 
		case "hsweep"		:   return hsweep; break; 
		case "vsweep"		:   return vsweep; break;
		case "refresh" 		:	return refresh; break;
		case "fullscreen"	:	return fullscreen; break;
		case "configcam"	:	return configcam; break;
	}
};
function reloadImage(camid, src){
	// Manual refresh only - no polling loop
	// Add random param to bypass cache for single refresh
	var refreshSrc = src + '&rd=' + Math.random();
	$('#cams'+camid).attr("src", refreshSrc);
	console.log("Manual refresh: camera " + camid);
};

function openEsp32Config(ip) {
    // Create the popup HTML
    var popupHtml = '<div id="esp32config" style="background:#000; padding:20px; color:#fff; width:25vw; height:70vh; cursor:move;">' +
        '<h2>ESP32 Camera Config</h2>' +
        '<iframe src="http://' + ip + '/" style="width:100%; height:calc(100% - 60px); border:none;"></iframe>' +
        '<br><button onclick="$(\'#esp32config\').trigger(\'close\');">Close</button>' +
        '</div>';
    // Append to body and show with lightbox_me
    $('body').append(popupHtml);
    $('#esp32config').lightbox_me({
        centered: true,
        onClose: function() { $('#esp32config').remove(); }
    });
    // Make draggable
    $('#esp32config').draggable();
};
function clearTabs(){
$('#elName').empty();
//document.getElementById('tablist').empty();
console.log("WHAAAAAAAAAAAAAAA");
document.getElementById('tablist').innerHTML =`
  <ul id="tablist">
  </ul>`;
};
function createTabs(){
	$( "#tabs" ).tabs();  // create tabs from listitems and divs "#tabs-[#]"
};
function changeDisplayState(elID,id){
  var e = document.getElementById(elID);
  if (e.style.display === "none" || e.style.display === "") { 
	e.style.display = "inline"; 
  } else { e.style.display = "none"; }
};
//___________________________________ socketio client ____________________________________
var socket = io.connect();
socket.on('connect', function() { console.log('__connected_to_server__'); });
socket.on('disconnect', function() { /*alert('---disconnected-from-server---');*/ });
socket.on('error', function(err) { 	if(err === 'handshake error') { console.log('handshake error', err); } else {  console.log('io error', err); } });
socket.on('config', function(dat) { loginVal = dat.value ;
									//console.log( 'value login: ' + dat.value); 
									loginscreen(); 
}); 
socket.on('role', function(role) {
	loggedInUserRole = role;
});
socket.on('cameralist', function(data) { // get cameralist from server (with pre-rendered HTML)
	cams = data;

	// Load image config for any client-side needs
	if (data.config && data.config.screen) {
		imagedirectory = data.config.screen.picdirectory;
		loadImageConfig(data);
	}

	// Create tabs structure
	createTabElements(data);

	// Insert server-rendered HTML into each tab
	if (data.tabs) {
		for (var tabNum in data.tabs) {
			var tabContainer = document.getElementById('cameras' + tabNum);
			if (tabContainer) {
				tabContainer.innerHTML = data.tabs[tabNum];
			}
		}
	}

	// Initialize tabs UI
	createTabs();

	// Set up click handlers for pelcod buttons
	setupPelcodClickHandlers(data);
});
socket.on('camControl', function(data) { }); // if camControl data is reveived from server ( not implemented yet( not needed ;) )


function sendLogOut(user, sessionID){
	socket.emit( 'logout', {  "user": user , "sessionID" : sessionID } );
	loginscreen();
}


//_____________________To_Serial_____________________________________
function sendControlData(data){ // data > cam object with command {'cam': '1', 'command': 'moveup'}
	socket.emit('camControl', data );
	console.log('CamID: '+ data.cam +' Command: '+ data.command );
};
//__________________________________end socketio_______________________________________
// ______________________________________________________
function loginscreen(){
	if ( loginVal === 'true' ){ 
	// popup a loginscreen
		var domobj = $(document.getElementById('login'));
		$(domobj).lightbox_me({
			centered: true, 
			onLoad: function() { 
				$('#login').find('input:first').focus()
			}
		});
		$('#log_in').click(function() { 
			// get data from user & password field > socket.emit('login', {user:pass} );
			var name = $('#log_in_form').find('input[name="name"]').val();
			var pass = $('#log_in_form').find('input[name="pass"]').val();
			$('#login').trigger('close');
			if ( name != '' || pass != '' ){
				socket.emit('login', { 'name': name, 'pass': pass } );
				loggedInUser = name ;
			};
		});
	} else 
	{	loggedInUser = 'USER';
		//console.log('requesting empty login from server..');
		socket.emit('login', { 'name': 'none' } );
	}
};
function addUserInfo(){
	var userInfo = '<div id="user" class="headertxt"> &nbsp || &nbsp &nbsp Hi, '+loggedInUser+' &nbsp || &nbsp <a href="">LOGOUT</a> </div>';
	document.getElementById('tablist').innerHTML +=userInfo;
};
function addUserInfo(){
    // 1. Remove existing user info if it exists (prevents duplicates)
    $('#user').remove();

    // 2. Create the HTML, but use href="#" and give it an ID "btnLogout"
    var userInfo = '<div id="user" class="headertxt"> &nbsp || &nbsp &nbsp Hi, '+loggedInUser+' &nbsp || &nbsp <a href="#" id="btnLogout">LOGOUT</a> </div>';
    
    // 3. Use jQuery append (safest way to add HTML without breaking other buttons)
    $('#tablist').append(userInfo);

    // 4. Attach the click event
    $('#btnLogout').click(function(e) {
        e.preventDefault(); // Stop the link from reloading the page immediately
        
        console.log("Logging out...");
        
        // Tell the server to destroy the session
        socket.emit('logout');
        
        // Reload the page to clear all camera streams and variables.
        // Since the session is now destroyed on the server, 
        // the reload will present the Login Screen.
        location.reload();
    });
};
Array.prototype.contains = function(obj) { // addon function for Array to add 'contains' functionality > [ARRAY].contains(VALUE);
	var i = this.length;
	while (i--) { if (this[i] === obj) { return true; }  }
	return false; 
};
function toggleSideButtons(sb){
console.log('toggled');
	var elem = $(document.getElementById(sb));
	var displayVal = elem.css( 'display' );
	if (displayVal === "none" || displayVal === ""){
			 $(elem).css('display', 'inline');}
	else {	 $(elem).css('display', 'none');}
};
//___________________________________________ InI File Importer ____________________________________
function sendIniFile(data){ // send ini file to import function @ server
	socket.emit('import', {'data': data.data, 'name':data.name} );  // { 'name': '' , 'pass': ''}
	console.log('ini File send to server: '+ data.data );
	//console.log(JSON.parse(data.data));
};
var importForm = '\
	<div id="import_form">\
		<h3 style="color:#f5d33d;">Import Configuration</h3>\
		<label>Project Name :</label><input class="sprited" name="name" style="width:100%;max-width:400px;"/></br>\
		<label>Data from InI File :</label><code> <textarea type="text" cols="60" rows="40" class="sprited" name="data" style="width:100%;max-width:400px; height:200px;"></textarea>\
		<div id="actions">\
			</br> <a id="send_data" class="buttn" href="#data" >Import Data</a>\
		</div>\
	</div>\
';
function getIniData(){ // get data from form and send it to server
		$('#send_data').click(function() { 
			// get data from user & password field > socket.emit('login', {user:pass} );
			var data = $('#import_form').find('textarea[name="data"]').val();
			var name = $('#import_form').find('input[name="name"]').val();
			if ( data != '' ){
				sendIniFile({ 'data':data, 'name':name });
			    document.getElementById("config-form").innerHTML = importForm;
				getIniData();
			};
		});
};
function addImportForm(){
	document.getElementById('config-form').innerHTML = importForm ; // add form to screen
	getIniData(); // clickHandler for import
};
//___________________________________________________________________________________________________
function addConfigListItems(){
	var conflist = document.getElementById('tablist').innerHTML +='    <li><a href="#tabs-98"><img src="/images/Control%20Panel.png" style="position:absolute; z-index:999; width:20px; height:20px; top:4px; left:3px;" />&nbsp;&nbsp;&nbsp;&nbsp;Configuration</a></li>';
	var confDiv = document.getElementById('tabs').innerHTML +='  <div id="tabs-98"><div id="config" style="display:flex;gap:20px;padding:20px;flex-wrap:wrap;"><div id="config-form" style="flex:1;min-width:300px;"></div><div id="config-cameralist" style="flex:1;min-width:300px;"></div></div></div>';
	addImportForm(); // add import form to configuration tab
	createCameraList(); // create list for configuration tab (now in same tab)
};
function getCameraTab(config,camID){ // get tabnumber for camera 
	var screenConf = config.config.screen;
	var camsPerTab = ( screenConf.columns * screenConf.rows );
	var tabsnr = (Math.ceil((camID + 1) / camsPerTab ));
	var tabid = 'cameras'+ tabsnr;
	return  tabid;
};
//_______________________________create Tab Elements ______________________________________
var tabsPicture = 'film_camera_35mm.png';
function createTabElements(config){
	var screenConf = cams.config.screen
	var camsPerTab = ( screenConf.columns * screenConf.rows );
	var nrCams = config.cameras.length;
	nrTabs = nrCams / ( screenConf.columns * screenConf.rows );
	for(var tabsCnt = 1; tabsCnt < (nrTabs+1) ;tabsCnt++){
		var tabtitle = 'Cam`s: X';
		var tabCamnrFrom = ( tabsCnt * camsPerTab ) - camsPerTab + 1 ;
		var tabCamnrTo = tabCamnrFrom + camsPerTab -1 ;
		var tabCamnrs = tabCamnrFrom + '-' + tabCamnrTo;
		tabtitle =  tabtitle.replace(tabtitle.charAt(7), tabCamnrs);
		var tabstemplate = '<li><a href="#tabs-X"><img src="/images/'+tabsPicture+'" style="position:absolute; z-index:999; width:24px; height:24px; top:2px; left:2px;" />&nbsp;&nbsp;&nbsp;&nbsp;'+tabtitle+'</a></li>'
		tabstemplate = tabstemplate.replace(tabstemplate.charAt(19), tabsCnt);
		var tabDiv ='  <div id="tabs-'+tabsCnt+'"><div id="cameras'+tabsCnt+'"></div></div>';
		document.getElementById('tablist').innerHTML += tabstemplate;
		document.getElementById('tabs').innerHTML += tabDiv;
	};
	// ___________________ disbale Config screen for all user except ADMINS_________________________
	if ( loggedInUserRole == 'admin'){addConfigListItems(); }  // if loggedInUser Role == ADMIN
	//______________________________________________________________________________________________
	addUserInfo(); // add logged in user info to topright of page
	document.getElementById('tablist').appendChild(
    document.getElementById('time')  // add time and date after userinfo
  );
};
function date_time(id){
	date = new Date;
	year = date.getFullYear();
	month = date.getMonth();
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
	d = date.getDate();
	day = date.getDay();
	days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	h = date.getHours();
	if(h<10) { h = "0"+h; }
	m = date.getMinutes();
	if(m<10) { m = "0"+m; }
	s = date.getSeconds();
	if(s<10) { s = "0"+s; }
	result = ''+days[day]+' '+months[month]+' '+d+' '+year+' '+h+':'+m+':'+s;
	document.getElementById(id).innerHTML = result;
	setTimeout('date_time("'+id+'");','1000');
	return true;
};
function createCameraList(){ // ________ create camera list for configuration tab ____________________
	var buff = '	<h3 style="color:#f5d33d;">Camera List</h3><div id="camlist" style="overflow-x:auto;"><table>\
		<tr class="tablehead"><th> Pelco ID </th><th> Name </th><th> type </th><th> IP </th><th> url </th><th> cip </th><th> user </th><th> password </th></tr>';
	cams.cameras.forEach( function(cam) {
		buff += '		<tr class="trows"><td> '+cam.id+' </td><td> '+cam.name+' </td><td> '+cam.type+' </td><td style="text-align:right;"> '+cam.ip+' </td><td class="tdiv"> '+cam.url+' </td>\
						<td class="tdiv"> '+cam.cip+':'+cam.cport+' </td><td class="tdiv" style="text-align:center;"> '+cam.user+' </td><td> ********* </td></tr>';
	});
	buff += '	</table></div>';
	document.getElementById('config-cameralist').innerHTML = buff ;
	//console.log(buff);
};
function fsCam(id) {
    var container = document.getElementById("picture" + id);
    var media = container.querySelector("img") || container.querySelector("video");

    if (!media) return;

    // Check if we are already in fullscreen
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Store original dimensions
        container.dataset.origWidth = media.getAttribute("width");
        container.dataset.origHeight = media.getAttribute("height");

        // Set fullscreen styles
        container.style.cssText = "width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:#000;";
        media.style.cssText = "width:100%;height:100%;object-fit:contain;";
        media.removeAttribute("width");
        media.removeAttribute("height");

        // Enter Fullscreen
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    } else {
        // Exit Fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Restore original dimensions when exiting fullscreen
document.addEventListener("fullscreenchange", handleFsExit);
document.addEventListener("webkitfullscreenchange", handleFsExit);
document.addEventListener("mozfullscreenchange", handleFsExit);
document.addEventListener("MSFullscreenChange", handleFsExit);

function handleFsExit() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        // Find the container that was fullscreen and restore it
        var containers = document.querySelectorAll(".stream[data-orig-width]");
        containers.forEach(function(container) {
            var media = container.querySelector("img") || container.querySelector("video");
            if (media && container.dataset.origWidth) {
                media.setAttribute("width", container.dataset.origWidth);
                media.setAttribute("height", container.dataset.origHeight);
                media.style.cssText = "";
                container.style.cssText = "";
                delete container.dataset.origWidth;
                delete container.dataset.origHeight;
            }
        });
    }
}

// Setup click handlers for server-rendered camera buttons
function setupPelcodClickHandlers(data) {
	if (!data.cameras) return;

	var stopCommandList = (data.config && data.config.stopCommandButtonList) ||
		["moveup", "movedown", "moveleft", "moveright", "zoomin", "zoomout", "focusfar", "focusnear"];

	data.cameras.forEach(function(camera, camIndex) {
		var type = camera.type;
		var isPelcod = (type === 'pelcod' || type === 'pelcod-web');

		if (isPelcod && camera.control && camera.control.enabled === 'true') {
			var buttons = camera.control.buttons;

			// Group 1 buttons (main buttons)
			if (buttons.group1) {
				buttons.group1.forEach(function(button) {
					if (button === 'blank' || button === 'toggle' || button === 'refresh' || button === 'fullscreen') return;

					var selector = '.' + button + camIndex;
					$(selector).mousedown(function() {
						sendControlData({ 'cam': camIndex, 'command': button });
					});

					// Stop command on mouseup for movement buttons
					if (stopCommandList.indexOf(button) !== -1) {
						$(selector).mouseup(function() {
							sendControlData({ 'cam': camIndex, 'command': 'stop' });
						});
					}
				});
			}

			// Group 2 buttons (side buttons)
			if (buttons.group2) {
				buttons.group2.forEach(function(button) {
					if (button === 'blank') return;

					var selector = '.' + button + camIndex;
					$(selector).mousedown(function() {
						sendControlData({ 'cam': camIndex, 'command': button });
					});

					if (stopCommandList.indexOf(button) !== -1) {
						$(selector).mouseup(function() {
							sendControlData({ 'cam': camIndex, 'command': 'stop' });
						});
					}
				});
			}
		}

		// Toggle button handler for all camera types
		var toggleSelector = '#toggle' + camIndex;
		var sideButtonsId = 'sidebuttons' + camIndex;
		$(toggleSelector).click(function() {
			toggleSideButtons(sideButtonsId);
		});
	});
}
