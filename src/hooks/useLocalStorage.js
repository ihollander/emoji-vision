import { useEffect, useState } from "react"

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item)
      } else {
        localStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // do nothing if stringify fails
    }
  }, [key, value])

  return [value, setValue]
}
