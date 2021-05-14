export function setUpTopBarMenuToggleButton(options: {
  breakpoint: number // The menu is kept visible at or beyond this `breakpoint`
  topBarMenuToggleButtonElement: HTMLButtonElement
  visibleClassName: string
}): void {
  const { breakpoint, topBarMenuToggleButtonElement, visibleClassName } =
    options

  function handleButtonClick(): void {
    document.body.classList.toggle(visibleClassName)
  }
  topBarMenuToggleButtonElement.addEventListener('click', handleButtonClick)

  function handleWindowClick(event: MouseEvent): void {
    // Exit if the menu is already hidden
    if (document.body.classList.contains(visibleClassName) === false) {
      return
    }
    // Exit if at or beyond `breakpoint` at which the menu is kept visible
    if (window.innerWidth >= breakpoint) {
      return
    }
    const eventTarget = event.target as HTMLElement
    // Exit if we clicked on `menuToggleButtonElement`
    const parentElement = findParentElement(
      eventTarget,
      function (element: HTMLElement): boolean {
        return element === topBarMenuToggleButtonElement
      }
    )
    if (parentElement !== null) {
      return
    }
    handleButtonClick()
  }
  window.addEventListener('click', handleWindowClick)

  function handleWindowKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return
    }
    handleButtonClick()
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
