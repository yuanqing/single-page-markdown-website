export function setUpMenuToggleButton(options: {
  breakpoint: number
  menuElement: HTMLElement
  menuToggleButtonElement: HTMLElement
  menuVisibleClassName: string
}): void {
  function toggleTocVisibility() {
    document.body.classList.toggle(options.menuVisibleClassName)
  }
  options.menuToggleButtonElement.addEventListener('click', function () {
    toggleTocVisibility()
  })
  window.addEventListener('keydown', function (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      toggleTocVisibility()
    }
  })
  window.addEventListener('click', function (event: Event) {
    if (
      document.body.classList.contains(options.menuVisibleClassName) ===
        false ||
      window.innerWidth >= options.breakpoint
    ) {
      return
    }
    const element = event.target as HTMLElement
    if (
      options.menuToggleButtonElement === element ||
      options.menuToggleButtonElement.contains(element) === true
    ) {
      return
    }
    if (
      options.menuElement.contains(element) === true &&
      element.getAttribute('href') !== null
    ) {
      return
    }
    toggleTocVisibility()
  })
}
