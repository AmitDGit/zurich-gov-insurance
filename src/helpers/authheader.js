export function authHeader() {
  // return authorization header with jwt token
  let user = JSON.parse(localStorage.getItem("zchuser"));
  debugger;
  if (user && user.accessToken) {
    return {
      Authorization: "Bearer " + user.accessToken,
      "Access-Control-Allow-Origin": "*",
    };
  } else {
    return {};
  }
}
