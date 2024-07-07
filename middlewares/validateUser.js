const validateUser = (user)=>{
    const errors = []
    if(!user.firstName) 
        errors.push({field : 'firstName' , message : 'First Name is required'})
    if(!user.lastName) 
        errors.push({field : 'lastName' , message : 'Last Name is required'})
    if(!user.email) 
        errors.push({field : 'email' , message : 'Email is required'})
    if(!user.password) 
        errors.push({field : 'password' , message : 'Password is required'})

    return errors.length ? errors : null
}

module.exports = {
    validateUser
}