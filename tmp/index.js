import { tokyoList } from "./tokyoList.js";
import { passengers } from "./passenger4.js";
const R = Math.PI / 180;
const distance = (lat1, lng1, lat2, lng2) => {
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return (
    6371 *
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    )
  );
};
const list = tokyoList;
const create = async (d) => {
  const arr = [];
  const a = await Promise.all(
    Object.values(list).map(async (property) => {
      const { geometry } = d;
      const { address, singleHousehold } = property;
      const isAddress = address === d.address;
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (isAddress) {
        arr.push(property.address);
        return singleHousehold;
      }
      const [lng, lat] = property.geometry;
      const isRange =
        Math.round(distance(geometry[1], geometry[0], lat, lng) * 1000) <= 500;
      if (!isRange) {
        return 0;
      }
      arr.push(property.address);
      return Math.round(singleHousehold * 0.8);
    })
  );
  const tmpTotal = a.reduce((sum, element) => sum + element, 0);
  if (!tmpTotal) {
    return d;
  }
  const isDetail = d?.detailAddress;
  const total = tmpTotal + d.singleHouseHold;
  if (!isDetail) {
    const newValue = {
      ...d,
      singleHouseHold: total,
      detailAddress: [...arr],
    };
    return newValue;
  }
  const newValue = {
    ...d,
    singleHouseHold: total,
    detailAddress: [...d.detailAddress, ...arr],
  };
  return newValue;
};

const generateObject = async () => {
  let returnObject = {};
  await Promise.all(
    Object.values(passengers).map(async (d) => {
      const newValue = await create(d);
      returnObject = { [newValue.name]: newValue, ...returnObject };
      return;
    })
  );
  console.log(`export const passengers =${JSON.stringify(returnObject)}`);
  return;
};
generateObject();
