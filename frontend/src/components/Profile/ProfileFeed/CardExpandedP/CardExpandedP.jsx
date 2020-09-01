import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { closeExpandedAC, closeExpandedProjectCardAC } from '../../../../store/slice'
import Tag from '../../../shared/Tag'
import FormStartProject from '../../FormStartProject/FormStartProject'
import FormFinishProject from '../../FormFinishProject/FormFinishProject'

export default function CardExpanded(props) {
  const dispatch = useDispatch()
  let { title, description, budget, currency, publishedAt, tags, url } = props.offer
  const activeTab = useSelector(state => state.slice.view.profileActiveTab)
  const [isModalStart, setIsModalStart] = useState(false)
  const [isModalFinish, setIsModalFinish] = useState(false)

  const closeExpanded = () => {
    if (activeTab === 1)
      dispatch(closeExpandedAC())
    else
      dispatch(closeExpandedProjectCardAC())
  }

  const toggleModalStart = () => {
    setIsModalStart(!isModalStart)
  }

  const toggleModalFinish = () => {
    setIsModalFinish(!isModalFinish)
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
          <button onClick={closeExpanded} className="btnOpenCard">свернуть</button>

          {(activeTab === 1) && <button onClick={toggleModalStart} className="btnOpenCard_cardExpanded_DOB">добавить в начатое</button>}
          {(activeTab === 2) && <button onClick={toggleModalFinish} className="btnOpenCard_cardExpanded_DOB">добавить в завершенное</button>}

          <a href={url} target="_blank" rel="noopener noreferrer" ><button className="btnOpenCard_cardExpanded_DOB">Перейти к обьявлению</button></a>

          {/* {
            isAuth && <button onClick={toggleFauvourite} className="btnHeartCard">
              <img className="imgHeartCard" src={isFavourite ? heartBlack : heartWhite} alt="favourite" />
            </button>
          } */}
        </div>

        {isModalStart && <FormStartProject isModal={isModalStart} onCancel={toggleModalStart} offer={props.offer} />}
        {isModalFinish && <FormFinishProject isModal={isModalFinish} onCancel={toggleModalFinish} offer={props.offer} />}
      </div>
    </article>
  )
}

