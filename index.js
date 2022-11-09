const apiURL = "http://api.openweathermap.org/data/2.5/weather?q=";

/* const key = config.SECRET_API_KEY; */
async function getWeather() {
    //where temperature will be sent
    const weatherDisplay = document.querySelector("#tempDisplay");
    //hide button for hourly display
    document.getElementById('hourlyButtons').style.display="none";
    let city = " ";
    //get city, if no city set to Barcelona
    if (document.querySelector('#city').value == ""){
        city = "Barcelona"
    } else {
       city = document.querySelector('#city').value.trim();
    }
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${SECRET_API_KEY}`
    //get data
     let response =  await fetch(weatherUrl);
     let data = await response.json();
      //get temp from response
      let temp = data.main.temp;
      //convert temperature to farinheight if its the value of the button
     temp = tempConvert(temp);
      //push temperature
      weatherDisplay.innerHTML = `<p> ${temp}°</p>`
      //push city data to display
      document.querySelector('#currentCity').innerHTML = city;
      //load 7 day weather 
      getForecast(data.coord.lat,data.coord.lon);
  };
getWeather();
//convert temp between cel and far 
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
//get days of the week
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
//get date for main date and time display
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
  const dayWeek = getDays(dayIndex);
  //get the month as a number
  const monthIndex = date.getMonth();
  //get that spot on the index
  const month = months[monthIndex];
  //day
  const day = date.getDate();
  //year
  const year = date.getFullYear();
  //send data to html
  const dateText = document.querySelector("#date");
  dateText.innerHTML = `${dayWeek}, ${month} ${day}, ${year}`
};
getDate();
//get time for main date and time display
function getTime () {
  const time = new Date();
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
  };
getTime();
//keep refreshing the time every 1000 miliseconds
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
//get weather for 7day forecast
 const getForecast = async(lat,lon) => {
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;
  //hide button for hourly display
  document.getElementById('hourlyButtons').style.display="none";
  //change style of hourly button 
  document.getElementById('hourlyButton').style.backgroundColor= "";
  //change style of daily button
  document.getElementById('dailyButton').style.backgroundColor= "rgba(255, 255, 255, 0.3)";
 try { 
   const res = await fetch(url);
   const data = await res.json();
   //get array of daily temps
   const daily = data.daily
   //get day divs where the data will be appended
   const display = document.querySelectorAll('#day')
   //loop through array of daily data, we only want 7 days, so minus 2
   for(let i=0;i<daily.length-1;i++) {
   //Loop through day divs append the new p element to the day div
    for(let j=0;i<display.length;j++){
    //create new p elements, max and min, and add the temp to the p elements inner text
    const pMax = document.createElement('p');
    pMax.id= "pMax";
    const pMin = document.createElement('p');
    pMin.id= "pMin";
    //get the max and min temps that we will add to the p element, and convert from kelvin
    const max = tempConvert(daily[i].temp.max)
    const min = tempConvert(daily[i].temp.min)
    if(document.getElementById('celFar').value== "f"){
      pMax.innerText = `${max} °F `
      pMin.innerText = `${min} °F `
    } else {
      pMax.innerText = `${max} °C `
      pMin.innerText = `${min} °C `
    }
    //get the timestamp provided by the api
    const timeStamp = daily[i].dt;
    //create a new date object using timestap
    const date = new Date(timeStamp*1000);
    //get day as a number and pass it through getDays function
    const day = getDays(date.getDay())
    //create p element to append day of week
    const dayWeek = document.createElement('p');
    dayWeek.id = "dayWeek";
    //add the day to the inner text
    dayWeek.innerText = day
          //reset display
          display[j].innerText="";
          //reset images on first iteration
          if(i==0){
            const images = document.querySelectorAll('#weatherIcons');
            Array.from(images).forEach((image)=> {
                image.parentNode.removeChild(image);
            })
          };
          //get the weather icon code depending on the day
          const iconCode = daily[i].weather[0].icon;
          //create img element
          const img = document.createElement('img');
          img.id = "weatherIcons";
          //add src
          img.src=`http://openweathermap.org/img/wn/${iconCode}@2x.png`
          //append dayWeek
          display[j].appendChild(dayWeek);
          //append max and min children
          display[j].appendChild(pMax);
          display[j].appendChild(pMin);
          //append image
          display[j].appendChild(img);
         i++
        }
   }
  } catch(err) {
    console.log(err);
  }
 }; 
