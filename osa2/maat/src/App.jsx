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

const DetailedInformation = (props) => {
  
  const [details, setDetails] = useState([])
  useEffect(() => {axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${props.country}`).then(response => {
    console.log("get details of country " + props.country)
    setDetails(response.data)
  })
  .catch(error=>{
    console.log("Error happened " + error)
  })},[])

  //This prevents crashing when details is still empty
  if(details.length !== 0){
    console.log("was not null")
  return(
    <div>
      {console.log("detailssit 2 " + details.languages)}
      <h1>{details.name.common}</h1>
      <p>capital {details.capital[0]}</p>
      <p>area {details.area}</p>
      <h3>languages:</h3>
      <img src={details.flags["png"]} alt="flag"></img>
    </div>
  )
  }
}

const callDetails = (countryParameter) => {
  console.log("call details for " + countryParameter)
  return(
    <div>
      <DetailedInformation country={countryParameter} />
    </div>
  )
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
        {props.results.map(country => <li key={country}>{country} <button onClick={() => callDetails(country)}>show</button> </li>)}
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

  const handleFilterChange = (event) => {
    setCountry(event.target.value)
    const filteredResults = allCountries.filter(countrySearch => countrySearch.toLowerCase().includes(event.target.value.toLowerCase()))
    console.log("handle filter change",event.target.value)
    console.log(filteredResults)
    setResultCountries(filteredResults)
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
      <ShowResults results={resultCountries} />
    </div>
  )
}

export default App
