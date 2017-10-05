			function closeMenuBar(evt) {
				var menubar = $("#sidebarmenu");
				if(menubar.is(":visible")) {
					menubar.removeClass("pt-page-moveFromLeft"); 
					menubar.addClass("pt-page-moveToLeft"); 						
					setTimeout(function() { menubar.addClass("sidebar-hide"); },500);
					$("#mainmenutrigger").addClass("active-trigger");
				}
			}
			function showMenuBar(evt) {
				var menubar = $("#sidebarmenu");
				if(!menubar.is(":visible")) {
					var h = $("#navigatebar").height();
					menubar.css({top: h+2});
					menubar.removeClass("pt-page-moveToLeft"); 
					menubar.removeClass("sidebar-hide"); 
					menubar.addClass("pt-page-moveFromLeft"); 	
					$("#mainmenutrigger").removeClass("active-trigger");
				}
			}
			function hangOut(msg) {
				closeMenuBar();
			}
			function bindingOnSideBarMenu() {
				/*
				$("ul.nav li.dropdown",$("#sidebarlayer")).hover(function() {
						if($(this).find(".panel-collapse").length) $(this).find("> a").trigger("click");
					}, function() {						
				});
				*/
			}
			$(function(){
				var menubarclicked = false;
				var menubar = $("#sidebarmenu");
				$("#mainmenutrigger").on("click", function(e) {
					barclicked = false;
					//e.stopPropagation();
					$(this).toggleClass("active-trigger");
					if(menubar.is(":visible")) { 						
						menubar.removeClass("pt-page-moveFromLeft"); 
						menubar.addClass("pt-page-moveToLeft"); 						
						setTimeout(function() { menubar.addClass("sidebar-hide"); },500);
					} else { 						
						var h = $("#navigatebar").height();
						menubar.css({top: h+2});
						menubar.removeClass("pt-page-moveToLeft"); 
						menubar.removeClass("sidebar-hide"); 
						menubar.addClass("pt-page-moveFromLeft"); 
					}
				});				
				$(document).on("click",function(e){ 
					//if(!barclicked && bar.is(":visible")) { $("#mainmenutrigger").trigger("click"); }
					var $target = $(e.target);
					if (!$target.closest('#sidebarmenu').length && !$target.closest('#mainmenutrigger').length) {
						var menubar = $("#sidebarmenu");
						if(menubar.is(":visible")) {
							menubar.removeClass("pt-page-moveFromLeft"); 
							menubar.addClass("pt-page-moveToLeft"); 						
							setTimeout(function() { menubar.addClass("sidebar-hide"); },500);
							$("#mainmenutrigger").addClass("active-trigger");
						}
					}
				});					
			});
