import { findParentElement } from './find-parent-element'

const breakpoint = 1600

type MenuToggleButtonOptions = {
  menuElement: HTMLElement
  menuToggleButtonElement: HTMLElement
  menuVisibleClassName: string
}

export function setUpMenuToggleButton(options: MenuToggleButtonOptions): void {
  function handleMenuToggleButtonClick() {
    document.body.classList.toggle(options.menuVisibleClassName)
  }
  options.menuToggleButtonElement.addEventListener(
    'click',
    handleMenuToggleButtonClick
  )

  function handleMenuClick(event: Event) {
    if (window.innerWidth >= breakpoint) {
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
    handleMenuToggleButtonClick()
  }
  options.menuElement.addEventListener('click', handleMenuClick)

  function handleWindowClick(event: Event) {
    // Exit if menu is already hidden
    if (
      document.body.classList.contains(options.menuVisibleClassName) === false
    ) {
      return
    }
    // Exit on big screens
    if (window.innerWidth >= breakpoint) {
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
    handleMenuToggleButtonClick()
  }
  window.addEventListener('click', handleWindowClick)

  function handleWindowKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      handleMenuToggleButtonClick()
    }
  }
  window.addEventListener('keydown', handleWindowKeyDown)
}
