import classNames from "classnames"

import * as modalConsts from "../constants/modal"
import { Button, Emoji } from "./Shared"

const Modal = ({ show, setActiveModal, children }) => {
  const closeModal = (e) => {
    if (e.target.classList.contains("open")) {
      setActiveModal(modalConsts.NONE)
    }
  }

  return (
    <div
      onClick={closeModal}
      className={classNames(
        "absolute top-0 bottom-0 right-0 left-0 bg-black bg-opacity-80 flex justify-center pt-28",
        {
          invisible: !show,
        },
      )}
    >
      <div className="w-[40rem] h-fit p-5">
        <div className="p-3 rounded bg-white bg-opacity-80">
          <div className="flex justify-end mb-4">
            <Button size="md" onClick={() => setActiveModal(modalConsts.NONE)}>
              <Emoji emoji="🙅‍♀️" label="close" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
