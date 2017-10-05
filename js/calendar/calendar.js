function fs_isleapyear(y) {
	if ((y % 400) == 0) return true;
	if ((y % 100) == 0) return false;
	if ((y % 4) == 0) return true;
	return false;
}
function fs_isdate(str_date) {
	var re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	var febday = 0;
	if (!re_date.exec(str_date))
		return false;
	try {
		if (fs_isleapyear(RegExp.$3)) {
			fabday = 29;
		} else {
			fabday = 28;
		}
		if (RegExp.$2 <= 0 || RegExp.$2 > 12) return false;
		if (RegExp.$1 <= 0) return false;
		return (RegExp.$2 == 1?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 2?RegExp.$1 <= fabday:true)
		&& (RegExp.$2 == 3?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 4?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 5?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 6?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 7?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 8?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 9?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 10?RegExp.$1 <= 31:true)
		&& (RegExp.$2 == 11?RegExp.$1 <= 30:true)
		&& (RegExp.$2 == 12?RegExp.$1 <= 31:true);
		var d = new Date (RegExp.$3, RegExp.$2-1, RegExp.$1);
	} catch (e) {
		return false;
	}
	return true;
}
function str2d (str_date) {
	var re_date = /^(\d+)\/(\d+)\/(\d+)$/;
	if (!re_date.exec(str_date))
		return alert("Invalid Date format: "+ str_date);
	return (new Date (RegExp.$3, RegExp.$2-1, RegExp.$1));
}
function d2dstr (dt_date) {
	var dd = dt_date.getDate();
	var mm = dt_date.getMonth()+1;
	return (new String ((((dd < 10) ? "0" : "") + dd)+"/"+( ((mm < 10) ? "0" : "") + mm)+"/"+dt_date.getFullYear()));
}
function openCalendar(src) {
	//try { if(fs_default_language) $.datepicker.setDefaults($.datepicker.regional[fs_default_language.toLowerCase()]); }catch(ex) { }
	var dpkr = $(src);
	//dpkr.attr("size","12");
	try{ 
		dpkr.datepicker({
			showOn : "",
			dateFormat : "dd/mm/yy",
			changeMonth: true,
			changeYear: true,
			beforeShow : function(input,inst) {
				var offset = $(input).offset();
				var height = $(input).height();
				window.setTimeout(function () {
					inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
				}, 1);
			}
		});
		dpkr.datepicker("show");
		return;
	}catch (ex)	{ }
}
function fs_opencalendar(src_path,src,placer) {
	openCalendar(src);
}
