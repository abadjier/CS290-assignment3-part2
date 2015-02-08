
function generate_rslt() {
 
	getGists();
	
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
				
          createResultsList(document.getElementById('results'), description, url, language);
				});
			}
	  }
		
		
		url = 'https://api.github.com/gists?page=' + i + '&per_page=30';
			
		
		req.open('GET', url);
	  req.send();
	}

	
}