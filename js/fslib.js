var fs_dialog_handler = "jquery.dialog";
var fs_success_message = "Process Success";
var fs_default_language = "EN";
var fs_mainPage = "index";
var fs_currentpid = null;
var fs_langsXMLDocs = null;
var fs_mainXMLDocs = null;
var fs_defaultXMLDocs = null;
var fs_labelAry = null;
var fs_winary = new Array();
function getWindowByName(winname) {
	if(!winname) return null;
	for(var i=0,isz=fs_winary.length;i<isz;i++) {
		try	{
			if(fs_winary[i]) {
				if(fs_winary[i].name == winname) return fs_winary[i];
			}
		}catch (ex)	{ 	}
	}
	return null;
}
function closeChildWindows() {
	for(var i=0,isz=fs_winary.length;i<isz;i++) {
		try	{
			if(fs_winary[i]) fs_winary[i].close();
		}catch(ex) { }
	}
}
function addWindow(awindow) {
	if(!awindow) return;
	fs_winary.push(awindow);
}
function fs_getLanguageDocuments(fs_progid,mainpage) {
	var aurl = "../jsp/labelconfig.jsp?pid="+fs_progid+"&seed="+Math.random();
	if(mainpage) aurl = "jsp/labelconfig.jsp?pid="+fs_progid+"&seed="+Math.random();
	var xhr = $.ajax({
		async: false,
		type: "GET",
		url: aurl,
		dataType: "xml"
	});
	return $.trim(xhr.responseText);
}
function fs_getLangsXMLDocs(fs_progid,mainpage) {
	if(!fs_progid || fs_progid=="") return fs_langsXMLDocs;
	if(!fs_langsXMLDocs) {
		var restext = fs_getLanguageDocuments(fs_progid,mainpage);
		fs_langsXMLDocs = $.parseXML(restext);
		if(fs_mainPage==fs_progid) fs_mainXMLDocs = $.parseXML(restext);
	}
	if(!fs_defaultXMLDocs) {
		var restext = fs_getLanguageDocuments("default_label",mainpage);
		fs_defaultXMLDocs = $.parseXML(restext);
	}
	if(fs_mainPage==fs_progid) {
		if(!fs_mainXMLDocs) {
			var restext = fs_getLanguageDocuments(fs_progid,mainpage);
			fs_mainXMLDocs = $.parseXML(restext);
		}
		return fs_mainXMLDocs;
	}
	return fs_langsXMLDocs;
}
function fs_createHashElements(fs_lang,fs_langHash,xmlDocs) { 
 	if(!fs_lang) return false; 
 	if(!fs_langHash) return false; 
 	if(!xmlDocs) return false; 
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
							fs_langHash[anode] = bnode;
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
function fs_switchingLanguage(fs_Language,mainpage,progid) {
	if(!progid || progid=="") progid = fs_currentpid;
	if(!fs_labelAry) {
		fs_labelAry = fs_createLabelArrays(fs_getLangsXMLDocs(progid,mainpage));
		if(fs_defaultXMLDocs) {
			var fs_defaultLabelAry = fs_createLabelArrays(fs_defaultXMLDocs);
			if(fs_labelAry && fs_defaultLabelAry) fs_labelAry = fs_labelAry.concat(fs_defaultLabelAry);
		}
	}
	var fs_curArray = fs_labelAry;
	var fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = {};
		if(fs_defaultXMLDocs) {
			fs_createHashElements(fs_Language,fs_hash,fs_defaultXMLDocs);			
		}
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid,mainpage));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_mainPage==progid) {
		fs_hash = {};
		if(fs_mainXMLDocs) {
			fs_curArray = fs_createLabelArrays(fs_mainXMLDocs);
			fs_createHashElements(fs_Language,fs_hash,fs_mainXMLDocs);
		} else {
			var restext = fs_getLanguageDocuments(progid,mainpage);
			fs_mainXMLDocs = $.parseXML(restext);
			fs_curArray = fs_createLabelArrays(fs_mainXMLDocs);
			fs_createHashElements(fs_Language,fs_hash,fs_mainXMLDocs);
		}
	}
	if(fs_hash) {
		for(var i=0;i<fs_curArray.length;i++) {
			try { $("#"+fs_curArray[i]).html(fs_hash[""+fs_curArray[i]]); } catch(ex) { }
			try { $("#"+fs_curArray[i]).val(fs_hash[""+fs_curArray[i]]); } catch(ex) { }
		}
	}
}
var fs_switchLanguageUrls = ["jsp/switchlanguage.jsp"];
function fs_switchLanguage(fs_Language,mainpage) { 
	if(!fs_Language) return;
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
	fs_Language = fs_Language.toUpperCase();
	try { fs_switchingLanguage(fs_Language,mainpage); } catch(ex) { }
	try { fs_changingLanguage(fs_Language,mainpage); } catch(ex) { }
	try {
		window.workingframe.fs_switchingLanguage(fs_Language);
		return;
	}catch(ex) { 
		window.frames[0].fs_switchingLanguage(fs_Language);
	}
	try {
		window.workingframe.fs_changingLanguage(fs_Language);
		return;
	}catch(ex) { 
		window.frames[0].fs_changingLanguage(fs_Language);
	}
	fs_default_language = fs_Language;
}
function fs_getLabelName(labelId,progid,lang) {
	if(!progid || progid=="") progid = fs_currentpid;
	var fs_Language = fs_default_language;
	if(lang) fs_Language = lang;
	var fs_hash= fs_hashLang[fs_Language];
	if(!fs_hash) {
		fs_hash = {};
		fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid));
		fs_hashLang[fs_Language] = fs_hash;
	}
	if(fs_mainPage==progid) {
		if(fs_mainXMLDocs) {
			fs_hash = {};
			fs_createHashElements(fs_Language,fs_hash,fs_mainXMLDocs);
		} else {
			fs_hash = {};
			fs_createHashElements(fs_Language,fs_hash,fs_getLangsXMLDocs(progid));
		}
	}
	if(fs_hash) {
		return fs_hash[labelId];
	}
	return null;
}
function fs_stopAnchorTaborder() {
		try {
			var links = document.getElementsByTagName("A");
			for( var i = 0, j =  links.length; i < j; i++ ) {
				links[i].setAttribute('tabIndex','-1');
			}
		}catch(ex) { }
}
function fs_enterTab(myfield, e) { 
	 var key; var keychar;  
	 if (window.event) key = window.event.keyCode; else if (e) key = e.which; else return true; 
	 keychar = String.fromCharCode(key); 
	 if ((key==null) || (key==0) || (key==8) || (key==9) || (key==27)) return true; 
	 else if (key !=13) return true; 
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
	 else return false; 
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

function openWindow(url, winname, winWidth, winHeight, fullScreen) { 
	if(!winname) return;  
	try {	 
		var fswin = getWindowByName(winname); 
		if(fswin) { fswin.focus(); return; }  
	} catch(ex) { } 
	if(!winWidth) winWidth = window.screen.availWidth; 
	if(!winHeight) winHeight = window.screen.availHeight; 
	if(!url) url = ""; 
	var sw = window.screen.availWidth; 
	var sh = window.screen.availHeight; 
	try{if(fullScreen==null) fullScreen = fs_fullscreen; }catch(ex) { }
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
		if("_self" != winname.toLowerCase()) {
			addWindow(fs_window); 
		}
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
	var yy = now.getFullYear(); 
	var result = ((dd < 10) ? "0" : "") + dd; 
	result += ((mm < 10) ? "/0" : "/") + mm; 
	result += "/"+yy; 
	return result; 
} 
function Hash() { 
	this.length = 0; 
	this.items = new Array(); 
	for (var i = 0; i < arguments.length; i += 2) { 
		if (typeof(arguments[i + 1]) != 'undefined') { 
			this.items[arguments[i]] = arguments[i + 1]; 
			this.length++; 
		} 
	}; 
	this.removeItem = function(in_key) 	{ 
		var tmp_value = null; 
		if (typeof(this.items[in_key]) != 'undefined') { 
			this.length--; 
			tmp_value = this.items[in_key]; 
			delete this.items[in_key]; 
		}	   
		return tmp_value; 
	}; 
	this.getItem = function(in_key) { 
		return this.items[in_key]; 
	};
	this.setItem = function(in_key, in_value) { 
		//alert("in_key: "+in_key+", in_value: "+in_value);
		if (typeof(in_value) != 'undefined') { 
			if (typeof(this.items[in_key]) == 'undefined') { 
				this.length++; 
			} 
			this.items[in_key] = in_value; 
		}	   
		return in_value; 
	}; 
	this.hasItem = function(in_key) { 
		return typeof(this.items[in_key]) != 'undefined'; 
	}; 
	this.size = function() { 
		return this.length; 
	}; 
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
	$("input[type=submit]:disabled, input[type=reset]:disabled, input[type=button]:disabled, button:disabled",aform).each(function(index,element){ 
		$(this).attr("disabled",false);
	});
}
function disableForm(aform) {
	$("input[type=submit]:enabled, input[type=reset]:enabled, input[type=button]:enabled, button:enabled",aform).each(function(index,element){ 
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
	try { hideLayer(fswaitlayer); }catch(ex) { }
	//try{ enableButtons(); }catch(ex) { }
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
function startApplication(pid,unbind,aform) { 
	fs_currentpid = pid;
	fs_langsXMLDocs = null;
	fs_labelAry = null;
	fs_hashLang = {};
	if(!unbind) {
		bindHangOut();
	}
	$("input[type=text]",aform||this.document).each(function(index,element) { 
		var input = $(this);
		if(input.attr("picture")) { input.mask(input.attr("picture")); }
	});	
}
function bindHangOut() {
	$(document).bind("click",function(e){ 
		try { window.parent.hangOut(); }catch(ex) { }
	});	
}
function setupApplication(aform) {
	var url = $(location).attr('href');
	$('input[name=resurl]').val(url);
	$('input, textarea').placeholder({customClass:'my-placeholder'});
	try { setNavigation(); } catch(ex) { }
	fs_stopAnchorTaborder();
	try{ 
		if(fs_default_language.toUpperCase()!="EN") fs_switchLanguage(fs_default_language,true);
	}catch(ex) { }	
	try { backHawkDown(); }catch(ex) { }
	try { $(window).bind("unload",closeChildWindows); }catch(ex) { }
}
function startPeriodical(period) {
	if(period) {
		fs_polling = setInterval(function() { $.ajax({ url : "jsp/track.jsp?seed="+Math.random(), type : "POST" }); },1000*60*period);
	}
}
function prepareOptions(jsAry,elementname,listing,defaultValue,defaultCaption,doubleValue,notEmpty) {
	if(!jsAry) return;
	if(!defaultCaption) { 
		try { defaultCaption = jsAry["undefinedlookup"]["value"]; } catch(ex) { }
	}
	try {
		if(!defaultCaption) defaultCaption = "   ";
		if(defaultValue!=null) $("<option value='"+defaultValue+"'>"+defaultCaption+"</option>").appendTo(listing);
		var opts = jsAry[elementname];
		if(opts) {
			for(var p in opts) {
				if(doubleValue) {
					if(notEmpty) {
						if(p!="") {
							$("<option value='"+p+"'>"+(p+" - "+opts[p])+"</option>").appendTo(listing);
						}
					} else {
						$("<option value='"+p+"'>"+(p+" - "+opts[p])+"</option>").appendTo(listing);
					}
				} else {
					if(notEmpty) {
						if(p!="") {
							$("<option value='"+p+"'>"+opts[p]+"</option>").appendTo(listing);
						}
					} else {
						$("<option value='"+p+"'>"+opts[p]+"</option>").appendTo(listing);
					}
				}				
			}
		}
	}catch(ex) { }
}

function backHawkDown() {
	$(document).on("keydown", function (e) {
		if (e.which == 8 && !$(e.target).is("input:not([readonly]), textarea")) {
			e.preventDefault(); return;
		}
        if (e.which == 17) {
            e.preventDefault(); return;
        }		
        //if(e.which==123) { //F12
		//	e.preventDefault(); return;
		//}
	});	
}
function notAllowRightClick() {
    $(document).on("contextmenu", function(e) {
        e.preventDefault();
        return false;
    });
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
	if(xhr.status==400) errorThrown = xhr.responseText; //400=Bad Request,401=Unauthen
	try{
		var json = $.parseJSON(xhr.responseText);
		if(json.text) errorThrown = json.text;
	}catch(ex) { }
	if($.trim(errorThrown)=="") errorThrown = "Unknown error or network error";
	return errorThrown;
}
function replaceString(str, arrStr){                           
	if(arrStr) {
		var regex = /%s/;
		for(var i=0;i<arrStr.length;i++){
			var t_str = arrStr[i];
			str = str.replace(regex, t_str);
		}
	} 
	if(str) {
		var regex = /%s/g;
		str = str.replace(regex,"");
	}
	return str;
}
var msgxmldoc = null;
function loadXMLMessage(aSync) {
	jQuery.ajax({
		url: "xml/smart_message.xml?seed="+Math.random(),
		async : aSync,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		dataType: "xml",
		error : function(transport,status,errorThrown) { 
			$.ajax({
				url: "../xml/smart_message.xml?seed="+Math.random(),
				async : aSync,
				type: "GET",
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				dataType: "xml",
				error : function(transport,status,errorThrown) { },
				success: function(data,status,transport) { msgxmldoc = data; }
			});
		},
		success: function(data,status,transport){ msgxmldoc = data; }
	});	
}
function getMessageCode(errcode, params) {
	try {
		if (msgxmldoc == null) loadXMLMessage(false);
		var msgnode = $("root msg[code=" + errcode + "]", msgxmldoc);
		var fs_curlang = fs_default_language;
		if(!fs_curlang) fs_curlang = "EN";
		var fs_msgtext = msgnode.find(fs_curlang.toUpperCase()).text();
		if(fs_msgtext && fs_msgtext!="") return replaceString(fs_msgtext, params);
		return msgnode.text();
	}catch(ex) { }
	return errcode;
}
function getMessageTitle(titleCode, defaultTitle) {
	var fs_msgtitle = getMessageCode(titleCode); 
	if(!fs_msgtitle || fs_msgtitle=="") fs_msgtitle = defaultTitle;
	return fs_msgtitle;
}
function createDialog(dialoglayer) {
    return $(dialoglayer).dialog({
        autoOpen: false, modal: true, title: "Message Dialog",
        width: 500, height: 200, resizable: false, 
        buttons: [{ text: "OK", click: function() { $(this).dialog("close"); } }]
    });
}
function alertDialog(msg, callback, width, height) {
    try {
		var fs_title = getMessageCode("fsmessagetitle");
		if(!fs_title || fs_title=="") fs_title = "Message Dialog";
		var fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || fs_okbtn=="") fs_ok = "OK";
        if (!width) width = 500;
        if (!height) height = 200;
        if (!msgdialog) msgdialog = createDialog("#fsdialoglayer");
        $("#fsmsgbox", $("#fsdialoglayer")).html(msg);
        msgdialog.dialog("option", "title", fs_title);
        msgdialog.dialog("option", "width", width);
        msgdialog.dialog("option", "height", height);
        msgdialog.dialog("option", "position", "center");
        msgdialog.dialog("option", "close", function() { if (callback) callback(); });
        msgdialog.dialog("option", "buttons", [{ text: fs_okbtn, click: function() { $(this).dialog("close"); } }]);
        msgdialog.dialog("open");
        return;
    } catch (ex) { alert(ex.description); }
    alert(msg);
    if (callback) callback();
}
function confirmDialog(msg, okCallback, cancelCallback, width, height) {
    try {
		var fs_title = getMessageCode("fsaccepttitle");
		if(!fs_title || fs_title=="") fs_title = "Confirm Dialog";
		var fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || fs_confirmbtn=="") fs_confirmbtn = "OK";
		var fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || fs_cancelbtn=="") fs_cancelbtn = "Cancel";
        if (!width) width = 500;
        if (!height) height = 200;
        if (!acceptdialog) acceptdialog = createDialog("#fsacceptlayer");
        $("#fsacceptbox", $("#fsacceptlayer")).html(msg);
        acceptdialog.dialog("option", "title", fs_title);
        acceptdialog.dialog("option", "width", width);
        acceptdialog.dialog("option", "height", height);
        acceptdialog.dialog("option", "position", "center");
        acceptdialog.dialog("option", "close", function() { });
        acceptdialog.dialog("option", "buttons", [{
				text: fs_cancelbtn,
				click: function() { $(this).dialog("close"); if (cancelCallback) cancelCallback(); }
			}, {
				text: fs_confirmbtn,
				click: function() { $(this).dialog("close"); if (okCallback) okCallback(); }
        }]);
        acceptdialog.dialog("open");
        return;
    } catch (ex) { }
    if (confirm(msg)) {
        if (okCallback) okCallback();
    } else {
        if (cancelCallback) cancelCallback();
    }
}
function confirmDialogBox(errcode, params, defaultmsg, okFn, cancelFn, width, height, addedMsg){
	var txt = getMessageCode(errcode,params);
	if(txt!=null && txt!="") {	
		if(addedMsg) txt += " "+addedMsg;
		confirmDialog(txt, okFn, cancelFn, width, height); 
		return false;
	} else {
		if (defaultmsg) {
			return confirmDialog(defaultmsg, okFn, cancelFn, width, height);
		} else {
			return confirmDialog(errcode, okFn, cancelFn, width, height);
		}
	}
}
function confirmDelete(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0001",params,"Do you want to delete this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmSave(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0002",null,"Do you want to save this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmCancel(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0003",null,"Do you want to cancel this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmRemove(params, okFn, cancelFn,  width, height) {
	if(!confirmDialogBox("QS0005",params,"Do you want to delete this record?",okFn,cancelFn,width,height)) return false;
	return true;
}
function confirmSend(okFn, cancelFn, width, height) {
	if(!confirmDialogBox("QS0006",null,"Do you want to send this transaction?",okFn,cancelFn,width,height)) return false;
	return true;
}
function successbox(callback) {
	alertbox("QS0004",callback);
}
function alertbox(errcode, callback, defaultmsg, params) {
	var txt = getMessageCode(errcode, params);
	//alert("alert box : "+errcode+" = "+txt);
	if(txt!=null && txt!="") {
		alertDialog(txt, callback);
	} else {
		if (defaultmsg) {
			alertDialog(defaultmsg, callback);
		} else {
			alertDialog(errcode, callback);
		}
	}
}
function confirmbox(errcode, okFn, cancelFn, defaultmsg, params){
	var txt = getMessageCode(errcode,params);
	//alert("confirm box : "+errcode+" = "+txt);
	if(txt!=null && txt!="") {
		return confirmDialog(txt, okFn, cancelFn);
	} else {
		if (defaultmsg) {
			return confirmDialog(defaultmsg, okFn, cancelFn);
		} else {
			return confirmDialog(errcode, okFn, cancelFn);
		}
	}
	return false;	
}
/* uncomment to use boot dialog */

function alertDialog(msg, callbackfn, width, height) {
	try {
		var fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || fs_okbtn=="") fs_ok = "OK";
    	bootbox.alert({
    		message: msg,
    		callback: function() {    		
    			if (callbackfn) callbackfn();
    		},
			buttons: {
				ok:  { label: fs_okbtn }
			}    		
    	}); 
		return;
    } catch (ex) { }
    alert(msg);
    if (callbackfn) callbackfn();
}
function confirmDialog(msg, okCallback, cancelCallback, width, height) {
	try {
		var fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || fs_confirmbtn=="") fs_confirmbtn = "OK";
		var fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || fs_cancelbtn=="") fs_cancelbtn = "Cancel";
    	bootbox.confirm({
			message: msg, 
			callback: function(result) {
				if(result) {
					if (okCallback) okCallback();
				} else {
					if (cancelCallback) cancelCallback();
				}
			},
			buttons: {
				confirm : { label: fs_confirmbtn },
				cancel: { label: fs_cancelbtn }
			}
    	}); 
		return;
    } catch (ex) { }
    if (confirm(msg)) {
        if (okCallback) okCallback();
    } else {
        if (cancelCallback) cancelCallback();
    }
}

function submitFailure(xhr, status, errorThrown) {
	stopWaiting();
	errorThrown = parseErrorThrown(xhr, status, errorThrown);
	alertbox(errorThrown, function() { 
		if(xhr.status==401) { window.open("index.jsp","_self"); }
	});
}
function alertmsg(errcode, fallmsg, params, callback) {
	alertbox(errcode, callback, fallmsg, params);
}
function confirmmsg(errcode, fallmsg, params, okFn, cancelFn) {
	confirmbox(errcode, okFn, cancelFn, fallmsg, params);
}

function bootAlertDialog(msg, callback, width, height) {
	try {
		var fs_okbtn = getMessageCode("fsokbtn"); if(!fs_okbtn || fs_okbtn=="") fs_ok = "OK";
    	bootbox.alert({
    		message: msg,
    		callback: function() {    		
    			if (callback) callback();
    		},
			buttons: {
				ok:  { label: fs_okbtn, className : "btn-primary btn-base" }
			}    		
    	}); 
		return;
    } catch (ex) { }
    alert(msg);
    if (callback) callback();
}
function bootConfirmDialog(msg, okCallback, cancelCallback, width, height) {
	try {
		var fs_confirmbtn = getMessageCode("fsconfirmbtn"); if(!fs_confirmbtn || fs_confirmbtn=="") fs_confirmbtn = "OK";
		var fs_cancelbtn = getMessageCode("fscancelbtn"); if(!fs_cancelbtn || fs_cancelbtn=="") fs_cancelbtn = "Cancel";
    	bootbox.confirm({
			message: msg, 
			callback: function(result) {
				if(result) {
					if (okCallback) okCallback();
				} else {
					if (cancelCallback) cancelCallback();
				}
			},
			buttons: {
				confirm : { label: fs_confirmbtn, className : "btn-primary btn-base" },
				cancel: { label: fs_cancelbtn, className : "btn-primary btn-base" }
			}
    	}); 
		return;
    } catch (ex) { }
    if (confirm(msg)) {
        if (okCallback) okCallback();
    } else {
        if (cancelCallback) cancelCallback();
    }
}
function alertboot(errcode, callback, defaultmsg, params) {
	var txt = getMessageCode(errcode, params);
	//alert("alert box : "+errcode+" = "+txt);
	if(txt!=null && txt!="") {
		bootAlertDialog(txt, callback);
	} else {
		if (defaultmsg) {
			bootAlertDialog(defaultmsg, callback);
		} else {
			bootAlertDialog(errcode, callback);
		}
	}
}
function confirmboot(errcode, okFn, cancelFn, defaultmsg, params){
	var txt = getMessageCode(errcode,params);
	//alert("confirm box : "+errcode+" = "+txt);
	if(txt!=null && txt!="") {
		return bootConfirmDialog(txt, okFn, cancelFn);
	} else {
		if (defaultmsg) {
			return bootConfirmDialog(defaultmsg, okFn, cancelFn);
		} else {
			return bootConfirmDialog(errcode, okFn, cancelFn);
		}
	}
	return false;	
}
function fs_beforedeactivate(src,rival) {  }
function fs_deactivate(src,rival) { }
function fs_rival_deactivate(src,rival) { }
function fs_rival_beforedeactivate(src,rival) { }
