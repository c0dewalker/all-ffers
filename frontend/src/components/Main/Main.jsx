import React from 'react'
import Feed from './Feed/Feed'
import ViewOptionsBar from './ViewOptionsBar/ViewOptionsBar'
import SortBlock from './SortBlock/SortBlock'
import SearchBlock from './SearchBlock/SearchBlock'
import FilterBlock from './FilterBlock/FilterBlock'

function Main() {

  return (
    <>
      <div className="mainText"> Удаленная работа на фрилансе </div>
      <div className="mainTextSmall"> Все самые актуальные заказы </div>
      <div className="wrap_numAndSort">
        <div><ViewOptionsBar /></div>
        <div className="sort"><SortBlock /></div>
      </div>
      <div className="wrap_cardBlock_and_filterBlock">
        <div className="main_cardBlock"> <Feed /> </div>
        <div className="main_filterBlock">
          <div className="blockIN_main_filterBlock">
          <div className="blockIN_main_filterBlock_Search">
          <div className="blockIN_main_filterBlock_Search_Text">Поиск</div>
            <div className="search"> <SearchBlock /> </div>
          </div>
          <div className="blockIN_main_filterBlock_filter_Text">Фильтры</div>
            <div className="filter"><FilterBlock /></div>
            
          </div>
        </div>
      </div>
    </>
  )
}


export default Main

