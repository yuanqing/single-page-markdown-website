import { setUpMenuToggleButton } from './utilities/set-up-menu-toggle-button'
import { setUpScrollSpy } from './utilities/set-up-scroll-spy'

function main(): void {
  setUpMenuToggleButton({
    breakpoint: 1600,
    menuToggleButtonElement: document.querySelector(
      '[data-js="menu-toggle-button"]'
    ) as HTMLButtonElement,
    visibleClassName: '--menu-visible'
  })

  setUpScrollSpy({
    activeClassName: '--scroll-spy-active',
    contentElement: document.querySelector(
      '[data-js="content"]'
    ) as HTMLElement,
    menuElement: document.querySelector('[data-js="menu"]') as HTMLDivElement,
    scrollMarginTopOffset: 40,
    topBarElement: document.querySelector('[data-js="top-bar"]') as HTMLElement
  })
}

main()
