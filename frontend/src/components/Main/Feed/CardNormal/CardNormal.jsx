import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleFavouriteAC, expandCardAC, toggleFavouriteThunk } from '../../../../store/slice'
import heartWhite from '../../../../img/heart_white.png'
import heartBlack from '../../../../img/heart_black.png'
import Tag from '../../../shared/Tag'
import expandCardImg from '../../../../img/expand-button.png'

export default function CardNormal(props) {
  const dispatch = useDispatch()
  let { _id, title, description, budget, currency, publishedAt, tags, isFavourite } = props.offer
  const isAuth = useSelector(state => state.slice.user.isAuth)
  const userId = useSelector(state => state.slice.user._id)

  const shortDescription = description
    .split('')
    .splice(0, 130)
    .join('')
    .concat('...');

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
        <div className="wrap_cardPrice"> {/* wrap для бюджета в рублях */}
          <div className="budgetRu">  </div> {/* div для бюджета в рублях */}
          <div className="priceCard">{budget} {currency}</div>
        </div>
      </div>
      <div className="cardText">{shortDescription}</div>
      <div className="wrap_normalCardDateAndHeart">
        <div className="dateTime">{publishedAt}</div>
        <div className="wrapHeartAndTags">
          <div className="wrapTags">
            {tags.map((tag, index) => <Tag key={index} className="tag" tag={tag}></Tag>)}
          </div>
          <div className="wrap_openAndHeart">
            <button onClick={expandCard} className="btnOpenCard">
              <img className="open-card-img" src={expandCardImg} alt=""></img>
            </button>
            {
              isAuth && <button onClick={toggleFavourite} className="btnHeartCard">
                <img className="imgHeartCard" src={isFavourite ? heartBlack : heartWhite} alt="" />
              </button>
            }
          </div>
        </div>
      </div>
    </article>
  )
}
