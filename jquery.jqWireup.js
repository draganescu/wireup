jQuery.jqWireup = new function() {  
	
	this.log = function(text) {
		if(arguments.length == 0) return false;
		var args = (arguments.length > 1) ? Array.prototype.join.call(arguments, " ") : arguments[0];
		try { console.log(args);	return true;}
		catch(e) { try {opera.postError(args); return true; } catch(e) {}}
		alert(args); return false;
	}
	
	this.getFile = function(uri) {
		var file = uri.split("?")[1].split("=")[1];
		if(unescape(file).indexOf("http") == -1)
			file = uri.split("?")[0] + file;
		jQuery.extend(settings, {'location' : file});
		return uri.split("?")[0];
	}
	
	this.wireup = function() {
		jQuery.getJSON(settings.location, function(data) {
			jQuery.each(data, function(element, wireup) {
				jQuery(element).each(function(){
					jQuery.each(wireup, function(script, actions){
						jQuery.ajax({
							url: baseUri + script,
							dataType: 'script',
							success: function(){
								$.each(actions, function(index, set){
									eval("check = typeof " + set[2]);
									if(check == "undefined")
									{
										jQuery.jqWireup.log(set[2] + " is not defined in the " + script + " file.");
									}
									else
									{
										set[0] == "document" ? element = "document" : element = "'" + set[0] + "'";
										eval("jQuery(" + element + ")." + set[1] + "(" + set[2] + ")");
									}
								});
							},
							error: function(){
								jQuery.jqWireup.log(script + " could not be loaded. Does it exist?");
							}
						});
					})
				});
			});
		});
	}
	
	//thanks stackoverflow!
	var scripts = document.getElementsByTagName('script');
	var baseUri = scripts[ scripts.length - 1 ]['src'].toString().replace("jquery.jqWireup.js","");
	
	var settings = {
		'location' : baseUri + 'wireup.json'
	};
	
	if(baseUri.indexOf("?") > -1)
		baseUri = this.getFile(baseUri);
		
	$.ajax({
	    url:settings.location,
	    type:'HEAD',
	    error:
	        function(){
	            jQuery.jqWireup.log("The wireup file could not be loaded. Does it exist?");
	        },
	    success:
	        function(){
	            jQuery.jqWireup.wireup();
	        }
	});
	
}();