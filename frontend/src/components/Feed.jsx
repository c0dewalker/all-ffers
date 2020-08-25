import React from 'react'
import Loader from 'react-loader-spinner'
import { useSelector, useDispatch } from 'react-redux'
import { setNumberOfOffersAC } from '../store/slice'
import CardShort from './CardShort'
import CardNormal from './CardNormal'
import CardExpanded from './CardExpanded'
import Pagination from './Pagination'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

function Feed() {
  const dispatch = useDispatch()
  const {
    componentsSize,
    filterSearch,
    filterFavourites,
    filterBudget,
    sortOption,
    currentPage,
    postsPerPage
  } = useSelector(state => state.slice.view)
  const isAuth = useSelector((state) => state.slice.user.isAuth)
  const offersAll = useSelector((state) => state.slice.offers)

  let offers = offersAll.slice()

  // filtering by favourites only
  if (isAuth && filterFavourites)
    offers = offers.filter(offer => offer.isFavourite === true)

  // filtering by search
  offers = offers.filter(offer =>
    offer.title.toLowerCase().includes(filterSearch.toLowerCase()) || offer.description.toLowerCase().includes(filterSearch.toLowerCase()))

  // filtering by budget
  if (filterBudget)
    offers = offers.filter(offer => (offer.hasProjectBudget) || (offer.hasHourlyRate))

  // filtering by tags
  // if (filterTags.length > 0)
  //   offers = offers.filter(offer => offer.tags.some(tag => filterTags.includes(tag)))

  // sorting by all criterias
  if (sortOption === 'hasProjectBudget') {
    offers = offers
      .filter(offer => offer.hasProjectBudget === true)
      .sort((a, b) => Number(b.budgetAbsolute) - Number(a.budgetAbsolute))
      .concat(offers.filter(offer => offer.hasProjectBudget === false))
  }
  else if (sortOption === 'hasHourlyRate') {
    offers = offers
      .filter(offer => offer.hasHourlyRate === true)
      .sort((a, b) => Number(b.budgetAbsolute) - Number(a.budgetAbsolute))
      .concat(offers.filter(offer => offer.hasHourlyRate === false))
  }
  else if (sortOption === 'publishedAtTS') {
    offers = offers.sort((a, b) => Number(b.publishedAtTS) - Number(a.publishedAtTS))
  }

  // slice by pagination 
  const indexOfLastOffer = currentPage * postsPerPage
  const indexOfFirstOffer = indexOfLastOffer - postsPerPage
  const paginatedOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer)

  dispatch(setNumberOfOffersAC(offers.length))

  if (paginatedOffers)
    return (
      <>
        {
          paginatedOffers.length > 0 ?
            <div>
              {
                paginatedOffers.map(offer => {
                  if (offer.hasExpandedSize === true)
                    return <CardExpanded key={offer._id} offer={offer} />
                  else if (componentsSize === 1)
                    return <CardShort key={offer._id} offer={offer} />
                  else
                    return <CardNormal key={offer._id} offer={offer} />
                })
              }
              <Pagination totalPosts={offers.length} />
            </div>

            : <div className="spinner">
              <Loader
                type="ThreeDots"
                color="#88afdd"
                height={70}
                width={70}
              />
            </div>
        }
      </>
    )
  else return null
}

export default Feed
