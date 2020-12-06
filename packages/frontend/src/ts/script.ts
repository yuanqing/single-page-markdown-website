function main(): void {
  setUpToc({
    tocSelector: '[data-js="toc"]',
    tocVisibleClassName: '--toc-visible',
    toggleButtonSelector: '[data-js="toc-toggle-button"]'
  })
}
main()

function setUpToc(options: {
  tocSelector: string
  tocVisibleClassName: string
  toggleButtonSelector: string
}): void {
  const toggleButtonElement = document.querySelector(
    options.toggleButtonSelector
  )
  if (toggleButtonElement === null) {
    throw new Error(`Could not find ${options.toggleButtonSelector}`)
  }
  const tocElement = document.querySelector(options.tocSelector)
  if (tocElement === null) {
    throw new Error(`Could not find ${options.tocSelector}`)
  }
  let scrollY = 0
  function toggleTocVisibility(): void {
    const isTocVisible =
      document.body.classList.contains(options.tocVisibleClassName) === true
    if (isTocVisible === false) {
      scrollY = window.scrollY
      document.body.classList.add(options.tocVisibleClassName)
      return
    }
    document.body.classList.remove(options.tocVisibleClassName)
    window.scrollTo(0, scrollY)
  }
  toggleButtonElement.addEventListener('click', function () {
    toggleTocVisibility()
  })
  tocElement.addEventListener('click', function (event: Event) {
    if (event.target === null) {
      return
    }
    const element = event.target as HTMLElement
    const href = element.getAttribute('href')
    if (href === null || href === '' || href[0] !== '#') {
      return
    }
    const headerElement = document.querySelector(`[id='${href.slice(1)}']`)
    if (headerElement === null) {
      return
    }
    event.preventDefault()
    document.body.classList.remove(options.tocVisibleClassName)
    const scrollY =
      headerElement.getBoundingClientRect().top -
      (toggleButtonElement as HTMLButtonElement).offsetHeight -
      16
    window.scrollTo(0, scrollY)
  })
}
