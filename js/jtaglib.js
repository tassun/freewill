var errdialog = null;
var fs_default_language = "EN";
var fs_accessor = null;
var fs_currentpid = null;
var fs_customizelayer = null;
function getDialog() { 
	try { 
		if(errdialog==null) { 
			var usexml = new UseXML(); 
			errdialog = new  ErrorDialog("errdialog", usexml); 
		} 
	} catch(ex) { } 
	return errdialog; 
}
var fs_langsXMLDocs = null;
function fs_getLangsXMLDocs(fs_progid) {
	if(!fs_langsXMLDocs) {
		var xhr = $.ajax({
			async: false,
			type: "GET",
			url: "../jsp/labelconfig.jsp?pid="+fs_progid,
			dataType: "xml"
		});
		//alert(xhr.responseText);
		fs_langsXMLDocs = $.parseXML($.trim(xhr.responseText));
	}
	return fs_langsXMLDocs;
}
 function fs_createHashElements(fs_lang,fs_langHash,xmlDocs) { 
 	if(!fs_lang) return false; 
 	if(!fs_langHash) return false; 
 	if(!xmlDocs) return false; 
 	var ex; 
 	try{ 
		var xmlChild = $(xmlDocs).children().children();
		if(xmlChild.length>0) {
			for(var i=0,isz=xmlChild.length;i<isz;i++) {
				var attr = $(xmlChild).eq(i).attr("language");
				if(attr && attr==fs_lang) {
					var subChild = $(xmlChild).eq(i).children();
					for(var j=0,jsz=subChild.length;j<jsz;j++) {
						var anode = subChild[j].nodeName;
						var bnode = subChild.eq(j).text();
						if(bnode) {
							fs_langHash.setItem(anode,bnode);
						}
					}
					return true;
				}
			}
		}
 	} catch(ex) { } 
 	return false; 
 } 

 function fs_createLabelArrays(xmlDocs) { 
 	var result = new Array(); 
 	if(!xmlDocs) return result; 
 	var ex; 
 	try{ 
		var xmlChild = $(xmlDocs).children().children();
		if(xmlChild.length>0) {
			for(var i=0,isz=xmlChild.length;i<isz;i++) {
				var attr = $(xmlChild).eq(i).attr("language");
				if(attr) {
					var subChild = $(xmlChild).eq(i).children();
					for(var j=0,jsz=subChild.length;j<jsz;j++) {
						var anode = subChild[j];
						result.push(anode.nodeName);
					}
					return result;
				}
			}
		}
 	} catch(ex) { } 
 	return result; 
 } 
var fs_hashLang = {};
function fs_switchGridLanguage(grid,gridname,progid,fs_Language) {
	var fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = new Hash();
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_hash) {
		var colscount = grid.getColumnsNum();
		for(var i=0;i<colscount;i++) {
			var fs_headLabel = fs_hash.getItem(gridname+"_headerlabel_"+i);
			if(fs_headLabel) grid.setColumnLabel(i,fs_headLabel);
		}
	}
}

function fs_doKeyDown (e) { 
	var myKeyCode      = e.keyCode; 
	var mySrcElement   = e.srcElement; 
	var isShiftPressed = e.shiftKey; 
	var isCtrlPressed  = e.ctrlKey; 
	var isAltPressed   = e.altKey; 
	if (fs_freeze ==  true) return false; 
	if (myKeyCode >= 13 && myKeyCode <= 20) return true; 
	var mapping = fs_isKeyMapped(myKeyCode, isShiftPressed, isCtrlPressed, isAltPressed);   
	if (!mapping) {return true;} 
	var srcTag = fs_findKeyMap(myKeyCode, isShiftPressed, isCtrlPressed, isAltPressed); 
	if(!srcTag) { e.keyCode = 0; e.cancelBubble = true; return !mapping; } 
	//02/09/2010 TSO ignore default select field but use focus in order to fix double alert when exit field
	if (srcTag == 'TABKEY'){ 
		for(var i=0;i<fs_tabindex.length;i++) { 
			if(e.srcElement.name==fs_tabindex[i]) { 
				var j = 0; 
				if(i<(fs_tabindex.length-1)) { 
					j = i +1; 
				} 			
				try { 
					for (var k=j;k<fs_tabindex.length;k++) { 
						if(!window.document.all[""+fs_tabindex[k]+""].disabled) { 
							j = k; break; 
						} 
					} 
				}catch(ex) { } 			
				var fs_field = document.forms[0].elements[fs_tabindex[j]]; 
				if(fs_field) { 
					try {  
						if(fs_field.length>0) { 
	 						if(fs_field.name==fs_field[0].name) {
								fs_field = fs_field[0]; 
							}
						} 
					} catch(ex) { } 					
					///fs_field.setActive(); 
					try{ 
						fs_field.focus(); 
						if(!fs_invalidate) fs_field.select();
					}catch(ex) { }
					return false; 					
				}											 
			} 
		} 
	} 
	if (srcTag == 'BACKTABKEY'){ 
		for(var i=0;i<fs_tabindex.length;i++) { 
			if(e.srcElement.name==fs_tabindex[i]) { 
				var j = i - 1; 
				if(i==0) { 
					j = fs_tabindex.length-1; 
				} 			
				try { 
					for (var k=j;k>=0;k--) { 
						if(!window.document.all[""+fs_tabindex[k]+""].disabled) { 
							j = k; break; 
						} 
					} 
				}catch(ex) { } 				
				var fs_field = document.forms[0].elements[fs_tabindex[j]]; 
				if(fs_field) { 
					try {  
						if(fs_field.length>0) { 
	 						if(fs_field.name==fs_field[0].name) {
								fs_field = fs_field[0]; 
							}
						} 
					} catch(ex) { } 			
					//fs_field.setActive(); 
					try{ 
						fs_field.focus(); 
						if(!fs_invalidate) fs_field.select();
					}catch(ex) { }
					return false; 
				}											 
			} 
		} 
	} 
	var mytag = document.getElementById(srcTag); 
	if ( mytag != null  )	{  
		e.keyCode = 0;		e.cancelBubble = true; 
		if (mytag.name == 'SaveBt') { 
			fs_confirmSubmitFK(fs_saveconfirmmessage,mytag); 
		} else {  
			try { 
				mytag.focus();  
				if(fs_getcurrfield() == mytag)  
					mytag.click();  
			}catch(ex) { } 
		} 
	} else {  
		return true;  
	} 
	return !mapping; 
} 
			
