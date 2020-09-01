import React from 'react'
import { useDispatch } from 'react-redux'
import { addTagAC } from '../../store/slice'

export default function Tag({ tag }) {
  const dispatch = useDispatch()
  const addTag = () => {
    dispatch(addTagAC(tag))
  }

  return (
    <span className="tag-2 tag-x" >
      <span onClick={addTag} className='tag-title'>{tag}</span>
    </span>
  )
}
