export function findParentElement(
  element: null | HTMLElement,
  callback: (element: HTMLElement) => boolean
): null | HTMLElement {
  while (element !== null) {
    if (callback(element) === true) {
      break
    }
    element = element.parentElement
  }
  return element
}