function fs_findKeyMap (keycode, shift, ctrl, alt, keyary) {  
			 	if(!keyary) keyary = fKeyMap; 
			 	for (var i = 0; i < keyary.length; i++) { 
			 		if (keyary[i].keyCode  == keycode 
			  		&& keyary[i].shift == shift  
			  		&& keyary[i].ctrl  == ctrl  
			  		&& keyary[i].alt   == alt) {  
			 		return keyary[i].idTag; 
			 	} 
			 } return "";
} 
function fs_isKeyMapped (keycode, shift, ctrl, alt) { 
			 	var keyary = fKeyMap; 
			 	for (var i = 0; i < keyary.length; i++) { 
			 		if (keyary[i].keyCode  == keycode 
			  		&& keyary[i].shift == shift  
			  		&& keyary[i].ctrl  == ctrl  
			  		&& keyary[i].alt   == alt) {  
			  			return keyary[i].isMapped; 
			 		}	 
			 	}  
			 	return false; 
} 
function fs_dohelp() { 
	return false;  
} 

	 var fs_tabindex = new Array();  
	 var fs_saveconfirmmessage = "Do you want to save this page?";  
	 var fs_cancelconfirmmessage = "Do you want to cancel this page?";  
	 var fs_currfocus = null;  
	 var fs_lastexit = null;  
	 var fs_freeze = false;  
	 var fs_focusing = false;  
	 var fs_fieldActive = false;  
	 var fs_rivalActive = false;  
	 var fs_invalidate = false;  
	 var fs_taborder = [];
	 function fs_attachfocus() { 
	 	for(var i=0;i<window.document.all.lenth;i++) { 
	 		window.document.all.item[i].attachEvent("onfocusin",fs_focusin); 
	 	} 
	 } 
	 function fs_focusin(src) { 
	 	if(fs_invalidate) { 
	 		if(event.fromElement) {
				event.fromElement.hideFocus(); 
			}
	  } 
	 } 	
	 function fs_deactivate(src,rival) {  
	 	if(!fs_focusing) {  
			try{if($(event.toElement).is(".jrivaly")) fs_rivalActive = true;}catch(ex) { }
	 		if(!fs_rivalActive) {  
	 			fs_startexit(src);  
	 			fs_focusing = false;  
	 			return;  
	 		}  
	 	} else { 
	 		try { event.srcElement.hideFocus(); } catch(ex) { }
	 	} 
	 	fs_focusing = false;  
	 }  
	   
	 function fs_beforedeactivate(src,rival) { 
	 	fs_rivalActive = false; 
	 	try { 
	 		fs_setcurrfield(event.toElement); 
	 		if(rival) {  
	 			if (event.toElement.uniqueID==rival.uniqueID)  
	 			fs_rivalActive = true;  
	 		} 
			if($(event.toElement).is(".jrivaly")) fs_rivalActive = true;
	 	} catch(ex) { } 
	 } 
	  
	 function fs_rival_deactivate(src,rival) { 
	 	if(!fs_focusing) { 
			try{if($(event.toElement).is(".jrivaly")) fs_fieldActive = true;}catch(ex) { }
	 		if(!fs_fieldActive) { 
	 			fs_startexit(src); 
	 			fs_focusing = false; 
	 			return; 
	 		} 
	 	} 
	 	fs_focusing = false;		 
	 } 
	  
	 function fs_rival_beforedeactivate(src,rival) { 
	 	fs_fieldActive = false; 
	 	try { 
	 		fs_setcurrfield(event.toElement); 
	 		if(event.toElement.uniqueID==src.uniqueID) {  
	 			fs_fieldActive = true;  
	 		} 
	 	} catch(ex) { } 
	 } 

	 function verifyItems(source) { 
	 	return true; 
	 } 
	
	 function fs_startexit(item) { 
	 	fs_invalidate = false; 
	  try { 
	 	if(fs_getcurrfield() != null) { 
	 		if(fs_getcurrfield().type.toLowerCase()=='reset') return; 
	 		var attr = fs_getcurrfield().getAttribute("typical");
	 		if(attr && (attr.toLowerCase()=='reset')) return; 
	  } 
	  }catch(ex) { } 
	 	if (item != null) { 
	 		var fs_found_field = false; 
	 		for (var i = 0; i < fs_taborder.length; i++) { 
				var fsvalid = false;
				var fsitem = fs_taborder[i];
				if(typeof(fsitem)=='string') {
					fsvalid = (item.name == fsitem);
				} else {
					fsvalid = (item == fsitem);
				}
				//alert("fsvalid ="+fsvalid+" ,name ="+fsitem.name);
	 			if (fsvalid) { 
	 				fs_found_field = true; 	 
					//alert("fs_validswitch : "+fs_validswitch(i,item));
					if (fs_validswitch(i,item)) { 
						//alert("fs_validswitch : true ");
	 					fs_invalidate = true; 
	 					fs_focusing = true;  
	 					fs_setcurrfield(item);  
	 					item.focus(); 
	 					return; 
	 				} 
	 			} 
	 		} 
	 		if(!fs_found_field) { 
	 			if (!verifyItems(item)) { 
	 				fs_invalidate = true; 
	 				fs_focusing = true;  
	 				fs_setcurrfield(item);  
	 				item.focus(); 
	 				return; 
	 			} 
	 		} 
	  		fs_setexitfield(item); 
	 	} 
	 } 

	 function fs_fetchTaborder() { 
	 	if(document.forms.length<=0) return; 
	 	fs_tabindex = new Array(); 
	 	for(var i=0;i<fs_taborder.length;i++) { 
	 		var fs_field = document.forms[0].elements[fs_taborder[i]];		 
	 		if(fs_field) {			 
	 			try {  
	 				if(fs_field.length>0) { 
	 					if(fs_field.name==fs_field[0].name) {
							fs_field = fs_field[0]; 
						}
	 				} 
	 			} catch(ex) { } 
	 			if((fs_field.style.visibility=="hidden") || (fs_field.style.display=="none")) {				 
	 			} else { 
	 				if(fs_field.tagName.toUpperCase()=="INPUT") {					 
	 					if(fs_field.type.toLowerCase()!="hidden") { 
	 						fs_tabindex.push(fs_field.name); 
	 					} 
	 				} else { 
	 					fs_tabindex.push(fs_field.name); 
	 				} 
	 			} 
	 		} 
	 	}	 
	 } 
	function fs_stopAnchorTaborder() {
		try {
			var links = document.getElementsByTagName("A");
			for( var i = 0, j =  links.length; i < j; i++ ) {
				links[i].setAttribute('tabIndex','-1');
			}
		}catch(ex) { }
	}
	 function fs_initfocus(item) { 
	 	if (item != null) { 
	 		try {item.select();} catch (e) {}  
	 		fs_currfocus=item; 
	 		item.focus(); 
	 	} else { 
	 		try { 
	 			document.forms[0].elements[fs_taborder[0]].select(); 
	 		} catch (e) {}  
	 		var canfocus = false; 
	 		var idx = 0; 
	 		while(!canfocus && (idx<fs_taborder.length)) { 
	 		try { 
	 		fs_currfocus = document.forms[0].elements[fs_taborder[idx]]; 
	 		document.forms[0].elements[fs_taborder[idx]].focus(); 
	 		canfocus = true; 
	 		}catch(ex) { } 
	 		idx++; 
	 		} 
	 	} 
	 	fs_fetchTaborder(); 
	 	/*try { 
	 		for(var i=0;i<window.document.forms.length;i++) { 
	 			var fs_aform = window.document.forms[i]; 
	 			fs_aform.attachEvent("onsubmit",fs_submitform); 
	 		} 
	 	}catch(ex) { } */
		fs_stopAnchorTaborder();
	 } 

	 var fs_enabling = false; 
	 function fs_setEnabling(enable) { fs_enabling = enable; } 
	 function fs_submitform() { 
	 	var fs_eform = event.srcElement; 
	 	if(fs_eform && fs_eform.getAttribute("target")) return; 
	 	fs_enableaction(fs_enabling); 
	 } 

	 function fs_enableaction(enable) { 
	 	var fs_inputs = document.getElementsByTagName("INPUT");
	 	for(i=0;i<fs_inputs.length;i++){  
	 		var fs_input = fs_inputs[i]; 
	 		var fs_attr = fs_input.getAttribute("type");
	 		if((fs_attr=="submit") || (fs_attr=="reset") || (fs_attr=="button")){  
	 			fs_input.disabled = !enable; 
	 		}  
	 	}  
	 } 
		
	 function fs_setexitfield(item){ 
	 	fs_lastexit = item; 
	 } 
	
	 function fs_getexitfield(){ 
	 	return fs_lastexit; 
	 } 
	
	 function fs_getcurrfield(){ 
	 	return fs_currfocus; 
	 } 
	
	 function fs_setcurrfield(curr){ 
	 fs_currfocus = curr; 
	 } 
	
	 function fs_validlastfield(curr){ 
	 var tabcount = fs_taborder.length; 
	 var item = fs_getexitfield(); 
	 fs_currfocus = curr; 
	 	if (item != null) { 
	 		for (var i = 0; i < tabcount; i++) { 
				var fsvalid = false;
				var fsitem = fs_taborder[i];
				if(typeof(fsitem)=='string') {
					fsvalid = (item.name == fsitem && curr.name != fsitem && item.value != '');
				} else {
					fsvalid = (item == fsitem && curr != fsitem && item.value != '');
				}
	 			if (fsvalid) { 
	 				if (fs_validswitch(i,item)) { 
	 					try {item.select();} catch (e) {}  
	 					fs_currfocus = item; 
						item.focus();
						break; 
	 				} 
	 			} 
	 		} 
	 	} 
	 } 
	
	 function fs_disablefield(item){ 
	 	if (item != null) { 
	 		item.style.backgroundColor = "silver";item.disabled = "disabled";item.unselectable="on";  
	 		var tabcount = fs_taborder.length; 
	 		for (var i = 0; i < tabcount; i++) 
	 		{ 
	 			if (item.name == fs_taborder[i])  
	 				fs_taborder[i] = "*"+fs_taborder[i]; 
	 		} 
	 	} 
	 } 
	
	 function fs_enablefield(item){ 
	 	if (item != null) { 
	 		item.disabled = "";  
	 		item.unselectable="off";  
	 		item.style.backgroundColor = "white";  
	 		var tabcount = fs_taborder.length; 
	 		for (var i = 0; i < tabcount; i++) 
	 		{ 
	 			if (("*"+item.name) == fs_taborder[i])  
	 				fs_taborder[i] = fs_taborder[i].substring(1,fs_taborder[i].length); 
	 		} 
	 	} 
	 } 
	
	 function fs_confirmCancel(msg,item){ 
	 	var fs_bfcancelbt = fs_getexitfield(); 
	 	if (confirm(msg) == true) { 
	 		item.form.reset(); 
	 		self.status=""; 
	 		fs_initfocus(); 
	 	} else { 
	 		if (fs_bfcancelbt != null) { 
	 		if (fs_bfcancelbt.type != 'button') 
	 			try{fs_bfcancelbt.select();} catch (e) {} 
	 		fs_bfcancelbt.focus(); 
	 		} 
	 	} 
	 } 
	
	 function fs_confirmCancelGo(msg,item){ 
	 	var fs_bfcancelbt = fs_getexitfield(); 
	 	if (confirm(msg) == true) { 
	 		window.location.replace(item); 
	 	} else { 
	 		if (fs_bfcancelbt != null) { 
	 		if (fs_bfcancelbt.type != 'button') 
	 			try {fs_bfcancelbt.select();} catch (e) {} 
	 		fs_bfcancelbt.focus(); 
	 		} 
	 	} 
	 } 
	
	 function fs_confirmSubmitFK(msg,item){ 
	 try{ 
	 	item.focus(); 
	 	if (fs_getcurrfield() != item) return; 
	 	if (confirm(msg) == true) { 
	 		item.form.submit(); 
	 		item.form.reset(); 
	 		fs_initfocus(); 
	 	} 
	 }catch(ex) { } 
	 } 
	
	 function fs_confirmSubmit(msg,item){ 
	 	item.focus(); 
	 	if (fs_getcurrfield() != item) return; 
	  var fs_bfdonebt = fs_getexitfield(); 
	 	if (fs_bfdonebt != null) { 
	 		if (fs_bfdonebt.name != item.name) { 
	 			if (confirm(msg) == true) { 
	 				item.form.submit(); 
	 				item.form.reset(); 
	 				fs_initfocus(); 
	 			}	else { 
	 				if (fs_bfdonebt != null) { 
	 					if (fs_bfdonebt.type != 'button') 
	 						try{ fs_bfdonebt.select();} catch (e) {} 
	 					fs_bfdonebt.focus(); 
	 				} 
	 			} 
	 		} 
	 	} 
	 } 
	
	 function fs_getFS_taborder(){ 
	 return fs_taborder; } 
	
	 function fs_enterTab(myfield, e) { 
	 var key; var keychar;  
	 if (window.event) key = window.event.keyCode; else if (e) key = e.which; else return true; 
	 keychar = String.fromCharCode(key); 
	 if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) return true; 
	 else if (key !=13) return true; 
	 else {  
	 	var dec = fs_taborder[0];  
	 	var tabcount = fs_taborder.length;  
	  for (var i = 0; i < tabcount; i++) {  
	 		if ((fs_taborder[i] == myfield.name) && (i+1 < tabcount)) { 
	 			dec = fs_taborder[i+1];  
	 			break; 
	 		} 
	 	}  
	 if (dec && (key==13)) {  
	 	try{myfield.form.elements[dec].focus();  }catch(ex) { }
	 	return false;  
	 } else return false; } 
	 } 
	
	 function fs_intNumsOnly(myfield, e,decimal,isPlus) { 
	 var key; var keychar;  
	 if (window.event) key = window.event.keyCode; else if (e) key = e.which; else return true; 
	 keychar = String.fromCharCode(key); 
	  var element = myfield; 
	  isPlus = ( isPlus != null )? true : false ; 
	  var isPoint= ( decimal != null && decimal != 0 )? true : false ; 
	  if ( key==45 && element.value.indexOf('-')==-1 && !isPlus  ) { 
	  element.value="-"+element.value;} 
	  if ( (key==46)&&(element.value.indexOf('.')==-1)&& isPoint ){ 
	  if (element.value == "") element.value='0'; 
	  return true; } 
	 if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) return true; 
	 else if ((("0123456789").indexOf(keychar) > -1)) return true; 
	 else { var dec = fs_taborder[0]; var tabcount = fs_taborder.length;  
	  for (var i = 0; i < tabcount; i++) { if ((fs_taborder[i] == myfield.name) && (i+1 < tabcount)) {dec = fs_taborder[i+1]; break;}}  
	 if (dec && (key==13)) { try{myfield.form.elements[dec].focus();}catch(ex) { } return false; } else return false; } 
	 } 
	 function fs_freezeform(){ 
	 	fs_freeze = true; 
	 	setTimeout('fs_changemousecursor("wait")',50); 
	 } 
	
	 function fs_unfreezeform(){ 
	 	fs_freeze = false; 
	 	setTimeout('fs_changemousecursor("default")',50); 
	 } 
	
	 function fs_changemousecursor(s) { 
	 	for(var i=0;i<document.all.length;i++) document.all(i).style.cursor=s; 
	 } 


		 var popLookup;  
		 var menus=new Array();  
		 var menuCount=0;  
		 var highlightColor="#FFFFCC";  
		 var borderWidth=1;  
		 var borderHeight=1;  
		 var paddingWidth=3;  
		 var paddingHeight=3;  
		 var itemWidth=125;  
		 var itemHeight=19;  
		 var ellookup; 
		 var eldesc; 
		 var MAXITEM = 15;  
		 var fsXSLLookup = null; 
		   
		 function alertDialog() { 
		 
		 } 
		 function menu (left,top,menuwidth) {  
		 	this.left = left;   
		 	this.top = top;   
		 	this.width = menuwidth;  
		 	this.children = new ActiveXObject("Microsoft.XMLDOM");  
		 }  
		   
		 function addMenu(left,top,menuwidth) {  
		 	if(!menuwidth)  menuwidth = itemWidth;  
		 	menus[menuCount] = new menu(left,top,menuwidth);  
		 	menuCount++;		   
		 }  
		   
		 function addXMLNode(xmldocs,html,url) {  
		 	if(xmldocs) {  
		 		var rootnode;  
		 		if(xmldocs.xml) {  
		 			rootnode = xmldocs.documentElement;		  
		 		} else {  
		 			rootnode = xmldocs.createElement("root");  
		 			xmldocs.appendChild(rootnode);  
		 		}		  
		 		var rownode = xmldocs.createElement("row");  
		 		if(url) rownode.setAttribute("scripts",url);  
		 		var elementnode = xmldocs.createElement("element");  
		 		var textnode = xmldocs.createTextNode(html);						  
		 		rootnode.appendChild(rownode);  
		 		rownode.appendChild(elementnode);  
		 		elementnode.appendChild(textnode);  
		 	}  
		 }  
		   
		 function addMenuItem (html,url,background) {  
		 	if(menus[menuCount-1] && html) {  
		 		addXMLNode(menus[menuCount-1].children,html,url);  
		 	}  
		 }  
		   
		 function addMenuItemByID (html,url,background,menuID,menuWidth) {  
		 	if(!menus[menuID]) return;  
		 	if(html) {  
		 		if(menuWidth) menus[menuID].width = menuWidth;  
		 		addXMLNode(menus[menuID].children,html,url);  
		 	}  
		 }  
		   
		 function clearMenu(menuID) {  
		 	menus[menuID] = null;  
		 }  
		   
		 function setMenus(numberOfMenus) {  
		 	if(numberOfMenus && (numberOfMenus>0)) {  
		 		for(var i=0;i<numberOfMenus;i++) {  
		 			if(!menus[i]) {  
		 				addMenu(0,0);  
		 			}  
		 		}  
		 	}  
		 }  
		 function xmlLookup(xmlDocs,menuWidth,menuID) {  
		 	if(!xmlDocs) return;  
		 	if(!menuID) menuID = 0; 
		 	if(!menus[menuID]) addMenu(0,0); 
		 	if(menus[menuID]) {  
		 		if(menuWidth) menus[menuID].width = menuWidth;  
		 		menus[menuID].children = xmlDocs;  
		 	}  
		 }  
		 function lookup(el,desc,section,singleShow,id,doc) { 
			 /*
			try {
				lookupCombo(el,desc,section,singleShow,id,doc);
			}catch(ex) { }
			*/
			lookupPopup(el,desc,section,singleShow,id,doc);
		 }
		 function lookupCombo(el,desc,section,singleShow,id,doc) { 
		 	if(!doc)  doc  = document;  
		 	if(!id) id = 0; 
		 	var ex = null;  
		 	ellookup = el;  
		 	eldesc = desc; 
		 	beforeLookup(ellookup); 
		 	if(!menus[id]) return;  
			var dataMap = {};
		 	var dataAry = composeLookupDatas(id,singleShow,dataMap);	  
		 	if(!dataAry) return;  
 			var fscombo = $(el).combobox({
					data: dataAry,
					autoShow: false,
					matchMiddle: false,
					listContainerTag : 'span',
					arrowHTML: function() { return $("<a></a>"); },
					select : function(e,ui) { choose(ui.value,id,ui.index,ui.value || dataMap[ui.value]); },
					listHTML: function(data, i) {
						var dataShow = data;
						if(!singleShow && dataMap[data]) dataShow += " - "+dataMap[data];
						var cls = i % 2 ? 'odd' : 'even';								
						return '<span class = "ui-combobox-item ' + cls + '">' + dataShow + '</span>';
					}
			});
			fscombo.combobox("showList");
		 }			
		 function composeLookupDatas(menuID,singleShow,dataMap) {  
		 	var result = null;
		 	if(menus[menuID]) {  
		 		var xmldocs = menus[menuID].children;  
		 		if(xmldocs && xmldocs.documentElement) {  
		 			if(xmldocs.documentElement.childNodes.length>0) {  
		 				var pnode = xmldocs.documentElement;  
		 				var attr = pnode.getAttribute("type");  
		 				if(attr && ((attr=="error") || (attr=="none"))) return result;  
						result = new Array();
		 				var cnode = pnode.childNodes[0];  
		 				var element1 = "element";  
		 				var element2;  
		 				if(cnode.childNodes.length>0) {  
		 					element1 = cnode.childNodes[0].nodeName;  
		 					if(element1=="#text") {  
		 						element1 = cnode.nodeName;  
		 					}  
		 					if(cnode.childNodes.length>1) {  
		 						element2 = cnode.childNodes[1].nodeName;						  
		 					}					  
		 				}
						var item2s = null;
						if(element2) item2s = xmldocs.documentElement.getElementsByTagName(element2);
						var item1s = xmldocs.documentElement.getElementsByTagName(element1);
						if(item1s.length>0) {
							for(var i=0;i<item1s.length;i++) {
								var node1 = item1s[i];
								var value1 = node1.childNodes[0].nodeValue;
								result.push(value1);
								if(item2s && item2s.length>0) {	
									var value2 = '';
									if(item2s[i].childNodes[0]) value2 = item2s[i].childNodes[0].nodeValue;
									dataMap[value1] = value2;
								} else {
									dataMap[value1] = value1;
								}
							}
						}
					}
				}
			}
			return result;
		 }
		 function lookupPopup(el,desc,section,singleShow,id,doc) { 
		 	if(!doc)  doc  = document;  
		 	if(!id) id = 0; 
		 	var ex = null;  
		 	ellookup = el;  
		 	eldesc = desc; 
		 	beforeLookup(ellookup); 
		 	try	{		  
		 		if(ellookup.className=="") {  
		 			ellookup.className = "LOOKUP";  
		 		} else {  
		 			var i = ellookup.className.indexOf("LOOKUP");  
		 			if(i<0) {  
		 				ellookup.className = ellookup.className+" LOOKUP";  
		 			}  
		 		}  
		 	} catch (ex)	{	}  
		 	if(popLookup==null) {  
		 		popLookup = window.createPopup();  
		 	}	  
		 	if(!menus[id]) return;  
		 	var ahtml = drawMenus(id,section,singleShow);	  
			if(ahtml=='') return;  
		 	try	{  
		 	var aCount = menus[id].children.documentElement.childNodes.length; 
			if(section) {
				var childs = menus[id].children.documentElement.getElementsByTagName(section);
				if(childs && childs.length>0) {
					aCount = childs[0].childNodes.length;
				}
			}
		 	var nHeight = ((itemHeight+borderHeight)*MAXITEM+borderHeight);  
		 	if(aCount<MAXITEM) nHeight = ((itemHeight+borderHeight)*aCount+borderHeight);  
			nHeight += 4;
		 	var awidth = menus[id].width;  
		 	if(awidth<ellookup.offsetWidth) awidth = ellookup.offsetWidth;  
		 	var pwidth = awidth + 20;	  
		 	popLookup.document.open();  
		 	popLookup.document.write(ahtml);  
		 	popLookup.document.body.style.border = "1px solid #CCCCCC";  
		 	popLookup.document.body.style.borderColor = "#EEEEEE #999999 #999999 #EEEEEE";  
		 	popLookup.document.body.style.background = "#CCCCCC";  
		 	popLookup.document.body.style.marginLeft = 0;  
		 	popLookup.document.body.style.marginRight = 0;  
		 	popLookup.document.body.style.marginTop = 0;  
		 	popLookup.document.body.style.marginBottom = 0;  
		 	popLookup.document.body.style.overflow = "auto";  
		 	if(aCount>MAXITEM) {  
		 		popLookup.document.body.style.overflow = "";  
		 		pwidth = awidth + 20;  
		 	}  
		 	popLookup.document.close();  
		 	var anode = window.document.getElementById(ellookup);  
		 	popLookup.show(ellookup.clientX,ellookup.offsetTop+ellookup.offsetHeight,pwidth,nHeight,ellookup);  
		 	} catch(ex) {   
		 	}  
		 }  
		 function choose(value,curMenu,curItem,desc) { 
		 	var ex = null;  
		 	var aScript;  
		 	if(menus[curMenu]) {  
		 		try	{  
		 		var xmldocs = menus[curMenu].children;  
		 		if(xmldocs && xmldocs.documentElement) {  
		 			var xmlChild = xmldocs.documentElement.childNodes;			  
		 			if (xmlChild.length>curItem) {  
		 				aScript = xmlChild[curItem].getAttribute("scripts");  
		 			}				  
		 		}  
		 		} catch(ex) { }  
		 	}  
		 	if(aScript && (aScript!="")) {  
		 		window.execScript(aScript);		  
		 	} else {  
		 		startSelectLookup(ellookup,desc);	  
		 		try {  
		 			ellookup.startSelect();	  
		 		} catch(ex) {}  
		 		try	{  
		 			ellookup.value = value;		  
		 			ellookup.innerText = value;  
		 		} catch (ex) { 	}  
		 		try	{  
		 			eldesc.innerText = desc;  
		 			eldesc.value = desc;		  
		 		} catch (ex) { 	}  
		 		try	{  
		 			ellookup.lookupFinish();	  
		 		}  
		 		catch (ex)	{	}  
		 		afterLookup(ellookup,desc);	  
		 	}  
		 	if(popLookup) popLookup.hide();  
		 }  
		 function beforeLookup(src) { } 
		 function startSelectLookup(src,desc) { } 
		 function afterLookup(src,desc) { } 
		 function drawMenus(menuID,section,singleShow) {  
		 	var result = '';  
		 	if(menus[menuID]) {  
		 		var xmldocs = menus[menuID].children;  
		 		if(xmldocs && xmldocs.documentElement) {  
		 			if(xmldocs.documentElement.childNodes.length>0) {  
		 				var pnode = xmldocs.documentElement;  
		 				var attr = pnode.getAttribute("type");  
		 				if(attr && ((attr=="error") || (attr=="none"))) return result;  
		 				var selectelement = pnode.nodeName;  
		 				var element = "element";  
		 				var element2;  
		 				var enode = pnode;
						if(section) {
							var childs = xmldocs.documentElement.getElementsByTagName(section);
							if(childs && childs.length>0) {
								enode = childs[0];
								if(enode.childNodes.length>0) {
									selectelement += "/"+enode.nodeName;
								}
							}
						}
						var cnode = enode.childNodes[0];  
		 				if(cnode.childNodes.length>0) {  
		 					element = cnode.childNodes[0].nodeName;  
		 					if(element=="#text") {  
		 						element = cnode.nodeName;  
		 					} else {  
		 						selectelement += "/"+cnode.nodeName;  
		 					}  
		 					if(cnode.childNodes.length>1) {  
		 						element2 = cnode.childNodes[1].nodeName;						  
		 					}	  
						}
		 				var astr = "</script"; 
		 				var xslstr = new String('<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> '+  
		 				'<xsl:template match="/">'+  
						'<html><title>Lookup</title><head>'+
		 				'<style type="text/css"> tr { height: 20px; } '+ 
		 				'tr.odd {background: #eeeeee;} '+ 
		 				'tr.event {background: #ffffff;} '+ 
						'a:hover { background: '+highlightColor+';}'+
		 				'</style> '); 
						try {
							$("head link").each(function(index,element) {
								var ahref = $(this).attr("href");
								if(ahref) xslstr += '<link href="'+ahref+'" rel="stylesheet" type="text/css" />';
							});
						} catch(ex) { }
		 				xslstr += '<script language="JavaScript"> '+  
		 				'var lightColor = "'+highlightColor+'"; '+  
		 				'var curMenu = '+menuID+'; '+  
		 				'function doKeyDown(e) { e.keyCode = 0; e.cancelBubble = true;  return false; }'+ 		
		 				'function mouseClick(row,value,desc) { var ex; 	try { parent.choose(value,curMenu,row,desc); } catch(ex) {} } '+  
		 				astr+'> '+  
		 				'</head><body onkeydown="return doKeyDown(event);">'+ 		
		 				'<table id="lookup" width="100%"  border="0" cellspacing="0" class="ui-state-default"> '+  
		 				'<xsl:for-each select="'+selectelement+'"> '+  
		 				'<tr class="odd"> '+  
		 				'<xsl:if test="position() mod 2 = 0"><xsl:attribute name="class">event</xsl:attribute></xsl:if> '+  
		 				'<td class="elementline" width="100%" style="cursor: pointer;" > '+  
		 				'<xsl:attribute name="onclick">mouseClick(<xsl:value-of select="position() - 1"/>,'+ 
		 				'"<xsl:value-of select="'+element+'"/>"'; 
		 				if(element2) xslstr = xslstr + ',"<xsl:value-of select="'+element2+'"/>"';  
		 				xslstr = xslstr + ')</xsl:attribute> '+  
		 				'<div class="elementlayer" width="100%"> '+  
		 				'<a href="#" tabIndex="-1" ondragstart="return false;" style="text-decoration: none; font-size: 12px; font-weight: bold; /*color: #000000; */ width:100%;" > '; 
						if(!singleShow) singleShow = "both";
						if(singleShow=="key") {
		 					xslstr += '<xsl:value-of select="'+element+'"/> ';  
						} else {
							if(singleShow=="value" && element2) xslstr += '<xsl:value-of select="'+element2+'"/>';   
		 					if(singleShow=="both") {
								xslstr += '<xsl:value-of select="'+element+'"/> ';  
								if(element2) xslstr += ' - <xsl:value-of select="'+element2+'"/>';  
							}
						}
		 				xslstr = xslstr +  '</a> </div> </td> ';  
		 				xslstr = xslstr + '</tr> </xsl:for-each> </table> </body></html> </xsl:template> </xsl:stylesheet> ';  
		 				fsXSLLookup = $.parseXML(xslstr);  
		 				return $.transform(xmldocs,fsXSLLookup);  
		 			}  
		 		}  
		 	}  
		 	return result;  
		 }  
		  
		 function convert(str) { 
			if(str==null) return "";
		 	var i = 0; 
		 	var result = ""; 
		 	for(i=0;i<str.length;i++) { 
		 		var a = str.charCodeAt(i); 
		 		if(a>3424) { 
		 			a = a - 3424; 
		 			result = result + String.fromCharCode(a); 
		 		} else { 
		 			result = result + str.charAt(i); 
		 		} 
		 	} 
		 	result = escape(result); 
		 	while(result.indexOf('+')!=-1) result = result.replace('+','%2B'); 
		 	return result; 
		 } 

		 function hasElement(aValue,xmlDocs) { 
			if(!aValue) return false; 
		 	if(!xmlDocs) return false; 
		 	var ex; 
		 	try{ 
				if(window.DOMParser) { // Standard
					var xmlChild = $("root",xmlDocs).children();
					//alert("xmlChild : "+xmlChild.length);
					if(xmlChild.length>0) { 
						for(var i=0; i<xmlChild.length; i++) {
							var rNode = $("root",xmlDocs).children(); //$("root row",xmlDocs).children();
							var cNode = rNode.eq(i).children();
							var vElement = cNode.eq(0).text();
							var vDesc = cNode.eq(1).text();
							//alert("vElement: "+vElement+", vDesc: "+vDesc);
							if(vElement && (vElement==aValue)) {
								if(vDesc) return vDesc;
								return " ";
							}
						}
					}
				}else { // IE
					if(xmlDocs.documentElement) { 
						var xmlChild = xmlDocs.documentElement.childNodes; 
						if(xmlChild) { 
							for(var i=0;i<xmlChild.length;i++) { 
								var cnode = xmlChild[i]; 
								var aElement = cnode.text; 
								var scnode1 = cnode.childNodes[0]; 
								if(scnode1) aElement = scnode1.text; 
								if(aElement && (aElement==aValue)) { 
									var scnode2 = cnode.childNodes[1]; 
									if(scnode2) { 
										if(scnode2.text) return scnode2.text; 
										return " "; 
									} 
									return true; 
								} 
							}
						} 
					} 
				}
		 	} catch(ex) { } 
		 	return false; 
		 }
		  
		 function validElement(xmlDocs,showflag) { 
		 	if(!xmlDocs) return false; 
		 	var ex; 
		 	try{ 
		 		if(xmlDocs.documentElement) { 
		 			var mnode = xmlDocs.documentElement; 
		 			var attr = mnode.getAttribute("type"); 
		 			if(attr) { 
		 				if(attr=="error") { 
		 					if(showflag) 	alertDialog(mnode.text); 
		 					return false; 
		 				} else if(attr=="result") { 
		 					for(var i=0,isz=xmlDocs.documentElement.childNodes.length;i<isz;i++) { 
		 						var anode = xmlDocs.documentElement.childNodes[i]; 
		 						if(anode.nodeName=="body") { 
		 							if(anode.text) return anode.text; 
		 							return " "; 
		 						} 
		 					} 
		 					if(mnode.text) return mnode.text; 
		 					return true; 
		 				} else if(attr=="none") { 
		 					if(showflag) alertDialog(mnode.text); 
		 					return false; 
		 				} 
		 			} 
		 		} 
		 	} catch(ex) { } 
		 	return false; 
		 } 

		 function windowLookup(el,desc,url,w,h) { 
		 if(!url) return; 
		 var ex = null;  
		 ellookup = el;  
		 eldesc = desc; 
		 var features ="toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,fullscreen=no";  
		 var winname = "lookup_window";  
		 window.open(url,winname,features);  
		 } 

		 function lookupChoosing(value,desc) { 
		 var ex;  
		 try	{  
		 	ellookup.value = value;  
		 	ellookup.innerText = value;  
		 } catch (ex) { 	}  
		 try	{  
		 	eldesc.value = desc;  
		 	eldesc.innerText = desc;  
		 } catch (ex) { 	}  
		 } 

		 function dialogLookup(el,desc,url,w,h) { 
		 if(!url) return; 
		 var ex = null;  
		 ellookup = el;  
		 eldesc = desc; 
		 if(!w) w = 350; 
		 if(!h) h = 150; 
		 var arguments = ''; 
		 var features = "dialogWidth="+w+"px;dialogHeight="+h+"px;scrollbars=no;center=yes;border=thin;help=no;status=no;"; 
		 var reply = window.showModalDialog(url,arguments,features);	 
		 if(reply) { 		
		 	var xmldocs = new ActiveXObject("Microsoft.XMLDOM");
		 	xmldocs.async = false;
		 	xmldocs.loadXML(reply); 
		 	if(xmldocs.documentElement) { 
		 		var anode = xmlDocs.documentElement.childNodes[0]; 
		 		if(anode) { 
		 			try	{  
		 				ellookup.value = anode.text;  
		 				ellookup.innerText = anode.text;  
		 			} catch (ex) { 	}  
		 		} 
		 		try	{  
		 			anode = xmlDocs.documentElement.childNodes[1]; 
		 			if(anode) { 
		 				eldesc.value = anode.text;  
		 				eldesc.innerText = anode.text;  
		 			} 
		 		} catch (ex) { 	}  
		 	} 
		 } 
		 } 
			
		 function popupLookup(el,desc,url,w,h) { 
		 if(!url) return; 
		 var xmldocs = new ActiveXObject("Microsoft.XMLDOM"); 
		 xmldocs.async="false"; 
		 var reply = xmldocs.load(url); 
		 if(reply) { 
		 	try { 
		 		xmlLookup(xmldocs,w); 
		 		lookup(el,desc);
		 	} catch(ex) {alert(ex.description);} 
		 } 
		 }

		 function luanchWindow(winname,winWidth,winHeight,fullScreening) { 
			if(typeof(winname)==="object") return openNewWindow(winname);
		 	if(!winname) return; 
			return openNewWindow({ url: "", windowName: winname, windowWidth: winWidth, windowHeight: winHeight, fullScreen: fullScreening});	
		 } 

		 function openWindow(aurl,winname,winWidth,winHeight,fullScreening) { 
			if(typeof(aurl)==="object") return openNewWindow(aurl);
		 	if(!winname) return;  
			var parameters = null;
			if(aurl) {
				var idx = aurl.indexOf("?");
				if(idx>0) {					
					parameters = aurl.substring(idx+1);
					aurl = aurl.substring(0,idx);
				}
			}
			return openNewWindow({ url: aurl, params: parameters, windowName: winname, windowWidth: winWidth, windowHeight: winHeight, fullScreen: fullScreening});
		 } 
		
		  function validNumeric(myfield){ 
		   var data=myfield.value; 
		   if (data!="") { 
		 	data = clearComma(data);  
		 	if (data.length>1) {  
		 		if (data.indexOf('.')==0)	data='0'+data; 
		 		if (data.indexOf('.')==data.length-1) data += '0';  
		 	} 
		 	data =  formatFloat(data , myfield.getAttribute("DECIMAL") ); 
		 	if (  data == 0 || Number(data)  ) ;  
		 	else return false; 
		 	myfield.value = putComma(data); 
		   } 
		   return true; 
		 } 

		  function formatFloat(myvalue , point){ 
		   if ( point == null || point <= 0 ) return myvalue ; 
		   var dec = "0"; 
		   dec += (myvalue.indexOf('.')>-1 )?myvalue.substring( myvalue.indexOf('.') ):".0"; 
		 	var i = point - (dec.length-2) ; 
		 	for ( ;i>0 ;i-- ){ dec +="0"; } 
		 	var x =( myvalue.indexOf('.')>-1 )?myvalue.substring(0,myvalue.indexOf('.')):myvalue ; 
		 	return  x+dec.substring(dec.indexOf('.')); 
		 } 

		  function validDate(myfield){ 
		  if ( myfield == null || myfield.value=="" ) return true; 
		  if ( formatDate(myfield.value) ) return true; 
		  else return false; 
		 } 

		  function formatDate(mydate) { 
		   var delimiter = "/"; 
			var dmy = /\d{1,2}\/\d{1,2}\/\d{2,4}/ ;
		 	if ( !mydate.match(dmy) ) return false; 
		 	var intDay = new Date(); 
		 	intDay.setDate(1); 
		 	var ary_date = mydate.split(delimiter); 
		 	var y=ary_date[2]; 
		 	if ( y.length==2 ) { 
		 	if (y>=80) { y = intDay.getYear()-100-(intDay.getYear()%100)+eval(y) ;   
		 	}else { y = intDay.getYear()-(intDay.getYear()%100)+ eval(y) ;}  
		 	}else if ( y.length==3 )  return false; 
		 	intDay.setYear(y);   
		 	var m = eval(ary_date[1]) ; 
		  if ( (m>0) && (m<=12) ) { intDay.setMonth(m);   intDay.setDate(0); } 
		  else   return false ; 
		  var d = eval(ary_date[0]); 
		  if ( (d>0) && (d<=intDay.getDate()) ) return true;  
		  else return false; 
		 } 

		 function validRangeDate(a,b){ 
         try{ 
         	if ( a!="" && b!="" ){ 
		 		var vala = a.split("/").reverse().join(""); 
		 		var valb = b.split("/").reverse().join(""); 
		 		if ( eval(valb)<eval(vala) ) return false; 
         	} 
         }catch(ex){  } 
         return true; 
		 } 

		 	function increaseValue(avalue,addonvalue,decimal) { 
		 		if(!decimal) decimal = 0; 
		 		return forValue(avalue,addonvalue,decimal,"+"); 
		 	} 
		  
		 	function decreaseValue(avalue,addonvalue,decimal) { 
		 		if(!decimal) decimal = 0; 
		 		return forValue(avalue,addonvalue,decimal,"-"); 
		 	} 
		  
		 	function forValue(avalue,addonvalue,decimal,flag) { 
		 		var result = eval(removeComma(avalue)); 
		 		if(decimal>0) { 
		 			var mval = Math.pow(10,decimal); 
		 			var addon = addonvalue * mval; 
		 			result = result * mval; 
		 			if(flag=="+") { 
		 				result = result + addon; 
		 			} else { 
		 				result = result - addon; 
		 			} 
		 			result = result / mval;			 
		 		} else { 
		 			if(flag=="+") { 
		 				result = result + addonvalue; 
		 			} else { 
		 				result = result - addonvalue; 
		 			} 
		 		} 
		 		return result; 
		 	} 
		 		 
		 	function parseNumber(avalue) { 
		 		return eval(removeComma(avalue)); 
		 	} 
		  
		 	function removeComma(avalue) { 
		 			var result = avalue ; 
		 			while ( result.indexOf(",") > -1 ) { 
		 				result = removeDelimiter(result,",");	} 
		 			return result; 
		 	} 
		 				 
		 	function removeDelimiter(avalue,delimiter) { 
		 			return avalue.replace(delimiter,""); 
		 	} 
		 							 
		 	function formatFloating(avalue,decimal) { 
		 			avalue = avalue+""; 
		 			avalue = removeComma(avalue); 
		 			return formatDecimal(avalue,decimal,true); 
		 	} 
		 							 
		 	function formatDecimal(avalue,decimal,verifydecimal) { 
		 			var sign = ""; 
		 			var result = avalue+"";			 
		 			var bstr = ""; 
		 			var cstr = ""; 
		 			var i = result.indexOf("-"); 
		 			if(i>=0) { 
		 				sign = "-"; 
		 				result = result.substring(i+1); 
		 			} else { 
		 				i = result.indexOf("+"); 
		 				if(i>=0) { 
		 					sign = "+"; 
		 					result = result.substring(i+1);					 
		 				} 
		 			} 
		 			var astr = result; 
		 			i = result.indexOf("."); 
		 			if(i>0) { 
		 				astr = result.substring(0,i); 
		 				bstr = result.substring(i+1); 
		 				cstr = result.substring(i); 
		 			}  
		 			var la = astr.length; 
		 			if(la>3) { 
		 				var tstr = astr; 
		 				astr = ""; 
		 				while(tstr!="") { 
		 					la = tstr.length; 
		 					var md = la % 3; 
		 					if(md>0) { 
		 						astr += tstr.substring(0,md)+","; 
		 						tstr = tstr.substring(md); 
		 					} else { 
		 						astr += tstr.substring(0,3); 
		 						tstr = tstr.substring(3); 
		 						if(tstr!="") astr += ","; 
		 					} 
		 				} 
		 			} 
		 			if(verifydecimal) { 
		 				if(decimal>0) { 
		 					var l = bstr.length; 
		 					if(decimal>l) { 
		 						var j = 0; 
		 						for(j=l;j<decimal;j++) { 
		 							bstr += "0"; 
		 						} 
		 					} else { 
		 						bstr = bstr.substring(0,decimal); 
		 					}		 
		 					if(astr=="") return ""; 
		 					return sign+astr+"."+bstr; 
		 				} else { 
		 					return sign+astr; 
		 				} 
		 			} else { 
		 				return sign+astr+cstr; 
		 			} 
		 	}						 
		  
		 function getTimeNow() { 
		 	var now = new Date(); 
		 	var hh = now.getHours(); 
		 	var mm = now.getMinutes(); 
		 	var ss = now.getSeconds(); 
		 	var result = ((hh < 10) ? "0":"") + hh; 
		 	result += ((mm < 10) ? ":0" : ":") + mm; 
		 	result += ((ss < 10) ? ":0" : ":") + ss; 
		 	return result; 
		 } 
		  
		 function getDateNow() { 
		 	var now  = new Date(); 
		 	var dd = now.getDate(); 
		 	var mm = now.getMonth()+1; 
		 	var yy = now.getYear(); 
		 	var result = ((dd < 10) ? "0" : "") + dd; 
		 	result += ((mm < 10) ? "/0" : "/") + mm; 
		 	result += "/"+yy; 
		 	return result; 
		 } 
		//addon autocomplete
		 var fsREQ; 
		 var fsAutoXMLDocs; 
		 var fsUseKeys = true; 
		 var fsAutoSrc; 
		 var fsAutoDesc; 
		  
		 function fs_InitRequest(fsURL) { 
		     if (window.XMLHttpRequest) { 
		         fsREQ = new XMLHttpRequest(); 
		     } else if (window.ActiveXObject) { 
		 		fsREQ = new ActiveXObject("Microsoft.XMLHTTP"); 
		     } 
		 	return fsREQ; 
		 } 
		  
		 function fs_AutoComplete(fsSrc,fsDesc,fsURL,fsKeyUsage) { 
		 	if(!fsURL) return; 
		 	if(fsKeyUsage!=null) fsUseKeys = fsKeyUsage; 
		     fsREQ = fs_InitRequest(fsURL); 
		 	fsAutoSrc = fsSrc; 
		 	fsAutoDesc = fsDesc; 
		     fsREQ.onreadystatechange = fs_ProcessRequest; 
		     fsREQ.open("GET", fsURL, true); 
		     fsREQ.send(null); 
		 } 
		  
		 function fs_ProcessRequest() { 
		     if (fsREQ.readyState == 4) { 
		         if (fsREQ.status == 200) { 
		           fs_ParseMessages(fsAutoSrc,fsAutoDesc); 
		         } 
		     } 
		 } 
		  
		 function fs_ParseMessages(src,desc) { 
		 	fsAutoXMLDocs = fsREQ.responseXML; 
		 	if(fsAutoXMLDocs.documentElement) { 
		 		fs_AutoLookup(src,desc); 
		 	} 
		 } 
		  
		 var fs_popLookup;  
		 var fs_highlightColor="#FFFFCC";  
		 var fs_borderWidth=1;  
		 var fs_borderHeight=1;  
		 var fs_paddingWidth=3;  
		 var fs_paddingHeight=3;  
		 var fs_itemWidth=125;  
		 var fs_itemHeight=15;  
		 var fs_ellookup;//currentEdit  
		 var fs_eldesc; 
		 var fs_MAXITEM = 12;  
		 var fs_AutoXSLLookup = null; 
		   
		 function fs_AutoLookup(el,desc,id,doc) {//click lookup botton  
		 	if(!doc)  doc  = document;  
		 	if(!el) return; 
		 	var ex = null;  
		 	fs_ellookup = el; 	  
		 	fs_eldesc = desc; 
		 	if(fs_popLookup==null) {  
		 		fs_popLookup = window.createPopup();  
		 	} 
		 	var fs_exlookup = fsUseKeys?fs_ellookup:fs_eldesc; 
		 	var ahtml = fs_AutoDrawMenus(fs_exlookup.value);	  
		 	if(ahtml=='') return;  
		 	try	{  
		 	var aCount = fsAutoXMLDocs.documentElement.childNodes.length;  
		 	var nHeight = ((fs_itemHeight+fs_borderHeight)*fs_MAXITEM+fs_borderHeight);  
		 	if(aCount<fs_MAXITEM) nHeight = ((fs_itemHeight+fs_borderHeight)*aCount+fs_borderHeight);  
		 	var awidth = fs_itemWidth; 
		 	if(awidth<fs_exlookup.offsetWidth) awidth = fs_exlookup.offsetWidth;  
		 	var pwidth = awidth; 
		 	fs_popLookup.document.open();  
		 	fs_popLookup.document.write(ahtml);  
		 	fs_popLookup.document.body.style.border = "1px solid #000000";  
		 	fs_popLookup.document.body.style.background = "#FFFFFF";  
		 	fs_popLookup.document.body.style.marginLeft = 0;  
		 	fs_popLookup.document.body.style.marginRight = 0;  
		 	fs_popLookup.document.body.style.marginTop = 0;  
		 	fs_popLookup.document.body.style.marginBottom = 0;  
		 	fs_popLookup.document.body.style.overflow = "auto";  
		 	if(aCount>fs_MAXITEM) {  
		 		fs_popLookup.document.body.style.overflow = "";  
		 		pwidth = awidth + 20;  
		 	}  
		 	fs_popLookup.document.close();  
		 	fs_popLookup.show(fs_exlookup.clientX,fs_exlookup.offsetTop+fs_exlookup.offsetHeight-3,pwidth,nHeight,fs_exlookup);  
		 	} catch(ex) {   
		 	}  
		 }  
		   
		 function fs_AutoChoose(value,curMenu,curItem,desc) {//internal routine for user select item 
		 	try	{  
		 		fs_ellookup.value = value;		  
		 		fs_ellookup.innerText = value;  
		 	} catch (ex) { 	}  
		 		try	{  
		 			fs_eldesc.innerText = desc;  
		 			fs_eldesc.value = desc;		  
		 		} catch (ex) { 	}  
		 	if(fs_popLookup) fs_popLookup.hide();  
		 }  
		  
		 function fs_AutoDrawMenus(filter) { 	 
		 	var menuID = 0; 
		 	var result = '';  
		 	if(fsAutoXMLDocs && fsAutoXMLDocs.documentElement) {  
		 		if(fsAutoXMLDocs.documentElement.childNodes.length>0) {  
		 			var pnode = fsAutoXMLDocs.documentElement;  
		 			var attr = pnode.getAttribute("type");  
		 			if(attr && ((attr=="error") || (attr=="none"))) return result;  
		 			var selectelement = pnode.nodeName;  
		 			var cnode = pnode.childNodes[0];  
		 			var element = "element";  
		 			var element2;  
		 			if(cnode.childNodes.length>0) {  
		 				element = cnode.childNodes[0].nodeName;  
		 				if(element=="#text") {  
		 					element = cnode.nodeName;  
		 				} else {  
		 					selectelement += "/"+cnode.nodeName;  
		 				}  
		 				if(cnode.childNodes.length>1) {  
		 					element2 = cnode.childNodes[1].nodeName;						  
		 				}					  
		 			}  
		 			var xslstr = new String('<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> '+  
		 			'<xsl:template match="/">'+  
		 			'<style type="text/css"> tr { height: 20px; } </style> '+  
		 			'<script language="JavaScript"> '+  
		 			'var lightColor = "'+fs_highlightColor+'"; '+  
		 			'var curMenu = '+menuID+'; '+  
		 			'function mouseOver(e) { '+  
		 			'var ex; 	try { var tag = e.srcElement.tagName; '+  
		 			'if(tag=="DIV") { 	e.srcElement.style.background = lightColor; return; 	} '+  
		 			'if(tag=="A") { e.srcElement.parentNode.style.background = lightColor; return; 	} '+  
		 			'e.srcElement.childNodes[0].style.background = lightColor; }catch(ex) { } 	} '+  
		 			'function mouseOut(e) { var ex; try { var tag = e.srcElement.tagName; '+  
		 			'if(tag=="DIV") { 	e.srcElement.style.background = ""; 	return; } '+  
		 			'if(tag=="A") { 	e.srcElement.parentNode.style.background = ""; return; } '+  
		 			'e.srcElement.childNodes[0].style.background = ""; }catch(ex) { }  } '+  
		 			'function mouseClick(row,value,desc) { var ex; 	try { parent.fs_AutoChoose(value,curMenu,row,desc); } catch(ex) {} } '+  
		 			'</'+ 
		 			'script> '+  
		 			'<table id="lookup" width="100%"  border="0" cellspacing="0"> '+  
		 			'<xsl:for-each select="'+selectelement+'"> '); 
		 			if(fsUseKeys) { 
		 				xslstr += '<xsl:if test="starts-with('+element+',&quot;'+filter+'&quot;)">'; 
		 			} else { 
		 				xslstr += '<xsl:if test="starts-with('+element2+',&quot;'+filter+'&quot;)">'; 
		 			} 
		 			xslstr += '<tr class="odd"> '+  
		 			'<xsl:if test="position() mod 2 = 0"><xsl:attribute name="class">even</xsl:attribute></xsl:if> '+  
		 			'<td class="elementline" width="100%" onmouseover="mouseOver(event)" onmouseout="mouseOut(event)"> '+  
		 			'<xsl:attribute name="onclick">mouseClick(<xsl:value-of select="position() - 1"/>,"<xsl:value-of select="'+element+'"/>","<xsl:value-of select="'+element2+'"/>")</xsl:attribute> '+ 
		 			'<div width="100%"> '+  
		 			'<a href="#" ondragstart="return false;" style="text-decoration: none; color: #000000; font-size: 12px; font-weight: bold;" > '; 
		 			if(fsUseKeys) { 
		 				xslstr += '<xsl:value-of select="'+element+'"/>  - <xsl:value-of select="'+element2+'"/> </a> </div> </td> </tr> '; 
		 			} else { 
		 				xslstr += '<xsl:value-of select="'+element2+'"/></a> </div> </td> </tr> '; 
		 			} 
		 			xslstr += '</xsl:if>'+ 
		 			'</xsl:for-each> </table> </xsl:template> </xsl:stylesheet> ';  
		 			fs_AutoXSLLookup = $.parseXML(xslstr);  
		 			return $.transform(fsAutoXMLDocs,fs_AutoXSLLookup);  
		 		}  
		 	}  
		 	return result;  
		 }  

		 function fs_setDescription(src,src_desc) { 
		 	try{ src.innerHTML = src_desc; }catch(ex) { } 
		 } 

		 	function Hash() { 
		 		this.length = 0; 
		 		this.items = new Array(); 
		 		for (var i = 0; i < arguments.length; i += 2) { 
		 			if (typeof(arguments[i + 1]) != 'undefined') { 
		 				this.items[arguments[i]] = arguments[i + 1]; 
		 				this.length++; 
		 			} 
		 		} 
		    		this.removeItem = function(in_key) 	{ 
		 			var tmp_value; 
		 			if (typeof(this.items[in_key]) != 'undefined') { 
		 				this.length--; 
		 				var tmp_value = this.items[in_key]; 
		 				delete this.items[in_key]; 
		 			}	   
		 			return tmp_value; 
		 		} 
		 		this.getItem = function(in_key) { 
		 			return this.items[in_key]; 
		 		} 
		 		this.setItem = function(in_key, in_value) { 
					//alert("in_key: "+in_key+", in_value: "+in_value);
		 			if (typeof(in_value) != 'undefined') { 
		 				if (typeof(this.items[in_key]) == 'undefined') { 
		 					this.length++; 
		 				} 
		 				this.items[in_key] = in_value; 
		 			}	   
		 			return in_value; 
		 		} 
		 		this.hasItem = function(in_key) { 
		 			return typeof(this.items[in_key]) != 'undefined'; 
		 		} 
		 		this.size = function() { 
		 			return this.length; 
		 		} 
		 	} 
		
		 function handleException(xmldocs) { 
		 	if(xmldocs) { 
		 		if(xmldocs.parseError.errorCode!=0) {  
		 			alert("the reason is : "+xmldocs.parseError.reason); 
		 			return false; 
		 		} 
		 		if(xmldocs.documentElement.nodeName.toUpperCase()=="HTML") { 
		 			var awin = luanchWindow("fs_window_error",500,300,false); 
		 			awin.document.open();  
		 			awin.document.writeln(xmldocs.xml); 
		 			awin.document.close(); 
		 			awin.focus(); 
		 			return false; 
		 		} 
		 	} 
		 	return true; 
		 } 
	

	 var regPicture = /[9XEATxea]/; 
	 function fs_maskEnter(element,aPicture,isMinus){ 
	  var letter ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
	  var sletter='abcdefghijklmnopqrstuvwxyz'; 
	  var sign = "!#$%&'()*+%,-./:;<>[]^_{}|~@=\\ \""; 
	  var number = '0123456789'; 
	  if (aPicture==null || aPicture=='') return true; 
	  if (window.event) { 
	   var key = (event.keyCode)?event.keyCode:event.which; 
	   if ( key==null || key==0 || key==9 || key==27 ) return true; 
	   var elm = element.value; 
	   if ( isMinus && elm.charAt(0)!='-' ) { 
	    if ( key==45 ) { 
	     element.maxLength++; 
	     aPicture = element.picture.replace('[-]','-'); 
	    if (elm.length > 0 ) { element.value = '-'+element.value;} 
	    return false;	} 
	    else {	aPicture = element.picture.replace('[-]','');} 
	   } 
	   var formatKey = currentKey(element,aPicture,elm.length); 
	   var keyChar = String.fromCharCode(key); 
	   switch (formatKey) { 
 	    case '9' : return isCharacter(number,keyChar);  
 	    case 'E' : keyChar=toUpper(keyChar);   return isCharacter(letter,keyChar); 
 	    case 'X' : keyChar=toUpper(keyChar);   return isCharacter(sign+letter+number,keyChar); 
 	    case 'A' : keyChar=toUpper(keyChar);   return isCharacter('_-+#&'+letter+number,keyChar ); 
 	    case 'e' : return isCharacter(letter+sletter,keyChar); 
 	    case 'x' : return isCharacter(sign+letter+sletter+number,keyChar); 
 	    case 'a' : return isCharacter('_-+#&'+letter+sletter+number,keyChar ) ; 
 	    case 'T' : return true; 
 	    default  : {event.cancelBubble=true; event.returnValue=false; return false;} 
	   } 
	  } 
	 } 
	 function isCharacter(style,keyChar) { 
	 	if ( style.indexOf(keyChar) > -1 ) return true; 
	 	event.cancelBubble=true; event.returnValue=false; return false; 
	 } 
	 function currentKey(element,aPicture, pos) {  
	 	var type, i, n, len = -1; 
	 	if (pos>=element.maxLength) { 
	 	if (aPicture.search(regPicture) != 0) { return null; } 
	 	pos=0;} 
	 	for (i = 0,n = aPicture.length; i < n ; i++) { 
	 	type = aPicture.charAt(i);  
	 	if ( type.search( regPicture ) > -1  ) {  
	 	if  ( aPicture.charAt(i+1) == '(' ){  
	 	len +=eval(aPicture.substring(i+2, aPicture.indexOf(')',i+2)));   
	 	i  = aPicture.indexOf(')',i+2); } 
	 	else len++ ; 
	 	} 
	 	else len++;   
	 		if (pos<=len )  break ; } 
	 		if (( type.search( regPicture )==-1) && type )  
	 			type = formatType(type,aPicture.substring(i)) ; 
	 		return type ; 
	 } 
	 function formatType(type,val) { 
	 	var posPic = val.search(regPicture) ; 
	 	if (posPic ==-1) {	event.srcElement.value += val ;	return null; } 
	 	else {event.srcElement.value +=val.substring(0,posPic) ;  
	 	return val.charAt(posPic); } 
	 } 
	 function toUpper(keyChar){ 
	 	var k = keyChar.toUpperCase(); 
	 	event.keyCode = k.charCodeAt(0); 
	 	return k; 
	 } 

	 function fs_showModal(url,arguments,width,height) { 
	 	var features = 'dialogWidth='+width+'px;dialogHeight=' +height+'px;scrollbars=no;' +'center=yes;border=thin;help=no;status=no;'; 
	 	return window.showModalDialog(url,arguments,features); 
	 } 
	 function fs_openlookup(input,path,width,height) { 
	 	fs_showModal(path+'dialog.jsp','',width,height); 
	 } 

	 function fs_intNumsOnly_chkKey(myfield, e,decimal,isPlus) { 
	 var iskeyup = myfield.getAttribute('keyup'); 
	 if ( iskeyup==null) ;  
	 else if ( iskeyup==false){  event.returnValue = false;  return false; }  
	 myfield.setAttribute('keyup',false);  
	 return fs_intNumsOnly(myfield, e,decimal,isPlus);  
	 } 

	 function fs_chkKey(myfield,maxvalue,decimal) { 
		var iNum=event.keyCode; 
		if (((iNum>=48)&&(iNum<=57)) || ((iNum>=96)&&(iNum<=105)) || iNum==109 || iNum==110 || iNum==189 || iNum==190 ) { 
			myfield.setAttribute('keyup',true);    
			var c_pos = getCaretPosition(myfield);
			var o_len = myfield.value.length;
			formatNumber(myfield,maxvalue,decimal);
			var n_len = myfield.value.length;
			setCaretPosition(myfield,n_len>o_len?c_pos+1:c_pos);
		} 
	 } 
	 function formatNumber(element,maxvalue,decimal) { 
      var valueBfChange = element.value;
	  var data = element.value; 
	  var point = 0 ; 
	  if ( decimal != null && decimal !=  ""  )  { 
	   point = ( eval(decimal) >= 0 ) ? eval(decimal) : 99  ;} 
	  var fraction = null ; 
	  if ( maxvalue != null && maxvalue != "" ) { 
	  if ( eval(maxvalue) >= 0 ) { 
	   fraction = maxvalue ; 
	   if ( data.indexOf("-")>-1 )  fraction++; 	} 
	  else 
	   fraction = null  ; 
	  } 
	  data = clearComma(data); 
	  try { 
	   var dot = '' ; 
	   var x = data.split('.'); 
	   if ( x.length == 2 && point > 0 ) { 
	    dot = ( x[1].length > point )?('.'+x[1].substring(0,point)):('.'+x[1]) ; } 
	   while ( x[0].length > 1 && x[0].charAt(0)=="0" ) { 
	    x[0] = x[0].substring(1);	} 
	   if ( (fraction == 0 && eval(x[0]) > 0 ) || 
	    ( fraction > 0 && x[0].length > fraction ) ){ 
	    element.value = valueBfChange ; return true;	} 
	   data = x[0] + dot; 
	  }catch (ex) { } 
	  element.value=putComma(data); 
	 } 
	 function putComma(data) { 
	  if ( data.indexOf(',') > -1 ) { data = clearComma(data); } 
	  var move = ( data.indexOf('.') > -1 ) ? data.indexOf('.') : data.length; 
	  var minus = ( data.indexOf('-') > -1 ) ? 1 : 0 ; 
	  while ( move > 3 ) { 
	   if ( minus && move <= 4  )  { break ; } 
	   data = data.substring(0,move-3)+","+data.substring(move-3) ; 
	   move -= 3 ; 
	  } 
	  return data; 
	 } 
	 function clearComma(data){ 
	  while (data.indexOf(',')!=-1) { 
	   data =  data.replace(',',''); } 
	  return data; 
	 } 


