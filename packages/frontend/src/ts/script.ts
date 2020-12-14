import { BREAKPOINT_XXL } from './breakpoints'
import { setUpMenu } from './utilities/set-up-menu'
import { setUpSidebarToggleButton } from './utilities/set-up-sidebar-toggle-button'

const tocVisibleClassName = '--sidebar-visible'
const menuItemActiveClassName = 'menu__item--active'

function main(): void {
  const sectionsElement = document.querySelector(
    '[data-js="sections"]'
  ) as Element
  const tocElement = document.querySelector('[data-js="toc"]') as Element

  const sidebarToggleButtonElement = document.querySelector(
    '[data-js="sidebar-toggle-button"]'
  ) as Element
  const contentElement = document.querySelector(
    '[data-js="content"]'
  ) as Element
  setUpSidebarToggleButton({
    breakpoint: BREAKPOINT_XXL,
    menuElement: tocElement,
    sidebarToggleButtonElement,
    tocVisibleClassName
  })
  setUpMenu({
    breakpoint: BREAKPOINT_XXL,
    contentElement,
    menuItemActiveClassName,
    sectionsElement,
    sidebarToggleButtonElement,
    tocElement,
    tocVisibleClassName
  })
}
main()
