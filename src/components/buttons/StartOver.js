import React from 'react'
import propTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isBrowser } from 'react-device-detect'
import styled from '@emotion/styled'
import { resetOrderType, resetCheckout } from '@open-tender/redux'
import { ButtonStyled, ButtonIcon } from '@open-tender/components'

import iconMap from '../iconMap'
import { selectBrand } from '../../slices'

const HeaderLogoButton = styled('button')`
  max-width: 14rem;
  margin: 0.4rem 0 0 1.2rem;
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin-left: 2.5rem;
  }

  img {
    pointer-events: none;
  }
`

const StartOver = ({
  text = 'Start Over',
  icon = iconMap.ArrowLeft,
  isLogo = false,
}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const brand = useSelector(selectBrand)
  const logoUrl = isBrowser ? brand.logo : brand.logoLight

  const startOver = () => {
    dispatch(resetOrderType())
    dispatch(resetCheckout())
    history.push(`/`)
  }

  return isBrowser ? (
    isLogo ? (
      <HeaderLogoButton onClick={startOver}>
        <img src={logoUrl} alt="logo" />
      </HeaderLogoButton>
    ) : (
      <ButtonStyled
        onClick={startOver}
        icon={icon}
        color="header"
        size="header"
      >
        {text}
      </ButtonStyled>
    )
  ) : (
    <ButtonIcon label={text} onClick={startOver}>
      {icon}
    </ButtonIcon>
  )
}

StartOver.displayName = 'StartOver'
StartOver.propTypes = {
  text: propTypes.string,
  classes: propTypes.string,
  icon: propTypes.element,
}

export default StartOver
