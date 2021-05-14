export function setUpTopBarTitleLink(options: {
  menuElement: HTMLDivElement
  topBarTitleLinkElement: HTMLAnchorElement
}): void {
  const { topBarTitleLinkElement, menuElement } = options

  function handleClick(event: MouseEvent) {
    if (event.metaKey === true || event.shiftKey === true) {
      return
    }
    event.preventDefault()
    history.pushState(
      '',
      document.title,
      `${window.location.pathname}${window.location.search}`
    )
    // Scroll both `window` and `menuElement` to top
    window.scrollTo({ top: 0 })
    menuElement.scrollTo({ top: 0 })
  }
  topBarTitleLinkElement.addEventListener('click', handleClick)
}
