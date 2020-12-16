import { BREAKPOINT_XXL } from './breakpoints'
import { setUpMenu } from './utilities/set-up-menu'
import { setUpMenuToggleButton } from './utilities/set-up-menu-toggle-button'

const menuVisibleClassName = '--menu-visible'
const menuItemActiveClassName = 'menu__item--active'

function main(): void {
  const contentElement = document.querySelector(
    '[data-js="content"]'
  ) as Element
  const menuElement = document.querySelector('[data-js="menu"]') as Element
  const menuToggleButtonElement = document.querySelector(
    '[data-js="menu-toggle-button"]'
  ) as Element

  setUpMenuToggleButton({
    breakpoint: BREAKPOINT_XXL,
    menuElement,
    menuToggleButtonElement,
    menuVisibleClassName
  })
  setUpMenu({
    contentElement,
    menuActiveItemClassName: menuItemActiveClassName,
    menuElement
  })
}
main()
