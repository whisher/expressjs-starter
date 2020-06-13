exports.successResponse = function (res, msg) {
  var resData = {
    message: msg,
  };
  return res.status(200).json(resData);
};

exports.successResponseWithData = function (res, data) {
  return res.status(200).json(data);
};

exports.ErrorResponse = function (res, msg) {
  var resData = {
    errors: [{ msg }],
  };
  return res.status(500).json(resData);
};

exports.notFoundResponse = function (res, msg) {
  var resData = {
    errors: [{ msg }],
  };
  return res.status(404).json(resData);
};

exports.validationErrorWithData = (res, data) => {
  var resData = {
    errors: data,
  };
  return res.status(422).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
  var resData = {
    errors: [{ msg }],
  };
  return res.status(401).json(resData);
};
