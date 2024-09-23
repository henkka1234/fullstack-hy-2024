import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

const CountryFilter = (props) => {  
  return(
    <div>
      Find countries <input value={props.newFilterProp} onChange={props.handleFilterChangeFunc} />
    </div>
  )
}

const CurrentWeather = (props) => {
  //API KEY
  const api_key = import.meta.env.VITE_WEATHER_KEY
  
  const [currentweather, setWeather] = useState([])
  useEffect(() => {axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${props.lat}&lon=${props.lon}&units=metric&appid=${api_key}`).then(response => {
    console.log("get weather for lat " + props.lat + " and lon " + props.lon)
    setWeather(response.data)
  })
  .catch(error=>{
    console.log("Error happened " + error)
  })},[props])

  if(currentweather.length !== 0){
    return(
      <div>
        {console.log("weather ", currentweather.weather[0].icon)}
        <p>temperature {currentweather.main.temp} Celcius</p>
        <img src={`https://openweathermap.org/img/wn/${currentweather.weather[0].icon}@2x.png`}></img>
        <p>wind {currentweather.wind.speed} m/s</p>
      </div>
    )
  }
}

const DetailedInformation = (props) => {
  const [details, setDetails] = useState([])
  useEffect(() => {axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${props.country}`).then(response => {
    console.log("get details of country " + props.country)
    setDetails(response.data)
  })
  .catch(error=>{
    console.log("Error happened " + error)
  })},[props.country])

  //This prevents crashing when details is still empty
  if(details.length !== 0){
    console.log("was not null")
  return(
    <div>
      {console.log("detailssit 2 ", details.capitalInfo.latlng[0])}
      <h1>{details.name.common}</h1>
      <p>capital {details.capital[0]}</p>
      <p>area {details.area}</p>
      <h3>languages:</h3>
      <ul>
          {Object.values(details.languages).map((language) => {
            console.log("language " + language  )
            return <li key={language}>{language}</li>
          })}
        </ul>      
      <img src={details.flags["png"]} alt="flag"></img>
      <h2>Weather in {details.capital[0]}</h2>
      <CurrentWeather lat={details.capitalInfo.latlng[0]} lon={details.capitalInfo.latlng[1]} />
    </div>
  )
  }
}

const ShowResults = (props) => {
  if(props.results.length > 10)
    return(
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )

  if(props.results.length <10 && props.results.length > 1){
    return(
      <div>
        {props.results.map(country => <li key={country}>{country} <button onClick={() => props.onShowDetails(country)}>show</button> </li>)}
      </div>
    )
  }

  if(props.results.length === 1){
    console.log("testing "+ props.results[0])
    return(
    <div>
      <DetailedInformation country={props.results[0]} />
    </div>
    )
  }

  }

//Get all countries from https://studies.cs.helsinki.fi/restcountries/api/all
//When filter.len --> >10 --> Too many matches
//when filter.len <10 --> show filter result
//When filter.len === 1 --> autofill and get that country from api

function App() {
  const [country, setCountry] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [resultCountries, setResultCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleFilterChange = (event) => {
    setCountry(event.target.value)
    const filteredResults = allCountries.filter(countrySearch => countrySearch.toLowerCase().includes(event.target.value.toLowerCase()))
    console.log("handle filter change",event.target.value)
    console.log(filteredResults)
    setResultCountries(filteredResults)
    setSelectedCountry(null)
    if(filteredResults.length>10){
      console.log("Too many countries")
    }

    if(filteredResults.length===1 ){
      console.log("Only one possible country")
    }

    if(filteredResults.length<10 && filteredResults.length>1){
      console.log("Show filter results")
    }
  }

  const handleShowDetails = (country) => {
    setSelectedCountry(country)
  }

  useEffect(() => {
    console.log("Get ALL countries")
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response =>{
      console.log("All countries downloaded")
      const downloadedData = response.data.map(country => {
        return country.name.common
        })
        console.log(downloadedData)
        setAllCountries(downloadedData)
    })
  }, [])

  return (
    <div>
      <h3>Countries</h3>
      <CountryFilter newFilterProp={country} handleFilterChangeFunc={handleFilterChange} />
      <ShowResults results={resultCountries} onShowDetails={handleShowDetails}/>
      {selectedCountry && <DetailedInformation country={selectedCountry} />}
    </div>
  )
}

export default App
