const checkAuth = (req, res, next) => {
  // Next nos permite irnos al siguiente middleware. Es decir, que se vaya a profile()
  
  next();
};

export default checkAuth;
