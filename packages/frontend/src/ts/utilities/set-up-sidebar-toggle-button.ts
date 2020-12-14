export function setUpSidebarToggleButton(options: {
  sidebarToggleButtonElement: Element
  menuElement: Element
  breakpoint: number
  tocVisibleClassName: string
}): void {
  function toggleTocVisibility() {
    document.body.classList.toggle(options.tocVisibleClassName)
  }
  options.sidebarToggleButtonElement.addEventListener('click', function () {
    toggleTocVisibility()
  })
  window.addEventListener('keydown', function (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      toggleTocVisibility()
    }
  })
  window.addEventListener('click', function (event: Event) {
    if (
      document.body.classList.contains(options.tocVisibleClassName) === false ||
      window.innerWidth >= options.breakpoint
    ) {
      return
    }
    let element: null | HTMLElement = event.target as HTMLElement
    while (element !== null && element !== document.body) {
      if (
        element === options.menuElement ||
        element === options.sidebarToggleButtonElement
      ) {
        return
      }
      element = element.parentElement
    }
    toggleTocVisibility()
  })
}
