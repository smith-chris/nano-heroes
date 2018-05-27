export const removeElement = <T>(data: T[], element: T) => {
  const index = data.indexOf(element)
  if (index > -1) {
    const result = [...data]
    result.splice(index, 1)
    return result
  }
  return data
}
