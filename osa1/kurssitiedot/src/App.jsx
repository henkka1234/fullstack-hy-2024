const Header = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
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
  return (
    <div>
      <Part part={props.part[0].name} exercise={props.part[0].exercises} />
      <Part part={props.part[1].name} exercise={props.part[1].exercises} />
      <Part part={props.part[2].name} exercise={props.part[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  console.log("total", props)
  let result = 0
  props.number.forEach(exercise => {
    result += exercise.exercises
  })
  return (
    <div>
      <p>Number of exercises {result} </p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course}/>
      <Content part = {course.parts} />
      <Total number={course.parts}/>
    </div>
  )
}

export default App