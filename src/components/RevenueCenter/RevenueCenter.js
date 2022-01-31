import React from 'react'
import propTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import { selectGroupOrder } from '@open-tender/redux'
import { stripTags } from '@open-tender/js'
import { BgImage, Box, Checkmark, Heading } from '@open-tender/components'

import iconMap from '../iconMap'
import RevenueCenterOrder from './RevenueCenterOrder'
import RevenueCenterAction from './RevenueCenterAction'
import { selectDisplaySettings } from '../../slices'
import { isMobileOnly } from 'react-device-detect'

const RevenueCenterView = styled(Box)`
  position: relative;
  overflow: hidden;
  width: 100%;
  // background-color: ${(props) =>
    props.isActive
      ? props.theme.bgColors.tertiary
      : props.theme.bgColors.secondary};
  box-shadow: ${(props) =>
    props.isActive ? '0 0 23px rgba(0, 0, 0, 0.35)' : 'none'};
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    ${(props) =>
      !props.isMenu
        ? `
    padding: 0;
    border-radius: 0;
    border: 0;
    margin: 0;
    background-color: transparent;
    box-shadow: none;`
        : `padding: 1.5rem;`}
  }
`

const RevenueCenterImage = styled(BgImage)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 24rem;
  background-color: ${(props) => props.theme.bgColors.secondary};

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    display: none;
  }
`

const RevenueCenterContent = styled('div')`
  padding: 0 ${(props) => (props.showImage ? `24rem` : null)} 0 0;

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    padding: 0;
  }

  > div {
    padding: 2rem 2.5rem 2.5rem;
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      padding: 0;
    }
  }
`

const RevenueCenterHeader = styled('div')`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin: 0 0 0rem -0.1rem;
    // height: 2rem;
    // align-items: flex-start;
  }

  & > * {
    display: block;
  }

  h2 {
    font-size: ${(props) => props.theme.fonts.sizes.h4};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.main};
    }
  }

  p {
    padding-top: 0.4rem;
    font-size: ${(props) => props.theme.fonts.sizes.xSmall};
  }
`

const RevenueCenterCheckmark = styled.div`
  margin: 0 0 0 1rem;
`

const RevenueCenterFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const RevenueCenterFlexContent = styled.div`
  flex: 1 1 auto;
`

const RevenueCenterImageMobile = styled(BgImage)`
  border-radius: ${(props) => props.theme.border.radiusSmall};
  flex: 0 0 15rem;
  width: 15rem;
  height: 10rem;
  margin: 0 0 0 1rem;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex: 0 0 9rem;
    width: 9rem;
    height: 6rem;
    margin: 0;
  }
`

const RevenueCenterActions = styled('div')`
  a,
  button {
    display: block;
    width: 100%;
    text-align: left;
  }
`

const RevenueCenterDesc = styled('div')`
  margin: 0.75rem 0 0;

  p {
    font-size: ${(props) => props.theme.fonts.sizes.small};
    line-height: ${(props) => props.theme.lineHeight};
    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: ${(props) => props.theme.fonts.sizes.xSmall};
    }
  }
