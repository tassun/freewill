var errdialog = null;
function getDialog() { 
	try { 
		if(errdialog==null) { 
			var usexml = new UseXML(); 
			errdialog = new  ErrorDialog("errdialog", usexml); 
		} 
	} catch(ex) { } 
	return errdialog; 
}

 function fs_createHashElements(fs_lang,fs_langHash,xmlDocs) { 
 	if(!fs_lang) return false; 
 	if(!fs_langHash) return false; 
 	if(!xmlDocs) return false; 
 	var ex; 
 	try{ 
 		if(xmlDocs.documentElement) { 
 			var xmlChild = xmlDocs.documentElement.childNodes; 
 			if(xmlChild) { 
 				for(var i=0,isz=xmlChild.length;i<isz;i++) { 
 					var attr = xmlChild[i].getAttribute("language");
 					if(attr && attr==fs_lang) { 
 						var subChild = xmlChild[i].childNodes; 
 						for(var j=0,jsz=subChild.length;j<jsz;j++) { 
 							var anode = subChild[j]; 
 							var bnode = anode.childNodes[0]; 
 							if(bnode) { 
 								fs_langHash.setItem(anode.nodeName,bnode.text); 
 							} 
 						} 
 						return true; 
 					} 
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
 		if(xmlDocs.documentElement) { 
 			var xmlChild = xmlDocs.documentElement.childNodes; 
 			if(xmlChild) { 
 				for(var i=0,isz=xmlChild.length;i<isz;i++) { 
 					var attr = xmlChild[i].getAttribute("language");
					if(attr) { 
 						var subChild = xmlChild[i].childNodes; 
 						for(var j=0,jsz=subChild.length;j<jsz;j++) { 
 							var anode = subChild[j]; 
							result.push(anode.nodeName); 
 						} 
 						return result; 
 					} 
 				} 
 			} 
 		} 
 	} catch(ex) { } 
 	return result; 
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
			 									fs_field = fs_field[0]; 
			 								} 
			 							} catch(ex) { } 			
			 							fs_field.setActive(); 
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
			 									fs_field = fs_field[0]; 
			 								} 
			 							} catch(ex) { } 			
			 							fs_field.setActive(); 
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
	 var fs_currfocus = null;  
	 var fs_lastexit = null;  
	 var fs_freeze = false;  
	outstr.append(LF);
	 var fs_focusing = false;  
	 var fs_fieldActive = false;  
	 var fs_rivalActive = false;  
	 var fs_invalidate = false;  
	 function fs_attachfocus() { 
	 	for(var i=0;i<window.document.all.lenth;i++) { 
	 		window.document.all.item[i].attachEvent("onfocusin",fs_focusin); 
	 	} 
	 } 
	 function fs_focusin(src) { 
	 	if(fs_invalidate) { 
	 		if(event.fromElement) event.fromElement.hideFocus(); 
	  } 
	 } 	
	 function fs_deactivate(src,rival) {  
	 	if(!fs_focusing) {  
	 		if(!fs_rivalActive) {  
	 			fs_startexit(src);  
	 			fs_focusing = false;  
	 			return;  
	 		}  
	 	} else { 
	 		event.srcElement.hideFocus(); 
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
	 	} catch(ex) { } 
	 } 
	  
	 function fs_rival_deactivate(src,rival) { 
	 	if(!fs_focusing) { 
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
	 			if (item.name == fs_taborder[i] ) { 
	 				fs_found_field = true; 
	 				if (fs_validswitch(i)) { 
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
	 					fs_field = fs_field[0]; 
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
	 	try { 
	 		for(var i=0;i<window.document.forms.length;i++) { 
	 			var fs_aform = window.document.forms[i]; 
	 			fs_aform.attachEvent("onsubmit",fs_submitform); 
	 		} 
	 	}catch(ex) { } 
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
	 		for (var i = 0; i < tabcount; i++) 
	 		{ 
	 			if (item.name == fs_taborder[i] && curr.name != fs_taborder[i] && item.value != '') { 
	 				if (fs_validswitch(i)) { 
	 					try {item.select();} catch (e) {}  
	 					fs_currfocus = item; item.focus();break; 
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
	 	myfield.form.elements[dec].focus();  
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
	 if (dec && (key==13)) { myfield.form.elements[dec].focus(); return false; } else return false; } 
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
		 var fsXSLLookup = new ActiveXObject("Microsoft.XMLDOM");  
		   
		 function alertDialog() { 
		 try{ alert(arguments[0]);}catch(ex){} 
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
		  
		 function lookup(el,desc,singleShow,id,doc) { 
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
		 	var ahtml = drawMenus(id,singleShow);	  
		 	if(ahtml=='') return;  
		 	try	{  
		 	var aCount = menus[id].children.documentElement.childNodes.length;  
		 	var nHeight = ((itemHeight+borderHeight)*MAXITEM+borderHeight);  
		 	if(aCount<MAXITEM) nHeight = ((itemHeight+borderHeight)*aCount+borderHeight);  
		 	var awidth = menus[id].width;  
		 	if(awidth<ellookup.offsetWidth) awidth = ellookup.offsetWidth;  
		 	var pwidth = awidth;	  
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
		 	popLookup.show(ellookup.clientX,ellookup.offsetTop+ellookup.offsetHeight-7,pwidth,nHeight,ellookup);  
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
		 	function drawMenus(menuID,singleShow) {  
		 	var result = '';  
		 	if(menus[menuID]) {  
		 		var xmldocs = menus[menuID].children;  
		 		if(xmldocs && xmldocs.documentElement) {  
		 			if(xmldocs.documentElement.childNodes.length>0) {  
		 				var pnode = xmldocs.documentElement;  
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
		 				var astr = "</script"; 
		 				var xslstr = new String('<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> '+  
		 				'<xsl:template match="/">'+  
		 				'<style type="text/css"> tr { height: 20px; } '+ 
		 				'tr.odd {background: #eeeeee;} '+ 
		 				'tr.even {background: #ffffff;} '+ 
		 				'</style> '+  
		 				'<script language="JavaScript"> '+  
		 				'var lightColor = "'+highlightColor+'"; '+  
		 				'var curMenu = '+menuID+'; '+  
		 				'function doKeyDown(e) { e.keyCode = 0; e.cancelBubble = true;  return false; }'+ 		
		 				'function mouseOver(e) { '+  
		 				'var ex; 	try { var tag = e.srcElement.tagName; '+  
		 				'if(tag=="DIV") { 	e.srcElement.style.background = lightColor; return; 	} '+  
		 				'if(tag=="A") { e.srcElement.parentNode.style.background = lightColor; return; 	} '+  
		 				'e.srcElement.childNodes[0].style.background = lightColor; }catch(ex) { } 	} '+  
		 				'function mouseOut(e) { var ex; try { var tag = e.srcElement.tagName; '+  
		 				'if(tag=="DIV") { 	e.srcElement.style.background = ""; 	return; } '+  
		 				'if(tag=="A") { 	e.srcElement.parentNode.style.background = ""; return; } '+  
		 				'e.srcElement.childNodes[0].style.background = ""; }catch(ex) { }  } '+  
		 				'function mouseClick(row,value,desc) { var ex; 	try { parent.choose(value,curMenu,row,desc); } catch(ex) {} } '+  
		 				astr+'> '+  
		 				'<body onkeydown="return doKeyDown(event);">'+ 		
		 				'<table id="lookup" width="100%"  border="0" cellspacing="0"> '+  
		 				'<xsl:for-each select="'+selectelement+'"> '+  
		 				'<tr class="odd"> '+  
		 				'<xsl:if test="position() mod 2 = 0"><xsl:attribute name="class">even</xsl:attribute></xsl:if> '+  
		 				'<td class="elementline" width="100%" onmouseover="mouseOver(event)" onmouseout="mouseOut(event)"> '+  
		 				'<xsl:attribute name="onclick">mouseClick(<xsl:value-of select="position() - 1"/>,'+ 
		 				'"<xsl:value-of select="'+element+'"/>"'); 
		 				if(element2) xslstr = xslstr + ',"<xsl:value-of select="'+element2+'"/>"';  
		 				xslstr = xslstr + ')</xsl:attribute> '+  
		 				'<div width="100%"> '+  
		 				'<a href="#" ondragstart="return false;" style="text-decoration: none; color: #000000; font-size: 12px; font-weight: bold;" > '+  
		 				'<xsl:value-of select="'+element+'"/> ';  
		 				if(!singleShow && element2) xslstr = xslstr + ' - <xsl:value-of select="'+element2+'"/>';  
		 				xslstr = xslstr +  '</a> </div> </td> ';  
		 				xslstr = xslstr + '</tr> </xsl:for-each> </table> </body> </xsl:template> </xsl:stylesheet> ';  
		 				fsXSLLookup.loadXML(xslstr);  
		 				return xmldocs.transformNode(fsXSLLookup);  
		 			}  
		 		}  
		 	}  
		 	return result;  
		 }  
		  
		 function convert(str) { 
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
		 var features ="toobar=no,menubar=0,location=no,directories=no,status=no,scrollbars=yes,resizable=yes,fullscreen=no";  
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
		 	} catch(ex) {} 
		 } 
		 } 

		String context = (String)com.fs.bean.util.GlobalVariable.getVariable("FULL_SCREEN");
		if((context!=null) && context.equalsIgnoreCase("true")) {
			 var fs_fullscreen = true; 
		} else {
			 var fs_fullscreen = false; 
		}
		 function luanchWindow(winname,winWidth,winHeight,fullScreen) { 
		 	if(!winname) return;  
		 	try {	 
		 		var fswin = window.parent.getWindowByName(winname); 
		 		if(fswin) { fswin.focus(); return; }  
		 	} catch(ex) { } 
		 	if(!winWidth) winWidth = 500; 
		 	if(!winHeight) winHeight = 500; 
		 	var sw = window.screen.availWidth; 
		 	var sh = window.screen.availHeight; 
		 	if(fullScreen==null) fullScreen = fs_fullscreen; 
		 	if(fullScreen) { 
		 		winWidth = sw; 
		 		winHeight = sh; 
		 	} 
		 	var wx = (sw - winWidth) / 2; 
		 	var wy = (sh - winHeight) / 2; 
		 	var features = "top="+wy+",left="+wx+",width="+winWidth+",height="+winHeight+",toobar=no,menubar=0,location=no,directories=no,status=no,scrollbars=yes,resizable=yes"; 
		 	var fs_window = window.open("",winname,features); 
		 	fs_window.opener = self; 
		 	try {	 
		 		window.parent.addWindow(fs_window); 
		 	} catch(ex) { } 
		 	return fs_window; 
		 } 

		 function openWindow(url,winname,winWidth,winHeight,fullScreen) { 
		 	if(!winname) return;  
		 	try {	 
		 		var fswin = window.parent.getWindowByName(winname); 
		 		if(fswin) { fswin.focus(); return; }  
		 	} catch(ex) { } 
		 	if(!winWidth) winWidth = window.screen.availWidth; 
		 	if(!winHeight) winHeight = window.screen.availHeight; 
		 	if(!url) url = ""; 
		 	var sw = window.screen.availWidth; 
		 	var sh = window.screen.availHeight; 
		 	if(fullScreen==null) fullScreen = fs_fullscreen; 
		 	if(fullScreen) { 
		 		winWidth = sw; 
		 		winHeight = sh; 
		 	} 
		 	var wx = (sw - winWidth) / 2; 
		 	var wy = (sh - winHeight) / 2; 
		 	var features = "top="+wy+",left="+wx+",width="+winWidth+",height="+winHeight+",toobar=no,menubar=1,location=no,directories=no,status=no,scrollbars=yes,resizable=yes"; 
		 	var fs_window = window.open(url,winname,features); 
		 	fs_window.opener = self; 
		 	try {	 
		 		window.parent.addWindow(fs_window); 
		 	} catch(ex) { } 
		 	return fs_window; 
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
		   var dec = "0" ; 
		   dec += (myvalue.indexOf('.')>-1 )?myvalue.substring( myvalue.indexOf('.') ):".0"  ; 
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
		 var fs_AutoXSLLookup = new ActiveXObject("Microsoft.XMLDOM");  
		   
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
		 			fs_AutoXSLLookup.loadXML(xslstr);  
		 			return fsAutoXMLDocs.transformNode(fs_AutoXSLLookup);  
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
		 			alert(xmldocs.parseError.reason); 
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
	  var sign = "!#$%&'()*+%,-./:;<>[]^_{}|~@=\\ "; 
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
	   formatNumber(myfield,maxvalue,decimal);} 
	 } 
	 function formatNumber(element,maxvalue,decimal) { 
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
