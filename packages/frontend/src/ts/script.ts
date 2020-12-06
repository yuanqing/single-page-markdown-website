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
  toggleButtonElement.addEventListener('click', function () {
    document.body.classList.toggle(options.tocVisibleClassName)
  })
  tocElement.addEventListener('click', function () {
    document.body.classList.remove(options.tocVisibleClassName)
  })
}
