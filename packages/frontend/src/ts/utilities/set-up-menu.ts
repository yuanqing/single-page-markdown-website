export function setUpMenu(options: {
  menuElement: HTMLDivElement
  topBarSectionsElement: HTMLDivElement
}): void {
  const { topBarSectionsElement, menuElement } = options

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
    // Read the `href` attribute off the link that was clicked
    const target = event.target as HTMLAnchorElement
    const href = target.getAttribute('href')
    if (href === null) {
      return
    }
    scrollToActiveMenuElement(href)
  }
  topBarSectionsElement.addEventListener('click', handleClick)

  const hash = window.location.hash
  if (hash !== '') {
    scrollToActiveMenuElement(hash)
  }
}
