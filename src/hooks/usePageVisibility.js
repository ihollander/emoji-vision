import { useState, useEffect } from "react"

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#Use_cases
let hidden, visibilityChange
if (typeof document.hidden !== undefined) {
  hidden = "hidden"
  visibilityChange = "visibilitychange"
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document[hidden])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document[hidden])
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    return () => {
      document.removeEventListener(visibilityChange, handleVisibilityChange, false);
    }
  }, [])

  return isVisible
}