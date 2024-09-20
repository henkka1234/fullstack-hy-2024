import { useState, useEffect } from 'react'
import './index.css'
import personService from './services/persons'

const Filter = (props) => {  
  return(
    <div>
      filter shown with a <input value={props.newFilterProp} onChange={props.handleFilterChangeFunc} />
    </div>
  )
}

const PersonForm = (props) => {
  
  return(
    <form onSubmit={props.addContactFunc}>
      <div>
        name: <input value={props.newNameProp} onChange={props.handleContactChangeFunc}  />
      </div>
      <div>
        number: <input value={props.newNumberProp} onChange={props.handleNumberChangeFunc}  />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Contact = ({contact, deleteFunction}) => {
  return(
    <li key={contact.id}> {contact.name} {contact.number} <button onClick={() => deleteFunction(contact.id)}>delete</button> </li>
  )
}

const Notification = ({type, msg }) => {
  if (msg === null || type === null) {
    return null
  }

  if(type === "error"){
    return (
      <div className="error">
        {msg}
      </div>
    )
  }
  if(type === "success"){
    return (
      <div className="success">
        {msg}
      </div>
    )    
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [msgType, setType] = useState(null)

  const addContact = (event) => {
    event.preventDefault()
    const contactObject = {
      name: newName,
      number: newNumber
    }

    if(persons.some(person => person.name === newName)){
      const duplicatePerson = persons.find((person) => person.name === newName)
      const changedPerson = {...duplicatePerson, number: newNumber}
      if(confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        personService.update(duplicatePerson.id, changedPerson)
        .then(responsePerson => {
          console.log(responsePerson)
          setPersons(persons.map(person => person.id !== duplicatePerson.id ? person : responsePerson.data))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log("Tried to update deleted contact!!!")
          setType("error")
          setMessage("Information of " + duplicatePerson.name + " has already been deleted from server")
        })
      }
    }

    else{

    personService.create(contactObject)
          .then(responsePerson => {
            console.log(responsePerson)
            setPersons(persons.concat(responsePerson))
            setType("success")
            setMessage("Added " + newName)
            setNewName('')
            setNewNumber('')
          })
    }
  }

  const handleContactChange = (event) => {
    console.log("handle new contact ", event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log("handle new number ", event.target.value)
    setNewNumber(event.target.value)
  } 
  //Filter variable stores filter and it is passed to contact module 
  const handleFilterChange = (event) => {
    console.log("handle filter change", event.target.value)
    setNewFilter(event.target.value)
  }

  const deletePerson = (id) => {
    console.log("delete person " + id)
    if(confirm("Delete " + persons.find((person) => person.id===id).name + "?")){
      personService.delObj(id)
      const newarr = persons.filter(person => person.id !== id)
      setPersons(newarr)
    }
    else{
      console.log("not deleted because confirmation rejected")
    }
  }

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      console.log("persons fetched")
      setPersons(initialPersons)
    })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={msgType} msg={message} />
      <Filter newFilterProp={newFilter} handleFilterChangeFunc={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addContactFunc={addContact} newNameProp={newName} newNumberProp={newNumber}
        handleContactChangeFunc={handleContactChange} handleNumberChangeFunc={handleNumberChange}/>
      <h2>Numbers</h2>
        {persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase())).map(person => 
        <Contact key={person.id} contact={person} deleteFunction={() => deletePerson(person.id)} />)}
    </div>
  )

}

export default App