import { findParentElement } from './find-parent-element'

export function setUpMenu(menuElement: HTMLDivElement): void {
  function scrollToActiveMenuElement(href: string): void {
    // Find the element in `menuElement` with the same `href`, then scroll to it
    const activeMenuElement = menuElement.querySelector<HTMLAnchorElement>(
      `[href="${href}"]`
    )
    if (activeMenuElement === null) {
      return
    }
    const padding =
      1 *
      window.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize
      ) // 1rem
    menuElement.scrollTo({
      top: Math.max(0, activeMenuElement.offsetTop - padding)
    })
  }

  function handleClick(event: MouseEvent): void {
    const eventTarget = event.target as HTMLElement
    if (eventTarget.tagName !== 'A') {
      return
    }
    // Read the `href` attribute off the element that was clicked
    const href = eventTarget.getAttribute('href')
    if (href === null) {
      return
    }
    // Exit if we clicked on a link within `menuElement`
    const parentElement = findParentElement(
      eventTarget,
      function (element: HTMLElement): boolean {
        return element === menuElement
      }
    )
    if (parentElement !== null) {
      return
    }
    scrollToActiveMenuElement(href)
  }
  window.addEventListener('click', handleClick)

  const hash = window.location.hash
  if (hash !== '') {
    scrollToActiveMenuElement(hash)
  }
}
