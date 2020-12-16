export function setUpMenu(options: {
  contentElement: Element
  menuActiveItemClassName: string
  menuElement: Element
}) {
  let stop = false

  function handleClick(event: Event) {
    const element = event.target as Element
    const href = element.getAttribute('href')
    if (href !== null) {
      const id = href.slice(1)
      setActiveToc({
        activeClassName: options.menuActiveItemClassName,
        id,
        menuElement: options.menuElement
      })
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
        setActiveToc({
          activeClassName: options.menuActiveItemClassName,
          id: elementOffsetTop.id,
          menuElement: options.menuElement
        })
        return
      }
    }
  }

  options.menuElement.addEventListener('click', handleClick)
  window.addEventListener('scroll', handleScroll)
  handleScroll()
}

function computeElementsOffsetTop(
  contentElement: Element
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

function setActiveToc(options: {
  menuElement: Element
  id: string
  activeClassName: string
}) {
  const previousActiveElements = options.menuElement.querySelectorAll(
    `.${options.activeClassName}`
  )
  for (const previousActiveElement of previousActiveElements) {
    previousActiveElement.classList.remove(options.activeClassName)
  }
  const activeElements = options.menuElement.querySelectorAll(
    `[href="#${options.id}"]`
  ) as NodeListOf<Element>
  for (const activeElement of activeElements) {
    activeElement.classList.add(options.activeClassName)
  }
}
