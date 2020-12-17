export function setUpMenu(options: {
  contentElement: HTMLElement
  activeClassName: string
  tocElement: HTMLElement
  sectionsElement: HTMLElement
}) {
  let stop = false

  function updateActiveItems(id: string) {
    updateActiveItem({
      activeClassName: options.activeClassName,
      element: options.tocElement,
      id
    })
    const sectionId = resolveSectionId(options.contentElement, id)
    updateActiveItem({
      activeClassName: options.activeClassName,
      element: options.sectionsElement,
      id: sectionId
    })
  }

  function handleClick(event: Event) {
    const element = event.target as HTMLElement
    const href = element.getAttribute('href')
    if (href !== null) {
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
  }

  options.tocElement.addEventListener('click', handleClick)
  options.sectionsElement.addEventListener('click', handleClick)
  window.addEventListener('scroll', handleScroll)

  const hash = window.location.hash
  if (hash === '') {
    handleScroll()
    return
  }
  updateActiveItems(hash.slice(1))
}

function resolveSectionId(contentElement: HTMLElement, id: string): string {
  const children = [...contentElement.children] as Array<HTMLElement>
  const index = children.findIndex(function (element: HTMLElement) {
    return element.getAttribute('id') === id
  })
  const sectionElement = children
    .slice(0, index + 1)
    .reverse()
    .find(function (element: HTMLElement) {
      return element.tagName === 'H1'
    }) as HTMLElement
  return sectionElement.getAttribute('id') as string
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
  id: string
  activeClassName: string
}) {
  const previousActiveElement = options.element.querySelector(
    `.${options.activeClassName}`
  )
  if (previousActiveElement !== null) {
    previousActiveElement.classList.remove(options.activeClassName)
  }
  const activeElement = options.element.querySelector(
    `[href="#${options.id}"]`
  ) as HTMLElement
  activeElement.classList.add(options.activeClassName)
}
