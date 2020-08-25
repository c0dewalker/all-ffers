import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { filterTagsSearchHandlerAC } from '../store/slice'
import TagX from './TagX'

export default function TagsBlock() {

  const { filterTagsSearch, filterTags = [] } = useSelector(state => state.slice.view)
  const allTags = useSelector(state => state.tags)

  const dispatch = useDispatch()

  return (
    <>
      <div className="tags-container-2">
        {filterTags.map(tag => <TagX tag={tag} />)}
      </div>
      <input type="text" onChange={(e) => dispatch(filterTagsSearchHandlerAC(e.target.value))} value={filterTagsSearch} />
    </>
  )
}

const TagsInput = props => {
  const [tags, setTags] = React.useState(props.tags)
  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }
  const addTags = event => {
    if (event.target.value !== "") {
      setTags([...tags, event.target.value])
      props.selectedTags([...tags, event.target.value])
      event.target.value = ""
    }
  }

  return (
    <div className="tags-input">
      <ul id="tags">
        {tags.map((tag, index) => (
          <li key={index} className="tag">
            <span className='tag-title'>{tag}</span>
            <span className='tag-close-icon'
              onClick={() => removeTags(index)}
            >
              x
						</span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={event => event.key === "Enter" ? addTags(event) : null}
        placeholder="Press enter to add tags"
      />
    </div>
  )
}

