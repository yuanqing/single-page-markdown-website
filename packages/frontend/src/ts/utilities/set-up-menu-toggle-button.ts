import { findParentElement } from './find-parent-element'

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
  options.menuElement.addEventListener('click', function (event: Event) {
    if (window.innerWidth >= options.breakpoint) {
      return
    }
    if (
      document.body.classList.contains(options.menuVisibleClassName) === false
    ) {
      return
    }
    const element = event.target as HTMLElement
    const parentElement = findParentElement(
      element,
      function (element: HTMLElement) {
        const href = element.getAttribute('href')
        return href !== null && href[0] === '#'
      }
    )
    if (parentElement === null) {
      return
    }
    toggleTocVisibility()
  })
  window.addEventListener('click', function (event: Event) {
    // Exit if menu is already hidden
    if (
      document.body.classList.contains(options.menuVisibleClassName) === false
    ) {
      return
    }
    // Exit on big screens
    if (window.innerWidth >= options.breakpoint) {
      return
    }
    const element = event.target as HTMLElement
    // Exit if we clicked within `menuElement`
    if (options.menuElement.contains(element) === true) {
      return
    }
    // Exit if we clicked the `menuToggleButtonElement`
    const parentElement = findParentElement(
      element,
      function (element: HTMLElement) {
        return element === options.menuToggleButtonElement
      }
    )
    if (parentElement !== null) {
      return
    }
    toggleTocVisibility()
  })
}
