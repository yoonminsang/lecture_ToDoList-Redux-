(function () {
  const clock = document.querySelector('.clock');
  const getTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + String(month);
    let datee = date.getDate();
    if (datee < 10) datee = '0' + String(datee);
    const day = date.toString().slice(0, 3);
    const dateArr = [year, month, datee, day];
    const time = date.toString().slice(16, 24);
    clock.textContent = dateArr.join(' ') + '  ' + time;
  };
  const init = () => {
    getTime();
    setInterval(getTime, 1000);
  };
  init();
})();
