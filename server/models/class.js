const mysql = require('../mysql');

const isExist = (value) => {
    return new Promise((resolve, reject) => {
      mysql('class').select('*').where({value})
      .then((result)=>{
        if (result.length){
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

const getClassList = (req, res) => {
  let negative = req.query.isNegativeLabel
    mysql('class').where({negative}).select('*')
    .then((result)=>{
      res.send(result)
    }).catch((err) => {
      console.error(err)
    })
}


module.exports = {
    getClassList,
}