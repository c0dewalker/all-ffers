import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { filterSearchHandlerAC } from '../../../store/slice'

export default function SearchBlock() {


  const filterSearch = useSelector(state => state.slice.view.filterSearch)

  const dispatch = useDispatch()

  return (
    <input className="inpSearch" type="text" onChange={(e) => dispatch(filterSearchHandlerAC(e.target.value))} value={filterSearch} />
  )

}
