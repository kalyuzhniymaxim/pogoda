var api_url;
var weatherExample;
var infoTxt = document.querySelector(".info-txt");
var inputField = document.querySelector("input");
var locationBtn = document.querySelector("button");
var weatherCity = document.querySelector(".weather-city");
var weatherTemp = document.querySelector(".weather-temp");
var weatherPart = document.querySelector(".weather-part");
var weatherIcon = document.querySelector(".icon");
var weatherDescription = document.querySelector(".description");
var windSpeed = document.querySelector(".wind-speed");
var sysSunrise = document.querySelector(".sys-sunrise");
var sysSunset = document.querySelector(".sys-sunset");
var feelsLike = document.querySelector(".feels-like");
var humidity = document.querySelector(".humidity");
var visibility = document.querySelector(".visibility");
var cloudsAll = document.querySelector(".clouds-all");
var bloсk = document.querySelectorAll(".bloсk");


//отслеживаем нажатие Энтера после ввода города. Нажатие вызовет метод requestApi, в который параметром передается название города
inputField.addEventListener("keyup", e => {
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});
//метод подставляет название города, переданное предыдущим методом в адрес api и вызывает метод fetchData
function requestApi(city) {
    api_url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=bd04ee071cea80685a632b569c8c65d1&units=metric`;
    fetchData();
}

//при клике на кнопку проверяем объект navigator, который хранит содержит информацию о геолокации(и не только), собираемую браузером. если геолокация поддерживается, определяем текущую позицию, выполняем метод onSuccess, если локация корректная, или onError, если локация некорректная
//иначе, геолокация не поддерживается браузером
document.addEventListener("DOMContentLoaded", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else {
        alert("Your browser not supported geolocation api");
    }
});

//в этом методе определяется мы извлекаем из координат нашей геопозиции широту и долготу, которые подставляем в адрес api, и передаем запрос на выполнение fetchData
//подробнее про получение геопозиции срадствами браузера:
//https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
function onSuccess(position) {
    const crd = position.coords;
    console.log(crd);
    api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${crd.latitude}&lon=${crd.longitude}&appid=bd04ee071cea80685a632b569c8c65d1&units=metric`;
    fetchData();
}

//здесь обрабатывается ошибка получения геолокации
function onError(error) {
    infoTxt.innerText = error.message;
}

//в этой функции выполняется метод fetch, который обрабатывает запрос по указанному адресу. Если с адресом все ок, тогда действие переходит в блок then, в котором выполняются необходимые с запросом действия, например: запись ответа в виде json. В следующем блоке then, который выполняется после предыдущего, происходит передача json-объекта в метод для дальнейшей обработки/рендеринга и тд.
//в блоке catch происходит обработка ошибки в случае, если запрос не выполнен/адрес неверный/что-то пошло не так
//подробно про fetch api:
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function fetchData() {
    infoTxt.innerText = "Getting weather details...";
    fetch(api_url).then(res => res.json()).then(result => weatherDetails(result)).catch(() => {
        infoTxt.innerText = "Something went wrong";
    });
}

