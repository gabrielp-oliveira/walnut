function isUnique(arr, property) {
    var tmpArr = [];
    for(var obj in arr) {
      if(tmpArr.indexOf(arr[obj][property]) < 0){ 
        tmpArr.push(arr[obj][property]);
      } else {
        return false; 
      }
    }
    return true; 
 }
 module.exports = {isUnique}