import HttpError from "http-errors";
import messageapp from "../data/messages.js";

// regular expressions: https://regex101.com/
const validateUserEmail = (req, res, next) => {
  const body = req.body;
  if (body.username) {
    if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(body.username)) {
      next();
    } else {
      next(HttpError(400, { message: messageapp.user_invalid_format }));
    }
  }
};

const validateUserPassword = (req, res, next) => {
  const body = req.body;
  if (body.password) {
    if (
      /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/.test(
        body.password
      )
    ) {
      next();
    } else {
      next(HttpError(400, { message: messageapp.password_invalid_format }));
    }
  }
};

export default {
  validateUserEmail,
  validateUserPassword,
};
