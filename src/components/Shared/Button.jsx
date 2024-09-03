import classNames from "classnames"
import { forwardRef } from "react"

function buttonClasses({ size, selected }) {
  return classNames(
    "rounded px-4 py-1 shadow-md outline-2 hover:shadow-lg focus:outline",
    {
      "text-md": size === "xs",
      "text-xl": size === "sm",
      "text-3xl": size === "md",
      "text-4xl": size === "lg",
      "bg-white": !selected,
      "bg-black": selected,
    },
  )
}

const Button = forwardRef(function Button(
  { size = "lg", selected, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={buttonClasses({ size, selected })} {...rest} />
  )
})

const ButtonLink = forwardRef(function ButtonLink(
  { href, size = "lg", selected, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      className={classNames("inline-block", buttonClasses({ size, selected }))}
      {...rest}
    />
  )
})

export { Button, ButtonLink }
