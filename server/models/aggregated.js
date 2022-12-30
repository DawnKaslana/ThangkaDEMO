const mysql = require('../mysql');

const selectInfo = (req, res) => {
  console.log(req.query.type,req.query.location_key,req.query.date)
  mysql('dawn.'+req.query.type)
  .select('*')
  .where('location_key',req.query.location_key)
  .orderBy('date', 'desc')
  .then((result)=>{
    res.send(result.pop())
  }).catch((err) => {
    console.error(err)  
  })
}

const selectByDate = (req, res) => {
  mysql('dawn.'+req.query.type)
  .select('*')
  .where('date', req.query.date)
  .then((result)=>{
    arr = {}
    result.forEach(item => {
      arr[item['location_key']] = item
    });
    res.send(arr)
  }).catch((err) => {
    console.error(err)  
  })
}

const selectByMonth = (req, res) => {
  let selectDate = req.query.date.substring(0,7)
  let type = req.query.type
  mysql('dawn.'+type)
  .select('*')
  .where('date', 'like', selectDate+'%')
  .then((result)=>{
    //同國家的加起來 累積用最後一天數據
    resultData = {}
    countryDict = {}
    result.forEach(item => {
      if (!countryDict[item['location_key']]){
        countryDict[item['location_key']] = []
      }
      countryDict[item['location_key']].push(item)
    });
    let keys = Object.keys(countryDict)
    let arr = []
    if (type === 'epid'){
      keys.forEach(country => {
        let new_confirmed = 0
        let new_deceased = 0
        let new_recovered = 0
        let new_tested = 0
        arr = countryDict[country]
        arr.forEach(item =>{
          new_confirmed += parseInt(item.new_confirmed)
          new_deceased += parseInt(item.new_deceased)
          new_recovered += parseInt(item.new_recovered)
          new_tested += parseInt(item.new_tested)
        })
        let lastArr = arr.pop()
        lastArr.new_confirmed = new_confirmed
        lastArr.new_deceased = new_deceased
        lastArr.new_recovered = new_recovered
        lastArr.new_tested = new_tested
        resultData[country] = lastArr
      })
    } else if (type === 'vacc'){
      keys.forEach(country => {
        let new_persons_fully_vaccinated = 0
        let new_persons_vaccinated = 0
        let cumulative_persons_vaccinated = 0
        let cumulative_persons_fully_vaccinated = 0
        arr = countryDict[country]
        arr.forEach(item =>{
          new_persons_fully_vaccinated += parseInt(item.new_persons_fully_vaccinated)
          new_persons_vaccinated += parseInt(item.new_persons_vaccinated)
          if (parseInt(item.cumulative_persons_vaccinated) > cumulative_persons_vaccinated) {
            cumulative_persons_vaccinated = parseInt(item.cumulative_persons_vaccinated)}
          if (parseInt(item.cumulative_persons_fully_vaccinated) > cumulative_persons_fully_vaccinated) {
            cumulative_persons_fully_vaccinated = parseInt(item.cumulative_persons_fully_vaccinated)}
        })
        let lastArr = arr.pop()
        lastArr.new_persons_fully_vaccinated = new_persons_fully_vaccinated
        lastArr.new_persons_vaccinated = new_persons_vaccinated
        lastArr.cumulative_persons_fully_vaccinated = cumulative_persons_fully_vaccinated
        lastArr.cumulative_persons_vaccinated = cumulative_persons_vaccinated
        resultData[country] = lastArr
      })
    }
    res.send(resultData)
  }).catch((err) => {
    console.error(err)  
  })
}

const selectByYear = (req, res) => {
  let selectDate = req.query.date.substring(0,4)
  let type = req.query.type 
  mysql('dawn.'+type)
  .select('*')
  .where('date', 'like', selectDate+'%')
  .andWhere('date', 'not like', '2022-09%')
  .then((result)=>{
    //同國家的加起來 累積用最後一天!!!have value de數據
    resultData = {}
    countryDict = {}
    result.forEach(item => {
      if (!countryDict[item['location_key']]){
        countryDict[item['location_key']] = []
      }
      countryDict[item['location_key']].push(item)
    });
    let keys = Object.keys(countryDict)
    let arr = []
    if (type === 'epid'){
      keys.forEach(country => {
        let new_confirmed = 0
        let new_deceased = 0
        let new_recovered = 0
        let new_tested = 0
        arr = countryDict[country]
        arr.forEach(item =>{
          new_confirmed += parseInt(item.new_confirmed)
          new_deceased += parseInt(item.new_deceased)
          new_recovered += parseInt(item.new_recovered)
          new_tested += parseInt(item.new_tested)
        })
        let lastArr = arr.pop()
        lastArr.new_confirmed = new_confirmed
        lastArr.new_deceased = new_deceased
        lastArr.new_recovered = new_recovered
        lastArr.new_tested = new_tested
        resultData[country] = lastArr
      })
    } else if (type === 'vacc'){
      keys.forEach(country => {
        let new_persons_fully_vaccinated = 0
        let new_persons_vaccinated = 0
        let cumulative_persons_vaccinated = 0
        let cumulative_persons_fully_vaccinated = 0
        arr = countryDict[country]
        arr.forEach(item =>{
          new_persons_fully_vaccinated += parseInt(item.new_persons_fully_vaccinated)
          new_persons_vaccinated += parseInt(item.new_persons_vaccinated)
          if (parseInt(item.cumulative_persons_vaccinated) > cumulative_persons_vaccinated) {
            cumulative_persons_vaccinated = parseInt(item.cumulative_persons_vaccinated)}
          if (parseInt(item.cumulative_persons_fully_vaccinated) > cumulative_persons_fully_vaccinated) {
            cumulative_persons_fully_vaccinated = parseInt(item.cumulative_persons_fully_vaccinated)}
        })
        let lastArr = arr.pop()
        lastArr.new_persons_fully_vaccinated = new_persons_fully_vaccinated
        lastArr.new_persons_vaccinated = new_persons_vaccinated
        lastArr.cumulative_persons_fully_vaccinated = cumulative_persons_fully_vaccinated
        lastArr.cumulative_persons_vaccinated = cumulative_persons_vaccinated
        resultData[country] = lastArr
      })
    }
    res.send(resultData)

  }).catch((err) => {
    console.error(err)  
  })
}

module.exports = {
  selectByDate,
  selectByMonth,
  selectByYear,
  selectInfo
}