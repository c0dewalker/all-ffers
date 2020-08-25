import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFilterBudgetAC, toggleFilterFavouritesAC } from '../store/slice'

export default function FilterBlock() {

  const dispatch = useDispatch()
  const { filterBudget, filterFavourites } = useSelector(state => state.slice.view)
  const isAuth = useSelector(state => state.slice.user.isAuth)

  return (
    <>
      {isAuth &&
        <form className="filterItem">
          <input
            name="filterFavourites"
            type="checkbox"
            checked={filterFavourites}
            onChange={() => dispatch(toggleFilterFavouritesAC())} />
          <label>
            Избранные:
        </label>
          <br />
        </form>}

      <form className="filterItem">
        <input className="InputBudget"
          name="filterBudget"
          type="checkbox"
          checked={filterBudget}
          onChange={() => dispatch(toggleFilterBudgetAC())} />
        <label>
          С бюджетом
        </label>

        <br />
      </form>
    </>
  )
}

