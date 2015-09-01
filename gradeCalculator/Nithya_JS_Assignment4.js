/**
 * Assignment4
 * Author: Nithya Narayanan
 * FileName: Nithya_JS_Assignment4.js
 */


var quizWeightedAverage = 0, assignmentWeightedAverage = 0, attendanceWeightedAverage = 0;

/*
 * This function builds arrays for all the inputs entered.
 */
function buildArray(elementName){
var isArrayValid;

	if(elementName === "quiz"){
		
		var quizArray = new Array();
		quizArray = getArray('quiz');
		isArrayValid = validateInputArray(quizArray, "quiz");
		if(isArrayValid === true){
			computeCalculations("quiz", quizArray);
		}
		
	}else if(elementName === "assignment"){
		
		var assignmentArray = new Array();
		assignmentArray = getArray('assignment');
		isArrayValid = validateInputArray(assignmentArray, "assignment");
		if(isArrayValid === true){
		computeCalculations("assignment",assignmentArray);
		}
	}else if(elementName === "attendance"){
	
		var attendanceArray = new Array();
		attendanceArray = getArray('attendance');
		isArrayValid = validateInputArray(attendanceArray, "attendance")
		if(isArrayValid === true){
			computeCalculations("attendance",attendanceArray);
		}
	}
	
}

/*
 * This is a generic function to clear inputs in the UI
 */
function clearInput(elementId){
	document.getElementById(elementId).value="";
}

/*
 * This function initiates calls to begin calculations
 */ 
function computeCalculations(elementName, elementArray){
	var average;

	if(elementName === "quiz"){
		
		//get and set average for quiz section
		average = getAverage(elementArray);
		setAverage('quizAverage',average);
		//calculate weighted average for quiz section
		quizWeightedAverage = getWeightedAverage(average, "quiz");
		
	}else if(elementName === "assignment"){
		
		//get and set average for assignment section
		average =  getAverage(elementArray);
		setAverage('assignmentAverage',average);
		//calculate weighted average for assignment section
		assignmentWeightedAverage = getWeightedAverage(average, "assignment");	

	}else if(elementName === "attendance"){

		//get and set average forattendance section
		average =  getAverage(elementArray);
		setAverage('attendanceAverage',average);
		//calculate weighted average for attendance section
		attendanceWeightedAverage = getWeightedAverage(average, "attendance");
		
	}
	changeProjectedAverageandGrade();
}

/*
 * This function is called when submit button is hit.
 */
function submitAllValues(){
	buildArray("quiz");
	buildArray("assignment");
	buildArray("attendance");
}

/*
 * This function returns array for the inputs entered.
 */
function getArray(elementId){
	var totalNumberOfInputs = document.getElementById(elementId).getElementsByTagName("input").length;
	var resultArray = new Array();
	
	for(var iterator=0; iterator < totalNumberOfInputs; iterator++){ 
		var id=elementId+(iterator+1);
		var value;
		
		if(elementId === "attendance"){
			if((document).getElementById(id).checked === true){
				//value is 100 if student is present
				value = 100;
			}else{
				//I am assigning value as undefined to entries which are yet to be graded.
				value = undefined;
			}
				
		}else{
			value = (document.getElementById(id).value);
			if(value !== ""){
				value = Number(document.getElementById(id).value);
			}else{
				//I am assigning value as undefined to entries which are yet to be graded.
				value = undefined;
			}
		}
			resultArray[iterator] = value;
	}
	return resultArray;
	
}

/*
 * This function initiates calls to change the results on the UI
 */
function changeProjectedAverageandGrade(){
	var projectedAverage = quizWeightedAverage + assignmentWeightedAverage + attendanceWeightedAverage;
	var projectedGrade;
	
	setProjectedAverage(projectedAverage);
	projectedGrade = getGrade(projectedAverage);
	setProjectedGrade(projectedGrade);
}

/*
 * This function returns average
 */
function getAverage(elementArray){
	var sum = 0, result, numberOfEntries;

	sum = getSumOfArray(elementArray);
	numberOfEntries = getLengthOfNonEmptyArray(elementArray);
	if(numberOfEntries !== 0){
		result = sum/(numberOfEntries);
	}else{
		//handles divide by zero scenario
		result = 0;
	}
	return result;
}

/*
 * This function returns the grade as a string
 */
function getGrade(projectedAverage){
	if((projectedAverage >= 94) && (projectedAverage <= 100)){
		return "A";
	}else if((projectedAverage >= 90) && (projectedAverage <= 93)){
		return "A-";
	}else if((projectedAverage >= 87) && (projectedAverage <= 89)){
		return "B+";
	}else if((projectedAverage >= 83) && (projectedAverage <= 86)){
		return "B";
	}else if((projectedAverage >= 80) && (projectedAverage <= 82)){
		return "B-";
	}else{
		return "C";
	}
}

/*
 * This function returns the number of elements in an array counted from end of the array
 */
function getLengthOfNonEmptyArray(elementArray){
	var numberOfEntries = elementArray.length;
	
	for(var iterator = (elementArray.length-1); iterator>=0; iterator --){
		if(elementArray[iterator]!==undefined){
			return numberOfEntries;
		}else{
			numberOfEntries = numberOfEntries - 1;
		}
	}
	return numberOfEntries;
}

