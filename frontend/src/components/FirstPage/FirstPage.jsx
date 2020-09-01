import React from 'react'
import { Link } from 'react-router-dom'

function FirstPage() {
  return (
    <div className="mainFirstPage">
      <div className="firstPage_mainText"> Делай то, что хочешь </div>

      <div className="firstPage_mainTextSmall"> Самые актуальные заказы с бирж фриланса</div>
      <div className="firstPage_btn">
        <Link to="/main"><span>перейти к заказам</span></Link>
      </div>

    </div>

  )
}

export default FirstPage
