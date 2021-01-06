import { findParentElement } from './find-parent-element'

const topOffset = 100 // offset from top edge of window in which to activate menu items

type MenuOptions = {
  contentElement: HTMLElement
  activeClassName: string
  tocElement: HTMLElement
  sectionsElement: null | HTMLElement
}

export function setUpMenu(options: MenuOptions): void {
  let stopHandleScroll = false

  function scrollToElement(id: string) {
    const elementsOffsetTop = computeElementsOffsetTop(options.contentElement)
    const elementOffsetTop = elementsOffsetTop.find(function (element) {
      return element.id === id
    })
    if (typeof elementOffsetTop === 'undefined') {
      return
    }
    stopHandleScroll = true // exit early from `handleWindowScroll`
    window.scroll(0, elementOffsetTop.offsetTop)
    stopHandleScroll = false
  }

  function updateBasedOnLocationHash() {
    const hash = window.location.hash
    if (hash === '') {
      handleWindowScroll() // Update the active item
      return
    }
    const id = hash.slice(1)
    scrollToElement(id)
    updateActiveItems(options, id)
  }

  function handleClick(event: Event) {
    const element = event.target as HTMLElement
    const parentElement = findParentElement(
      element,
      function (element: HTMLElement) {
        return element.getAttribute('href') !== null
      }
    )
    if (parentElement === null) {
      return
    }
    const href = parentElement.getAttribute('href') as string
    if (href[0] !== '#') {
      // Exit if not an internal link
      return
    }
    event.preventDefault()
    const id = href.slice(1)
    scrollToElement(id)
    updateActiveItems(options, id)
    history.pushState(null, '', href)
  }
  options.contentElement.addEventListener('click', handleClick)
  options.tocElement.addEventListener('click', handleClick)
  if (options.sectionsElement !== null) {
    options.sectionsElement.addEventListener('click', handleClick)
  }

  function handleWindowPopState(event: Event) {
    event.preventDefault()
    updateBasedOnLocationHash()
  }
  window.addEventListener('popstate', handleWindowPopState)

  function handleWindowScroll() {
    if (stopHandleScroll === true) {
      return
    }
    const elementsOffsetTop = computeElementsOffsetTop(options.contentElement)
    for (const element of elementsOffsetTop) {
      if (window.scrollY >= element.offsetTop) {
        updateActiveItems(options, element.id)
        return
      }
    }
    // Unset all active items
    updateActiveItems(options, null)
  }
  window.addEventListener('scroll', handleWindowScroll)

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual' // https://developer.mozilla.org/en-US/docs/Web/API/History/scrollRestoration
  }
  updateBasedOnLocationHash()
}

function computeElementsOffsetTop(
  contentElement: HTMLElement
): Array<{
  id: string
  offsetTop: number
}> {
  const elements = contentElement.querySelectorAll(
    '[id]'
  ) as NodeListOf<HTMLElement>
  const result = []
  const maxOffsetTop = document.body.scrollHeight - window.innerHeight
  let i = -1
  let offsetBottom = null // bottom edge of the last `element` directly _above_ the viewport when scroll is at `maxOffsetTop`
  while (++i < elements.length) {
    const element = elements[i]
    const id = element.getAttribute('id') as string
    let offsetTop = element.offsetTop - topOffset
    if (element.offsetTop + element.offsetHeight >= maxOffsetTop) {
      // `element` is _within_ the viewport when scroll is at `maxOffsetTop`
      if (offsetBottom === null) {
        const previousElement = elements[i - 1]
        offsetBottom =
          previousElement.offsetTop - topOffset + previousElement.offsetHeight
      }
      offsetTop = Math.floor(
        offsetBottom +
          ((element.offsetTop - offsetBottom) /
            (document.body.scrollHeight - offsetBottom)) *
            (document.body.scrollHeight - offsetBottom - window.innerHeight)
      )
    }
    result.push({ id, offsetTop })
  }
  return result.reverse()
}

function updateActiveItems(options: MenuOptions, id: null | string) {
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
