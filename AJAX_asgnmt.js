// Global object to store the array of favorite gists
var stored_gists = null;

function generate_rslt() { 
  var res_list = document.getElementById("res");

  //Clear the old result list
  while(res_list.childNodes.length != 0) {
    res_list.removeChild(res_list.childNodes[res_list.childNodes.length - 1]);
  }

  //generate new result list	
  getGists();
}

function getSelectedLanguages() {
  var lang_select = [];
		
	if (document.getElementById('JavaScript').checked) {
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
}

function createResultsList(ul, description, url, language) {

	var item = '<a href="' + url + '">' + description + '</a>';

	// check if selected result is already in favorites list
	if (isInFavorites(item)) {
		return;
	}

  var res_item = document.createElement('li');
	var fav_btn = document.createElement('button');
	var btn_text = document.createTextNode('Add to Favorites');
	fav_btn.appendChild(btn_text);
	res_item.innerHTML = item; 

	res_item.appendChild(fav_btn);	
	ul.appendChild(res_item);	
}

function isInFavorites(item) {
	var i = 0;
  var gist;
 
  for (i = 0; i < stored_gists.gists.length; i++) {
	
		gist = stored_gists.gists[i];
		
		if (gist == item) {
			return true;
		}
  }
	
  return false;
}

function addToFavoritesList(ul, itemText) {
  var fav_item = document.createElement('li');
	var btn = document.createElement('button');
	var btn_text = document.createTextNode('Remove');
  btn.appendChild(btn_text);
	fav_item.innerHTML = itemText;
	fav_item.appendChild(btn);
	ul.appendChild(fav_item);	
}

function populateFavoritesList() {  
  var ul = document.getElementById('favorites');
	
	stored_gists.gists.forEach( function (gist) { 
	  var liItem = document.createElement('li');
		var btn = document.createElement('button');
	  var btn_text = document.createTextNode('Remove');
	  btn.appendChild(btn_text);
		liItem.innerHTML = gist;	
		liItem.appendChild(btn);
		ul.appendChild(liItem);
	});
}

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
							    createResultsList(document.getElementById('res'), description, url, language);
							  }
						  });
					  }
				  }
					else {
					  // selected language array is empty
						createResultsList(document.getElementById('res'), description, url, language);
					}
          
				});
			}
	  }		
		
		url = 'https://api.github.com/gists?page=' + i + '&per_page=30';			
		
		req.open('GET', url);
	  req.send();
	}	
}

//Hook up event listeners to results buttons
function setUpResultsList() {
  
  ul = document.getElementById('res');

  // Code for add to favourites button
  //	Source: Jon Duckett 'Javascript & Jquery' pg. 269  
	function getTarget(e) {
    if (!e) {         // If there is no event object 
		  e = window.event;   // Use old IE event object
		}
		return e.target || e.srcElement;   // get the target of event
  }	
	
	function addToFavorites(e) {
    var target, liElement, ulElement, link;	

    if (e.target.nodeName !== 'BUTTON') {
      return;		
		}
		
    target = getTarget(e);           // get clicked on button
		
		liElement = target.parentNode;		// get li element
		ulElement = target.parentNode.parentNode; //get ul element		
				
		link = liElement.innerHTML;		
		link = link.slice(0, link.indexOf("<button>"));   // remove button from li
		//console.log(link);
		
		
		//Add to local storage
		stored_gists.gists.push(link);
		localStorage.setItem('storedGistsKey', JSON.stringify(stored_gists));
		
		//Add to favourites
		addToFavoritesList(document.getElementById('favorites'), link);
					
		ulElement.removeChild(liElement);				
  }	
	
	if (ul.addEventListener) { //If event listener works
	  ul.addEventListener('click', function(e) {     // Add listener on click
	    addToFavorites(e);
		}, false);               // use bubbling phase for flow
	}
	else {
	  ul.attachEvent('onclick', function(e) {     // Use old IE model
		  addToFavorites(e);
		});
	}

}

// Hook up event listeners to favourites- delete buttons
function setUpFavoritesList() {
  ul = document.getElementById('favorites');

  // Code for remove from favourites button
  //	Source: Jon Duckett 'Javascript & Jquery' pg. 269  
	function getTarget(e) {
    if (!e) {         // If there is no event object 
		  e = window.event;   // Use old IE event object
		}
		return e.target || e.srcElement;   // get the target of event
  }	
	
	function removeFromFavorites (e) {
    var target, liElement, ulElement, link;	

    if (e.target.nodeName !== 'BUTTON') {
      return;		
		}
		
    target = getTarget(e);           // get clicked on button
		
		liElement = target.parentNode;		// get li element
		ulElement = target.parentNode.parentNode; //get ul element		
				
		link = liElement.innerHTML;		
		link = link.slice(0, link.indexOf("<button>"));   // remove button from li
				
		//Remove from global array
		removeFromFavoritesList(link);
		
		//Remove from local storage 		
		localStorage.setItem('storedGistsKey', JSON.stringify(stored_gists));
		
		//Remove from favourites in HTML					
		ulElement.removeChild(liElement);				
  }
	
	if (ul.addEventListener) { //If event listener works
	  ul.addEventListener('click', function(e) {     // Add listener on click
	    removeFromFavorites(e);
		}, false);               // use bubbling phase for flow
	}
	else {
	  ul.attachEvent('onclick', function(e) {     // Use old IE model
		  removeFromFavorites(e);
		});
	}
}

function removeFromFavoritesList(item) {  
	var i;	
	for (i = 0; i < stored_gists.gists.length; i++ ) {
	  if (stored_gists.gists[i] == item ) {
		  //Remove 1 element at position i
			//Source: http://www.w3schools.com/jsref/jsref_splice.asp
			stored_gists.gists.splice(i, 1);
		}
	}	
}

window.onload = function () {	
	// Initialize storage
	var gistStr = localStorage.getItem('storedGistsKey');
	
	if (gistStr === null) {
	  stored_gists = {'gists':[]};
		// convert into string representation of an object
		localStorage.setItem('storedGistsKey', JSON.stringify(stored_gists));  
	}
	else {
	  stored_gists = JSON.parse(gistStr);
	}
	
	populateFavoritesList();	
	
	setUpResultsList();
	
	setUpFavoritesList();
	
}