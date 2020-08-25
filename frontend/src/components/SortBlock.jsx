import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeSortOptionAC } from '../store/slice'

export default function SortBlock() {

  const dispatch = useDispatch()
  const sortOption = useSelector(state => state.slice.view.sortOption)

  const handleChange = (event) => {
    dispatch(changeSortOptionAC(event.target.value))
  }

  return (
    <form>
      <label>
        Отсортировать по:
        <select value={sortOption} onChange={handleChange}>
          <option value="">-</option>
          <option value="hasProjectBudget">бюджету проекта</option>
          <option value="hasHourlyRate">часовой оплате</option>
          <option value="createdAt">актуальности</option>
        </select>
      </label>
    </form>
  )
}

