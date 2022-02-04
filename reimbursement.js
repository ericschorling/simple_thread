'use strict'
/**
 * 
 * @param {string} costType cost type in full ("F") or travel ("T") days
 * @param {string} cityType city type in low cost ("L") or high cost ("H")
 * @returns {integer} reimbursement rate for the day and type of city
 */
 const getCost = (costType, cityType1, cityType2)=>{
    const cityType = cityType1 === "H" ? cityType1 : cityType2 === "H" ? cityType2 : cityType1
    const reimbursementRates = [45, 55, 75, 85]
    if((costType !== "T" && costType !== "F") || (cityType !== "H" && cityType !== "L")){
        console.error(`Incorrect value entered cityType=${cityType} costType=${costType}`)
        return
    }
    if(costType === "T"){
        if(cityType === "L"){
            return reimbursementRates[0]
        }
        else{
            return reimbursementRates[1]
        }
    }else {
        if(cityType === "L"){
            return reimbursementRates[2]
        }
        else{
            return reimbursementRates[3]
        }
    }
}
//  First day and last day of a project, or sequence of projects, is a travel day.
//  Any day in the middle of a project, or sequence of projects, is considered a full day.
//  If there is a gap between projects, then the days on either side of that gap are travel days.
//  If two projects push up against each other, or overlap, then those days are full days as well.
//  Any given day is only ever counted once, even if two projects are on the same day.
/**
 * 
 * @param {string[][]} arr array of arrays of strings that are passed in to provide the dates of projects and the city cost.
 * @returns {integer} reimbursement which is the total value of the time worked.
 */
const calculateReimbursment =(arr)=>{
    const dayInMils = 84600000
    let reimbursementArr = []
    
    let firstDay = new Date(arr[0][0])
    let lastDay = new Date(arr[0][1])
    let daysCost = 0
    let daysChecked = []
    console.log(lastDay - firstDay)
    let reimbursement = 0
    //should input array be sorted?
    //create a day checked array to hold already calculated days
    //check firstday abut / overlap by set for all projects against first  and last day (only last day if not first day)
        //check first day against first day to ensure only multi day overlap evaluated
    //run cost for any true values and add to reimbursement amount / add day to checked array
    //check last day abut / overlap by set for all projects in set conditional on checked day array
    //if no overlap // abut then return travel day
    
    for (let i = 0; i < arr.length; i++){
        firstDay = new Date(arr[i][0])
        lastDay = new Date(arr[i][1])
        //if last day is true of the check below then the whole array can be skipped
        if (+daysChecked[daysChecked.length-1]>=+lastDay){
            //have to check for price in overlap... better somehwere else
            continue
        }
        if (+daysChecked[daysChecked.length-1]>+firstDay){
            //Perform last day overlap checks
            //calculate any non-overlapping middle days
        }
        for (let j = i+1; j<arr.length; j++ ){
            let checkDate = +new Date(arr[j][0])
            if(+firstDay >= checkDate){
                reimbursement += getCost("F",arr[j][2], arr[i][2])
            }
        }
    }

    if (+lastDay === +firstDay){
        daysCost = getCost("F",arr[0][2])
        console.log("same day "+ "cost "+ daysCost)
    }
    else {
        console.log(Math.floor((lastDay - firstDay)/dayInMils))
    }
    return reimbursement
}

const set1 = [["9/1/2015","9/3/2015","L"]]
const set2 = [["9/1/2015", "9/1/2015","L"],["9/2/2015","9/6/2015","H"], ["9/6/2015","9/8/2015","L"]]
const set3 = [["9/1/2015", "9/3/2015", "L"], ["9/5/2015","9/7/2015","H"], ["9/8/2015", "9/8/2015","H"]]
const set4 = [["9/1/15","9/1/15","L"],["9/1/15","9/1/2015","L"],["9/2/2015","9/2/2015","H"],["9/2/2015","9/3/2015","H"]]

console.log(calculateReimbursment(set1))
console.log(calculateReimbursment(set2))
console.log(calculateReimbursment(set3))
console.log(calculateReimbursment(set4))

