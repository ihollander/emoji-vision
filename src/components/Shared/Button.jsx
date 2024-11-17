import classNames from "classnames"
import { forwardRef } from "react"

function buttonClasses({ size, selected }) {
  return classNames(
    "rounded px-4 py-1 shadow-md outline-2 hover:shadow-lg focus:outline",
    {
      "text-sm lg:text-md": size === "sm",
      "text-md lg:text-xl": size === "md",
      "text-lg lg:text-3xl": size === "lg",
      "text-xl lg:text-4xl": size === "xl",
      "bg-white": !selected,
      "bg-black": selected,
    },
  )
}

const Button = forwardRef(function Button(
  { size = "xl", selected, ...rest },
  ref,
) {
  return (
    <button ref={ref} className={buttonClasses({ size, selected })} {...rest} />
  )
})

const ButtonLink = forwardRef(function ButtonLink(
  { href, size = "xl", selected, ...rest },
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
