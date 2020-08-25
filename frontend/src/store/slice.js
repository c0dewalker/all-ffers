import { createSlice } from '@reduxjs/toolkit'
import initialState from './initialState'
import axios from 'axios'

const axiosQ = axios.create({ withCredentials: true })

const currencyRates = {
  '$': 72.94,
  '₴': 2.66
}

function figureOutCurrency(budgetString) {
  let currency = '₽'
  if (budgetString === 'Цена договорная')
    currency = ''
  else if (budgetString.includes('$'))
    currency = '$'
  else if (budgetString.includes('₴'))
    currency = '₴'
  else if (budgetString.includes('грн'))
    currency = '₴'
  else if (budgetString.includes('руб'))
    currency = '₽'
  return currency
}

function calculateAbsoluteBudget(budget, currency) {
  let budgetAbsolute
  if (currency === '₽')
    budgetAbsolute = budget
  else if (currency === '₴') {
    budgetAbsolute = Math.round(budget * currencyRates['₴'] / 100) * 100
  }
  else if (currency === '$') {
    budgetAbsolute = Math.round(budget * currencyRates['$'] / 100) * 100
  }
  return budgetAbsolute
}

export const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    loginAC: (state, action) => {
      const { firstName, lastName, _id, favourites, startedProjects, finishedProjects } = action.payload
      state.user.isAuth = true
      state.user.firstName = firstName
      state.user.lastName = lastName
      state.user._id = _id
      state.user.favourites = favourites
      state.user.startedProjects = startedProjects.map(project => { return { ...project, hasExpandedSize: false } })
      state.user.finishedProjects = finishedProjects.map(project => { return { ...project, hasExpandedSize: false } })
      state.offers = state.offers.map(offer => {
        if (favourites.includes(offer._id))
          return { ...offer, isFavourite: true }
        else return offer
      })
    },

    addOffers: (state, action) => {
      const tags = []
      state.offers = action.payload.map(offer => {
        offer.tags.forEach(tag => tags.push(tag))
        if (offer.hasProjectBudget === false && offer.hasHourlyRate === false)
          return { ...offer, isFavourite: false, hasExpandedSize: false }
        const currency = figureOutCurrency(offer.budget)
        if (offer.budget !== 'Цена договорная')
          var budgetNumber = Number(offer.budget.replace(/[^0-9]/g, ''))
        const budgetAbsolute = calculateAbsoluteBudget(budgetNumber, currency)
        return { ...offer, budget: budgetNumber, budgetAbsolute, currency, isFavourite: false, hasExpandedSize: false }
      })
      state.tags = [...new Set(tags)]
    },

    logoutAC: (state) => {
      state.user = {
        isAuth: false,
        _id: undefined,
        firstName: undefined,
        lastName: undefined,
        favourites: [],
        startedProjects: [],
        finishedProjects: []
      }
      state.offers = state.offers.map(offer => {
        return { ...offer, isFavourite: false }
      })
      state.view.profileActiveTab = 1
    },

    // Card sizes
    changeComponentSizeAC: (state, action) => {
      state.view.componentsSize = Number(action.payload)
    },


    expandCardAC: (state, action) => {
      state.offers = state.offers.map(offer => {
        if (offer._id === action.payload)
          return { ...offer, hasExpandedSize: true }
        else
          return { ...offer, hasExpandedSize: false }
      })
    },

    closeExpandedAC: (state) => {
      state.offers = state.offers.map(offer => {
        return { ...offer, hasExpandedSize: false }
      })
    },

    expandProjectCardAC: (state, action) => {
      state.user.startedProjects = state.user.startedProjects.map(offer => {
        if (offer._id === action.payload)
          return { ...offer, hasExpandedSize: true }
        else
          return { ...offer, hasExpandedSize: false }
      })
      state.user.finishedProjects = state.user.finishedProjects.map(offer => {
        if (offer._id === action.payload)
          return { ...offer, hasExpandedSize: true }
        else
          return { ...offer, hasExpandedSize: false }
      })
    },

    closeExpandedProjectCardAC: (state) => {
      state.user.startedProjects = state.user.startedProjects.map(project => {
        return { ...project, hasExpandedSize: false }
      })
      state.user.finishedProjects = state.user.finishedProjects.map(project => {
        return { ...project, hasExpandedSize: false }
      })
    },

    /// Filters
    toggleFilterBudgetAC: state => {
      state.view.filterBudget = !state.view.filterBudget;
    },

    toggleFilterFavouritesAC: state => {
      state.view.filterFavourites = !state.view.filterFavourites;
    },

    filterSearchHandlerAC: (state, action) => {
      state.view.filterSearch = action.payload;
    },

    filterTagsSearchHandlerAC: (state, action) => {
      state.view.filterTagsSearch = action.payload;
    },

    addTagAC: (state, action) => {
      if (!state.view.filterTags.includes(action.payload))
        state.view.filterTags.push(action.payload)
    },

    removeTagAC: (state, action) => {
      state.view.filterTags = state.view.filterTags.filter(tag => tag !== action.payload)
    },

    changeSortOptionAC: (state, action) => {
      state.view.sortOption = action.payload;
    },


    // Pagination
    setCurrentPageAC: (state, action) => {
      state.view.currentPage = action.payload
    },

    setNumberOfOffersAC: (state, action) => {
      state.view.numberOfOffers = action.payload
    },


    // Favourites
    toggleFavouriteAC: (state, action) => {
      state.offers = state.offers.map(offer => {
        if (offer._id === action.payload)
          return { ...offer, isFavourite: !offer.isFavourite }
        else return offer
      })

      if (state.user.favourites.includes(action.payload))
        state.user.favourites = state.user.favourites.filter(el => el !== action.payload)
      else
        state.user.favourites.push(action.payload)
    },

    addToStartedProjectsAC: (state, action) => {
      state.user.startedProjects.push({ ...action.payload, hasExpandedSize: false })
      state.view.profileActiveTab = 2
    },

    addToFinishedProjectsAC: (state, action) => {
      state.user.finishedProjects.push({ ...action.payload, hasExpandedSize: false })
      state.user.startedProjects = state.user.startedProjects.filter(project => project._id !== action.payload._id)
      state.view.profileActiveTab = 3
    },

    // Profle
    setActiveTabAC: (state, action) => {
      state.view.profileActiveTab = action.payload
    }
  },
})

