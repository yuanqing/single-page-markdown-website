import { BREAKPOINT_XXL } from './breakpoints'
import { setUpMenu } from './utilities/set-up-menu'
import { setUpMenuToggleButton } from './utilities/set-up-menu-toggle-button'

const menuVisibleClassName = '--menu-visible'
const menuItemActiveClassName = 'menu__item--active'

function main(): void {
  setUpMenuToggleButton({
    breakpoint: BREAKPOINT_XXL,
    menuElement: document.querySelector('[data-js="menu"]') as HTMLElement,
    menuToggleButtonElement: document.querySelector(
      '[data-js="menu-toggle-button"]'
    ) as HTMLElement,
    menuVisibleClassName
  })
  setUpMenu({
    activeClassName: menuItemActiveClassName,
    contentElement: document.querySelector(
      '[data-js="content"]'
    ) as HTMLElement,
    sectionsElement: document.querySelector(
      '[data-js="sections"]'
    ) as HTMLElement,
    tocElement: document.querySelector('[data-js="toc"]') as HTMLElement
  })
}
main()
