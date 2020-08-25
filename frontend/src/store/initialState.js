const initialState = {
  user: {
    isAuth: false,
    _id: undefined,
    firstName: undefined,
    lastName: undefined,
    favourites: [],
    favouritesAsObjects: [],
    startedProjects: [],
    finishedProjects: []
  },
  view: {
    isLoading: false,
    componentsSize: 2,
    filterBudget: false,
    filterFavourites: false,
    filterSearch: '',
    filterTagsSearch: '',
    filterTags: [],
    sortOption: '',
    numberOfOffers: 0,
    currentPage: 1,
    postsPerPage: 10,
    profileCurrentPage: 1,
    profilePostsPerPage: 10,
    profileActiveTab: 1
  },
  offers: [],
  tags: []
}


export default initialState
