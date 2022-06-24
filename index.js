

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
     temp = tempConvert(temp);
      //push temperature
      weatherDisplay.innerHTML = `<p> ${temp}°</p>`
      //push city data to display
      document.querySelector('#currentCity').innerHTML = city;
      //load 7 day weather 
      getForecast(response.coord.lat,response.coord.lon);


  })

};
getWeather();
const tempConvert = (temp) => {
   //convert temperature to farinheight if its the value of the button
   let choice = document.querySelector('#celFar')

   if(choice.value == "f") {
     temp = Math.round(1.8 * (temp-273) + 32);
     //Show them to click to diplay the other
     choice.innerHTML = "Display Celsius"
     //return temp
     return temp
   } else {
     temp = Math.round(temp-273.5);
     //Show them to click to diplay the other
     choice.innerHTML = "Display Fahrenheit"
     //return temp
     return temp
   }
};
function getTemp (){

}
const getDays = (dayIndex) => {
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
  //get that place on the index
  let dayWeek = days[dayIndex];
  return dayWeek
};
function getDate (){
  
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
  const date = new Date();
  //get day of week as number 
  const dayIndex = date.getDay();
  //get that place on the index
  let dayWeek = getDays(dayIndex);
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

/* /* function dailyWeather () {
  //get date
  const date = new Date();
  //get day
  //create day dives
  //

}
 */


 const getForecast = async(lat,lon) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
 try { 
   let res = await fetch(url);
   let data = await res.json();
   //get array of daily temps
   let daily = data.daily
   console.log(daily);
   
   //get day divs where the data will be appended
   const display = document.querySelectorAll('#day')
   //loop through array of daily data, we only want 7 days, so minus 2
   for(let i=0;i<daily.length-1;i++) {
   
   //Loop through day divs append the new p element to the day div
        for(let j=0;i<display.length;j++){
           //create new p elements, max and min, and add the temp to the p elements inner text
    let pMax = document.createElement('p');
    let pMin = document.createElement('p');
    //get the max and min temps that we will add to the p element, and convert from kelvin
    let max = tempConvert(daily[i].temp.max)
    let min = tempConvert(daily[i].temp.min)
    pMax.innerText=`High: ${max}`
    pMin.innerText=`Min: ${min}`
          //reset display
          display[j].innerText="";
          //reset images on first iteration
          if(i==0){
            let images = document.querySelectorAll('#weatherIcons');
            Array.from(images).forEach((image)=> {
                image.parentNode.removeChild(image);
            })
          };
          //get the weather icon code depending on the day
          let iconCode = daily[i].weather[0].icon;
          //create img element
          let img = document.createElement('img');
          img.id = "weatherIcons";
          //add src
          img.src=`http://openweathermap.org/img/wn/${iconCode}@2x.png`
          //append new children
          display[j].appendChild(pMax);
          display[j].appendChild(pMin);
          //append o,age
          display[j].appendChild(img);
          
         i++
          
        }
   }
  } catch(err) {
    console.log(err);
  }

  
 }; 

