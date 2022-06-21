

const apiURL = "http://api.openweathermap.org/data/2.5/weather?q=";
const key = "8eb83a7bd958087710c1f10c6d397b4a";

/* window.onbeforeunload = function (e) {
    console.log(e);
    return true;
} */
 function getWeather() {
   //where temperature will be sent
  const weatherDisplay = document.querySelector("#tempDisplay");
  let city = " ";
  //button to push farenheight and celcius data

//get city, if no city set to Barcelona
    if (document.querySelector('#city').value == ""){
        city = "Barcelona"
    } else {
       city = document.querySelector('#city').value.trim();
    }
    console.log(city);
    const arr = [apiURL];
    arr.push(city,"&APPID=",key );
    const weatherUrl=arr.join('');
//get data
  fetch(weatherUrl, {mode:"cors"})
  .then(function(response) {
    return response.json() ;
  })
  .then(function(response){
      console.log(response);
      //get temp from response
      let temp = response.main.temp;
      console.log(temp);
      //convert temperature to farinheight if its the value of the button
      let choice = document.querySelector('#celFar')
      console.log(choice);
      if(choice.value == "f") {
        temp = Math.round(1.8 * (temp-273) + 32);
        console.log(temp);
        //Show them to click to diplay the other
        choice.innerHTML = "Display Celsius"
      } else {
        temp = Math.round(temp-273.5);
        //Show them to click to diplay the other
        choice.innerHTML = "Display Fahrenheit"
      }
      //push temperature
      weatherDisplay.innerHTML = `<p> ${temp}°</p>`
      //push city data to display
      document.querySelector('#currentCity').innerHTML = city;


  })

};
getWeather();

function getTemp (){

}
function getDate (){
  //days of week
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  //Months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  let date = new Date();
  //get day of week as number 
  let dayIndex = date.getDay();
  //get that place on the index
  let dayWeek = days[dayIndex];
  //get the month as a number
  monthIndex = date.getMonth();
  //get that spot on the index
  let month = months[monthIndex];
  //day
  let day = date.getDay();
  //year
  let year = date.getFullYear();
  //send data to html
  const dateText = document.querySelector("#date");
  dateText.innerHTML = `${dayWeek}, ${month} ${day}, ${year}`
}
getDate();
function getTime () {
  let time = new Date();
  //get hour
  let hour = time.getHours();
  //get minutes
  let minutes = time.getMinutes()
  //make sure it displays as 2 digits
  if (minutes < 10) { 
   minutes = '0' + minutes;
} else {
   minutes = minutes + '';
};
  //add am and pm
  let timeOfDay = " ";
 if (hour < 12) {
   timeOfDay = "AM";
   hour = hour%12;
   if(hour==0) {
     hour = 12;
   }
 } else {
  timeOfDay= "PM";
  hour = hour%12; 
  if(hour==0) {
    hour = 12;
  }
 };
//send data to div
const timeText = document.querySelector('#time');
timeText.innerHTML = `${hour}:${minutes} ${timeOfDay}`;  
  }
getTime();
setInterval(getTime,1000);
//keep track of celcius vs farenheight choice
function celFar() {
  let button = document.querySelector('#celFar')
  const option = button.value;
  //they want to see c
  if(option == "f") {
    //change value to c
   button.value="c";
    
  } else {
    //set value to c 
    button.value="f";
  
  }
  getWeather();
};



