import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutThunk } from '../../store/slice'
import LoginModal from '../pages/LoginModal'
import SignupModal from '../pages/SignupModal'

function Header() {
  const dispatch = useDispatch()
  const isAuth = useSelector(state => state.slice.user.isAuth)
  const firstName = useSelector(state => state.slice.user.firstName)

  const [loginModal, setLoginModal] = useState(false)
  const [signupModal, setSignupModal] = useState(false)

  const toggleLoginModal = () => setLoginModal(!loginModal)
  const toggleSignupModal = () => setSignupModal(!signupModal)

  return (
    <div className="headerBlock">
      <NavLink className="logo" to="/main">All-ffers</NavLink>
      <div className="wrap_login">
        {isAuth ?
          <>
            <NavLink className="login" to="/profile">{firstName}</NavLink>
            <span onClick={() => dispatch(logoutThunk())} className="login">Выйти</span>
          </>
          : <>
            <span className="login" onClick={toggleLoginModal}>Войти</span>
            <span className="registration" onClick={toggleSignupModal}>Зарегистрироваться</span>
          </>
        }
        {loginModal && <LoginModal isModal={loginModal} toggleModal={toggleLoginModal} />}
        {signupModal && <SignupModal isModal={signupModal} toggleModal={toggleSignupModal} />}
      </div>
    </div>
  )
}

export default Header
