export function setUpMenuToggleButton(options: {
  menuToggleButtonElement: Element
  menuElement: Element
  breakpoint: number
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
    let element: null | HTMLElement = event.target as HTMLElement
    while (element !== null && element !== document.body) {
      if (
        element === options.menuElement ||
        element === options.menuToggleButtonElement
      ) {
        return
      }
      element = element.parentElement
    }
    toggleTocVisibility()
  })
}
