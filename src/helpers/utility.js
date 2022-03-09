import moment from "moment";
export const dynamicSort = (property, dir) => {
  return function(obj1, obj2) {
    if (typeof obj1[property] == "string") {
      if (typeof obj1[property] == "undefined" || obj1[property] == "undefined")
        return false;
      if (typeof obj2[property] == "undefined" || obj2[property] == "undefined")
        return false;

      var c1 = obj1[property].toLowerCase();
      var c2 = obj2[property].toLowerCase();
    } else {
      if (typeof obj1[property] == "undefined" || obj1[property] == "undefined")
        return false;
      if (typeof obj2[property] == "undefined" || obj2[property] == "undefined")
        return false;

      var c1 = obj1[property];
      var c2 = obj2[property];
    }
    if (dir == "Des") {
      return c1 < c2 ? 1 : c1 > c2 ? -1 : 0;
    } else {
      return c1 > c2 ? 1 : c1 < c2 ? -1 : 0;
    }
  };
};

export const formatDate = (date) => {
  return moment(date).format("DD-MMM-YYYY");
};
