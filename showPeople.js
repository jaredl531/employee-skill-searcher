var searchedTerms = [];
var slackTeamID = "ADD YOUR TEAM'S SLACK ID HERE";

/*
  Purpose: Fill in results table with appropriate models
  Args:
    tags - A search term entered by the user (String)
*/
function doAnalysis(search, grabRandom) {
	// first clear old table and past searched terms
	document.getElementById("ResultsTable").innerHTML = "";
	searchedTerms = [];
	
	// Trim the search
	var trimmedSearch = search.trim(); 
	var words = [];
	
	// Check for blank "I'm feeling lucky" search
	if(search == "") {
		var randomPerson;
		var tagArray;

		// first get random person and their tags
		if(mentorOptionEnabled()) {
			randomPerson = getRandomPerson(Object.keys(mentorTags));
			tagArray = mentorTags[randomPerson];
		}
		else {
			randomPerson = getRandomPerson(Object.keys(employeeTags));
			tagArray = employeeTags[randomPerson];
		}

		console.log("Tagarray: " + tagArray);

		// then randomly get one of their tags
		var randomTag = tagArray[Math.floor(Math.random()*tagArray.length)];
		words.push(randomTag);
		searchedTerms = [capitalize(randomTag)];
	}
	
	else {
		// First check search term for just one word with quotes
		if((trimmedSearch.charAt(0) == "\"" && trimmedSearch.charAt(trimmedSearch.length-1) == "\"") || (trimmedSearch.charAt(0) == "'" && trimmedSearch.charAt(trimmedSearch.length-1)) == "'") {
			trimmedSearch = trimmedSearch.replace(/["'?!,]/g, "");
			words.push(trimmedSearch);
		}
		
		else {
			// Parse the words with spaces
			
			// Remove any question marks, exclamation marks, commas
			trimmedSearch = trimmedSearch.replace(/[?!,]/g, " ");
			words = trimmedSearch.split(" ");
			
			// then combine ones with quotes
			var quote1, quote2;
			
			for(var i=0; i < words.length; i++) {
				if(words[i].charAt(0) == "\"" || words[i].charAt(0) == "'") {
					quote1 = i;
				}
				else if(words[i].charAt(words[i].length-1) == "\"" || words[i].charAt(words[i].length-1) == "'") {
					quote2 = i;
				}
			}
	
			// tweak array as necessary if quotes exist
			if(quote1 != null && quote2 != null) {
				var newTerm = words[quote1];
				var wordSpliceCount = 0;
				
				for(var i=quote1; i < quote2; i++) {
					console.log("Word: " + words[i]);
					newTerm += " " + words[i+1];
					wordSpliceCount++;
				}
				
				// remove quotes, replace original term and then remove unneeded terms
				newTerm = newTerm.replace(/["']/g, "");
				words[quote1] = newTerm;
				words.splice(quote1+1, quote2-quote1);
				trimmedSearch = trimmedSearch.replace(/["']/g, "");
			}
			
		}
	}
	
	var peopleResults = getPeople(words);
	
	// If grabRandom = Yes, we only pick one person for it
	if(grabRandom == "yes") {
		peopleResults = getRandomPerson(peopleResults);
	}
	
	var textDiv = document.getElementById("resultText");
	var resultsTable = document.getElementById("ResultsTable");
	
	var numRows = Math.ceil(peopleResults.length / 4); // number of rows to output
	
	// No Results
	if(peopleResults.length == 0) {
		textDiv.innerHTML = "Bummer! \"" + capitalize(trimmedSearch) + "\" either isn't in anyone's wheelhouse<br/> or nobody offered to mentor it";
	}
	
	else {
		// sort by alphabetical order
		peopleResults.sort();

		console.log("PeopleResults: " + peopleResults);
		
		console.log("Search Terms: " + searchedTerms.toString());
		textDiv.innerHTML = "You may want to ask " + (peopleResults.length == 1 ? peopleResults[0].split(' ')[0] : ' any of the following ' + peopleResults.length + ' people') + " about " + searchedTerms.join(', ').replace(/, (?!.*,)/gmi, ' and ') + "!<br/><br/>";
		
		for(var h=0; h < numRows; h++) {
			var mainRow = resultsTable.insertRow(-1);
		
			// Loop through the people
			for(var i=(4*h); i <= (peopleResults.length - 4*h >= 4 ? (4*h + 3) : (4*h + peopleResults.length%4 - 1)); i++) {
				var newCell = mainRow.insertCell(-1);
				newCell.style.textAlign = "center";

				// format for picture
				var picName = peopleResults[i].toLowerCase();
				picName = picName.replace(" ", "-");
				newCell.innerHTML = "<div id='cellBackground" + i + "' style='background-repeat:no-repeat'><a href='slack://user?team=" + slackTeamID + "&id=" + employeeSlackIDs[peopleResults[i]] + "' style='text-decoration: none; color:black;'><div style='position: relative; left: 0; top: 0;' title='" + peopleResults[i].split(' ')[0] + " knows about " + employeeTags[peopleResults[i]].sort().join(', ').replace(/, (?!.*,)/gmi, ' and ') + "." + (mentorTags.hasOwnProperty(peopleResults[i]) ? '\n\nThey are willing to mentor ' + mentorTags[peopleResults[i]].sort().join(', ').replace(/, (?!.*,)/gmi, ' and ') : '') +  "\'><span style='font-family:calibri;'><img src='Employee-Photos/" + picName + ".jpg' style='position: relative; top: 0; left: 0; z-index:-1' width='300' height='300'\><br/>" + peopleResults[i] + "<br/>" + employeeTitles[peopleResults[i]] + "</font></div></a></div>";
				//newCell.innerHTML = "<font face='calibri'><span class='tooltip tooltip-effect-2'><span class='tooltip-item'><a href='slack://user?team=T0684KNCS&id=" + employeeSlackIDs[peopleResults[i]] + "'><img src='https://s3.amazonaws.com/jared-clarifai-stuff/People-Searcher/Employee-Photos/" + picName + ".jpg' width='300' height='300' title=''\></a></span><span class='tooltip-content clearfix'><span class='tooltip-text'>" + peopleResults[i].split(' ')[0] + " also knows about " + employeeTags[peopleResults[i]].sort().join(', ') + "</span></span></span><br/>" + peopleResults[i] + "<br/>" + employeeTitles[peopleResults[i]] + "</font>";
								
				// Add Mentorship Badges if applicable
				if(mentorTags.hasOwnProperty(peopleResults[i])) {
					if(containsAny(mentorTags[peopleResults[i]], searchedTerms.toString().toLowerCase())) {
						console.log(peopleResults[i]);
						document.getElementById("cellBackground" + i).style.backgroundImage = "url('Graphics/lightbulb.png')";
					}
				}
			}
		}
	}
}


/*
  Purpose: Return all people that contain a certain search term in their skillset
  Args:
    words - An array of words that were entered by the user
  Returns:
  	peopleResults - an array of all people that contain the search term
*/
function getPeople(words) {
	var peopleResults = [];
	var finalResults = [];

	console.log("Words: " + words);
	
	// search all words for people
	for(var i=0; i < words.length; i++) {
		// Need to traverse dictionary
		Object.keys(employeeTags).forEach(function(key) {
  		if (employeeTags[key].includes(words[i].toLowerCase()) && (!mentorOptionEnabled() || (mentorTags.hasOwnProperty(key) && mentorTags[key].includes(words[i].toLowerCase())))) {
				// Make sure that we don't push duplicates
				if(!peopleResults.includes(key)) {
					peopleResults.push(key);
				}
    		if(!searchedTerms.includes(capitalize(words[i]))) {
    			searchedTerms.push(capitalize(words[i]));
    		}
  		}
		});
	}
	
	// now filter peopleResults array by potential multi-term AND search
	if(searchedTerms.length > 1) {
		for(var i=0; i < peopleResults.length; i++) {
			if(searchedTerms.every(function(word) { return employeeTags[peopleResults[i]].includes(word.toLowerCase()); })) {
				finalResults.push(peopleResults[i]);
			}
		}
		return finalResults;
	}
	
	else {
		return peopleResults;
	}

}


/*
	Purpose: Retrieves a random person based on a people array
	Args:
		people - array of people
  Returns:
  	A random person in an array
*/ 
function getRandomPerson(people) {
	var randomIndex = Math.floor((Math.random() * people.length));
	return [people[randomIndex]];
}


/*
  Purpose: Returns True or False based on the mentors checkbox being checked
  Returns:
  	A boolean True or False
*/ 
function mentorOptionEnabled() {
	return document.getElementById("mentorCheck").checked;
}


/*
  Purpose: Capitalizes words in a String
  Args:
  	s - A String
*/ 
function capitalize(s){
    return s.replace( /(^|\s)([a-z])/g, function(match, group_1, group_2){return group_1 + group_2.toUpperCase()});
};

/*
  Purpose: Returns if an array contains all of the elements supplied
  Args:
  	source - Source Array
  	target - Array of what you're checking against
*/ 
function containsAll(source,target)
{
		var result = source.filter(function(item){ return target.indexOf(item) > -1});   
    return (result.length == source.length);  
} 

/*
  Purpose: Returns if an array contains any of the elements supplied
  Args:
  	source - Source Array
  	target - Array of what you're checking against
*/ 
function containsAny(source,target)
{
    var result = source.filter(function(item){ return target.indexOf(item) > -1});   
    return (result.length > 0);  
}  
