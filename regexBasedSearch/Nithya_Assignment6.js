/**
Author: Nithya Narayanan
FileName: Nithya_Assignment6.js
Assignment6 
*/
function submitSearchQuery(){
	"use-strict";
	//clear table from previous search
	document.getElementById('searchResultSection').innerHTML="";
 	//get form input
 	var searchInput_name = getFormInput('searchInput_name');
 	var searchInput_tookOffice = getFormInput('searchInput_tookOffice');
 	var searchInput_dob = getFormInput('searchInput_dob');
 	var searchInput_number = getFormInput('searchInput_number');
 	//get search result
 	getSearchResults(searchInput_name, searchInput_tookOffice, searchInput_dob, searchInput_number);
 }

function showAllPresidents(){
	var URL = "http://schwartzcomputer.com/ICT4570/Resources/USPresidents.json", isAsync = true, method = "GET";
	var searchString = buildSearchString("", "", "", "");

	//clear table from previous search
	document.getElementById('searchResultSection').innerHTML="";
	resetInputs();
 	getJSONFromURL(method, URL, isAsync, searchString);
}

function resetInputs(){
	clearField('searchInput_name');
 	clearField('searchInput_tookOffice');
 	clearField('searchInput_number');
 	clearField('searchInput_dob');
}

 function getFormInput(element){
 	"use-strict";
 	return document.getElementById(element).value;
 }

 //builds the search inputs as an object. 
 function buildSearchString(searchInput_name, searchInput_tookOffice, isSearchInput_dob, isSearchInput_number){
 		var searchString ={
 			name: searchInput_name,
 			took_office: searchInput_tookOffice,
 			dob: isSearchInput_dob,
 			number: isSearchInput_number
 		};
 		return searchString;
 }

 function getSearchResults(searchInput_name, searchInput_tookOffice, searchInput_dob, searchInput_number){
 	"use-strict";
 	var isSearchInput_nameValid, isSearchInput_tookOffice, searchString;
 	var URL = "http://schwartzcomputer.com/ICT4570/Resources/USPresidents.json", isAsync = true, method = "GET";
 	isSearchInput_nameValid = validateInput(searchInput_name);
 	isSearchInput_tookOffice = validateInput(searchInput_tookOffice);
 	isSearchInput_dob = validateInput(searchInput_dob);
 	isSearchInput_number = validateInput(searchInput_number);

 	searchString = buildSearchString(searchInput_name, searchInput_tookOffice, searchInput_dob, searchInput_number);

 	if((isSearchInput_nameValid === true) || (isSearchInput_tookOffice === true) || (isSearchInput_dob=== true) || (isSearchInput_number === true)){
 		getJSONFromURL(method, URL, isAsync, searchString);
 	 }
 	else{
 		//error in inputs
 		alert("error in inputs !");
 	}
 }

  function getJSONFromURL(method, URL, isAsync, searchString){
 	"use-strict";
 	
 	var xmlhttpRequest = new XMLHttpRequest();
 	var timedOut = false;
 	var responseArray;

 	var timer = setTimeout(function(){
 		timedOut = true;
 		xmlhttpRequest.abort();
 	},30);

 	xmlhttpRequest.onreadystatechange = function(){
 		if((xmlhttpRequest.status == 200) && (xmlhttpRequest.readyState ==4 )){
 			//console.log("calling buildTable");
 			clearTimeout(30000);
 			responseArray = JSON.parse(xmlhttpRequest.responseText); 			
 			initTable(responseArray, searchString);
 			if(timedOut){
 				//clear text fields
 				clearField('searchInput_name');
 				clearField('searchInput_tookOffice');
 				clearField('searchInput_number');
 				clearField('searchInput_dob');
 				alert("request timed Out");
 				return;
 			}
 		}
 	}
 	xmlhttpRequest.open(method,URL,isAsync);
 	xmlhttpRequest.send();
 }

//checks every object in the json-response-array for any match to the search inputs
 function checkIfSearchStringMatchesJSON(JSONArray, searchString){
 	var matchedRows = JSONArray.presidents.president.filter( function(item) {var searchNumber = searchString.number;
 																														var jsonNumber = item['number'].toString();
 																															 return (
 																															 	  (item['name'].match(searchString.name)) && (item['took_office'].match(searchString.took_office)) && (item['date'].match(searchString.dob)) && (jsonNumber.match(searchNumber))
 																															 	); 
 																															}
 																											);
 	return matchedRows;
 }

 function initTable(JSONArray, searchString){
 	"use-strict";
 	var table, tr, th, buildTableHeader, buildTableRow, td, currentRowDetails;
 	var properties = ['number', 'name', 'took_office', 'date', 'left_office', 'vice president'];

 	searchStringMatchedRows = checkIfSearchStringMatchesJSON(JSONArray, searchString);

 	//build table only if there are any matched rows
 	if(searchStringMatchedRows.length!=0){
 		 table = buildTable('presidentTable', properties, searchStringMatchedRows);
	 	document.getElementById('searchResultSection').appendChild(table);
 	}
 }

function buildTable(tableName, properties, array){
 	var table = document.createElement('table');
	table.setAttribute('class', tableName);
	var tr = getTableHeader(properties);
	table.appendChild(tr);
	//build <tr> for each of the matched rows
 	for( var arrayIterator = 0; arrayIterator < array.length; arrayIterator++){
 		tr = document.createElement('tr');
 		tr = getTableRow(properties, tr, array[arrayIterator]);
 		table.appendChild(tr);
 	}
	return table;
}

 //returns the content of a <th>
 function getTableHeader(properties){
 	"use-strict";
 	var tr;
 	tr = document.createElement('tr');
 	for( var propertiesIterator = 0; propertiesIterator < properties.length; propertiesIterator++){
 		th = document.createElement('th');
 		var headerTitle = properties[propertiesIterator].replace("_"," ");
 		th.appendChild(document.createTextNode(headerTitle.toUpperCase()));
 		tr.appendChild(th);
 	}
 	return tr;
 }

 //RETURNS <tr>
 function getTableRow(properties, tr, currentRowDetails){
 	"use-strict";
 	var td, subTable;
 	for( var propertiesIterator = 0; propertiesIterator < properties.length; propertiesIterator++){
 		td = document.createElement('td'); 					
 		if(properties[propertiesIterator]==='vice president'){
 			//build subtable if only there are vice presidents
 			if(currentRowDetails.term.length>0){
 	 			var subTableProperties = ['number', 'vice_president'];
 				subTable = buildTable('presidentSubTable', subTableProperties, currentRowDetails.term); 			
 				td.appendChild(subTable)
 			}
 		}else{
 			td.appendChild(document.createTextNode(currentRowDetails[properties[propertiesIterator]]));
 		}
 		tr.appendChild(td);
 	}
 	return tr;
 };

 function clearField(element){
 	document.getElementById(element).value="";
 }


 function validateInput(element){
 	"use-strict";
 	if((element !== undefined) && (element !== ""))
 		return true;
 	else
 		return false;
 }

