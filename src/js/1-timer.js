// Belgelerde açıklandığı gibi
import flatpickr from 'flatpickr';
// Ek stil dosyalarını içe aktar
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';

let userSelectedDate = null;
let countdownInterval = null;
let isTimerRunning = false;

const startButton = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer');
const dateInput = document.getElementById('datetime-picker');

// Sayılar 2 karakterden azsa başına 0 ekle
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// ms cinsinden farkı gün/saat/dk/sn'ye çevir
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

// Flatpickr ayarları
flatpickr('#datetime-picker', {
  enableTime: true,
  dateFormat: 'Y-m-d H:i',
  time_24hr: true,
  locale: 'tr',
  minDate: 'today',
  onClose: function (selectedDates) {
    const selected = selectedDates[0];
    const now = new Date();

    if (isTimerRunning) {
      iziToast.warning({
        title: 'Uyarı',
        message: 'Zamanlayıcı başladıktan sonra tarih değiştirilemez.',
        position: 'topRight',
      });
      return;
    }

    if (!selected || selected <= now) {
      startButton.disabled = true;
      userSelectedDate = null;

      iziToast.error({
        title: 'Hatalı Seçim',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
    } else {
      userSelectedDate = selected;
      startButton.disabled = false;
    }
  },
});

// Start butonuna basıldığında
startButton.addEventListener('click', () => {
  if (!userSelectedDate || isTimerRunning) return;

  isTimerRunning = true;
  startButton.disabled = true;
  dateInput.disabled = true;

  countdownInterval = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(countdownInterval);
      timerDisplay.textContent = '00:00:00:00';
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);

    timerDisplay.textContent = `${addLeadingZero(days)}:${addLeadingZero(
      hours
    )}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }, 1000);
});

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}
