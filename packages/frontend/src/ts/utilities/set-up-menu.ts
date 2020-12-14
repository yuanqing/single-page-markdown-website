export function setUpMenu(options: {
  tocElement: Element
  sectionsElement: Element
  sidebarToggleButtonElement: Element
  contentElement: Element
  breakpoint: number
  tocVisibleClassName: string
  menuItemActiveClassName: string
}): void {
  options.tocElement.addEventListener('click', function () {
    if (window.innerWidth < options.breakpoint) {
      document.body.classList.remove(options.tocVisibleClassName)
    }
  })
  updateActiveMenuItemOnScroll({
    contentElements: [...options.contentElement.children],
    menuItemActiveClassName: options.menuItemActiveClassName,
    sectionsElement: options.sectionsElement,
    sidebarToggleButtonElement: options.sidebarToggleButtonElement,
    tocElement: options.tocElement
  })
}

function updateActiveMenuItemOnScroll(options: {
  contentElements: Array<Element>
  sectionsElement: Element
  tocElement: Element
  sidebarToggleButtonElement: Element
  menuItemActiveClassName: string
}) {
  const activeIndexes: { [key: string]: number } = {}
  let activeIndex = -1
  function updateActiveItemElement(options: {
    element: Element
    id: string
    className: string
  }): void {
    const previousActiveItemElement = options.element.querySelector(
      `.${options.className}`
    )
    if (previousActiveItemElement !== null) {
      previousActiveItemElement.classList.remove(options.className)
    }
    const activeItemElement = options.element.querySelector(
      `[href="#${options.id}"]`
    ) as Element
    activeItemElement.classList.add(options.className)
  }
  const callback: IntersectionObserverCallback = function (entries) {
    const changedIndexes: { [key: string]: boolean } = {}
    for (const entry of entries) {
      const element = entry.target
      const index = findIdElementIndex({
        contentElements: options.contentElements,
        element,
        topLevelHeadingsOnly: false
      })
      if (index !== -1 && entry.intersectionRatio === 1) {
        activeIndexes[`${index}`] = index
        changedIndexes[`${index}`] = true
        continue
      }
      if (changedIndexes[`${index}`] !== true) {
        delete activeIndexes[`${index}`]
      }
    }
    const sortedIndexes = Object.values(activeIndexes).sort()
    if (sortedIndexes.length > 0 && activeIndex !== sortedIndexes[0]) {
      activeIndex = sortedIndexes[0]
      const id = options.contentElements[activeIndex].getAttribute(
        'id'
      ) as string
      const activeSectionIndex = findIdElementIndex({
        contentElements: options.contentElements,
        element: options.contentElements[activeIndex],
        topLevelHeadingsOnly: true
      })
      const sectionId = options.contentElements[
        activeSectionIndex
      ].getAttribute('id') as string
      updateActiveItemElement({
        className: options.menuItemActiveClassName,
        element: options.sectionsElement,
        id: sectionId
      })
      updateActiveItemElement({
        className: options.menuItemActiveClassName,
        element: options.tocElement,
        id
      })
    }
  }
  const toggleButtonElementHeight = (options.sidebarToggleButtonElement as HTMLElement)
    .offsetHeight
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: `-${toggleButtonElementHeight}px 0px 0px 0px`,
    threshold: 1
  })
  for (const element of options.contentElements) {
    observer.observe(element)
  }
}

// Find the index of the header element in `elements` with an `id` attribute
function findIdElementIndex(options: {
  contentElements: Array<Element>
  element: Element
  topLevelHeadingsOnly: boolean
}): number {
  let index = options.contentElements.indexOf(options.element)
  while (index !== -1) {
    const element = options.contentElements[index]
    const id = element.getAttribute('id')
    if (
      id !== null &&
      id !== '' &&
      (options.topLevelHeadingsOnly === false || element.tagName === 'H1')
    ) {
      break
    }
    index -= 1
  }
  return index
}
