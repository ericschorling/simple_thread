'use strict'
/**
 * 
 * @param {string} costType cost type in full ("F") or travel ("T") days
 * @param {string} cityType city type in low cost ("L") or high cost ("H")
 * @returns {integer} reimbursement rate for the day and type of city
 */
 const getCost = (costType, cityType)=>{
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
    const dayInMils = 86400000
    let reimbursementArr = []
    
    let firstDay 
    let lastDay
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
        //exit if last array
        
        if(arrayNum === arr.length-1){
            return [false, null]
        }
        for(let arrNum = arrayNum + 1; arrNum<= arr.length; arrNum++ ){
            let checkDate = new Date(arr[arrNum][0])
            let cityCost
            if(+day >= +checkDate){
                arr[arrayNum][2] === "H" ? cityCost = "H" : arr[arrayNum][2] ==="H" ? cityCost = "H" : cityCost = "L"
                    return [true, cityCost]
            } else {
                return [false, null]
            }
        }
    }
    /**
     * Gets the cost of the city using getCost and then adds it to the reimbursement as well as adding the day to the daysChecked array
     * @param {Object} day - date time object for the day to be added to the array
     * @param {string} costType - full / travel day cost for get cost function
     * @param {*} cityType1 - city type High / Low 
     * @returns {null}
     */
    //May be able to remove the two city check based on the overlap check in overlap check function 
    const addCost = (day, costType, cityType1)=>{
        console.log("adding cost ", day, costType, cityType1, getCost(costType, cityType1))
        reimbursement += getCost(costType, cityType1)
        daysChecked = [...daysChecked, day]
    }

    /**
     * Checks wether a first or last day abut another project 
     * @param {Object} day - Date/Time object of the day to check
     * @param {string} dayType - "L" or "F" to indicate the type of day
     * @param {integer} arrNumber - indicates current array in the nested array to indicate where to check after 
     * @returns {boolean} - returns a boolean of the result of the check
     */
    const abutCheck = (day, dayType, arrNumber) =>{
        //Check the last day against all first days of subsequent projects to check for abut only if there are more projects to check
        if(dayType === "L" && arrNumber < arr.length-1){
            for(let arrNum = arrNumber + 1; arrNum < arr.length; arrNum++ ){
                let checkDate = new Date(arr[arrNum][0])
                if(+day + dayInMils === +checkDate ){
                    console.log("abuts", day, checkDate)
                    return true
                }
            }
        }else {
            //check if the frist day is greater than a day after the last day checked 
            if(+day < +daysChecked[daysChecked-1] + dayInMils){
                return true
            } 
        }
        return false
    }

    //loop to check all the projects submitted in the project array
    //need to add a skip to this loop if only one project
    for (let i = 0; i < arr.length; i++){
        console.log('reimbursement:' + reimbursement)
        firstDay = new Date(arr[i][0])
        lastDay = new Date(arr[i][1])
        let cityType = arr[i][2]
        //Checking to see if the first and last day are the same, all single day projects are considered full days. 
        //Should skip to the check for overlap only if the city isn't High cost

        //Check for first array
        //Check for overlap 
        //check for abut


        //if last day is true of the check below then the whole array can be skipped
        if (+daysChecked[daysChecked.length-1]>=+lastDay){
            //have to check for price in overlap... better somehwere else
            //Will check cost on overlap in another place should be able to skip all together if full overlap of project times
            continue
        }
        //Checking for single day project, also looking at overlap
        if(+firstDay === +lastDay){
            if(arr[i][2]=== "H"){
                addCost(firstDay, "F", "H")
            }
            else{
                const [check, cost] = overlapCheck(firstDay, i)
                if(check){
                    addCost(firstDay, "F", "H")
                } else {
                    addCost(firstDay, "F", "L")
                }
            }
            continue
        }
        // Multi Day project
        //Check first day overlap, no overlap then 
        if(+firstDay < +lastDay){
            let lastDayAbut = abutCheck(lastDay, "L", i)
            //check first day abuts after overlap check by using the last day in check days array...!
            //check 2 day vs longer projects
            //use difference to then check overlap... might need to return a potental overlap size if last is checked and also indicate a last check?
            //this would also validate overlap because dates are sequential and there won't be a need to see if there is overlap except for the first array
            //do we need to check if there is a project has a first day that doesn't abut before but abuts after when another proejct starts in the middle eg 9/1/15 - 9/3/15 & 9/2/15 - 9/5/15?
            const [check, cost] = overlapCheck(firstDay, i)
            const [ldCheck, ldCost] = overlapCheck(lastDay, i)
            //if its the first array check on the first day overlapping subsequent projects
            if(i === 0 ){
                if(check){
                    addCost(firstDay, "F", cost)
                } else {
                    addCost(firstDay, "T", cityType)
                }
            }else {
                //else work on the first day as long as it is greater than the last day in the array which would indicate no overlap
                if(+firstDay > +daysChecked[daysChecked.length-1]){
                    console.log(+firstDay, +daysChecked[daysChecked.length-1]+ dayInMils)
                    if(+firstDay === +daysChecked[daysChecked.length-1]+ dayInMils){
                        
                        addCost(firstDay, "F", cityType)
                    } else {
                        console.log(false)
                        addCost(firstDay, "T", cityType)
                    }
                }
            }
            //add cost for last day depending on abutting projects
            //if last day overlaps then 
            if(ldCheck){
                console.log("overlap last day" + ldCost)
                addCost(lastDay, "F", ldCost)
            }else {
                if(lastDayAbut){
                    console.log("yes")
                    addCost(lastDay, "F", cityType)
                } else {
                    addCost(lastDay, "T", cityType)
                }
            }

            //check for multi day projects
            //Should I check for multi day multi day overlaps?
            if((+lastDay - +firstDay)/ dayInMils >1){
                let projectLength = Math.floor((+lastDay - +firstDay) / dayInMils)-1
                //if no overlap for last day then just days added in
            
                console.log("multiday" + projectLength * getCost("F", cityType))
                reimbursement += projectLength * getCost("F", cityType)
            
            }
        }
        
        if (+daysChecked[daysChecked.length-1] > +firstDay){
            //Perform last day overlap checks
            //calculate any non-overlapping middle days
        }
        //daysChecked=[]
    }
    
    return reimbursement
}

// Should be 165
const set1 = [["9/1/2015","9/3/2015","L"]]
//Should be 620
const set2 = [["9/1/2015", "9/1/2015","L"],["9/2/2015","9/6/2015","H"], ["9/6/2015","9/8/2015","L"]]
//Should be 475
const set3 = [["9/1/2015", "9/3/2015", "L"], ["9/5/2015","9/7/2015","H"], ["9/8/2015", "9/8/2015","H"]]
//Should be 245
const set4 = [["9/1/15","9/1/15","L"],["9/1/15","9/1/2015","L"],["9/2/2015","9/2/2015","H"],["9/2/2015","9/3/2015","H"]]

//console.log(calculateReimbursment(set1))
//console.log(calculateReimbursment(set2))
//console.log(calculateReimbursment(set3))
//console.log(calculateReimbursment(set4))

