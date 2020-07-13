import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import {
  selectCustomer,
  selectCartTotal,
  selectMenuSlug,
  selectOrder,
  resetOrder,
  selectAutoSelect,
  selectCheckout,
  resetErrors,
  resetTip,
  resetCompletedOrder,
  setConfirmationOrder,
} from '@open-tender/redux'
import { CheckoutForm } from '@open-tender/components'

import { selectConfig } from '../slices'
import Loader from './Loader'
import { cardIconMap } from '../assets/cardIcons'
import Background from './Background'
import PageTitle from './PageTitle'
import CheckoutHeader from './CheckoutHeader'
import { User } from 'react-feather'

const CheckoutPage = () => {
  const formRef = useRef()
  const history = useHistory()
  const dispatch = useDispatch()
  const { checkout: checkoutConfig } = useSelector(selectConfig)
  const cartTotal = useSelector(selectCartTotal)
  const menuSlug = useSelector(selectMenuSlug)
  const order = useSelector(selectOrder)
  const autoSelect = useSelector(selectAutoSelect)
  const customer = useSelector(selectCustomer)
  const checkout = useSelector(selectCheckout)
  const { check, completedOrder } = checkout
  const { serviceType, revenueCenter } = order
  const { revenue_center_id: revenueCenterId } = revenueCenter || {}
  const iconMap = {
    signUp: <User size={null} />,
  }

  useEffect(() => {
    window.scroll(0, 0)
    return () => {
      dispatch(resetErrors())
      dispatch(resetTip())
    }
  }, [dispatch])

  useEffect(() => {
    if (!revenueCenterId || !serviceType) {
      return history.push('/')
    } else if (cartTotal === 0) {
      return history.push(menuSlug)
    } else if (completedOrder) {
      dispatch(setConfirmationOrder(completedOrder))
      dispatch(resetCompletedOrder())
      dispatch(resetOrder())
      return history.push('/confirmation')
    }
  }, [
    history,
    dispatch,
    cartTotal,
    menuSlug,
    revenueCenterId,
    serviceType,
    completedOrder,
  ])

  return (
    <>
      {isBrowser && <Background imageUrl={checkoutConfig.background} />}
      <div className="content">
        <CheckoutHeader checkout={checkout} />
        <PageTitle {...checkoutConfig} />
        <div className="checkout">
          <div className="container">
            <div ref={formRef} className="checkout__form slide-up">
              {!check && (
                <Loader
                  text={'Retrieving your order...'}
                  className="loading--left"
                />
              )}
              <CheckoutForm
                dispatch={dispatch}
                history={history}
                iconMap={iconMap}
                cardIconMap={cardIconMap}
                config={checkoutConfig}
                checkout={checkout}
                order={order}
                customer={customer}
                autoSelect={autoSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

CheckoutPage.displayName = 'CheckoutPage'
export default CheckoutPage
