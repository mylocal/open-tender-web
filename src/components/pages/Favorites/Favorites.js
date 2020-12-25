import React, { useState, useEffect, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Helmet } from 'react-helmet'
import {
  selectCustomerFavorites,
  fetchCustomerFavorites,
  selectCustomer,
} from '@open-tender/redux'
import { makeDisplayItem } from '@open-tender/js'

import { selectAccountConfig, selectBrand } from '../../../slices'
import { AppContext } from '../../../App'
import {
  Container,
  Content,
  ItemCards,
  Loading,
  Main,
  PageTitle,
  PageContent,
  HeaderAccount,
} from '../..'

const Favorites = () => {
  const sectionRef = useRef()
  const dispatch = useDispatch()
  const history = useHistory()
  const { entities, loading, error } = useSelector(selectCustomerFavorites)
  const [favorites, setFavorites] = useState(entities)
  const { title: siteTitle } = useSelector(selectBrand)
  const config = useSelector(selectAccountConfig)
  const { auth } = useSelector(selectCustomer)
  const isLoading = loading === 'pending'
  const items = favorites.map((i) => ({ ...i.item, id: i.favorite_id }))
  const { windowRef } = useContext(AppContext)

  useEffect(() => {
    windowRef.current.scroll(0, 0)
  }, [windowRef])

  useEffect(() => {
    if (!auth) return history.push('/')
  }, [auth, history])

  useEffect(() => {
    if (error) window.scrollTo(0, sectionRef.current.offsetTop)
  }, [error])

  useEffect(() => {
    dispatch(fetchCustomerFavorites())
  }, [dispatch])

  useEffect(() => {
    const items = entities.map((i) => ({ ...i, item: makeDisplayItem(i.item) }))
    setFavorites(items)
  }, [entities])

  return auth ? (
    <>
      <Helmet>
        <title>Order History | {siteTitle}</title>
      </Helmet>
      <Content>
        <HeaderAccount title="Favorites" />
        <Main bgColor="secondary">
          <Container>
            <PageTitle {...config.favorites} />
            <PageContent>
              {items.length ? (
                <ItemCards items={items} delay={0.25} />
              ) : isLoading ? (
                <Loading text="Retrieving your order history..." />
              ) : error ? (
                <p>{error}</p>
              ) : (
                <p>
                  Looks like you don't have any favorites yet. Visit your past
                  orders to add some.
                </p>
              )}
            </PageContent>
          </Container>
        </Main>
      </Content>
    </>
  ) : null
}

Favorites.displayName = 'Favorites'
export default Favorites
