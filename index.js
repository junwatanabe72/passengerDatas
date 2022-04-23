import {numberOfPassengers} from "./base.js"

const minLatitude = 35.17996994;
const maxLatitude = 36.30737452;
const minLongitude = 139.26021206;
const maxLongitude =  140.31408175;

let list ={};
const makeJSfile =()=>{
const {features} = numberOfPassengers
console.log(features.length)
features.forEach((feature)=>{
    const {geometry,properties} = feature;
    const {S12_001,S12_002,S12_003,S12_033,S12_037,S12_041} = properties;
    const {coordinates}= geometry
    const [datas] = coordinates;
    const [first,second] = datas 
    const longitude = (first[0]+second[0])/2;
    const latitude = (first[1]+second[1])/2;
    const isVaild =  longitude >minLongitude && longitude< maxLongitude && latitude>minLatitude && latitude<maxLatitude
    if(!isVaild){
      return
    }
    const existingData = list[[S12_001]]
    if(!existingData){
      const data = {[S12_001]:{name:S12_001,
        route: S12_003,
        company:S12_002,
        passenger2017:S12_033,
        passenger2018:S12_037,
        passenger2019:S12_041,
        geometry:[longitude,latitude]}
      }
    list = {...data,...list}
    return;
    }
    const {passenger2017,passenger2018,passenger2019,route,company} = existingData
    const data = {[S12_001]:{name:S12_001,
      route: `${S12_003}/${route}`,
      company:`${S12_002}/${company}`,
      passenger2017:S12_033+passenger2017,
      passenger2018:S12_037+passenger2018,
      passenger2019:S12_041+passenger2019,
      geometry:[longitude,latitude]}
    }
  list = {...list,...data}
  return;
  })
  console.log(Object.values(list).length)
  console.log(`export const passengers = ${JSON.stringify(list)}`)
}
makeJSfile()

// [ longitude 139.77818, latitude 35.62961 ]
//  latitude  35.17996994 < x < 36.30737452
//  longitude 139.26021206 < y < 140.31408175