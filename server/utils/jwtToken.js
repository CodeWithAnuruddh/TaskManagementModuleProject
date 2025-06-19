export const sendToken = (user, statusCode, res, message) => {
  console.log("before token --->");
  const token = user.getJWTToken();
  console.log("token -------->", token);

  const options = {
    expires: new Date(Date.now() + 36000000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
