import { useState } from 'react'

const StatisticsLine = (props) => {
  //console.log("statistics line ", props)
    return(
    <table>
      <tbody>
        <tr>
          <td> {props.text} </td>
          <td>{props.value}</td>
        </tr>
      </tbody>
    </table>
    )
}

const Statistics = (props) => {
  const {goods, neutrals, bads} = props
  const all = goods + neutrals + bads
  const average = (goods-bads) / all
  const positive_average = (goods / all) * 100

  if(all===0){
    return(
      <p>No feedback given</p>
    )
  }
  else{
    return(
    <div>
      <StatisticsLine text={"good"} value={goods} />
      <StatisticsLine text={"neutral"} value={neutrals} />
      <StatisticsLine text={"bad"} value={bads} />
      <StatisticsLine text={"average"} value={average}/>
      <StatisticsLine text={"positive"} value={positive_average+"%"}/>
    </div>
    )
  }
}

const Button = (props) => {
  return(
    <>
    <button onClick={props.func} >
      {props.name}
    </button>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good+1)
  const increaseNeutral = () => setNeutral(neutral+1)
  const increaseBad = () => setBad(bad+1)

  return (
    <div>
      <h1> give feedback </h1>
      <Button func={increaseGood} name ={"good"} />
      <Button func={increaseNeutral} name ={"neutral"} />
      <Button func={increaseBad} name ={"bad"} />
      <h1> statistics </h1>
      <Statistics goods={good} neutrals={neutral} bads={bad} />
    </div>
  )
}

export default App