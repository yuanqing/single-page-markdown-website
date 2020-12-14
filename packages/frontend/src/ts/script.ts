import { BREAKPOINT_XXL } from './breakpoints'
import { setUpMenu } from './utilities/set-up-menu'
import { setUpMenuToggleButton } from './utilities/set-up-menu-toggle-button'

const menuVisibleClassName = '--menu-visible'
const menuItemActiveClassName = 'menu__item--active'

function main(): void {
  const menuElement = document.querySelector('[data-js="menu"]') as Element
  const mainMenuElement = document.querySelector('[data-js="top-bar"]')
  const tocElement = document.querySelector('[data-js="toc"]')
  const menuToggleButtonElement = document.querySelector(
    '[data-js="menu-toggle-button"]'
  ) as Element
  const contentElement = document.querySelector(
    '[data-js="content"]'
  ) as Element

  setUpMenuToggleButton({
    breakpoint: BREAKPOINT_XXL,
    menuElement,
    menuToggleButtonElement,
    menuVisibleClassName
  })
  setUpMenu({
    breakpoint: BREAKPOINT_XXL,
    contentElement,
    mainMenuElement,
    menuElement,
    menuItemActiveClassName,
    menuToggleButtonElement,
    menuVisibleClassName,
    tocElement
  })
}
main()
