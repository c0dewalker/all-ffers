import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ProfileTab from './ProfileTab'
import { setActiveTabAC } from '../../../store/slice'

export default function ProfileTabBar() {
  const profileActiveTab = useSelector(state => state.slice.view.profileActiveTab)
  const [buttonOneActive, setButtonOneActive] = useState(profileActiveTab === 1)
  const [buttonTwoActive, setButtonTwoActive] = useState(profileActiveTab === 2)
  const [buttonThreeActive, setButtonThreeActive] = useState(profileActiveTab === 3)

  useEffect(() => {
    setButtonOneActive(profileActiveTab === 1)
    setButtonTwoActive(profileActiveTab === 2)
    setButtonThreeActive(profileActiveTab === 3)
  }, [profileActiveTab])

  const dispatch = useDispatch()

  const setActiveOne = () => {
    if (buttonOneActive !== true) {
      setButtonOneActive(true)
      setButtonTwoActive(false)
      setButtonThreeActive(false)
      dispatch(setActiveTabAC(1))
    }
  }
  const setActiveTwo = () => {
    if (buttonTwoActive !== true) {
      setButtonOneActive(false)
      setButtonTwoActive(true)
      setButtonThreeActive(false)
      dispatch(setActiveTabAC(2))
    }
  }

  const setActiveThree = () => {
    if (buttonThreeActive !== true) {
      setButtonOneActive(false)
      setButtonTwoActive(false)
      setButtonThreeActive(true)
      dispatch(setActiveTabAC(3))
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
