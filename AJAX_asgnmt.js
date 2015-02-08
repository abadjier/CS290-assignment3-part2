
function generate_rslt() {
 
	getGists();

};

function getSelectedLanguages() {
  var lang_select = [];
		
	if ( document.getElementById('JavaScript').checked ) {
	  lang_select.push('JavaScript');		
	};
			
	if (document.getElementById('JSON').checked) {
	  lang_select.push('JSON');
	};
	
	if (document.getElementById('SQL').checked) {
	  lang_select.push('SQL');
	};
	
	if (document.getElementById('Python').checked) {
	  lang_select.push('Python');
	};
	
	return lang_select;
};

function createResultsList(ul, description, url, language) {
  var res_item = document.createElement('li');
	res_item.innerHTML = '<a href="' + url + '">' + description + '</a>';
	ul.appendChild(res_item);
};



function getGists() {

  var pages = document.getElementById('num_pgs');
	var url;	
  var req;
	
	
	// source: http://stackoverflow.com/questions/1085801/get-selected-value-of-dropdownlist-using-javascript
	var num_of_pgs = pages.options[pages.selectedIndex].value; 
	
	for ( var i = 1; i <= num_of_pgs; i++) {
		req = new XMLHttpRequest();
		if(!req){
			throw "Unable to create HttpRequest.";
		}
		
		req.onreadystatechange = function() {
	    
			var result;
	    var gists = [];
			var files;
			var file;
			
			if(this.readyState ===4){
		    console.log('---------------********************');
			  result = JSON.parse(this.responseText);		  
        //source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
				Array.prototype.push.apply(gists, result);
				var select_lang = getSelectedLanguages();
				
        gists.forEach( function (gist) { 
				  				
				  var description = gist.description;
					if ( description == "") {
					  description = "No description"; 
					}
				  var url = gist.url;
				  var language = [];
			
				  files = gist.files;
				  for(var filename in files) {
					  file = files[filename];					
					  language.push(file.language);
				  }
					
					// If any of the languages inside 'language' is in 'select_lang' or empty call createResultsList
					if (select_lang.length !== 0) {
					  for (var j = 0; j < language.length; j++) {
					    select_lang.forEach( function (lang) {
						    if (language[j] === lang) {
							    createResultsList(document.getElementById('results'), description, url, language);
							  }
						  });
					  }
				  }
					else {
					  // selected language array is empty
						createResultsList(document.getElementById('results'), description, url, language);
					}
          
				});
			}
	  }
		
		
		url = 'https://api.github.com/gists?page=' + i + '&per_page=30';
			
		
		req.open('GET', url);
	  req.send();
	}

	
}