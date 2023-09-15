import { useEffect, useRef, useState } from "react"
import SignUpForm from "../SignUpForm/SignUpForm"
import styles from './AuthModal.module.scss'
import LoginForm from "../LoginForm/LoginForm"

export default function AuthModal({ setUser, isAuthModalOpen, toggleAuthModal, handleCloseAuthModal }) {

  /* --- State --- */
  const modalRef = useRef()
  const [showSignUp, setShowSignUp] = useState(false)


  const toggleModalContents = () => {
    setShowSignUp(!showSignUp)
  }

  useEffect(() => {
    isAuthModalOpen ? modalRef.current.showModal() : modalRef.current.close()
  }, [isAuthModalOpen])

  return (
    <>
      <dialog className={styles.dialog} ref={modalRef} onClose={handleCloseAuthModal}>
        <button onClick={handleCloseAuthModal}>X</button>
        {showSignUp ?
          <>
            <SignUpForm setUser={setUser} handleCloseAuthModal={handleCloseAuthModal} />
            <p>Already a member? <strong onClick={toggleModalContents}>Login</strong></p>
          </> :
          <>
            <LoginForm setUser={setUser} handleCloseAuthModal={handleCloseAuthModal} />
            <p>Don't have an account? <strong onClick={toggleModalContents}>Sign Up</strong></p>
          </>
        }

      </dialog>
    </>
  )
}