function handleFavor(pid,pname) {
	var errflag = false;
	try { window.parent.parent.headFrame.handleFavor(pid,pname); }catch(ex){ errflag = true; }
	try { if(window.parent.opener) window.parent.opener.parent.headFrame.handleFavor(pid,pname); }catch(ex){ 	errflag = true;	}
	if(errflag && fs_favorite_url) {		
		submitWindow({url: fs_favorite_url, windowName: "headerfavorframe", params:[{name: "progid", value: pid},{name:"progname", value: pname}]});
	}
}
function displayProgramTitle(ptitle,pid,pname,langs,awin) {
	try { window.parent.parent.headFrame.displayProgramTitle(ptitle,pid,pname,langs,awin); }catch(ex){ }
	try { if(window.parent.opener) window.parent.opener.parent.headFrame.displayProgramTitle(ptitle,pid,pname,langs,awin); }catch(ex){ }
}
function openVersion(progid,winWidth,winHeight) {
	if(!progid) return; 
	var winname = progid+"_version_window";
	if(!winWidth) winWidth = 500;
	if(!winHeight) winHeight = 300;
	var sw = window.screen.availWidth;
	var sh = window.screen.availHeight;
	var wx = (sw - winWidth) / 2;
	var wy = (sh - winHeight) / 2;
	var features = "top="+wy+",left="+wx+",width="+winWidth+",height="+winHeight+",toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes";
	var fs_window = window.open("../jsp/version.jsp?progid="+progid,winname,features);
	fs_window.opener = self;
	try {	
		window.parent.addWindow(fs_window);
	} catch(ex) { }		
}

