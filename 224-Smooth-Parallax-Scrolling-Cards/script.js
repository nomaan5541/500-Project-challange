class ParallaxCard {
  constructor(cardEl) {
    this.cardEl = cardEl
    this.imageWrapper = cardEl.querySelector('.card__image-wrapper')

    this.heightDiff = this.imageWrapper.clientHeight - this.cardEl.clientHeight
  }

  update() {
    const boundingRect = this.cardEl.getBoundingClientRect()
    const topOffset = boundingRect.y
    const progress = topOffset / window.innerHeight
    const offset = this.heightDiff * progress * -1
    this.imageWrapper.style.transform = `translate(0, ${offset}px)`
  }
}

function initCardParallax() {
  const cardEls = document.querySelectorAll('.card')
  const cards = Array.from(cardEls).map((cardEl) => new ParallaxCard(cardEl))

  function update() {
    cards.forEach((card) => card.update())
  }
  
  function onScroll() {
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll)
  requestAnimationFrame(update)
}

initCardParallax()