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

/**
 * Function to calculate the reimbursement of travel and expenses for projects that are entered in a series of arrays. 
 * @param {string[][]} arr array of arrays of strings that are passed in to provide the dates of projects and the city cost.
 * @returns {integer} reimbursement which is the total value of the time worked.
 */
const calculateReimbursment =(arr)=>{
    const dayInMils = 86400000   
    let firstDay 
    let lastDay
    let daysChecked = []
    let reimbursement = 0
    //should input array be sorted?
    //Validate input of arrays and sort as needed?
        
     /**
     * Function to check if days of the project overlap with others to ensure that any overlap is handled as a full day.
     * @param {object} day - Datetime object for the day being checked for overlap
     * @param {integer} arrayNum - the array position in the nested array that is being checked 
     * @returns {[boolean, string]} - returns the result of the check and if it is true returns the cost of the city.
     */
    const overlapCheck=(day, arrayNum)=>{
        //exit if last array
        if(arrayNum === arr.length-1){
            return [false, null]
        }

        for(let arrNum = arrayNum + 1; arrNum<= arr.length; arrNum++ ){
            let checkDate = new Date(arr[arrNum][0])
            let cityCost
            if(+day >= +checkDate){
                arr[arrayNum][2] === "H" ? cityCost = "H" : arr[arrNum][2] ==="H" ? cityCost = "H" : cityCost = "L"
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
        firstDay = new Date(arr[i][0])
        lastDay = new Date(arr[i][1])
        let cityType = arr[i][2]


        //if last day is true of the check below then the whole array can be skipped
        if (+daysChecked[daysChecked.length-1]>=+lastDay){
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
                    addCost(firstDay, "F", cost)
                } else {
                    addCost(firstDay, "F", cityType)
                }
            }
            continue
        }
        // Multi Day project
        //Check first day overlap, no overlap then 
        if(+firstDay < +lastDay){
            let lastDayAbut = abutCheck(lastDay, "L", i)
            //check first day abuts after overlap check by using the last day in check days array...!
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
                    if(+firstDay === +daysChecked[daysChecked.length-1]+ dayInMils){
                        addCost(firstDay, "F", cityType)
                    } else {
                        addCost(firstDay, "T", cityType)
                    }
                }
            }
            //add cost for last day depending on abutting projects
            //If last day overlaps then should we take a look at the point of overlap ending... only important if there is a price difference between projects but if there is subtract last day of current project from last day overlap project. then take that number of subtract from total project length. Use different costs * differen lengths to get correct cost. Current sets do not require that validation. 
            if(ldCheck){
                addCost(lastDay, "F", ldCost)
            }else {
                if(lastDayAbut){
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
                reimbursement += projectLength * getCost("F", cityType)
            
            }
        }
    }
    
    return reimbursement
}

// Should be 165
const set1 = [["9/1/2015","9/3/2015","L"]]
//Should be 620
const set2 = [["9/1/2015", "9/1/2015","L"],["9/2/2015","9/6/2015","H"], ["9/6/2015","9/8/2015","L"]]
//Should be 475
const set3 = [["9/1/2015", "9/3/2015", "L"], ["9/5/2015","9/7/2015","H"], ["9/8/2015", "9/8/2015","H"]]
//Should be 215
const set4 = [["9/1/15","9/1/15","L"],["9/1/15","9/1/2015","L"],["9/2/2015","9/2/2015","H"],["9/2/2015","9/3/2015","H"]]

console.log(calculateReimbursment(set1))
console.log(calculateReimbursment(set2))
console.log(calculateReimbursment(set3))
console.log(calculateReimbursment(set4))

