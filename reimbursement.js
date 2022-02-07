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
    let reimbursement = 0
    //should input array be sorted?
    //Validate input of arrays and sort as needed?
    //create a day checked array to hold already calculated days
    //check firstday abut / overlap by set for all projects against first  and last day (only last day if not first day)
        //check first day against first day to ensure only multi day overlap evaluated
    //run cost for any true values and add to reimbursement amount / add day to checked array
    //check last day abut / overlap by set for all projects in set conditional on checked day array
    //if no overlap // abut then return travel day
    
     /**
     * 
     * @param {object} day - Datetime object for the day being checked for overlap
     * @param {integer} arrayNum - the array position in the nested array that is being checked 
     * @returns {[boolean, string]} - returns the result of the check and if it is true returns the cost of the city.
     */
    //Raises the question of a triple+ overlap with multiple city costs, seems unlikely but may be worth checking on 
    const overlapCheck=(day, arrayNum)=>{
        for(let i = arrayNum + 1; i<= arr.length; i++ ){
            if(+day >= +arr[arrayNum][0]){
                return [true, arr[arrayNum][2]]
            } else {
                return [false, null]
            }
        }
    }
    /**
     * Gets the cost of the city using getCost and then adds it to the reimbursement as well as adding the day to the daysChecked array
     * @param {string} costType - full / travel day cost for get cost function
     * @param {*} cityType1 - city type High / Low 
     * @param {*} cityType2 - city type high / low if overlap comparison is necessary 
     * @returns {null}
     */
    //May be able to remove the two city check based on the overlap check in overlap check function 
    const addCost = (costType, cityType1, cityType2)=>{
        reimbursement += getCost(costType, cityType1, cityType2)
        daysChecked = [...daysChecked, +firstDay]
        console.log("Reimbursment" + reimbursement)
    }

    //loop to check all the projects submitted in the project array
    for (let i = 0; i < arr.length; i++){
        firstDay = new Date(arr[i][0])
        lastDay = new Date(arr[i][1])
        //Checking to see if the first and last day are the same, all single day projects are considered full days. 
        //Should skip to the check for overlap only if the city isn't High cost

        

        //if last day is true of the check below then the whole array can be skipped
        if (+daysChecked[daysChecked.length-1]>=+lastDay){
            //have to check for price in overlap... better somehwere else
            //Will check cost on overlap in another place should be able to skip all together if full overlap of project times
            continue
        }
        //Checking for single day project, also looking at overlap
        if(+firstDay === +lastDay){
            if(arr[i][2]=== "H"){
                addCost("F", "H")
            }
            else{
                const [check, cost] = overlapCheck(firstDay, i)
                if(check){
                    addCost("F", "H")
                } else {
                    addCost("F", "L")
                }
            }
        }
        // Multi Day project
        //Check first day overlap, no overlap then 
        if(+firstDay < +lastDay){
            console.log(daysChecked)
            
            //check first day abuts after overlap check by using the last day in check days array...!
            //check 2 day vs longer projects
            //use difference to then check overlap... might need to return a potental overlap size if last is checked and also indicate a last check?
            //this would also validate overlap because dates are sequential and there won't be a need to see if there is overlap except for the first array
            //do we need to check if there is a project has a first day that doesn't abut before but abuts after when another proejct starts in the middle eg 9/1/15 - 9/3/15 & 9/2/15 - 9/5/15?
            const [check, cost] = overlapCheck(firstDay, i)
            if(i === 0 ){
                if(check){
                    addCost("F", cost)
                }
            }
            if(+firstDay > +daysChecked[daysChecked-1]){
                //check abutment by looking at last day of days checked array plus 1 day, if greater then shouldn't abut
                if(+firstDay > +daysChecked[daysChecked-1] + dayInMils){
                    addCost("T", arr[i][2])
                    console.log(+daysChecked[daysChecked-1] + dayInMils)
                } else {
                    addCost("F", arr[i][2])
                }
            }
        }
        
        if (+daysChecked[daysChecked.length-1] > +firstDay){
            //Perform last day overlap checks
            //calculate any non-overlapping middle days
        }
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

