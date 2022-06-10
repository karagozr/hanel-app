
export const leftJoin = (leftTable, rightTable, joinRule, leftRule) => {
	return leftTable.reduce((resultTable,leftItem)=>{
    	let isMerged=false;
        var result = rightTable.reduce((resultTable,rightItem)=>{
        	if(isMerged === false) isMerged = (joinRule(leftItem,rightItem)!==false?true:false);
        	return resultTable.concat(joinRule(leftItem,rightItem)||[])
        },resultTable)
    	
        //console.log("leftRule ",isMerged?result:resultTable.concat(leftRule !== undefined? leftRule(leftItem) : leftItem ||[]))
        return isMerged?result:resultTable.concat(leftRule !== undefined? leftRule(leftItem) : leftItem ||[])
    	
    },[])

}


export const fullJoin = (leftTable, rightTable, joinRule, leftRule) => {
	return leftTable.reduce((resultTable,leftItem)=>{
    	let isMerged=false;
        var result = rightTable.reduce((resultTable,rightItem)=>{
        	if(isMerged === false) isMerged = (joinRule(leftItem,rightItem)!==false?true:false);
        	return resultTable.concat(joinRule(leftItem,rightItem)||[])
        },resultTable)
    	
        //console.log("leftRule ",isMerged?result:resultTable.concat(leftRule !== undefined? leftRule(leftItem) : leftItem ||[]))
        return isMerged?result:resultTable.concat(leftRule !== undefined? leftRule(leftItem) : leftItem ||[])
    	
    },[])

}
