import React from 'react'
import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'

import './index.css'

const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'

class Upcoming extends React.Component {
  state = {
    isLoading: true,
    apiStatus: 'INITIAL',
    upcomingMovieResponse: {},
  }

  componentDidMount() {
    this.getUpcomingMoviesResponse()
  }

  getUpdatedData = responseData => ({
    totalPages: responseData.total_pages,
    totalResults: responseData.total_results,
    results: responseData.results.map(eachMovie => ({
      id: eachMovie.id,
      posterPath: eachMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`
        : '',
      voteAverage: eachMovie.vote_average,
      title: eachMovie.title,
    })),
  })

  getUpcomingMoviesResponse = async (page = 1) => {
    this.setState({isLoading: true, apiStatus: 'IN_PROGRESS'})
    const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`

    try {
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      this.setState({
        upcomingMovieResponse: this.getUpdatedData(data),
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
      <button onClick={this.getUpcomingMoviesResponse}>Retry</button>
    </div>
  )

  renderUpcomingMoviesList = () => {
    const {upcomingMovieResponse} = this.state
    const {results = []} = upcomingMovieResponse

    return (
      <ul className="movie-list p-0 ms-0 me-0 mt-3">
        {results.map(movie => (
          <MovieCard key={movie.id} movieDetails={movie} />
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
          {apiStatus === 'SUCCESS' && this.renderUpcomingMoviesList()}
        </div>
      </>
    )
  }
}

export default Upcoming