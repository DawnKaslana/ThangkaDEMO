const mysql = require('../mysql');

const isExist = (value, user_id, class_id) => {
    return new Promise((resolve, reject) => {
      mysql('label').select('*')
      .where({value, user_id, class:class_id})
      .orWhere({value, user_id:0, class:class_id})
      .then((result)=>{
        console.log(result)
        resolve(result.length? true:false)
      }).catch((err) => {
        console.error(err)
      })
    })
  }


const getLabelList = (req, res) => {
  let user_id = req.query.user_id

  mysql('label').select('*').whereIn('user_id', [0, user_id])
  .then((result)=>{
    result.sort(function (a,b){
      if (a.value < b.value) {
        return -1
      }
      if (a.value > b.value) {
        return 1
      }
      return 0
    })
    res.send(result)
  }).catch((err) => {
    console.error(err)
  })
}

const addLabel = (req, res) => {
  let value = req.body.value
  let user_id = req.body.user_id
  let class_id = req.body.class_id

  console.log(req.body)

  isExist(value, user_id, class_id).then(exist => {
    if (!exist){
      mysql('label').insert({user_id, value, class:class_id})
      .then((result)=>{
        res.send('ok')
      }).catch((err) => {
        console.error(err)
      })
    } else {
      res.send('existed')
    }
  }).catch((err) => {
    console.error(err)
  })
}

const putLabel = (req, res) => {
  let id = req.body.id
  let value = req.body.value
  let user_id = req.body.user_id
  let class_id = req.body.class_id

  console.log(req.body)

  isExist(value, user_id, class_id).then(exist => {
    if (!exist){
      mysql('label').where({id}).update({value})
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

const deleteLabel = (req, res) => {
  let id = req.body.id

  mysql('label')
  .where({id})
  .del()
  .then((result)=>{
    res.send('ok')
  })
}

module.exports = {
    getLabelList,
    addLabel,
    putLabel,
    deleteLabel,
}