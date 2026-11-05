const eyes = document.querySelectorAll('.eye')
const centerEl = document.querySelector('.eyes-center')
const handleEyesMove = (e) => {
  const rect = centerEl.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
  
  eyes.forEach(el => {
    el.style.rotate = `${angle}deg`
  })
}


document.addEventListener('mousemove', handleEyesMove)