var verticalpos="fromtop"
function FloatTopDiv() {
	var x = document.body.clientWidth;
	var startX = x-1500;
	var startY = 10; //110;
	var ns = (navigator.appName.indexOf("Netscape") != -1);
	document.getElementById('floatmenu').style.display='';
	var d = document;
	function ml(id) {
		var el=d.getElementById?d.getElementById(id):d.all?d.all[id]:d.layers[id];
		if(d.layers)el.style=el;
		el.sP = function(x,y) { 
			this.style.left=x; 
			this.style.top=y; 
		};
		el.x = startX;
		if (verticalpos=="fromtop") {
			el.y = startY;
		} else {
			el.y = ns ? pageYOffset + innerHeight : document.body.scrollTop + document.body.clientHeight;
			el.y -= startY;
		}
		return el;
	}
	window.stayTopLeft=function() {
		ftlObj.x = document.body.clientWidth -  1500; 
		if (verticalpos=="fromtop") {
			var pY = ns ? pageYOffset : document.body.scrollTop;
			ftlObj.y += (pY + startY - ftlObj.y)/8;
		} else {
			var pY = ns ? pageYOffset + innerHeight : document.body.scrollTop + document.body.clientHeight;
			ftlObj.y += (pY - startY - ftlObj.y)/8;
		}
		ftlObj.sP(ftlObj.x, ftlObj.y);
		setTimeout("stayTopLeft()", 10);
	}
	ftlObj = ml("floatmenu");
	stayTopLeft();
}
function fs_allowChangeLanguage() { return true; }
function fs_switchLanguage(fs_Language,notForced) { 
	try {
		if(fs_switchLanguageUrls) {
			for(var i=0; i<fs_switchLanguageUrls.length; i++) {
				$.ajax({
					async: false,
					type: "GET",
					url: fs_switchLanguageUrls[i]+"?language="+fs_Language+"&seed="+Math.random(),
					dataType: "xml"
				});
			}
		}
	} catch(ex) {}
	var fs_languageChanged = fs_default_language != fs_Language;
	fs_default_language = fs_Language;
	try { fs_switchingLanguage(fs_Language); } catch(ex) { }
	try { fs_changingLanguage(fs_Language); } catch(ex) { }
	if(fs_allowChangeLanguage()) {
		//try { if(fs_default_language) $.datepicker.setDefaults($.datepicker.regional[fs_default_language.toLowerCase()]); }catch(ex) { }
		if(fs_languageChanged) {
			fs_reformDatas(null,notForced);
			try { fs_reformingDatas(null,notForced); } catch(ex) { }
		}
	}
}

