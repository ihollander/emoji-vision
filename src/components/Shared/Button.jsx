import classNames from "classnames"

const Base = ({ className, as: Component, selected, size, ...rest }) => {
  return (
    <Component
      className={classNames(className, "rounded px-4 py-1", {
        "text-md": size === "xs",
        "text-xl": size === "sm",
        "text-3xl": size === "md",
        "text-4xl": size === "lg",
        "bg-white": !selected,
        "bg-black": selected,
      })}
      {...rest}
    />
  )
}

const Button = ({ size = "lg", selected, ...rest }) => {
  return <Base as="button" size={size} selected={selected} {...rest} />
}

const ButtonLink = ({ href, size = "lg", selected, ...rest }) => {
  return (
    <Base
      as="a"
      href={href}
      size={size}
      selected={selected}
      className="inline-block"
      {...rest}
    />
  )
}

export { Button, ButtonLink }
