import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ProfileFeed from './ProfileFeed/ProfileFeed'
import ProfileTabBar from './ProfileTabBar/ProfileTabBar'
import ProfileStats from './ProfileStats/ProfileStats'

export default function Profile() {
  const isAuth = useSelector(state => state.slice.user.isAuth)
  const history = useHistory()

  if (!isAuth)
    history.push("/")

  const { profileActiveTab } = useSelector(state => state.slice.view)
  const { startedProjects, finishedProjects, favourites } = useSelector(state => state.slice.user)
  const offers = useSelector(state => state.slice.offers)
  const favouritesAsObjects = []

  favourites.forEach(fav => {
    const favOffer = offers.find(offer => offer._id == fav)
    favouritesAsObjects.push(favOffer)
  })

  let projectsToShow = []
  if (profileActiveTab === 1)
    projectsToShow = favouritesAsObjects
  else if ((profileActiveTab === 2))
    projectsToShow = startedProjects
  else
    projectsToShow = finishedProjects

  return (
    <div className="wrap_profile">
      <div className="prof_blockCards">
        <div className="blockCards_tabs">
          <ProfileTabBar />
        </div>
        <ProfileFeed projects={projectsToShow} />
      </div>

      <div className="prof_blockStat">
        <div className="blockStat_graf">
          <ProfileStats />
        </div>
      </div>
    </div>
  )
}
