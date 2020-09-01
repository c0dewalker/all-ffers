import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavouriteAC, toggleFavouriteThunk, expandCardAC } from '../../../../store/slice'
import heartWhite from '../../../../img/heart_white.png'
import heartBlack from '../../../../img/heart_black.png'
import expandCardImg from '../../../../img/expand-button.png'

export default function CardShort(props) {
  const dispatch = useDispatch()
  let { _id, title, budget, currency, isFavourite } = props.offer
  const isAuth = useSelector(state => state.slice.user.isAuth)
  const userId = useSelector(state => state.slice.user._id)

  const toggleFavourite = () => {
    dispatch(toggleFavouriteAC(_id))
    dispatch(toggleFavouriteThunk({ userId, offerId: _id }))
  }

  const expandCard = () => {
    dispatch(expandCardAC(_id))
  }

  return (
    <article className="card">
      <div className="wrap_cardMainText">
        <div className="cardMainText">{title}</div>
        <div className="priceCard">{budget} {currency}</div>
      </div>
      <div className="wrap_openAndHeart_cardShort">
        <button onClick={expandCard} className="btnOpenCard">
          <img className="open-card-img" src={expandCardImg} alt=""></img>
        </button>
        {isAuth && <button onClick={toggleFavourite} className="btnHeartCard"><img className="imgHeartCard" src={isFavourite ? heartBlack : heartWhite} alt="favourite" /></button>}
      </div>
    </article>
  )
}


