import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeComponentSizeAC } from '../store/slice'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

export default function ViewOptionsBar() {
  const dispatch = useDispatch()
  const { componentsSize, numberOfOffers } = useSelector(state => state.slice.view)

  const changeComponentSize = (e) => {
    dispatch(changeComponentSizeAC(e.target.value))
  }

  return (
    <>
      <form className="formMainPage_SVER">
        <div className="radio"> Свернуть все
          <input
            type="radio"
            id="short"
            value="1"
            checked={componentsSize === 1}
            onChange={changeComponentSize}
          />
        </div>
        <div className="radio"> Развернуть все
          <input
            type="radio"
            id="normal"
            value="2"
            checked={componentsSize === 2}
            onChange={changeComponentSize}
          />
        </div>
      </form>
      {
        numberOfOffers === 0 ?
            <Loader
              type="ThreeDots"
              color="#88afdd"
              height={20}
              width={20}
            />
            : <span>Найдено <b className="boldText">{numberOfOffers}</b> заказов:</span>
      }
    </>
  )
}
