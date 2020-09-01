import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentPageAC } from '../../../store/slice'

export default function Pagination({ totalPosts }) {
  const { currentPage, postsPerPage } = useSelector(state => state.slice.view)
  const dispatch = useDispatch()
  const pagesNumbers = []
  const n = Math.ceil(totalPosts / postsPerPage)
  for (let i = 1; i <= n; i += 1)
    pagesNumbers.push(i)

  const setСurrentPage = (e) => {
    e.preventDefault()
    if (currentPage !== Number(e.target.innerText))
      dispatch(setCurrentPageAC(Number(e.target.innerText)))
  }

  const decreaseCurrentPage = () => {
    if (currentPage > 1)
      dispatch(setCurrentPageAC(currentPage - 1))
  }

  const increaseCurrentPage = () => {
    if (currentPage < n)
      dispatch(setCurrentPageAC(currentPage + 1))
  }

  return (
      <p>
        <button className="pagination__button" onClick={decreaseCurrentPage}>&lt;</button>
        {
          pagesNumbers.map(page => {
            let buttonStyle = 'pagination__button'
            if (page == currentPage)
              buttonStyle += ' pagination__button--current'
            if (n < 10)
              return <button className={buttonStyle} key={page} href="#!" onClick={setСurrentPage}>{page}</button>
            else if (n > 10 && (page === 1 || page === 2 ||  page === n - 1 ||page === n))
              return <button className={buttonStyle} key={page} href="#!" onClick={setСurrentPage}>{page}</button>
            else if (n > 10 && ((page === 3  && currentPage > 4) || (page === n - 2 && currentPage < n - 3)))
              return <button className={buttonStyle} key={page} href="#!">...</button>
            else if (n > 10 && ((currentPage - page > -3) && (currentPage - page < 3)))
              return <button className={buttonStyle} key={page} href="#!" onClick={setСurrentPage}>{page}</button>
            else return null
          })
        }
        <button className="pagination__button" onClick={increaseCurrentPage}>&gt;</button>
      </p>
  )
}
