import { findParentElement } from './find-parent-element'

export function setUpMenu(options: {
  contentElement: HTMLElement
  activeClassName: string
  tocElement: HTMLElement
  sectionsElement: null | HTMLElement
}): void {
  let stop = false

  function updateActiveItems(id: null | string) {
    updateActiveItem({
      activeClassName: options.activeClassName,
      element: options.tocElement,
      id
    })
    if (options.sectionsElement === null) {
      return
    }
    for (const tagName of ['H1', 'H2']) {
      const sectionId = resolveSectionId({
        contentElement: options.contentElement,
        id,
        tagName
      })
      const result = updateActiveItem({
        activeClassName: options.activeClassName,
        element: options.sectionsElement,
        id: sectionId
      })
      if (result === true) {
        break
      }
    }
  }

  function handleClick(event: Event) {
    const element = event.target as HTMLElement
    const parentElement = findParentElement(
      element,
      function (element: HTMLElement) {
        return element.getAttribute('href') !== null
      }
    )
    if (parentElement !== null) {
      const href = parentElement.getAttribute('href') as string
      const id = href.slice(1)
      updateActiveItems(id)
      stop = true
    }
  }

  function handleScroll() {
    if (stop === true) {
      stop = false
      return
    }
    const scrollPercentage =
      window.scrollY / (document.body.scrollHeight - window.innerHeight)
    const elementsOffsetTop = computeElementsOffsetTop(options.contentElement)
    for (const elementOffsetTop of elementsOffsetTop) {
      if (scrollPercentage >= elementOffsetTop.percentage) {
        updateActiveItems(elementOffsetTop.id)
        return
      }
    }
    // Unset all active items
    updateActiveItems(null)
  }

  options.contentElement.addEventListener('click', handleClick)
  options.tocElement.addEventListener('click', handleClick)
  if (options.sectionsElement !== null) {
    options.sectionsElement.addEventListener('click', handleClick)
  }
  window.addEventListener('scroll', handleScroll)

  const hash = window.location.hash
  if (hash === '') {
    handleScroll()
    return
  }
  updateActiveItems(hash.slice(1))
}

function resolveSectionId(options: {
  contentElement: HTMLElement
  id: null | string
  tagName: string
}): null | string {
  if (options.id === null) {
    return null
  }
  const children = [...options.contentElement.children] as Array<HTMLElement>
  const index = children.findIndex(function (element: HTMLElement) {
    return element.getAttribute('id') === options.id
  })
  const element = children
    .slice(0, index + 1)
    .reverse()
    .find(function (element: HTMLElement) {
      return element.tagName === options.tagName
    })
  if (typeof element === 'undefined') {
    const firstHeaderElement = children.find(function (element: HTMLElement) {
      return element.tagName === options.tagName
    }) as HTMLElement
    return firstHeaderElement.getAttribute('id') as string
  }
  return element.getAttribute('id') as string
}

function computeElementsOffsetTop(
  contentElement: HTMLElement
): Array<{
  id: string
  percentage: number
}> {
  const elements = contentElement.querySelectorAll(
    '[id]'
  ) as NodeListOf<HTMLElement>
  const result = []
  for (const element of elements) {
    const id = element.getAttribute('id') as string
    const percentage = element.offsetTop / document.body.scrollHeight
    result.push({ id, percentage })
  }
  if (elements[0].offsetTop < window.innerHeight) {
    result[0].percentage = 0
  }
  return result.reverse()
}

function updateActiveItem(options: {
  element: HTMLElement
  id: null | string
  activeClassName: string
}): boolean {
  const previousActiveElement = options.element.querySelector(
    `.${options.activeClassName}`
  )
  if (previousActiveElement !== null) {
    previousActiveElement.classList.remove(options.activeClassName)
  }
  if (options.id === null) {
    return false
  }
  const activeElement = options.element.querySelector(`[href="#${options.id}"]`)
  if (activeElement !== null) {
    activeElement.classList.add(options.activeClassName)
    return true
  }
  return false
}
