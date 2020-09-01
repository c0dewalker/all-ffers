import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavouriteAC, toggleFavouriteThunk, closeExpandedAC } from '../../../../store/slice'
import heartWhite from '../../../../img/heart_white.png'
import heartBlack from '../../../../img/heart_black.png'
import expandCardImg from '../../../../img/close-button.png'
import Tag from '../../../shared/Tag'

export default function CardExpanded(props) {
  const dispatch = useDispatch()
  let { _id, title, description, budget, currency, publishedAt, tags, isFavourite, url } = props.offer
  const isAuth = useSelector(state => state.slice.user.isAuth)
  const userId = useSelector(state => state.slice.user._id)

  const toggleFauvourite = () => {
    dispatch(toggleFavouriteAC(_id))
    dispatch(toggleFavouriteThunk({ userId, offerId: _id }))
  }

  const closeExpanded = () => {
    dispatch(closeExpandedAC())
  }

  return (
    <article className="card_extended">
      <div className="wrap_cardMainText">
        <div className="cardMainText">{title}</div>
        <div className="priceCard">{budget} {currency}</div>
      </div>
      <div className="cardText">{description}</div>
      <div className="dateTime">{publishedAt}</div>
      <div className="wrapHeartAndTags">
        <div className="wrapTags">
          {tags.map((tag, index) => <Tag key={index} className="tag" tag={tag}></Tag>)}
        </div>

        <div className="wrap_openAndHeart_cardExpanded">
          <button onClick={closeExpanded} className="btnOpenCard">
              <img className="close-card-img" src={expandCardImg} alt=""></img>
          </button>
            <a href={url} target="_blank" rel="noopener noreferrer" ><button className="btnOpenCard_cardExpanded_DOB">Перейти к обьявлению</button></a>
          {
            isAuth && <button onClick={toggleFauvourite} className="btnHeartCard">
              <img className="imgHeartCard" src={isFavourite ? heartBlack : heartWhite} alt="favourite" />
            </button>
          }
        </div>

      </div>
    </article>
  )
}

