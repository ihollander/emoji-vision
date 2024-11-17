import * as RadixDialog from "@radix-ui/react-dialog"
import { useState } from "react"

import { Button, Emoji } from "./Shared"

const Modal = ({ children, emoji, label, onClose }) => {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (open) => {
    if (!open && typeof onClose === "function") {
      onClose()
    }
    setOpen(open)
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
      <RadixDialog.Trigger asChild>
        <Button>
          <Emoji label={label} emoji={emoji} />
        </Button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black bg-opacity-80" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className="fixed inset-1/2 h-fit max-h-[calc(100vh-4rem)] w-[40rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded bg-white bg-opacity-80 p-4"
        >
          <RadixDialog.Title>
            <span className="sr-only">{label}</span>
          </RadixDialog.Title>
          <div className="mb-4 flex justify-end">
            <RadixDialog.Close asChild>
              <Button size="md">
                <Emoji emoji="🙅‍♀️" label="Close" />
              </Button>
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export default Modal
