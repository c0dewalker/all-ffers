import React, { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToStartedProjectsThunk } from '../../../store/slice'
import Tag from '../../Tag'

export default function FormStartProject(props) {
  const dispatch = useDispatch()
  let userId = useSelector(state => state.slice.user._id)
  let { title, description, budget, publishedAt, tags } = props.offer

  const [realBudget, setRealBudget] = useState(budget)
  const [comment, setComment] = useState('')

  const elRef = useRef(null)
  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      props.onCancel()
    }
  }, [props])

  useEffect(() => {
    const modalRoot = document.getElementById('modal')
    modalRoot.appendChild(elRef.current)
    document.addEventListener("keydown", escFunction, false)
    return () => {
      modalRoot.removeChild(elRef.current)
      document.removeEventListener("keydown", escFunction, false)
    }
  }, [escFunction])

  const budgetHandler = (e) => {
    setRealBudget(e.target.value)
  }

  const commentHandler = (e) => {
    setComment(e.target.value)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const newProject = {
      ...props.offer,
      user: userId,
      budget: realBudget,
      startedAt: new Date(),
      comment,
    }
    dispatch(addToStartedProjectsThunk(newProject))
    props.onCancel()
  }

  if (props.isModal)
    return createPortal(
      <div className="modal-overlay" >
        <div className="modal-window">
          <article className="startProject_card_extended">
            <form className="form_startProject" action="">
              <button className="startProject_closeBtn" onClick={props.onCancel}>X</button>
              
              <p className="startProject_MainText">{title}</p>
              <p className="startProject_Text">{description}</p>
              <p className="startProject_dateTime">{publishedAt}</p>
              <div className="wrap_redactBudget">
              <div className="startProject_lableRedactBudget">Изменить бюджет</div>
              <input className="startProject_inpBudget" onChange={budgetHandler} type="text" name="budget" value={realBudget} />
              </div>
              <div className="wrap_comments">
              <div className="startProject_lableComments">Добавить заметку</div>
              <textarea className="startProject_comments" onChange={commentHandler} name="comment" id="" cols="30" rows="10" value={comment}></textarea>
              </div>
              <div className="startProject_wrapTags">
                {tags.map((tag, index) => <Tag key={index} className="tag" tag={tag}></Tag>)}
              </div>
              <div className="wrap_btn_startProject">
              <button onClick={props.onCancel} className="btnCancel">Отменить</button>
              <button className="btn_formStartProj_DOB" onClick={submitHandler}>Добавить в начатое</button>
              {/* <a href={url} target="_blank"><button>Перейти к обьявлению</button></a> */}
              </div>
            </form>
          </article>
        </div>
      </div>,
      elRef.current
    )
  else return null
}


