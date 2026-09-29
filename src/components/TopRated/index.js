import React from 'react'
import Loader from 'react-loader-spinner'

import NavBar from '../NavBar'
import './index.css'

const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'

class TopRated extends React.Component {
  state = {
    isLoading: true,
    apiStatus: 'INITIAL', // INITIAL, IN_PROGRESS, SUCCESS, FAILURE
    topRatedMoviesResponse: {},
  }

  componentDidMount() {
    this.getTopRatedMoviesResponse()
  }

  getUpdatedData = responseData => ({
    totalPages: responseData.total_pages,
    totalResults: responseData.total_results,
    results: responseData.results.map(eachMovie => ({
      id: eachMovie.id,
      posterPath: eachMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`
        : '', // fallback for missing poster
      voteAverage: eachMovie.vote_average,
      title: eachMovie.title,
    })),
  })

  getTopRatedMoviesResponse = async (page = 1) => {
    this.setState({isLoading: true, apiStatus: 'IN_PROGRESS'})
    const topRatedMoviesURL = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`

    try {
      const response = await fetch(topRatedMoviesURL)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      this.setState({
        topRatedMoviesResponse: this.getUpdatedData(data),
        isLoading: false,
        apiStatus: 'SUCCESS',
      })
    } catch (error) {
      console.error(error)
      this.setState({isLoading: false, apiStatus: 'FAILURE'})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#032541" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <p>Something went wrong. Please try again.</p>
      <button onClick={this.getTopRatedMoviesResponse}>Retry</button>
    </div>
  )

  renderTopRatedMoviesList = () => {
    const {topRatedMoviesResponse} = this.state
    const {results = []} = topRatedMoviesResponse

    return (
      <ul className="movie-list p-0 ms-0 me-0 mt-3">
        {results.map(movie => (
          <li key={movie.id} className="movie-item">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="movie-poster"
            />
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-rating">Rating: {movie.voteAverage}</p>
            <button className="view-details-btn">View Details</button>
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {isLoading, apiStatus} = this.state

    return (
      <>
        <NavBar />
        <div className="route-page-body">
          {isLoading && this.renderLoadingView()}
          {apiStatus === 'FAILURE' && this.renderFailureView()}
          {apiStatus === 'SUCCESS' && this.renderTopRatedMoviesList()}
        </div>
      </>
    )
  }
}

export default TopRated