//get hourly forecase 
async function hourlyForecast () {
  //show buttons for hourly display
  document.getElementById('hourlyButtons').style.display="";
  let city = " "
  //get current city 
  if (document.querySelector('#city').value == ""){
     city = "Barcelona"
} else {
   city = document.querySelector('#city').value.trim();
}
  //make api call to get lat and lon
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
  const response = await fetch(weatherUrl)
  const data = await response.json();
  //get lat long to make new api request for hourly data. 
  const lat = data.coord.lat;
  const lon = data.coord.lon;
  //make api call to get hourly data
  const urlHourly = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,minutely&appid=${key}`
  const res = await fetch(urlHourly);
  const dataHourly = await res.json();
  const hourly = [...dataHourly.hourly]
  //splie out the hours past 24 hours
  hourly.splice(24);
  //put the 12 clock hours to this array
  const hours = [ ]
  const timesOfDay = [ ];
  const iconCodes = [ ]
  //turn on display of the 24 divs
  //change the timestamp to reflect hours
  hourly.forEach((hour)=> {
  //get the icon then push to array
  let iconCode = hour.weather[0].icon;
  iconCodes.push(iconCode);
  hour = new Date(hour.dt*1000).getHours()
  //convert to 12-hour clock and add am/pm
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
    //push hour to hours array
    hours.push(hour);
    //push times of day
    timesOfDay.push(timeOfDay);
  }); 
  //hide weekly display
  document.getElementById('daily').style.display = "none";
  //show hourly display
  document.getElementById('hourly').style.display = "";
  //clear divs from the previous time
  let oldDivs = document.querySelectorAll("#hourlyWeather");
  oldDivs = [...oldDivs];
  if(oldDivs){
    oldDivs.forEach((div)=> {
      div.parentNode.removeChild(div);
    })
  };
  //get tabs
  const tab1 = document.getElementById('tab1');
  const tab2 = document.getElementById('tab2');
  const tab3 = document.getElementById('tab3');
  for(let i=0; i<hours.length;i++){
    let div = document.createElement('div');
    div.id = "hourlyWeather";
    //add hour and time of day to div
    let time = document.createElement('p');
    time.innerText = `${hours[i]} ${timesOfDay[i]}`;
    time.id="hourlyTime";
    //append time to new div
    div.appendChild(time);
    //add temp from hourly array
    let temp = hourly[i].temp
    temp = tempConvert(temp);
    //create p element for temp
    let tempDisplay = document.createElement('p');
    tempDisplay.id="hourlyTemps";
    //inner text far vs cel
    if(document.getElementById('celFar').value== "f"){
      tempDisplay.innerText = `${temp} °F `
    } else {
      tempDisplay.innerText = `${temp} °C`
    }
    //append temp to div
    div.appendChild(tempDisplay);
    //append icons to div
     //create img element
     let img = document.createElement('img');
     img.id = "hourlyIcons";
     //get icon code from array
     let iconCode = iconCodes[i];
     //add src
     img.src=`http://openweathermap.org/img/wn/${iconCode}@2x.png`;
     div.appendChild(img);
    if(i<8){
      //append previously created div to tab
      tab1.appendChild(div);
    }
    //if i<16 add to tab 2
    else if (i<16){
      //append previously created div to tab
      tab2.appendChild(div);
     }
     //else add to tab 3
    else  {
      //append previously created div to tab
      tab3.appendChild(div);
    }
  };
  //hide tab2 and tab3
  document.getElementById('tab2').style.display = "none";
  document.getElementById('tab3').style.display = "none";
  //show the first tab
  document.getElementById('tab1').style.display = ""
  //Change style of first tab button 
  document.getElementById('firstTab').style.backgroundColor="rgba(255, 255, 255, 0.3)";
  //change style of hourly button 
  document.getElementById('hourlyButton').style.backgroundColor= "rgba(255, 255, 255, 0.3)";
   //change font-coor 
 document.getElementById('hourlyButton').style.color= "rgb(59, 58, 58);";
 document.getElementById('dailyButton').style.color= "";
  //change style of daily button
  document.getElementById('dailyButton').style.backgroundColor= "";
};

function dailyForecast () {
  document.getElementById('hourly').style.display="none";
  document.getElementById('daily').style.display=""
  //hide button for hourly display
  document.getElementById('hourlyButtons').style.display="none";
 //change style of hourly button 
 document.getElementById('hourlyButton').style.backgroundColor= "";
 //change style of daily button
 document.getElementById('dailyButton').style.backgroundColor= "rgba(255, 255, 255, 0.3)";
 //change font-coor 
 document.getElementById('dailyButton').style.color= "rgb(59, 58, 58);";
 document.getElementById('hourlyButton').style.color= "";
};
//hourly tabs
function openTab(value) {
  if(value == "tab1") {
    //hide other tabs
    document.getElementById('tab2').style.display = "none";
    document.getElementById('tab3').style.display = "none";
    //show selected tap
    document.getElementById('tab1').style.display = "";
    //change style of button 
    document.getElementById('firstTab').style.backgroundColor="rgba(255, 255, 255, 0.3)";
    document.getElementById('secondTab').style.backgroundColor="";
    document.getElementById('thirdTab').style.backgroundColor="";
  } else if (value == "tab2") {
    //hide other tabs
    document.getElementById('tab1').style.display = "none";
    document.getElementById('tab3').style.display = "none";
    //show selected tab
    document.getElementById('tab2').style.display = "";
    //change style of button 
    document.getElementById('secondTab').style.backgroundColor="rgba(255, 255, 255, 0.3)";
    document.getElementById('firstTab').style.backgroundColor="";
    document.getElementById('thirdTab').style.backgroundColor="";

  } else {
    //hide other tabs
    document.getElementById('tab1').style.display = "none";
    document.getElementById('tab2').style.display = "none";
     //show selected tab
     document.getElementById('tab3').style.display = "";
     //change style of button 
    document.getElementById('thirdTab').style.backgroundColor="rgba(255, 255, 255, 0.3)";
    document.getElementById('firstTab').style.backgroundColor="";
    document.getElementById('secondTab').style.backgroundColor="";

  }
};