function fs_getLabelName(labelId,progid) {
	if(!progid || progid=="") progid = fs_currentpid;
	var fs_Language = fs_default_language;
	if(!fs_labelAry) fs_labelAry = fs_createLabelArrays(fs_getLangsXMLDocs(progid));	
	var fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = new Hash();
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_hash) {
		return fs_hash.getItem(labelId);
	}
}

function getCaretPosition (ctrl) {
	var iCaretPos = 0;
	if (document.selection) { 
		ctrl.focus ();
		var selector = document.selection.createRange ();
		selector.moveStart ('character', -ctrl.value.length);
		iCaretPos = selector.text.length;
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		iCaretPos = ctrl.selectionStart;
	}
	return (iCaretPos);
}
function setCaretPosition(ctrl, iCaretPos) {
	if (ctrl.createTextRange) { 
		var selector = ctrl.createTextRange ();
		selector.collapse(true);
		selector.moveEnd ('character', iCaretPos);
		selector.moveStart ('character', iCaretPos);
		selector.select ();
	} else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
		ctrl.selectionStart = iCaretPos;
		ctrl.selectionEnd = iCaretPos;
		ctrl.focus ();
	}
}

function enableElements(doc) {
	$("input[type!=hidden]:disabled, select:disabled, button:disabled, textarea:disabled, a",doc||this.document).each(function(index,element){ 
		var e = $(this);
		if(e.data("fs_disabled_element")) {
			e.attr("disabled",false);
			if(e.is("a")) {
				e.attr("disables",false);
				var ahref = e.data("fs_ahref");
				if(ahref) e.attr("href",ahref);
				var fnclick = e.data("fs_fnclick");
				if(fnclick) {
					e.bind("click",fnclick);
				}
			}
		}
	});
}
function disableElements(doc) {
	$("input[type!=hidden]:enabled, select:enabled, button:enabled, textarea:enabled, a",doc||this.document).each(function(index,element){ 
		var e = $(this);
		if(!e.is(".ignoredisabled")) {
			e.attr("disabled",true);
			e.data("fs_disabled_element",true);
			if(e.is("a")) {
				if(!e.is(".allowdisabled")) {
					e.attr("disabled",false);
				}
				e.attr("disables",true);
				var ahref = e.attr("href");
				if(ahref) {
					e.removeAttr("href");
					e.data("fs_ahref",ahref);
				}
				var fnclick = e.data("fs_fnclick");
				if(fnclick) e.unbind("click",fnclick);
				fnclick = e.attr("onclick");
				if(fnclick) {
					e.removeAttr("onclick");
					e.data("fs_fnclick",fnclick);
				}
			}
		}
	});
}
function enableButtons() {
	$("input[type=submit]:disabled, input[type=reset]:disabled, input[type=button]:disabled, button:disabled").each(function(index,element){ 
		$(this).attr("disabled",false);
	});
}
function disableButtons() {
	$("input[type=submit]:enabled, input[type=reset]:enabled, input[type=button]:enabled, button:enabled").each(function(index,element){ 
		$(this).attr("disabled",true);
	});
}
function enableForm(aform) {
	$("input[type=submit]:disabled, input[type=reset]:disabled, input[type=button]:disabled",aform).each(function(index,element){ 
		$(this).attr("disabled",false);
	});
}
function disableForm(aform) {
	$("input[type=submit]:enabled, input[type=reset]:enabled, input[type=button]:enabled",aform).each(function(index,element){ 
		$(this).attr("disabled",true);
	});
}
function handleFocus() {
	$("input[type=text]:enabled, textarea:enabled").each(function(index,element){ 
		$(this).focusin(function() { $(this).addClass("ui-active-input"); });
		$(this).focusout(function(){ $(this).removeClass("ui-active-input");  });
	});
}
function hideLayer(layer) {
	$(layer).hide();
}
function showLayer(layer) {
	$(layer).show();
}
function fsTableMouseOver(src) {
	try {
		var sx = $(src).offset().left;
		var sy = $(src).offset().top;
		var fslayer = $(fsexportlayer);
		fslayer.css("zIndex",99999);
		fslayer.css("top",sy-30);
		fslayer.css("left",sx);
		fslayer.show();
	}catch(ex) { }
}
function startWaiting() {
	try{
		var dc = $(document.body);
		var sh = dc.innerHeight();
		var fslayer = $(fswaitlayer);
		var lh = fslayer.height();
		var fstop = mouseY;
		if(lh > (sh-fstop)) fstop = mouseY-lh;
		fslayer.css("top",fstop);
		fslayer.css("left",mouseX>0?mouseX:dc.innerWidth()-50);
		fslayer.show();
	} catch(ex) { }
}
function stopWaiting() {
	hideLayer(fswaitlayer);
	try{ enableButtons(); }catch(ex) { }
}
function createTaborder(aform) {
	fs_taborder = new Array();
	$("input[type!=hidden]",aform||this.document).each(function(index,element){ 
		var fe = $(this);
		if(fe.attr("type")!="hidden") {
			fs_taborder.push(element);
			try { fe.bind("onfocusin",fs_focusin); } catch(ex) { }
			bindjsFunc(fe);
		}
	});
}
function createDialog(dialoglayer) {
    return $(dialoglayer).dialog({
        autoOpen: false, modal: true, title: "Message Dialog",
        width: 500, height: 200, 
        buttons: [{ text: "OK", click: function() { $(this).dialog("close"); } }]
    });
}
function alertbox(msg,callback,width,height,info) {
	if(fs_dialog_handler=="system.dialog") {
		alert(msg);
		if(callback) callback(3);
		return;
	}
	try{
		fs_focusing = true;
		if(!width) width = 500;
		if(!height) height = 200;
		var fs_title = getMessageCode("fsmessagetitle");
		if(!fs_title || fs_title=="") fs_title = "Message Dialog";
		var fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || fs_okbtn=="") fs_ok = "OK";
        if (!msgdialog) msgdialog = createDialog("#fsdialoglayer");
        //$("#fsmsgbox", $("#fsdialoglayer")).html(msg);
        msgdialog.dialog("option", "title", fs_title);
        msgdialog.dialog("option", "width", width);
		msgdialog.dialog("option", "height", height);
        msgdialog.dialog("option", "position", "center");
        msgdialog.dialog("option", "resizable", false);
        msgdialog.dialog("option", "close", function() { if (callback) callback(); });
		if(info) {
			msgdialog.dialog("option", "buttons", []);
			window.getMessageDialogArguments = function() { return info; };
			window.closeMessageDialog = function() { try { msgdialog.dialog("close"); } catch(ex) { } };
			window.stretchMessageDialog = function(paded) { };
			$("#fsdialoglayer").empty();
			var sz = $("iframe",$("#fsdialoglayer")).length;
			if(sz<=0) {
				var fs_frame_id = "fs_message_iframe";
				var fs_messageframe = $("<iframe id='"+fs_frame_id+"' name='"+fs_frame_id+"' width='100%' height='100%' scrolling='auto' frameborder='0' src='../jsp/msgdialog.jsp'></iframe>");
				$("#fsdialoglayer").empty().append(fs_messageframe);
			} else {
				msgdialog.on("dialogopen",function() {
					try { window.fs_message_iframe.initialScreen(); }catch(ex) { try { window.frames[0].initialScreen(); }catch(exc) { } }
				});
			}
		} else {
			msgdialog.dialog("option", "buttons", [{ text: fs_okbtn, click: function() { $(this).dialog("close"); } }]);
			$("#fsdialoglayer").empty().append($("<span id='fsmsgbox'></span>").html(msg));
		}
        msgdialog.dialog("open");
		return;
	} catch(ex) { alert(ex.description); }
	alert(msg);
	if(callback) callback(3);
}
function confirmbox(msg,okCallback,cancelCallback,width,height,info){
	if(fs_dialog_handler=="system.dialog") {
		if(confirm(msg)) {
			if(okCallback) okCallback();
		} else {
			if(cancelCallback) cancelCallback();
		}
		return;
	}
	try{
		fs_focusing = true;
		if(!width) width = 500;
		if(!height) height = 200;
		var fs_title = getMessageCode("fsaccepttitle");
		if(!fs_title || fs_title=="") fs_title = "Confirm Dialog";
		var fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || fs_confirmbtn=="") fs_confirmbtn = "OK";
		var fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || fs_cancelbtn=="") fs_cancelbtn = "Cancel";
        if (!acceptdialog) acceptdialog = createDialog("#fsacceptlayer");
        //$("#fsacceptbox", $("#fsacceptlayer")).html(msg);
        acceptdialog.dialog("option", "title", fs_title);
        acceptdialog.dialog("option", "width", width);
		acceptdialog.dialog("option", "height", height);
        acceptdialog.dialog("option", "position", "center");
        acceptdialog.dialog("option", "resizable", false);
        acceptdialog.dialog("option", "close", function() { });
        acceptdialog.dialog("option", "buttons", [{
				text: fs_cancelbtn,
				click: function() { $(this).dialog("close"); if (cancelCallback) cancelCallback(); }
			}, {
				text: fs_confirmbtn,
				click: function() { $(this).dialog("close"); if (okCallback) okCallback(); }
        }]);
		if(info) {
			var icon = $("<img id='fsiconmsgdialog' src='"+getMessageSource(info.type)+"'  class='img-icon-msg-class' width='38' height='38' border='0'></img>");
			var span = $("<span id='fsmsgbox'></span>").html(msg);
			var td1 = $("<td></td>").append(icon);
			var td2 = $("<td></td>").append(span);
			var row = $("<tr></tr>").append(td1).append(td2);
			var tab = $("	<table id='fsdialoglayertable' class='fsdialog-table-class'></table>").append(row);
			$("#fsacceptlayer").empty().append(tab);
		} else {
			$("#fsacceptlayer").empty().append($("<span id='fsacceptbox'></span>").html(msg));
		}
        acceptdialog.dialog("open");
		return;
	} catch(ex) { alert(ex.description); }
	if(confirm(msg)) {
		if(okCallback) okCallback();
	} else {
		if(cancelCallback) cancelCallback();
	}
}
function successbox(msg) {
	//alert(msg);
}
function messagebox(progid,errcode,param,defaultmsg){
	try{
		var reply = getDialog().showDialog(progid,errcode,param);
		return reply=='ok';
	} catch(ex) {
		if (defaultmsg) {
			return alert(defaultmsg);
		} else {
			return alert(errcode);
		}
	}
	return false;	
}
function handleDataTable(containerList) {
	if(!containerList) containerList = $("#listpanel");
	$(".drowclass",containerList).each(function(index,element) { 
		var e = $(this);
		e.dblclick(function() { var alink = $("a.anclass:eq(0)",e); if(alink) alink.trigger("click"); else $("input.buttonedit:eq(0)",e).trigger("click"); });
		e.mouseenter(function() { $("td",e).each(function(index,element) { $(this).addClass("ui-state-highlight"); }); });
		e.mouseleave(function() { $("td",e).each(function(index,element) { $(this).removeClass("ui-state-highlight"); }); });
	});
}
function handleDecimalElements(doc) {
	$(".idecimal",doc||this.document).each(function(index,element){ 
		var df = $(this);
		var decimals = df.attr("decimal");
		df.blur(function() { var v = df.val(); if(v=="") v="0"; df.val(formatFloat(v,decimals)); });
	});
}
function clearingFields(aform) {
	$("input[type=text]",aform||this.document).each(function(index,element) { 
		var input = $(this);
		input.val(""); 
		if(input.is(".ilookup")) $("#"+input.attr("id")+"desc").html("");
	});
	$("textarea",aform||this.document).each(function(index,element) { $(this).val(""); });
}
function initialFocus(aform) {
	$("input:visible:eq(0)",aform).trigger("focusin").focus();
}
function startApplication(pid) { 
	fs_currentpid = pid;
	try{
		if(fsPeriodical) startPeriodical(fsPeriodical);
	}catch(ex) { }
	if(pid) {
		try {
			fs_customizelayer = $("#customizerlayer").customizer({
				customizeID : pid
				,customizeTable : "#fsDetailTable1"
				,customizeGrid : getGridView
				,customizeTrigger: $("#custom_linker") 
			});		
		}catch(ex){}
	}
	try { backHawkDown(); }catch(ex) { }
	//try { notAllowRightClick(); } catch(ex) { }
	bindHangOut();
}
function bindHangOut() {
	$(document).bind("click",function(e){ 
		try { window.parent.hangOut(); }catch(ex) { }
	});	
}
function setInsertMode() { handleDecimalElements($("#entrypanel")); }
function setEditMode() { handleDecimalElements($("#entrypanel")); }
function setUnknownMode() { }
function setupScreen() { }
function getGridView() { return null; }
function setupApplication(aform) {
	$("input[type=text]",aform||this.document).each(function(index,element) { 
		var input = $(this);
		if(input.attr("picture")) { input.mask(input.attr("picture")); }
	});	
	$("input.idate").css("width",100);
	fs_stopAnchorTaborder();
	try{ 
		if(fs_default_language!="EN") fs_switchLanguage(fs_default_language,true);
	}catch(ex) { }	
}
function refreshScreen() {
	try { $("#customizerlayer").customizer("refresh"); }catch(ex) { }
}
function startPeriodical(period) {
	if(period) {
		fs_polling = setInterval(function() { $.ajax({ url : "../jsp/track.jsp?seed="+Math.random(), type : "POST" }); },1000*60*period);
	}
}
var focusObj = null;
function bindjsFunc(objfield){
	//Check Browser Name
	var browserName  = navigator.appName;
	var nAgt = navigator.userAgent;
	if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	}	
	if (browserName != "Microsoft Internet Explorer"){
		if(fs_validmapitem[objfield.attr("name")]){
			var str = fs_validmapitem[objfield.attr("name")].substring(0,fs_validmapitem[objfield.attr("name")].indexOf("("));
			try { 
				/*
				objfield.bind("blur",function() {
					eval(str+'($("input[name='+objfield.attr("name")+']")[0])');					
				});
				*/
				objfield.focusin(function(event) {
					focusObj = event;
				});				
				objfield.bind("keydown",function(event){
					if (event.keyCode == 9) // key tab
					{
						//alert("call "+str+"(focusObj.target)");
						return eval(str+"(focusObj.target)");
					} 
				});				
			} catch(ex) { alert("Error bindjsFunc");}
		}
		objfield.bind("mousedown",function(event) {
				//alert("mousedown");
				//return eval("valid"+focusObj.target.id+"(focusObj.target)");
				if (focusObj.target.id == objfield.attr("id")) // current field not valid
				{
					return true;
				}												
				//alert("valid"+focusObj.target.id+"(focusObj.target)");
				return eval("valid"+focusObj.target.id+"(focusObj.target)");
		});
	}
}
function prepareOptions(jsAry,elementname,listing,defaultValue,defaultCaption,doubleValue) {
	if(!jsAry) return;
	if(!defaultCaption) { 
		try { defaultCaption = jsAry["undefinedlookup"]["value"]; } catch(ex) { }
	}
	try {
		if(!defaultCaption) defaultCaption = "   ";
		//if(!defaultCaption) defaultCaption = "- - Undefined - -";
		if(defaultValue!=null) $("<option value='"+defaultValue+"'>"+defaultCaption+"</option>").appendTo(listing);
		if(elementname) {
			var opts = jsAry[elementname];
			if(opts) {
				for(var p in opts) {
					if(doubleValue) {
						$("<option value='"+p+"'>"+(p+" - "+opts[p])+"</option>").appendTo(listing);
					} else {
						$("<option value='"+p+"'>"+opts[p]+"</option>").appendTo(listing);
					}
				}
			}
		} else {
			for(var i=0;i<jsAry.length;i++) {
				var ary = jsAry[i];
				if(ary.length>0) {
					var p = ary[0];
					var v = "";
					if(ary.length>1) v = ary[1];
					if(doubleValue) {
						$("<option value='"+p+"'>"+(p+" - "+v)+"</option>").appendTo(listing);
					} else {
						$("<option value='"+p+"'>"+v+"</option>").appendTo(listing);
					}
				}
			}
		}
	}catch(ex) { }
}
function editTransaction(rowId) {
	fslistform.fsAction.value='view';
	fslistform.fsRowid.value=""+rowId; 
	submitDetail(fslistform,rowId);
}
function deleteTransaction(rowId) {
	fslistform.fsAction.value='delete';
	fslistform.fsRowid.value=""+rowId; 
	submitDetail(fslistform,rowId);
}
function backHawkDown() {
	$(document).on("keydown", function (e) {
		if (e.which == 8 && !$(e.target).is("input:not([readonly]), textarea")) { //BACK
			e.preventDefault();
			e.stopPropagation();
		}
		if(e.ctrlKey && (e.which==86 || e.which==118)) {
			e.preventDefault();
			e.stopPropagation();
		}
		if(e.which==123) { //F12
			e.preventDefault();
			e.stopPropagation();
		}
	});	
}
function notAllowRightClick() {
	$(document).on("contextmenu",function(e) {
		e.preventDefault();
		return false;
	});
}
function exportCsvHandler(pid) {
	if(!pid) pid = fs_currentpid;
	var fs_parameters = null;
	try { fs_parameters = $("#customizerlayer").customizer("columns"); }catch(ex) { }
	openNewWindow({ url: pid+"_dsv.jsp", windowName: pid+"_csv_window", params:  fs_parameters });
}
function fs_reformDatas(aform,notForced) {
	if(notForced) return;
	$(".idate",aform||this.document).each(function(index,element) { 
		var input = $(this);
		var oldText = $.trim(input.is("input")?input.val():input.text());
		var txts = oldText.split("/");
		if(txts.length==3) {
			var year = eval(txts[2]);
			if("TH"==fs_default_language) {
				year += 543;
			} else if("EN"==fs_default_language) {
				year -= 543;
			}
			var newText = txts[0]+"/"+txts[1]+"/"+year;
			if(input.is("input")) input.val(newText);
			else input.text(newText);
		}
	});	
}
function fs_reformingDatas(aform,notForced) {
}
function switchTheme(theme) {
	updateCSS(theme);
	updateCSS(theme);
}
function updateCSS(locStr){
	var cssLink = $('<link href="'+locStr+'/jquery-ui-1.8.2.custom.css" type="text/css" rel="Stylesheet" class="ui-theme" />');
	$("head").append(cssLink);
	if( $("link.ui-theme").size() > 3){
		$("link.ui-theme:first").remove();
	}	
}	
function fs_switchActiveXGridLanguage(progid,fs_Language,grid,fs_schemafields) {
	var fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = new Hash();
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_hash) {
		for(var i=0;i<fs_schemafields.length;i++) {
			var fieldname = fs_schemafields[i];
			grid.SetColumnLabel(fieldname,fs_hash.getItem(fieldname+"_headerlabel"));
		}
	}
}
function submitWindow(settings) {
	var p = settings;
	if((p.url && p.url!="") && p.params) {
		var frm = $("<form method='POST'></form>");
		frm.attr("action",p.url);
		frm.attr("target",p.windowName);
		if(typeof(p.params)==="string") {
			var prms = p.params.split("&");
			for(var i=0;i<prms.length;i++) {
				var kary = prms[i].split("=");
				var inp = $('<input type="hidden" name="'+kary[0]+'"></input>');
				inp.val(kary[1]);
				frm.append(inp);
			}
		} else {
			if($.isArray(p.params)) {
				for(var i=0;i<p.params.length;i++) {
					var prm = p.params[i];
					if(prm.name) {
						var inp = $('<input type="hidden" name="'+prm.name+'"></input>');
						inp.val(prm.value);
						frm.append(inp);
					} 
				}
			} else {
				if(p.params) {
					for(var prm in p.params) {
						var inp = $('<input type="hidden" name="'+prm+'"></input>');
						inp.val(p.params[prm]);
						frm.append(inp);
					}
				}
			}
		}
		var layer = $("<div class='open-new-window-submit-layer'></div>");
		layer.append(frm);
		$("body").append(layer);
		frm.trigger("submit");
		setTimeout(function() { layer.remove(); },1500);
	}
}		 
function openNewWindow(settings) {
	var defaultSettings = {
		url : "",
		windowName : "_blank",
		windowWidth : window.screen.availWidth,
		windowHeight : window.screen.availHeight,
		windowFeatures : "toobar=no,menubar=no,location=no,directories=no,status=no,scrollbars=yes,resizable=yes",
		fullScreen : null,
		params : null
	};
	var p = $.extend({},defaultSettings, settings);		
	try {	 
		var fswin = window.parent.getWindowByName(p.winName); 
		if(fswin) { fswin.focus(); return; }  
	} catch(ex) { } 
	var sw = window.screen.availWidth; 
	var sh = window.screen.availHeight; 
	try{if(p.fullScreen==null) p.fullScreen = fs_fullscreen; }catch(ex) { }
	if(p.fullScreen) { 
		winWidth = sw; 
		winHeight = sh; 
	} 
	var wx = (sw - p.windowWidth) / 2; 
	var wy = (sh - p.windowHeight) / 2; 
	var fs_features = "top="+wy+",left="+wx+",width="+p.windowWidth+",height="+p.windowHeight+","+p.windowFeatures;
	var fs_window = null;
	if(p.params) fs_window = window.open("",p.windowName,fs_features); 
	else fs_window = window.open(p.url,p.windowName,fs_features); 
	fs_window.opener = self; 
	try {	 
		window.parent.addWindow(fs_window); 
	} catch(ex) { } 
	submitWindow(p);
	return fs_window; 
} 
function parseErrorThrown(xhr,status,errorThrown) {
	if (!errorThrown) errorThrown = xhr.responseText;
	if(xhr.status==400) errorThrown = xhr.responseText;
	return errorThrown;
}