export const {
  loginAC,
  logoutAC,
  addOffers,
  changeComponentSizeAC,
  expandCardAC,
  closeExpandedAC,
  expandProjectCardAC,
  closeExpandedProjectCardAC,
  toggleFilterBudgetAC,
  toggleFilterFavouritesAC,
  filterSearchHandlerAC,
  filterTagsSearchHandlerAC,
  addTagAC,
  removeTagAC,
  changeSortOptionAC,
  setCurrentPageAC,
  setNumberOfOffersAC,
  toggleFavouriteAC,
  addToStartedProjectsAC,
  addToFinishedProjectsAC,
  setActiveTabAC
} = slice.actions


export const fetchOffersThunk = () => async dispatch => {
  const ratesAPI = await axios('http://data.fixer.io/api/latest?access_key=9a1d7f920cf0ea42a9e6bc7a5fe03d06&symbols=USD,RUB,UAH')
  const { USD, RUB, UAH } = ratesAPI.data.rates
  currencyRates['$'] = Number(RUB) / Number(USD)
  currencyRates['₴'] = (Number(RUB) / Number(UAH)) / Number(USD)
  const response = await axiosQ('http://localhost:3003/offers')
  dispatch(addOffers(response.data.offers))
}

export const logoutThunk = () => async dispatch => {
  axiosQ.post('http://localhost:3003/logout')
  dispatch(logoutAC())
}

export const toggleFavouriteThunk = (payload) => () => {
  axiosQ.patch('http://localhost:3003/users/favourite', payload)
}

export const addToStartedProjectsThunk = (payload) => async dispatch => {
  const response = await axiosQ.post('http://localhost:3003/users/start', payload)
  dispatch(addToStartedProjectsAC(response.data))
  dispatch(toggleFavouriteAC(payload._id))
}

export const addToFinishedProjectsThunk = (payload) => async dispatch => {
  const response = await axiosQ.post('http://localhost:3003/users/finish', payload)
  dispatch(addToFinishedProjectsAC(response.data))
}

export default slice.reducer
