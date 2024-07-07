const renderUser = (req,res)=>{
    if(!user){
        res.status(404).json({
            message : 'User not found'
        })
    } else{
        res.json(user)
    }
}

module.exports = {
    renderUser
}