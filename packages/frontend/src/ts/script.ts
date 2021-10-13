import { setUpMenu } from './utilities/set-up-menu'
import { setUpScrollSpy } from './utilities/set-up-scroll-spy'
import { setUpTopBarMenuToggleButton } from './utilities/set-up-top-bar-menu-toggle-button'
import { setUpTopBarTitleLink } from './utilities/set-up-top-bar-title-link'

function main(): void {
  const contentElement = document.querySelector<HTMLDivElement>(
    '[data-js="content"]'
  )
  const topBarElement = document.querySelector<HTMLDivElement>(
    '[data-js="top-bar"]'
  )
  const topBarMenuToggleButtonElement =
    document.querySelector<HTMLButtonElement>(
      '[data-js="top-bar-menu-toggle-button"]'
    )
  const topBarTitleLinkElement = document.querySelector<HTMLAnchorElement>(
    '[data-js="top-bar-title-link"]'
  )
  const menuElement = document.querySelector<HTMLDivElement>('[data-js="menu"]')

  if (topBarMenuToggleButtonElement !== null) {
    setUpTopBarMenuToggleButton({
      breakpoint: 1600,
      topBarMenuToggleButtonElement,
      visibleClassName: '--menu-visible'
    })
  }
  if (menuElement !== null && topBarTitleLinkElement !== null) {
    setUpTopBarTitleLink({
      menuElement,
      topBarTitleLinkElement
    })
  }
  if (menuElement !== null) {
    setUpMenu(menuElement, topBarElement)
  }
  if (
    menuElement !== null &&
    contentElement !== null &&
    topBarElement !== null
  ) {
    setUpScrollSpy({
      activeClassName: '--scroll-spy-active',
      contentElement,
      menuElement,
      scrollMarginTopOffset: 40,
      topBarElement
    })
  }
}
main()