/*
 * This function returns the sum of an array
 */
function getSumOfArray(elementArray){
	var sum = 0;

	for(var iterator=0; iterator < elementArray.length; iterator++){
		if(elementArray[iterator]!==undefined){
			sum = sum + elementArray[iterator];
		}
	}
	return sum;
}

/*
 * This function returns the weighted average
 */
function getWeightedAverage(average, elementId){
	var weightage, sum;
	
	if(elementId === "quiz"){
		weightage = 30;
	}else if(elementId === "assignment"){
		weightage = 60;
	}else if(elementId === "attendance"){
		weightage = 10;
	}
	
	weightedAverage = average * (weightage/100);
	return weightedAverage;
}

/*
 * This function sets average in the UI.
 */
function setAverage(elementId, average){
	document.getElementById(elementId).innerHTML = "Average: "+average;
}

/* This function fills the inputBoxes after array of inputs are entered and submitted
 * 
 */
function setInputBox(elementName, elementArray){
	if(elementName === "attendance"){
		for(iterator=0; iterator<elementArray.length;iterator++){
			if(elementArray[iterator]!==0){
				document.getElementById(elementName+[iterator+1]).checked=true;
			}
		}
	}
	else{
		for(iterator=0; iterator<elementArray.length;iterator++){
			document.getElementById(elementName+(iterator+1)).value = elementArray[iterator];
		}
	}
}

/*
 * This function sets the projected average in the UI
 */
function setProjectedAverage(average){
	document.getElementById('projectedAverage').innerHTML = "Average: "+average;	
}

/*
 * This function sets the projected  grade in the UI.
 */
function setProjectedGrade(projectedGrade){
	document.getElementById('projectedGrade').innerHTML = "Projected Grade: "+projectedGrade;
}

/*
 * This is a generic function to change bg color for any element in the webpage
 */
function setTextBoxBackgroundColor(elementId, color){
	document.getElementById(elementId).style.backgroundColor = color;
}

/*
 * This function changes the string array to number
 */
function stringArrayToNumberArray(inputArray){
	for(var iterator=0; iterator < inputArray.length; iterator++){
		inputArray[iterator] = parseInt(inputArray[iterator],10);
	}
	return inputArray;
}

/*
 * This function processes the array input after submit button is clicked.
 */
function submitArray(){
	var quizArray = new Array();
	var assignmentArray = new Array();
	var attendanceArray = new Array();
	var isQuizArrayValid, isAssignmentArrayValid, isAttendanceArrayValid;
	
	attendanceArray = document.getElementById('attendanceArray').value.split(",");
	assignmentArray = document.getElementById('assignmentArray').value.split(",");
	quizArray = document.getElementById('quizArray').value.split(",");
	
	//convert string array to number array
	quizArray = stringArrayToNumberArray(quizArray);
	assignmentArray = stringArrayToNumberArray(assignmentArray);
	attendanceArray = stringArrayToNumberArray(attendanceArray);
	
	//validate input
	isQuizArrayValid = validateInputArray(quizArray, "quiz");
	isAssignmentArrayValid = validateInputArray(assignmentArray, "assignment");
	isAttendanceArrayValid = validateInputArray(attendanceArray, "attendance")
	
	
	if( isAttendanceArrayValid && isAssignmentArrayValid && isQuizArrayValid){
		computeCalculations("quiz", quizArray);
		computeCalculations("assignment",assignmentArray);
		computeCalculations("attendance",attendanceArray);
	
		//set the input text boxes after array of inputs are entered
		setInputBox('quiz', quizArray);
		setInputBox('assignment', assignmentArray);
		setInputBox('attendance', attendanceArray);
		
		//set textbox white
		setTextBoxBackgroundColor("quizArray","white");
		setTextBoxBackgroundColor("assignmentArray","white");
		setTextBoxBackgroundColor("attendanceArray","white");
	}
		//clear input
		clearInput('quizArray');
		clearInput('assignmentArray');
		clearInput('attendanceArray');
}


/*This is a generic function to validate inputs from both array input and form input.
If input is wrong, the bacground color is changed.
The background color is changed instead of outlining the input box because it was not visible to the maroon bg of the frame.
*/
function validateInputArray(arrayInput, element){
	
	
	if((element === "quiz") || (element === "assignment" )){		
		for(iterator=0; iterator<arrayInput.length; iterator++){
			if((arrayInput[iterator] < 0) || (arrayInput[iterator] >100) || (isNaN(arrayInput[iterator])) ){
					setTextBoxBackgroundColor(element,"red");
				return false;
			}else{
				if(element.contains("Array")){
					setTextBoxBackgroundColor(element,"white");
				}
				else{
					setTextBoxBackgroundColor(element,"grey");
				}
				return true;
			}
		}
	}else if(element === "attendance"){
		for(iterator=0; iterator<arrayInput.length; iterator++){
			if((arrayInput[iterator] !== 0) && (arrayInput[iterator] !== 100)){
					setTextBoxBackgroundColor(element,"red");
				return false;
			}else{
				if(element.contains("Array")){
					setTextBoxBackgroundColor(element,"white");
				}else{
					setTextBoxBackgroundColor(element,"grey");
				}
				return true;
			}
		}
}	
}

