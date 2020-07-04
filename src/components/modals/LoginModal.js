import React, { useState, useRef, useEffect } from 'react'
import propTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import {
  loginCustomer,
  selectCustomer,
  selectResetPassword,
  sendPasswordResetEmail,
  resetPasswordReset,
} from 'open-tender-redux'
import { Input, Button } from 'open-tender'

import { closeModal } from '../../slices'
import ModalClose from '../ModalClose'

const messaging = {
  login: {
    title: 'Log into your account',
    subtitle: 'Please enter your email address and password',
    reset: 'Forget your password?',
  },
  reset: {
    title: 'Reset your password',
    subtitle: 'Please enter the email address associated with your account',
    reset: 'Nevermind, I remembered it',
  },
  resetSent: {
    title: 'Password reset email sent',
    subtitle:
      'A reset password email was just sent to the email address you provided. Please check your inbox and click on the link in the email in order to reset your password.',
    reset: 'Back to login form',
  },
}

const LoginModal = ({ callback }) => {
  const [data, setData] = useState({})
  const [isReset, setIsReset] = useState(false)
  const submitButton = useRef()
  const dispatch = useDispatch()
  const customer = useSelector(selectCustomer)
  const { loading, error, profile } = customer
  const { resetSent } = useSelector(selectResetPassword)
  const mode = resetSent ? 'resetSent' : isReset ? 'reset' : 'login'
  const msg = messaging[mode]
  const isLoading = loading === 'pending'

  // useEffect(() => {
  //   return () => dispatch(resetResetSent)
  // }, [dispatch])

  useEffect(() => {
    if (profile) dispatch(closeModal())
    return () => dispatch(resetPasswordReset())
  }, [profile, dispatch])

  const handleClose = () => {
    dispatch(closeModal())
  }

  const handleChange = (evt) => {
    const { id, value } = evt.target
    setData({ ...data, [id]: value })
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (isReset) {
      const link_url = `${window.location.origin}/reset-password`
      dispatch(sendPasswordResetEmail(data.email, link_url))
    } else {
      const { email, password } = data
      dispatch(loginCustomer(email, password)).then(() => {
        if (callback) callback()
      })
    }
    submitButton.current.blur()
  }

  const toggleReset = (evt) => {
    evt.preventDefault()
    setIsReset(!isReset)
    evt.target.blur()
  }

  const toggleResetSent = (evt) => {
    evt.preventDefault()
    setIsReset(false)
    dispatch(resetPasswordReset())
    evt.target.blur()
  }

  return (
    <>
      <ModalClose classes="btn-link" onClick={handleClose} />
      <div className="modal__content">
        <div className="modal__header">
          <p className="modal__title heading ot-font-size-h3">{msg.title}</p>
          <p className="modal__subtitle">{msg.subtitle}</p>
        </div>
        <div className="modal__body">
          {resetSent ? (
            <Button classes="btn" onClick={handleClose} text="Close" />
          ) : (
            <form
              id="login-form"
              className="form"
              onSubmit={handleSubmit}
              noValidate
            >
              {error && (
                <div className="form__error form__error--top form-error">
                  {error}
                </div>
              )}
              <div className="form__inputs">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  required={true}
                  classes="form__input"
                />
                {!isReset && (
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={data.password}
                    onChange={handleChange}
                    required={true}
                    classes="form__input"
                  />
                )}
              </div>
              <div className="form__submit">
                <input
                  className="btn"
                  type="submit"
                  value={isLoading ? 'Submitting' : 'Submit'}
                  disabled={isLoading}
                  ref={submitButton}
                />
              </div>
            </form>
          )}
        </div>
        <div className="modal__footer font-size-small">
          <Button
            classes="btn-link"
            onClick={resetSent ? toggleResetSent : toggleReset}
            text={msg.reset}
          />
        </div>
      </div>
    </>
  )
}

LoginModal.displayName = 'LoginModal'
LoginModal.propTypes = {
  callback: propTypes.func,
}

export default LoginModal
