import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavouriteAC, expandCardAC, toggleFavouriteThunk } from '../../../../store/slice'
import Tag from '../../../shared/Tag'

export default function CardNormalP(props) {
  const dispatch = useDispatch()
  let { _id, title, description, budget, publishedAt, tags } = props.offer
  const userId = useSelector(state => state.slice.user._id)
  const [isModal, setIsModal] = useState(false)

  const shortDescription = description
    .split('')
    .splice(0, 130)
    .join('')
    .concat('...')

  const expandCard = () => {
    dispatch(expandCardAC(_id))
  }

  return (
    <article className="card">
      <div className="wrap_cardMainText">
        <div className="cardMainText">{title}</div>
        <div className="priceCard">{budget}</div>
      </div>
      <div className="cardText">{shortDescription}</div>
      <div className="dateTime">{publishedAt}</div>
      <div className="wrapHeartAndTags">
        <div className="wrapTags">
          {tags.map((tag, index) => <Tag key={index} className="tag" tag={tag}></Tag>)}

        </div>
        <div className="wrap_openAndHeart">
          <button onClick={expandCard} className="btnOpenCard">развернуть</button>
        </div>
      </div>
    </article>
  )
}