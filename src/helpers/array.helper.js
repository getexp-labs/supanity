// works only on primitives
export const areArraysEqual = (array1, array2) => {
  return array1.length === array2.length && array1.every(val => array2.includes(val))
}

// works only on primitives
export const diffArray = (array1, array2) => {
  return array1.filter(val => !array2.includes(val))
}
