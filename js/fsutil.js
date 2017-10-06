var defaultContentType = "application/x-www-form-urlencoded; charset=UTF-8";
function change_page($nextPage){
	if($currPage==""){
		$currPage = $("#page_0");
	}
	$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");
	$currPage = $nextPage.addClass("pt-page-current pt-page-moveFromRight");
}
function load_page(appid,params){	
	if($previousApplication) destroyApplication($previousApplication);
	if($currPage==""){
		$currPage = $("#page_0");
	}	
	$currPage.hide();
	$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");	
	try{ closeMenuBar(); }catch(ex) { }
	loadApplication(appid,params);
	$("#pagecontainer").show();
	$("#workingframe").hide();
}
function loadApplication(appid,params) {
	//alert("load app "+appid);
	var fs_user = $("#login_user").val();
	var appurl = appid+"/"+appid+".jsp?seed="+Math.random()+"&userid="+fs_user+(params?"&"+params:"");
	startWaiting();
	jQuery.ajax({
		url: appurl,
		type: "GET",
		dataType: "html",
		contentType: defaultContentType,
		error : function(transport,status,errorThrown) { 
			stopWaiting();
			//alert("status="+status+", transport="+transport.status+", error="+errorThrown);
			var txt = $.trim(transport.responseText);
			var $div = $("<div class='protection-error'></div>").html(txt);
			//if(transport.status==500 || txt=="") $div.addClass("protection-error-internal").html(errorThrown);
			$("#pagecontainer").html($div);
		},
		success: function(data,status,transport){ 
			stopWaiting();
			$("#pagecontainer").html(data);
			applyApplicationView(appid,data);
			//$currPage = $("#pagecontainer").children("div").eq(0);
			//$currPage.addClass("pt-page-current pt-page-moveFromRight");
			$currPage = $("#"+appid).addClass("pt-page-current pt-page-moveFromRight");
			try { onLoadPage(appid); } catch(ex) { }
			$currPage.show();
			initApplication(appid);
			$previousApplication = appid;
		}
	});	
}
function applyApplicationView(appid,data) {
	//var appelement = angular.element(document.getElementById(appid));
	var appelement = angular.element(document.body);
	var appcontroller = angular.element(document.body);
	appcontroller.scope().activateView(appelement);
}
function initApplication(appid) {
	try { startApplication(appid,true); }catch(ex) { }
	try {
		var pid = eval(appid);
		pid.init({});
		initTitle(pid);
		$currentApplication = pid;
	}catch(ex) { }
}
function launchApplication(pid,appid) {
	
	try {
		if(!pid && appid) pid = eval(appid);
		pid.init({});
		initTitle(pid);
		$currentApplication = pid;
	}catch(ex) { }
	
}
function initTitle(pid) {
	var title = "GoldSpot";
	if(pid) title = pid.title;
	$("#programtitle").html(title);
}
function destroyApplication(appid) {
	try {
		if($currentApplication) {
			$currentApplication.destroy({}); 
			return;
		}
	}catch(ex)  {}
	try {
		var pid = eval(appid);
		pid.destroy({});
	}catch(ex) { }
}
function invokeProgram(appid) {
	try { startApplication(appid,true); }catch(ex) { }
	$('#page_login').removeClass('pt-page-current');
	//var pager = $("#pagecontainer").children("div").eq(0);
	var pager = $("#"+appid);
	pager.addClass("pt-page-current");	
	var pid = eval(appid);
	pid.init({});
	initTitle(pid);
	$currentApplication = pid;
}
function change_page_back($nextPage){
	if($currPage==""){
		$currPage = $("#page_0");
	}
	$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");
	$currPage = $nextPage.addClass("pt-page-current pt-page-moveFromLeft");
}
function onLoadPage(page){
}
function onUnLoadPage(page){
}
/*
function submitSearch(aform) {
	if($currentApplication) $currentApplication.submitSearch(aform);
}
function submitRetrieve(fsParams) {
	if($currentApplication) $currentApplication.submitRetrieve(fsParams);
}
function submitEntry(aform) {
	if($currentApplication) $currentApplication.submitEntry(aform);
}
function submitChapter(aform,index) {
	if($currentApplication) $currentApplication.submitChapter(aform,index);
}
function submitOrder(fsParams) {
	if($currentApplication) $currentApplication.submitOrder(fsParams);
}
function submitDelete(fsParams) {
	if($currentApplication) $currentApplication.submitDelete(fsParams);
}
*/
function open_page(appid,params) {
	//load_page(pid);
	if($previousApplication) destroyApplication($previousApplication);
	if($currPage==""){
		$currPage = $("#page_0");
	}	
	$currPage.hide();
	$currPage.removeClass("pt-page-current pt-page-moveFromRight pt-page-moveFromLeft");	
	try{ closeMenuBar(); }catch(ex) { }
	open_program(appid,params);
}
function open_program(appid,params) {
	//alert("open app "+appid);
	//var fs_user = $("#login_user").val();
	var appurl = appid+"/"+appid+".jsp?seed="+Math.random()+(params?"&"+params:"");
	$("#page_login").hide();
	$("#workingframe").contents().find("body").html("");
	window.open(appurl,"workingframe");		
	$("#pagecontainer").hide();
	$("#workingframe").show();
}
