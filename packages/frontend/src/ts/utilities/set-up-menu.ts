export function setUpMenu(options: {
  breakpoint: number
  contentElement: Element
  mainMenuElement: null | Element
  menuElement: Element
  menuItemActiveClassName: string
  menuToggleButtonElement: Element
  tocElement: null | Element
  menuVisibleClassName: string
}): void {
  let stopIntersectionObserver = false
  options.menuElement.addEventListener('click', function (event: Event) {
    const href = (event.target as Element).getAttribute('href') as string
    if (href === null || href[0] !== '#') {
      return
    }
    // Directly set the active item element to the item that was explicitly
    // clicked, ignoring the scroll position. Set the `stopIntersectionObserver`
    // flag to stop the intersection observer `callback`.
    stopIntersectionObserver = true
    const id = href.slice(1)
    if (options.mainMenuElement !== null) {
      const sectionIndex = findIdElementIndex({
        contentElements,
        element: options.contentElement.querySelector(
          `[id="${id}"]`
        ) as Element,
        topLevelOnly: true
      })
      const sectionId = contentElements[sectionIndex].getAttribute(
        'id'
      ) as string
      updateActiveItemElement({
        className: options.menuItemActiveClassName,
        element: options.mainMenuElement,
        id: sectionId
      })
    }
    if (options.tocElement !== null) {
      updateActiveItemElement({
        className: options.menuItemActiveClassName,
        element: options.tocElement,
        id
      })
    }
    //  Hide the menu if screen is smaller than `options.breakpoint`
    if (window.innerWidth < options.breakpoint) {
      document.body.classList.remove(options.menuVisibleClassName)
    }
  })
  const contentElements = [...options.contentElement.children]
  const activeIndexes: { [key: string]: number } = {}
  let activeIndex = -1
  const callback: IntersectionObserverCallback = function (entries) {
    const changedIndexes: { [key: string]: boolean } = {}
    for (const entry of entries) {
      const element = entry.target
      const index = findIdElementIndex({
        contentElements,
        element,
        topLevelOnly: false
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
    if (stopIntersectionObserver === true) {
      stopIntersectionObserver = false
      return
    }
    const sortedIndexes = Object.values(activeIndexes).sort()
    if (sortedIndexes.length > 0 && activeIndex !== sortedIndexes[0]) {
      activeIndex = sortedIndexes[0]
      const id = contentElements[activeIndex].getAttribute('id') as string
      const sectionIndex = findIdElementIndex({
        contentElements,
        element: contentElements[activeIndex],
        topLevelOnly: true
      })
      const sectionId = contentElements[sectionIndex].getAttribute(
        'id'
      ) as string
      if (options.mainMenuElement !== null) {
        updateActiveItemElement({
          className: options.menuItemActiveClassName,
          element: options.mainMenuElement,
          id: sectionId
        })
      }
      if (options.tocElement !== null) {
        updateActiveItemElement({
          className: options.menuItemActiveClassName,
          element: options.tocElement,
          id
        })
      }
    }
  }
  const toggleButtonElementHeight = (options.menuToggleButtonElement as HTMLElement)
    .offsetHeight
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: `-${toggleButtonElementHeight}px 0px 0px 0px`,
    threshold: 1
  })
  for (const element of contentElements) {
    observer.observe(element)
  }
}

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

// Find the index of the header element in `elements` with an `id` attribute
function findIdElementIndex(options: {
  contentElements: Array<Element>
  element: Element
  topLevelOnly: boolean
}): number {
  let index = options.contentElements.indexOf(options.element)
  while (index !== -1) {
    const element = options.contentElements[index]
    const id = element.getAttribute('id')
    if (
      id !== null &&
      id !== '' &&
      (options.topLevelOnly === false || element.tagName === 'H1')
    ) {
      break
    }
    index -= 1
  }
  return index
}
