import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './css/App.css'
import './components/shared/Tag.css'
import './css/Modal.css'
import './css/Active.css'


import Header from './components/layout/Header/Header'
import Main from './components/Main/Main'
import Footer from './components/layout/Footer/Footer'
import FirstPage from './components/FirstPage/FirstPage'
import { fetchOffersThunk } from './store/slice'
import Profile from './components/Profile/Profile'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchOffersThunk())
  }, [])


  return (
    <Router>
      <Switch>

        <Route exact path="/">
          <div className="app_wrapper_firstPage">
            <div className="header"> <Header /> </div>
            <div className="firstPage"> <FirstPage /> </div>
            <div className="footer"> <Footer /> </div>
          </div>
        </Route>

        <Route exact path="/main">
          <div className="app_wrapper">
            <div className="header"> <Header /> </div>
            <div className="wrap_main">
              <div className="main"> <Main /> </div>
            </div>
            <div className="footer"> <Footer /> </div>
          </div>
        </Route>

        <Route exact path="/profile">
          <div className="app_wrapper">
            <div className="header"> <Header /> </div>
            <Profile />
            <div className="footer"> <Footer /> </div>
          </div>
        </Route>

      </Switch>
    </Router>
  )
}

export default App
