		var mouseX = 0;
		var mouseY = 0;
		var $currPage = "";
		var $previousApplication;
		var $currentApplication;
		var fs_working = true;		
		var msgdialog;
		var acceptdialog;
		function validInputUser() {
			if($.trim($("#login_user").val())=="") { alertbox("User is undefined"); return false; }
			return true;
		}
		function connectServer() {	
			if(!validInputUser()) return;
			//if(fs_working) { startWorking(); return; }
			login();
		}
		function disConnectServer(){
			logOut();
		}
		function login(){
			startWaiting();
			jQuery.ajax({
				url: "logon/logon_c.jsp",
				type: "POST",
				contentType: defaultContentType,
				data: $("#login_form").serialize(), 
				dataType: "html",
				error : function(transport,status,errorThrown) { 
					stopWaiting();
					errorThrow = parseErrorThrown(xhr, status, errorThrown);
					alertbox(errorThrown);
				},
				success: function(data){ 
					stopWaiting();
					var xmldoc = $.parseXML($.trim(data));
					var type = $("root",xmldoc).attr("type");
					if("error"==type) {
						alertbox($("body",xmldoc).text());
					} else {
						var fs_userdetail = $("fsUserName",xmldoc).text();
						$("#accessor_label").html(fs_userdetail);
						doAfterLogin(xmldoc);
					}
				}
			});			
		}
		function doAfterLogin(xmldoc) {
			startWorking();
			refreshScreen();
		}
		function startWorking() {
			$('#page_login').hide();
			createMenu(1); 
			startupPage(); 
			showMenu();
		}
		function createMenu(index){
			$("#homelayer").show();
			$("#mainmenu").show();
			$("#usermenuitem").show();
			$("#favormenuitem").show();
		}
		function startupPage(){
			load_page("page_first");
			load_sidebar_menu();
			load_favor_menu();
			load_prog_item();
		}
		function showMenu(){
		}
		function hideMenu(){
			$("#page_first").hide();
		}
		function fs_changingPlaceholder(lang) {
			if(!lang) return;
			var u_placeholder = fs_getLabelName("login_user_placeholder","index",lang);
			var p_placeholder = fs_getLabelName("login_pass_placeholder","index",lang);
			if(u_placeholder) $("#login_user").attr("placeholder",u_placeholder);
			if(p_placeholder) $("#login_pass").attr("placeholder",p_placeholder);
		}
		function goHome() {
			load_page("page_first");
		}
		function forceLogout() {
			$.ajax({ async: false, url : "logon/logout.jsp?seed="+Math.random(), type : "POST" });
		}
		function logOut() {
			try{ closeMenuBar(); }catch(ex) { }
			$("#pagecontainer").empty();
			$("#mainmenu").hide();
			if($currPage=="") $currPage = $("#page_first");
			if($currPage) {
				$currPage.removeClass('pt-page-current pt-page-moveFromRight pt-page-moveFromLeft');	
			}
			logInClick();
			$("#workingframe").hide();
			$("#homelayer").hide();
			$("#mainmenu").hide();
			$("#usermenuitem").hide();
			$("#favormenuitem").hide();
			$("#programtitle").html("STROKE");
			hideNewFavorItem();
			forceLogout();
		}
		function logInClick() {
			hideWorkingFrame();
			$("#page_login").show();
			login_form.reset();
			//setTimeout(function() { $("#login_user").trigger("focus"); },1000);
		}
		function load_sidebar_menu() {
			var fs_user = $("#login_user").val();
			jQuery.get("main/side_menu.jsp?fsAjax=true&userid="+fs_user+"&x=1&seed="+Math.random(),function(data){ $("#sidebarlayer").html(data); bindingOnSideBarMenu(); });
		}
		function load_favor_menu() {
			var fs_user = $("#login_user").val();
			jQuery.get("main/favor_menu.jsp?fsAjax=true&userid="+fs_user+"&seed="+Math.random(),function(data){ $("#favorbarmenu").html(data); bindingOnFavorMenu(); });
		}
		function fs_changingLanguage(fs_Language) {
			fs_changingPlaceholder(fs_Language);
			if(fs_currentpid && fs_currentpid!="index") {
				fs_switchingLanguage(fs_Language,"index");
			}
		}
		function refreshScreen() {
			$(window).trigger("resize");
		}
		function getTargetFrameName() { return "workingframe"; }
		function hideLoginForm() {
			$("#page_login").hide();
		}
		function showWorkingFrame() {
			$("#pagecontainer").hide();
			$("#workingframe").show();
		}
		function hideWorkingFrame() {
			$("#pagecontainer").hide();
			$("#workingframe").hide();
		}
		var mainapps = angular.module("mainapplication", []).controller("maincontroller", function($scope, $compile) {
				$scope.activateView = function(element) {
					$compile(element.contents())($scope);
					$scope.$apply();
				};
		});
		mainapps.config(function ($controllerProvider) {
            mainapps.controller = $controllerProvider.register;
        });
		var fs_workingframe_offset = 10;
		$(function(){
			$(this).mousedown(function(e) { mouseX = e.pageX; mouseY = e.pageY; });
			msgdialog = createDialog("#fsdialoglayer");	
			acceptdialog = createDialog("#fsacceptlayer");
			try { startApplication("index",true); }catch(ex) { }
			//ignore force logout coz it was invalidate when refresh
			//try { $(window).bind("unload",forceLogout); }catch(ex) { }
			$("#login_pass").on("keydown", function (e) {
				if(e.which==13) { connectServer(); }
			});
			$(window).resize(function() { 
					var wh = $(window).height();
					var nh = $("#navigatebar").height();
					var fh = $("#footerbar").height();
					$("#workingframe").height((wh-nh-fh) - fs_workingframe_offset);
			}).trigger("resize");
		});