`

export const RevenueCenterChild = ({ revenueCenter, style }) => {
  const { hours_desc, description } = revenueCenter
  const hoursDesc = hours_desc ? stripTags(hours_desc) : null
  const desc = description ? stripTags(description) : null
  return (
    <RevenueCenterView style={style}>
      <RevenueCenterContent>
        <div>
          <RevenueCenterHeader>
            <h2>{revenueCenter.name}</h2>
          </RevenueCenterHeader>
          <RevenueCenterActions>
            {desc && (
              <RevenueCenterDesc>
                <p>{desc}</p>
              </RevenueCenterDesc>
            )}
            {hoursDesc && (
              <RevenueCenterAction
                icon={iconMap['Clock']}
                text={hoursDesc}
                arrow={null}
              />
            )}
          </RevenueCenterActions>
        </div>
      </RevenueCenterContent>
    </RevenueCenterView>
  )
}

RevenueCenterChild.displayName = 'RevenueCenterChild'
RevenueCenterChild.propTypes = {
  revenueCenter: propTypes.object,
  style: propTypes.object,
}

const RevenueCenter = ({
  revenueCenter,
  showImage,
  isActive = false,
  isMenu,
  isLanding,
  style = null,
}) => {
  const { cartGuest } = useSelector(selectGroupOrder)
  const { storePhone = true } = useSelector(selectDisplaySettings)
  const { address, images, hours, is_outpost, description } = revenueCenter
  const smallImg = images.find((i) => i.type === 'SMALL_IMAGE')
  const largeImg = images.find((i) => i.type === 'SMALL_IMAGE')
  const bgImage = smallImg.url || largeImg.url
  const bgStyle = bgImage ? { backgroundImage: `url(${bgImage}` } : null
  const phoneUrl = address.phone ? `tel:${address.phone}` : null
  const desc = description ? stripTags(description) : null
  const hoursDesc = hours.description ? stripTags(hours.description) : null
  const hoursDescIcon = is_outpost ? iconMap.AlertCircle : iconMap.Clock
  const distance =
    revenueCenter.distance !== null && revenueCenter.distance !== undefined
      ? revenueCenter.distance
      : null

  return (
    <RevenueCenterView style={style} isMenu={isMenu} isActive={isActive}>
      {showImage && !isMobileOnly && (
        <RevenueCenterImage style={bgStyle}>&nbsp;</RevenueCenterImage>
      )}
      <RevenueCenterContent showImage={showImage && !isMobileOnly}>
        <div>
          <RevenueCenterFlex>
            <RevenueCenterFlexContent>
              <RevenueCenterHeader>
                <h2>{revenueCenter.name}</h2>
                {isActive && (
                  <RevenueCenterCheckmark>
                    <Checkmark />
                  </RevenueCenterCheckmark>
                )}
              </RevenueCenterHeader>

              <RevenueCenterActions>
                <a
                  href={revenueCenter.directions_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <RevenueCenterAction
                    icon={iconMap.MapPin}
                    text={
                      <span>
                        {address.street}{' '}
                        {distance !== null && (
                          <Heading>
                            &bull; {distance.toFixed(2)} miles away
                          </Heading>
                        )}
                      </span>
                    }
                  />
                </a>
                {storePhone && phoneUrl && !isMobileOnly && (
                  <a href={phoneUrl} rel="noopener noreferrer" target="_blank">
                    <RevenueCenterAction
                      icon={iconMap.Phone}
                      text={address.phone}
                    />
                  </a>
                )}
                {hoursDesc && (
                  <RevenueCenterAction
                    icon={hoursDescIcon}
                    text={hoursDesc}
                    arrow={null}
                  />
                )}
              </RevenueCenterActions>
            </RevenueCenterFlexContent>
            {showImage && isMobileOnly && (
              <RevenueCenterImageMobile style={bgStyle}>
                &nbsp;
              </RevenueCenterImageMobile>
            )}
          </RevenueCenterFlex>
          {desc && (
            <RevenueCenterDesc>
              <p>{desc}</p>
            </RevenueCenterDesc>
          )}
          {!cartGuest && (
            <RevenueCenterOrder
              revenueCenter={revenueCenter}
              isMenu={isMenu}
              isLanding={isLanding}
            />
          )}
        </div>
      </RevenueCenterContent>
    </RevenueCenterView>
  )
}

RevenueCenter.displayName = 'RevenueCenter'
RevenueCenter.propTypes = {
  revenueCenter: propTypes.object,
  showImage: propTypes.bool,
  isActive: propTypes.bool,
  isMenu: propTypes.bool,
  isLanding: propTypes.bool,
  style: propTypes.object,
}

export default RevenueCenter
