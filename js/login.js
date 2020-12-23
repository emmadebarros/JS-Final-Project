/* Fetch elements */
let mainContainer = document.getElementById("main-container");
let dateContainer = document.getElementById("date-container");
let timeContainer = document.getElementById("time-container");
let weatherContainer = document.getElementById("weather-container");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("password");
let errorMsg = document.getElementById("error-msg");
let submitBtn = document.getElementById("login");

/* Create current date object */
let today = new Date();

/* Get day */
let day = getWeekDay();
/* Get month */
let month = getMonthName();
/* Get date */
let date = today.getDate();
/* Get year */
let year = today.getFullYear();

/* Update today obj */
today = `${day} ${month} ${date} ${year}`;

/* Event listener */
submitBtn.addEventListener("click", check);

/* Text */
dateContainer.textContent = `Today's date: ${today}`;

/* Functions */

function realTimeClock() {
    let todayHour = new Date();

    /* Get hours */
    let hours = todayHour.getHours();
    /* Get minutes */
    let minutes = todayHour.getMinutes();
    /* Get seconds */
    let seconds = todayHour.getSeconds();

    //Am and PM
    let amPm = (hours < 12) ? "AM" : "PM";

    //Convert to 12 hour format
    hours = (hours > 12) ? hours - 12 : hours;

    //Add 0's in front of numbers for consistent format
    hours = ("0" + hours).slice(-2); //getting rid of 0 in front of 2 digit numbers
    minutes = ("0" + minutes).slice(-2); //getting rid of 0 in front of 2 digit numbers
    seconds = ("0" + seconds).slice(-2); //getting rid of 0 in front of 2 digit numbers


    timeContainer.textContent = `Time now: ${hours}:${minutes}:${seconds} ${amPm}`;
    let t = setTimeout(realTimeClock, 500);
}

function getWeekDay() {
    let weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    return weekday[today.getDay()];
}

function getMonthName() {
    let monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[today.getMonth()];
}

function weather(weatherData) {
    /* Initialize input fields */
    emailInput.value = "";
    passwordInput.value = "";
    weatherContainer.textContent = "";


    const paragraph = document.createElement("p");
    paragraph.textContent = "Weather in Montreal for the next 5 days!"

    weatherContainer.appendChild(paragraph);

    let weatherInfoContainer = document.createElement("ul");
    let a = document.createAttribute("class");
    a.value = "container";
    weatherInfoContainer.setAttributeNode(a);
    weatherContainer.appendChild(weatherInfoContainer);

    for (let i = 0; i < weatherData.DailyForecasts.length; i++) {

        /* Create li element and link for date */
        const days = document.createElement("li");
        days.style.marginBottom = i != weatherData.DailyForecasts.length - 1 ? "1rem" : "0";
        let dateLink = weatherData.DailyForecasts[i].Date;

        let dateStyled = document.createElement("a");
        dateStyled.style.color = "blue"; /* See comment below... */
        dateStyled.href = "#0";
        dateStyled.textContent = dateLink.slice(0, 10); // slice string to make date more readable
        /* Had to add initial color of blue and an event listener to change link color on click because, for some reason, the links would all appear purple from the start... */
        dateStyled.addEventListener("click", function () {
            dateStyled.style.color = "purple";
        });
        days.appendChild(dateStyled);

        /* Create max and min p */
        const maxAndMin = document.createElement("p");
        maxAndMin.textContent = `Max: ${weatherData.DailyForecasts[i].Temperature.Maximum.Value}${weatherData.DailyForecasts[i].Temperature.Maximum.Unit} Min: ${weatherData.DailyForecasts[i].Temperature.Minimum.Value}${weatherData.DailyForecasts[i].Temperature.Minimum.Unit}`;
        days.appendChild(maxAndMin);

        /* Create day and night p */
        const DayAndNight = document.createElement("p");
        DayAndNight.textContent = `Day: ${weatherData.DailyForecasts[i].Day.IconPhrase} Night: ${weatherData.DailyForecasts[i].Night.IconPhrase}`;
        days.appendChild(DayAndNight);

        weatherInfoContainer.appendChild(days);

    }
}

function check() {
    if(weatherContainer.textContent != "") {
        weatherContainer.textContent = "";
    }
    errorMsg.textContent = "";
    const emailInputContent = emailInput.value;
    const passwordInputContent = passwordInput.value;
    if (emailInputContent == "admin@yopmail.com" && passwordInputContent == "adminyopmail") {
        $.ajax("http://dataservice.accuweather.com/forecasts/v1/daily/5day/56186?apikey=5gSsn49PUUYs8PcEJ4x4UGdRKYksFnxE&metric=true").done(weather);

    } else if (emailInputContent == "" && passwordInputContent == "") {
        errorMsg.textContent = "Error! Please complete the form!";
    } else if (emailInputContent == "") {
        errorMsg.textContent = "* Email address must be filled in!";
    } else if (passwordInputContent.length < 6) {
        errorMsg.textContent = "* Password length must be at least 6 characters!";
    }
}
