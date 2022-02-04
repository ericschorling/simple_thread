'use strict'
/**
 * 
 * @param {string[][]} arr array of arrays of strings that are passed in to provide the dates of projects and the city cost.
 * @returns {integer} reimbursement which is the total value of the time worked.
 */
const calculateReimbursment =(arr)=>{
    const reimbursementRates = [45, 55, 75, 85]
}

console.log(calculateReimbursment(set1))
console.log(calculateReimbursment(set2))
console.log(calculateReimbursment(set3))
console.log(calculateReimbursment(set4))

const set1 = [["9/1/2015","9/1/2015","L"]]
const set2 = [["9/1/2015", "9/1/2015","L"],["9/2/2015","9/6/2015","H"], ["9/6/2015","9/8/2015","L"]]
const set3 = [["9/1/2015", "9/3/2015", "L"], ["9/5/2015","9/7/2015","H"], ["9/8/2015", "9/8/2015","H"]]
const set4 = [["9/1/15","9/1/15","L"],["9/1/15","9/1/2015","L"],["9/2/2015","9/2/2015","H"],["9/2/2015","9/3/2015","H"]]
