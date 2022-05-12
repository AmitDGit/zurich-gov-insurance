import { useState, useEffect } from "react";
import TokenService from "../services/Tokenservice";
import { USER_ROLE } from "../constants";
import { useOktaAuth } from "@okta/okta-react";
async function useUserProfile(initialval) {
  const { oktaAuth, authState } = useOktaAuth();
  let initialprofile = {
    isAdminGroup: false,
    isSuperAdmin: false,
    isGlobalAdmin: false,
    isRegionAdmin: false,
    isCountryAdmin: false,
  };

  let userProfile =
    authState && authState.isAuthenticated
      ? await oktaAuth.getUser()
      : initialprofile;
  let userRoles =
    userProfile && userProfile.userRoles
      ? userProfile.userRoles[0]
      : initialprofile;
  if (userRoles.roleId === USER_ROLE.superAdmin) {
    userProfile.isSuperAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId === USER_ROLE.globalAdmin) {
    userProfile.isGlobalAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId === USER_ROLE.regionAdmin) {
    userProfile.isRegionAdmin = true;
    userProfile.isAdminGroup = true;
  }
  if (userRoles.roleId === USER_ROLE.countryAdmin) {
    userProfile.isCountryAdmin = true;
    userProfile.isAdminGroup = true;
  }
  return { ...userProfile, initialprofile };
}

export default useUserProfile;
