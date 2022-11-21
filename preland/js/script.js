let rand = Math.floor(Math.random() * (15 - 5) + 5);
$('.data-end-place').text(rand)

const updDate = new Date().toLocaleDateString('es', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

document.querySelector('.updateDate').innerHTML = updDate
document.querySelector('.currentDate').innerHTML = updDate