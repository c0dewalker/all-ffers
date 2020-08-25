import React from 'react';
import { useDispatch } from 'react-redux'
import { removeTagAC } from '../store/slice'

export default function TagX({ tag }) {
  const dispatch = useDispatch()
  const removeTag = () => {
    dispatch(removeTagAC(tag))
  }

  return (
    <span className="tag-x" >
      <span className='tag-title'>{tag}</span>
      <span className='tag-close-icon'
        onClick={removeTag}
      >x</span>
    </span>
  )
}
