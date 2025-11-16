// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";

// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


//  DOM-ЕЛЕМЕНТИ

const dateInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

// console.log(dateInput);
// console.log(startBtn);
// console.log(daysEl);
// console.log(hoursEl);
// console.log(minutesEl);
// console.log(secondsEl);

// ПОЧАТКОВІ ЗМІННІ

let userSelectedDate = null;
let timerId = null;
startBtn.disabled = true;

// НАЛАШТУВАННЯ FLATPICKR

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,

    onClose(selectedDates) {
        const pickedDate = selectedDates[0];

        if (pickedDate <= new Date()) {
            startBtn.disabled = true;

            iziToast.error({
                message: "Please choose a date in the future",
                position: "topRight",
            });
            return;
        }

        // Валідна дата
        userSelectedDate = pickedDate;
        startBtn.disabled = false;

    }
}



flatpickr(dateInput, options);

// ОБРОБНИК КНОПКИ "START"

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    dateInput.disabled = true;

    timerId = setInterval(() =>{
        const diff = userSelectedDate - new Date();

        if(diff <= 0){
            clearInterval(timerId);
            updateTimer({days: 0, hours: 0, minutes: 0, seconds: 0});

            dateInput.disabled = false;
            startBtn.disabled = true;
            return;
        }

        updateTimer(convertMs(diff));
    }, 1000);
});

// ФОРМАТУВАННЯ

function addLeadingZero(value){
    return String(value).padStart(2, '0');
}

// ОНОВЛЕННЯ ІНТЕРФЕЙСУ

function updateTimer({days, hours, minutes, seconds}){
    daysEl.textContent = days;
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}
