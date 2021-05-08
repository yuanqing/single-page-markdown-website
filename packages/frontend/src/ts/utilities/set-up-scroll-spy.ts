export function setUpScrollSpy(options: {
  activeClassName: string
  contentElement: HTMLElement
  menuElement: HTMLElement
  scrollMarginTopOffset: number
  topBarElement: HTMLElement
}): void {
  const {
    activeClassName,
    contentElement,
    menuElement,
    scrollMarginTopOffset,
    topBarElement
  } = options

  function handleWindowScroll() {
    const activeId = computeActiveId({
      contentElement,
      scrollMarginTop: topBarElement.offsetHeight + scrollMarginTopOffset
    })
    updateActiveItem({
      activeClassName,
      element: menuElement,
      id: activeId
    })

    const activeSectionId = computeActiveSectionId({
      activeId,
      contentElement,
      tagName: 'H1'
    })
    updateActiveItem({
      activeClassName,
      element: topBarElement,
      id: activeSectionId
    })
  }
  window.addEventListener('scroll', handleWindowScroll)
}

function computeActiveId(options: {
  contentElement: HTMLElement
  scrollMarginTop: number
}): null | string {
  const { contentElement, scrollMarginTop } = options
  const elements = [
    ...contentElement.querySelectorAll<HTMLElement>('[id]')
  ].reverse()
  const scrollY = window.scrollY
  for (const element of elements) {
    if (element.offsetTop - scrollMarginTop <= scrollY) {
      return element.getAttribute('id')
    }
  }
  return null
}

function computeActiveSectionId(options: {
  contentElement: HTMLElement
  activeId: null | string
  tagName: string
}): null | string {
  const { contentElement, activeId, tagName } = options
  if (activeId === null) {
    return null
  }
  const children = [...contentElement.querySelectorAll<HTMLElement>('[id]')]
  const index = children.findIndex(function (element: HTMLElement) {
    return element.getAttribute('id') === activeId
  })
  const element = children
    .slice(0, index + 1)
    .reverse()
    .find(function (element: HTMLElement) {
      return element.tagName === tagName
    })
  if (typeof element === 'undefined') {
    const firstHeaderElement = children.find(function (element: HTMLElement) {
      return element.tagName === tagName
    }) as HTMLElement
    return firstHeaderElement.getAttribute('id') as string
  }
  return element.getAttribute('id') as string
}

function updateActiveItem(options: {
  element: HTMLElement
  id: null | string
  activeClassName: string
}): void {
  const { element, id, activeClassName } = options
  const previousActiveElement = element.querySelector(`.${activeClassName}`)
  if (previousActiveElement !== null) {
    previousActiveElement.classList.remove(activeClassName)
  }
  if (id === null) {
    return
  }
  const activeElement = element.querySelector(
    `[href="#${id === null ? '' : id}"]`
  )
  if (activeElement === null) {
    return
  }
  activeElement.classList.add(activeClassName)
}
