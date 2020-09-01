import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { expandCardAC, expandProjectCardAC } from '../../../../store/slice'
import FormStartProject from '../../FormStartProject/FormStartProject'
import FormFinishProject from '../../FormFinishProject/FormFinishProject'


export default function CardShort(props) {
  const dispatch = useDispatch()
  let { _id, title, budget, currency } = props.offer
  const [isModalStart, setIsModalStart] = useState(false)
  const [isModalFinish, setIsModalFinish] = useState(false)

  const activeTab = useSelector(state => state.slice.view.profileActiveTab)

  const expandCard = () => {
    if (activeTab === 1)
      dispatch(expandCardAC(_id))
    else
      dispatch(expandProjectCardAC(_id))
  }


  const toggleModalStart = () => {
    setIsModalStart(!isModalStart)
  }

  const toggleModalFinish = () => {
    setIsModalFinish(!isModalFinish)
  }

  return (
    <article className="card">
      <div className="wrap_cardMainText_shortCard">
        <div className="cardMainText_shortCard">{title}</div>
        <div className="priceCard_shortCard">{budget} {currency}</div>
        <div className="wrap_btn_cardShort">
          <button onClick={expandCard} className="btnOpenCard_cardShort_RAZV">развернуть</button>

          {(activeTab === 1) && <button onClick={toggleModalStart} className="btnOpenCard_cardShort_DOB">добавить в начатое</button>}
          {(activeTab === 2) && <button onClick={toggleModalFinish} className="btnOpenCard_cardShort_DOB">добавить в завершенное</button>}
        </div>
      </div>

      {isModalStart && <FormStartProject isModal={isModalStart} onCancel={toggleModalStart} offer={props.offer} />}
      {isModalFinish && <FormFinishProject isModal={isModalFinish} onCancel={toggleModalFinish} offer={props.offer} />}
    </article>
  )
}


