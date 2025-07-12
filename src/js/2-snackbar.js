// Dokümantasyonda açıklanan
import iziToast from 'izitoast';
// Ek stillerin ek olarak içe aktarılması
import 'izitoast/dist/css/iziToast.min.css';

document
  .getElementById('delay-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const delay = Number(document.getElementById('delay-input').value);
    const status = document.querySelector('input[name="status"]:checked').value;

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        status === 'resolve' ? resolve(delay) : reject(delay);
      }, delay);
    });

    promise
      .then(delay => {
        iziToast.success({
          title: '✅ Başarılı',
          message: `Promise başarıyla gerçekleşti: ${delay} ms sonra`,
          position: 'topRight',
        });
      })
      .catch(delay => {
        iziToast.error({
          title: '❌ Hata',
          message: `Promise reddedildi: ${delay} ms sonra`,
          position: 'topRight',
        });
      });
  });
