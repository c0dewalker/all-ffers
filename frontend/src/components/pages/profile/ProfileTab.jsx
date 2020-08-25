import React from 'react'
import classNames from 'classnames'

export default function ProfileTab({ tabActive, textContent, setActive }) {

  const classes = classNames('tab', { tabActive })

  return (
    <button onClick={setActive} className={classes}>{textContent}</button>
  )
}
