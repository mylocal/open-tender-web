import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import { isBrowser } from 'react-device-detect'
import {
  selectOrderRating,
  fetchOrderRating,
  updateOrderRating,
  unsubscribeOrderRating,
  resetOrderRating,
  selectCustomer,
} from '@open-tender/redux'
import { Message, OrderRatingForm } from '@open-tender/components'

import { maybeRefreshVersion } from '../../../app/version'
import { selectBrand, selectConfig } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Container,
  Content,
  HeaderDefault,
  Loading,
  Main,
  PageTitle,
  PageContent,
  Background,
} from '../..'
import iconMap from '../../iconMap'

const makePageTitles = (orderRating, isSubmitted, unsubscribe, isCancelled) => {
  if (unsubscribe) {
    return {
      title: "You've been unsubscribed",
      subtitle: 'You will not receive future order rating emails.',
    }
  } else if (isSubmitted) {
    return {
      title: 'Thanks for rating your order!',
      subtitle:
        'You can update your rating from your Order History if you need to make any adjustments.',
    }
  } else if (orderRating && orderRating.order_id) {
    return {
      title: `Almost done!`,
      subtitle: `Please verify your rating and add any comments (optionally) for order #${orderRating.order_id}, and then click Submit.`,
    }
  } else if (isCancelled) {
    return {
      title: 'This order has been cancelled',
    }
  } else {
    return {
      title: "Sorry, but we couldn't find your order",
      subtitle: 'Please try clicking on the link in the email again',
    }
  }
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const Rating = () => {
  const dispatch = useDispatch()
  const query = useQuery()
  const queryRating = query.get('rating')
  const unsubscribe = query.get('unsubscribe')
  const [submitted, setSubmitted] = useState(false)
  const { id: ratingUuid } = useParams()
  const { title: siteTitle } = useSelector(selectBrand)
  const { account: accountConfig } = useSelector(selectConfig)
  const { orderRating, loading, error } = useSelector(selectOrderRating)
  const { auth } = useSelector(selectCustomer)
  const errMsg = error ? error || error.message : null
  const isCancelled = errMsg && errMsg.includes('cancelled')
  const title = orderRating
    ? `Rating Order #${orderRating.order_id}`
    : 'Rating Not Found'
  const { windowRef } = useContext(AppContext)
  const isSubmitted = submitted && !error && loading !== 'pending'
  const pageTitles = makePageTitles(
    orderRating,
    isSubmitted,
    unsubscribe,
    isCancelled
  )
  const adjustedRating =
    queryRating && !submitted
      ? { ...orderRating, rating: parseInt(queryRating) }
      : orderRating

  const updateRating = useCallback(
    (ratingUuid, data) => dispatch(updateOrderRating(ratingUuid, data)),
    [dispatch]
  )

  const callback = useCallback(() => setSubmitted(true), [setSubmitted])

  useEffect(() => {
    windowRef.current.scrollTop = 0
    maybeRefreshVersion()
  }, [windowRef])

  useEffect(() => {
    if (unsubscribe) {
      dispatch(unsubscribeOrderRating(ratingUuid))
    } else {
      dispatch(fetchOrderRating(ratingUuid))
    }
    return () => dispatch(resetOrderRating())
  }, [dispatch, ratingUuid, unsubscribe])

  return (
    <>
      <Helmet>
        <title>
          {title} | {siteTitle}
        </title>
      </Helmet>
      <Background imageUrl={accountConfig.background} />
      <Content maxWidth="76.8rem">
        <HeaderDefault title={isBrowser ? null : 'Curbside Pickup'} />
        <Main>
          <Container>
            <PageTitle {...pageTitles} />
            <PageContent>
              {loading === 'pending' ? (
                <Loading text="Retrieving order rating..." />
              ) : errMsg ? (
                <Message color="error" style={{ width: '100%' }}>
                  {errMsg}
                </Message>
              ) : submitted ? (
                <p>
                  {auth ? (
                    <Link to="/account">Head back to your account page</Link>
                  ) : (
                    <Link to="/">Head back to the home page</Link>
                  )}
                </p>
              ) : orderRating ? (
                <OrderRatingForm
                  orderId={ratingUuid}
                  orderRating={adjustedRating}
                  icon={iconMap.Star}
                  updateRating={updateRating}
                  callback={callback}
                />
              ) : null}
            </PageContent>
          </Container>
        </Main>
      </Content>
    </>
  )
}

Rating.displayName = 'Rating'
export default Rating