//в этой функции выводятся результаты запроса. если было введено некорректное название города, котороее передается в адрес api, то адрес становится несуществующим, т.е. возвращает код 404(страница не найдена) и  информацию по данному адресу мы получить не можем.
//иначе(если адрес и введенный город корректный), мы получаем объект, в котором содержится информация по искомому городу(погода, координаты и тд.), из которой мы получаем нужные данные для вывода на странице
function weatherDetails(info) {
    if(info.cod == "404") {
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }
    else {
        console.log(info);
        weatherCity.innerText = `${info.name}`;
        for(item of bloсk) {
            item.style.backgroundColor = `${info.weather[0].main == 'Clear'
                                        ?`rgba(192, 228, 250, 0.738)`
                                        :`rgba(151, 169, 224, 0.591)`} ,
                                        ${info.weather[0].main == 'Clouds'
                                        ?`rgba(151, 169, 224, 0.591)`
                                        :``} ,
                                        ${info.weather[0].main == 'Drizzle'
                                        ?`rgba(49, 52, 59, 0.591)`
                                        :`rgba(151, 169, 224, 0.591)`},
                                        ${info.weather[0].main == 'Thunderstorm'
                                        ?`rgba(31, 16, 16, 0.591)`
                                        :`rgba(151, 169, 224, 0.591)`}`;
        }
        weatherTemp.innerHTML = `${Math.round(info.main.temp)}&#176;`;
        weatherDescription.innerHTML = `<p>${info.weather[0].description}</p>`;
        weatherIcon.style.backgroundImage = `url("https://openweathermap.org/img/wn/${info.weather[0].icon}.png")`
                                    
        weatherPart.style.background =  `${info.weather[0].main == 'Clouds'
                                    ?`url(few.png) 100% 100% `
                                    :`url()`} ,
                                    ${info.weather[0].main == 'Clear'
                                    ?`url(clear-2.png) 100% 100% `
                                    :`url()`} ,
                                    ${info.weather[0].main == 'Rain'
                                    ?`url(r.png) 100% 100%`
                                    :`url()`} ,
                                    ${info.weather[0].main == 'Drizzle'
                                    ?`url(drizzle.png) 100% 100%`
                                    :`url()`} ,
                                    ${info.weather[0].main == 'Thunderstorm'
                                    ?`url(thunderstorm.png) 100% 100%`
                                    :`url()`}`;
        windSpeed.innerHTML = 
        `<div>
            <img src="wind.png" alt="">
            <p>Wind</p>
        </div>
            <p class="txt">${info.wind.speed}m/s</p>`;
        sysSunset.innerHTML = `Sunset: ${info.sys.sunset}`;
        sysSunrise.innerHTML = `Sunrise: ${info.sys.sunrise}`;
        feelsLike.innerHTML = 
        `<div>
            <img src="feels-like.png" alt="">
            <p>Feels-like</p>
        </div>
        <p class="txt">${Math.round(info.main.feels_like)}&#176;</p>`;
        humidity.innerHTML = 
        `<div>
            <img src="humidity.png" alt="">
            <p>Humidity</p>
        </div>
        <p class="txt">${info.main.humidity} %</p>`;
        visibility.innerHTML = 
        `<div>
            <img src="visibility.png" alt="">
            <p>Visibility</p>
        </div>
        <p class="txt">${(info.visibility)/1000} km</p>`;
        cloudsAll.innerHTML = 
        `<div>
            <img src="clouds-all.png" alt="">
            <p>Сloudy sky</p>
        </div>
        <p class="txt">${info.clouds.all} %</p>`;

    }
}
// main.feels_like Этот температурный параметр учитывает восприятие человеком погоды.
// main.humidity Влажность, %


// visibility Видимость, счетчик. Максимальное значение видимости составляет 10 км
// wind.speedСкорость ветра. Единица измерения по умолчанию: метр/сек, метрика: метр/сек, имперский: мили/час.
// clouds.all Облачность, %

// sys.sunriseВремя восхода солнца, unix, UTC
// sys.sunsetВремя захода солнца, unix, UTC

// let request;
// //стандартный код, предназначенный для того, чтобы гарантировать отправку/выполнение/получение запроса ВСЕМИ браузерами, включая Internet Explorer
// //XMLHttpRequest это объект, содержащий все необходимые свойства и методы для работы с запросами, поддерживаемый новыми современными браузерами
// //ActiveXObject это объект для работы с запросами, устаревший, поддерживаемый на данный момент только Internet Explorer`ом
// if (window.XMLHttpRequest) {
//     request = new XMLHttpRequest();
//   } else {
//     request = new ActiveXObject("Microsoft.XMLHTTP");
//   }
// //"открываем" запрос: указываем метод, с помощью которого ответ на запрос будет получен, указываем адрес, по которому необходимо получить/передать данные
// request.open(
//   "GET",
//   "https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=bd04ee071cea80685a632b569c8c65d1"
// );

// //указываем, как будет обработан ответ на запрос, т.е. что выполнится. в данном случае, вывод в консоль результата
// request.onload = function () {
//   if (request.status === 200) {
//     weatherExample = request.response;
//     console.log(weatherExample);
//     weatherInfo.innerText = weatherExample;
//   }
// };
// //отправка запроса
// request.send();
