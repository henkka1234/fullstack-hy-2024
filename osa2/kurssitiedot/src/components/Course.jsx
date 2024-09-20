const Header = (props) => {
    console.log("header ", props.course)
    return (
      <div>
        <h1>{props.course}</h1>
      </div>
    )
  }
  
const Part = (props) => {
console.log("part", props)
return (
    <div>
    <p>{props.part} {props.exercise}</p>
    </div>
)
}

const Content = (props) => {
console.log("content", props)

const show = props.part.map(prop =>
    <Part key={prop.name} part={prop.name} exercise={prop.exercises} />
    )

return (
    <div>
    {show}
    </div>
)
}

const Total = (props) => {
console.log("total", props.number)
const result = props.number.reduce( (sum, current) => {
    console.log("inside reduce sum", sum, " inside reduce current ", current.exercises)
    return sum+current.exercises
}, 0)

return (
    <div>
    <h3>Number of exercises {result} </h3>
    </div>
)
}

const Course = (props) => {
return(
<div>
    <Header course={props.kurssi}/>
    <Content part = {props.part} />
    <Total number={props.part}/>
</div>
)
}

export default Course