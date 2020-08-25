import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CardShortP from './CardShortP'
import CardExpandedP from './CardExpandedP'
import Pagination from '../../Pagination'
import { setNumberOfOffersAC } from '../../../store/slice'

export default function ProfileFeed({ projects }) {
  const dispatch = useDispatch()
  const { profileCurrentPage, profilePostsPerPage } = useSelector(state => state.slice.view)

  const indexOfLastOffer = profileCurrentPage * profilePostsPerPage
  const indexOfFirstOffer = indexOfLastOffer - profilePostsPerPage
  const paginatedProjects = projects.slice(indexOfFirstOffer, indexOfLastOffer)

  dispatch(setNumberOfOffersAC(projects.length))

  if (paginatedProjects)
    return (
      <>
        {
          paginatedProjects.length > 0 && paginatedProjects.map(project => {
            if (project.hasExpandedSize === true)
              return <CardExpandedP key={project._id} offer={project} />
            else
              return <CardShortP key={project._id} offer={project} />
          })
        }
        {projects.length > profilePostsPerPage && <Pagination totalPosts={projects.length} />}
      </>
    )
  else return null
}
