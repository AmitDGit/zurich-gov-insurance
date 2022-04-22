import { useState, useEffect } from "react";
import TokenService from "../services/Tokenservice";
import { USER_ROLE } from "../constants";
function useUserProfile(initialval) {
  let initialprofile = {
    isAdminGroup: false,
    isSuperAdmin: false,
    isGlobalAdmin: false,
    isRegionAdmin: false,
    isCountryAdmin: false,
  };
  let userProfile = TokenService.getUser();
  let userRoles = userProfile ? userProfile.userRoles[0] : initialprofile;
  if (userRoles.roleId == USER_ROLE.superAdmin) {
    userProfile.isSuperAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId == USER_ROLE.globalAdmin) {
    userProfile.isGlobalAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId == USER_ROLE.regionAdmin) {
    userProfile.isRegionAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId == USER_ROLE.countryAdmin) {
    userProfile.isCountryAdmin = true;
    userProfile.isAdminGroup = true;
  }
  return userProfile;
}

export default useUserProfile;
