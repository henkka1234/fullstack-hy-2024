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

export default Notification