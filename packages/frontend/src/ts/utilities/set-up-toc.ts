export function setUpToc(
  tocElement: Element,
  toggleButtonElement: Element,
  contentElement: Element,
  options: {
    breakpoint: number
    tocVisibleClassName: string
    tocItemActiveClassName: string
  }
): void {
  tocElement.addEventListener('click', function () {
    if (window.innerWidth < options.breakpoint) {
      document.body.classList.remove(options.tocVisibleClassName)
    }
  })
  const elements = [...contentElement.children]
  updateActiveTocItemOnScroll(elements, tocElement, toggleButtonElement, {
    tocItemActiveClassName: options.tocItemActiveClassName
  })
  if (window.innerWidth >= options.breakpoint) {
    document.body.classList.add(options.tocVisibleClassName)
  }
}

function updateActiveTocItemOnScroll(
  elements: Array<Element>,
  tocElement: Element,
  toggleButtonElement: Element,
  options: {
    tocItemActiveClassName: string
  }
) {
  const activeIndexes: { [key: string]: number } = {}
  let activeIndex = -1
  function onChange(id: string, previousId: null | string): void {
    if (previousId !== null) {
      const element = tocElement.querySelector(
        `[href="#${previousId}"]`
      ) as Element
      if (element !== null) {
        element.classList.remove(options.tocItemActiveClassName)
      }
    }
    const element = tocElement.querySelector(`[href="#${id}"]`)
    if (element !== null) {
      element.classList.add(options.tocItemActiveClassName)
    }
  }
  const callback: IntersectionObserverCallback = function (entries) {
    const changedIndexes: { [key: string]: boolean } = {}
    for (const entry of entries) {
      const element = entry.target
      const index = findIdElementIndex(elements, element)
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
      const previousId =
        activeIndex === -1
          ? null
          : (elements[activeIndex].getAttribute('id') as string)
      activeIndex = sortedIndexes[0]
      const id = elements[activeIndex].getAttribute('id') as string
      onChange(id, previousId)
    }
  }
  const toggleButtonElementHeight = (toggleButtonElement as HTMLElement)
    .offsetHeight
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: `-${toggleButtonElementHeight}px 0px 0px 0px`,
    threshold: 1
  })
  for (const heading of elements) {
    observer.observe(heading)
  }
}

// Find the index of the header element in `elements` with an `id` attribute
function findIdElementIndex(
  elements: Array<Element>,
  element: Element
): number {
  let index = elements.indexOf(element)
  while (index !== -1) {
    const id = elements[index].getAttribute('id')
    if (id !== null && id !== '') {
      break
    }
    index -= 1
  }
  return index
}
