const mysql = require('../mysql');


const isExist = (user_name) => {
  return new Promise((resolve, reject) => {
    mysql('user').select('*').where({user_name})
    .then((result)=>{
      if (result.length){
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

const getUserList = (req, res) => {
  mysql('user').select('*')
  .then((result)=>{
    res.send(result)
  }).catch((err) => {
    console.error(err)
  })
}


const addUser = (req, res) => {
  let user_name = req.body.user_name

  isExist(user_name).then(exist => {
    if (!exist){
      mysql('user').insert({user_name})
      .then((result)=>{
        res.send('ok')
      }).catch((err) => {
        console.error(err)
      })
    } else {
      res.send('existed')
    }
  }) 
}

const putUser = (req, res) => {
  let user_id = req.body.user_id
  let user_name = req.body.user_name

  isExist(user_name).then(exist => {
    if (!exist){
      mysql('user').where({user_id}).update({user_name})
      .then((result)=>{
        res.send('ok')
      }).catch((err) => {
        console.error(err)
      })
    } else {
      res.send('existed')
    }
  }) 
}

const deleteUser = (req, res) => {
  mysql('user')
  .where({'user_id':req.body.user_id})
  .del()
  .then((result)=>{
    res.send('ok')
  })
}

module.exports = {
  getUserList, addUser, putUser, deleteUser
}