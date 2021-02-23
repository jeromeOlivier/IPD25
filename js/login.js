// declare & initialize global identifiers
const messageArea = document.getElementById("message");
const errorMessageArea = document.getElementById("errors");
const forecastArea = document.getElementById("weatherForecast");
const newParagraph = document.createElement("p");
const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/56186?apikey=Iwx3AWQ7ZQKVDj5FbroGZ8Od8uQUEyfJ&metric=true`;

// on load...
function runTheFollowing() {
    Display.message.forAakash();
    Display.format.forCurrentDate();
    Display.format.forCurrentTime();
}

// on click...
function submitButton() {
    Run.submitProgram();
}

// Display class & methods
const Display = {

    // clear method
    clear: clear = {
        allErrorMessages: function () {
            errorMessageArea.innerHTML = "";
        },

        allWeatherInfo: function () {
            forecastArea.innerHTML = "";
        }
    },

    // message methods
    message: messages = {

        forAakash: function () {
            messageArea.innerHTML = "Gimme 100%!";
        },

        forInvalidEmailOrPassword: function () {
            newParagraph.innerHTML = "ERROR!<br>Please complete the form<br>" +
                " <ul><li>Email must be filled in</li> <li>Password must be at" +
                " least 6 characters</li></ul>";
            newParagraph.className = "errorStyle";
            errorMessageArea.appendChild(newParagraph);
        }
    },

    // date & time methods
    format: formatFor = {

        date: forDateOfmat = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        },

        forCurrentDate: function () {
            const dateArea = document.getElementById("date");
            const forCurrentDate = new Date();
            dateArea.append(forCurrentDate.toLocaleDateString('en-US', Display.format.date));
        },

        forCurrentTime: function () {
            const timeArea = document.getElementById("time");
            timeArea.innerHTML = new Date().toLocaleTimeString('en-US');
            setTimeout(Display.format.forCurrentTime, 1000);
        },

        forDateOf: function (epoch) {
            const forDateOf = new Date(epoch * 1000);
            return forDateOf.toLocaleDateString('en-US', Display.format.date);
        }
    }
}

// Run class & methods
const Run = {

    // XHR request
    weatherProgram: function () {
        const weatherRequest = new XMLHttpRequest();
        weatherRequest.open("get", url);
        weatherRequest.onload = Run.printWeatherProgram;
        weatherRequest.onerror = Run.noWeatherProgram;
        weatherRequest.send();

    },

    // display weather data
    printWeatherProgram: function (weatherData) {
        const weatherObj = JSON.parse(weatherData.target.response);
        const weatherForecast = weatherObj.DailyForecasts;

        weatherForecast.forEach(function (date) { // loop through weather data
            const forecastItem = document.createElement("div");
            const link = date.Link;
            const epoch = Display.format.forDateOf(date.EpochDate);
            const maxHigh = date.Temperature.Maximum.Value;
            const maxUnit = date.Temperature.Maximum.Unit;
            const minLow = date.Temperature.Minimum.Value;
            const minUnit = date.Temperature.Minimum.Unit;
            const daySummary = date.Day.IconPhrase;
            const nightSummary = date.Night.IconPhrase;
            forecastItem.setAttribute("class", "singleForecast normalColor");
            forecastItem.innerHTML =
                `<p><a href="${link}">${epoch}</a></p>` +
                `<p><b>Max:</b> ${maxHigh}${maxUnit} <b>Min:</b> ${minLow}${minUnit}</p>` +
                `<p><b>Day:</b> ${daySummary}</p>` +
                `<p><b>Night:</b> ${nightSummary}</p>`;
            forecastArea.appendChild(forecastItem);
        });
    },

    // in case XHR request fails
    noWeatherProgram: function () {
        Display.clear.allWeatherInfo();
        const forecastItem = document.createElement("div");
        forecastItem.innerHTML = "weather info unavailable<br> +" +
            "did you break your computer again?"
        forecastArea.appendChild(forecastItem);

    },

    // executions triggered with the submit button
    submitProgram: function () {
        const emailEntry = document.getElementById("email");
        const email = emailEntry.value.toLowerCase();
        const passwordEntry = document.getElementById("password");
        const password = passwordEntry.value;

        const emailRegex = /^\S+@\S+$/; // ref: got this from o'reiley
        const validEmail = emailRegex.test(email);
        const passwordRegex = /^.{6,}$/;
        const validPassword = passwordRegex.test(password);

        if (!validEmail || !validPassword) {
            Display.clear.allErrorMessages();
            Display.clear.allWeatherInfo();
            Display.message.forInvalidEmailOrPassword();
        } else if (email === "admin@yopmail.com" && password === "adminyopmail") {
            Display.clear.allErrorMessages();
            Display.clear.allWeatherInfo();
            Run.weatherProgram();
        } else {
            Display.clear.allErrorMessages();
            Display.clear.allWeatherInfo();
        }
    }
}