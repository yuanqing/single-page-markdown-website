export function setUpMenuToggleButton(options: {
  breakpoint: number // The menu is kept visible at or beyond this breakpoint
  menuToggleButtonElement: HTMLButtonElement
  visibleClassName: string
}): void {
  const { breakpoint, menuToggleButtonElement, visibleClassName } = options

  function handleMenuToggleButtonClick(): void {
    document.body.classList.toggle(visibleClassName)
  }
  menuToggleButtonElement.addEventListener('click', handleMenuToggleButtonClick)

  function handleWindowClick(event: MouseEvent): void {
    // Exit if the menu is already hidden
    if (document.body.classList.contains(visibleClassName) === false) {
      return
    }
    // Exit if at or beyond `BREAKPOINT` at which `menuElement` is kept visible
    if (window.innerWidth >= breakpoint) {
      return
    }
    const eventTarget = event.target as HTMLElement
    // Exit if we clicked on `menuToggleButtonElement`
    const parentElement = findParentElement(
      eventTarget,
      function (element: HTMLElement): boolean {
        return element === menuToggleButtonElement
      }
    )
    if (parentElement !== null) {
      return
    }
    handleMenuToggleButtonClick()
  }
  window.addEventListener('click', handleWindowClick)

  function handleWindowKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return
    }
    handleMenuToggleButtonClick()
  }
  window.addEventListener('keydown', handleWindowKeyDown)
}

function findParentElement(
  element: null | HTMLElement,
  callback: (element: HTMLElement) => boolean
): null | HTMLElement {
  while (element !== null) {
    if (callback(element) === true) {
      break
    }
    element = element.parentElement
  }
  return element
}
