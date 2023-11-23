import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const ApiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADING',
  initial: 'INITIAL',
}

// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    activeOption: categoriesList[0].id,
    apiStatus: ApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeActiveOption = event => {
    this.setState({activeOption: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({apiStatus: ApiStatusConstants.inProgress})
    const {activeOption} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: ApiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: ApiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={() => this.getProjectsList()}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <div className="success-view-container">
        <ul className="projects-container">
          {projectsList.map(each => (
            <li key={each.id} className="each-project">
              <img
                src={each.imageUrl}
                alt={each.name}
                className="project-image"
              />
              <p className="project-name">{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case ApiStatusConstants.inProgress:
        return this.renderLoadingView()
      case ApiStatusConstants.success:
        return this.renderSuccessView()
      case ApiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state
    return (
      <div className="app-container">
        <div className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <select
          className="category-container"
          onChange={this.onChangeActiveOption}
          value={activeOption}
        >
          {categoriesList.map(each => (
            <option key={each.id} value={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        {this.renderView()}
      </div>
    )
  }
}

export default App
