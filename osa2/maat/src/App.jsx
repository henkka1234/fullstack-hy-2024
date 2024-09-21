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

//Get all countries from https://studies.cs.helsinki.fi/restcountries/api/all
//When filter.len --> >10 --> Too many matches
//when filter.len <10 --> show filter result
//When filter.len === 1 --> autofill and get that country from api

function App() {
  const [country, setCountry] = useState("")
  const [allCountries, setAllCountries] = useState([])

  const handleFilterChange = (event) => {
    console.log("handle filter change", event.target.value)
    setCountry(event.target.value)
  }

  useEffect(() => {
    console.log("Get ALL countries")
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
    .then(response =>{
      console.log("All countries downloaded")
      setAllCountries(response.data)
    })
  }, [])

  return (
    <div>
      <h3>Countries</h3>
      <CountryFilter newFilterProp={country} handleFilterChangeFunc={handleFilterChange} />
    </div>
  )
}

export default App
