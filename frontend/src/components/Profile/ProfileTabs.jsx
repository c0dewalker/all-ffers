import React, { useState } from 'react'
import ProfileTab from './ProfileTab'


export default function ProfileTabBar() {
  const [buttonOneActive, setButtonOneActive] = useState(true)
  const [buttonTwoActive, setButtonTwoActive] = useState(false)
  const [buttonThreeActive, setButtonThreeActive] = useState(false)

  const setActiveOne = () => {
    if (buttonOneActive !== true) {
      setButtonOneActive(true)
      setButtonTwoActive(false)
      setButtonThreeActive(false)
    }
  }
  const setActiveTwo = () => {
    if (buttonTwoActive !== true) {
      setButtonOneActive(false)
      setButtonTwoActive(true)
      setButtonThreeActive(false)
    }
  }

  const setActiveThree = () => {
    if (buttonThreeActive !== true) {
      setButtonOneActive(false)
      setButtonTwoActive(false)
      setButtonThreeActive(true)
    }
  }


  return (
    <nav className="navTabBar">
      <ProfileTab tabActive={buttonOneActive} setActive={setActiveOne} textContent="Избранное" />
      <ProfileTab tabActive={buttonTwoActive} setActive={setActiveTwo} textContent="Начатое" />
      <ProfileTab tabActive={buttonThreeActive} setActive={setActiveThree} textContent="Законченное" />
    </nav>
  )
}
