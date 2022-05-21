import HttpError from "http-errors";
import userModel from "../models/usersModel.js";
import bcrypt from "bcrypt";
import messageapp from "../data/messages.js";
import messageUser from "../models/user/messagesusr.js";
import userPojo from "../models/user/userPojo.js";
import notices from "../data/notices.js";

const register = async (req, res, next) => {
  console.log(`---> userController::register`);

  try {
    const body = req.body;
    let result;

    if (!body.username || !body.password) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      console.log(`---> userController::register ${body.password}`);
      const user = {
        username: body.username,
        password: body.password,
        timestamp: body.timestamp || 0,
        active: 1,
      };

      result = await userModel.loginUser(user);
      if (result != undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        result = await userModel.createUser(user);

        if (result < 0) {
          next(HttpError(400, { message: messageapp.user_error_register }));
        } else {
          let resultado = userPojo(result);
          resultado.message = messageUser.user_msg_create;

          res.status(201).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  console.log(`---> userController::login`);

  try {
    const body = req.body;

    if (!body.username || !body.password) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        password: body.password,
        timestamp: body.timestamp || 0,
      };
      const result = await userModel.loginUser(user);

      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          console.log(`---> userController::login ${result.password}`);
          console.log(`---> userController::login ${body.password}`);

          if (!bcrypt.compareSync(body.password, result.password)) {
            next(HttpError(400, { message: messageapp.user_error_login }));
          } else {
            let resultado = new userPojo(result);
            resultado.message = messageUser.user_msg_login;
            const notes = notices.find(
              (element) => element.username == resultado.username
            );
            if (notes != undefined) {
              resultado.notices = notes.notices;
            }
            res.status(200).json(resultado);
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const _delete = (req, res, next) => {
  try {
    const body = req.body;

    if (!body.username) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        password: body.password,
        timestamp: body.timestamp || 0,
        active: 1,
      };
      const result = userModel.loginUser(user);

      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          result.active = 0;
          let resultado = new userPojo(result);
          resultado.message = messageUser.user_msg_deactivateuser;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const active = (req, res, next) => {
  try {
    const body = req.body;

    if (!body.username) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        password: body.password,
        timestamp: body.timestamp || 0,
        active: 0,
      };
      const result = userModel.loginUser(user);

      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 1) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          result.active = 1;
          let resultado = new userPojo(result);
          resultado.message = messageUser.user_msg_activateuser;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const getUser = (req, res, next) => {
  console.log("---> userController:getUser");
  try {
    const user = {
      username: req.params.username,
    };
    const result = userModel.loginUser(user);
    const resultado = new userPojo(result);
    resultado.message = messageUser.user_msg_getusr;
    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const getFullUser = (req, res, next) => {
  console.log("---> userController:getFullUser");
  try {
    const body = req.body;
    let result;

    if (!body.username) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
      };

      result = userModel.loginUser(user);
      if (result == undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        result = userModel.createUser(user);

        if (result < 0) {
          next(HttpError(400, { message: messageapp.user_error_register }));
        } else {
          res.status(201).json(result);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const newPass = (req, res) => {
  try {
    const body = req.body;
    const newpassword = bcrypt.hashSync(req.body.newpassword, 10);

    if (!body.username || !body.password) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        password: body.password,
        timestamp: body.timestamp || 0,
        active: 1,
      };
      const result = userModel.loginUser(user);

      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          console.log(`---> userController::login ${result.password}`);
          console.log(`---> userController::login ${body.password}`);

          if (!bcrypt.compareSync(body.password, result.password)) {
            next(HttpError(400, { message: messageapp.user_error_login }));
          } else {
            result.password = newpassword;
            let resultado = new userPojo(result);
            resultado.message = messageUser.user_msg_newpassw;
            res.status(200).json(resultado);
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const getGrants = (req, res, next) => {
  console.log("---> userController:getGrants");
  try {
    const body = req.body;

    if (!body.username || !body.grants) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        timestamp: body.timestamp || 0,
        active: 1,
        grants: body.grants,
      };
      const result = userModel.loginUser(user);

      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          result.grants = body.grants;
          let resultado = new userPojo(result);
          resultado.message = messageUser.user_msg_insertgrants;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const deleteGrants = (req, res, next) => {
  console.log("---> userController:deleteGrants");
  try {
    const body = req.body;

    if (!body.username || !body.grants) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        timestamp: body.timestamp || 0,
        active: 1,
        grants: body.grants,
      };
      const result = userModel.loginUser(user);
      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          body.grants.forEach((element) => {
            if (result.grants.includes(element))
              result.grants.splice(result.grants.lastIndexOf(element), 1);
          });
          let resultado = new userPojo(result);
          resultado.message = messageUser.user_msg_deletegrants;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateGrants = (req, res, next) => {
  console.log("---> userController:updateGrants");
  try {
    const body = req.body;

    if (!body.username || !body.grants) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        timestamp: body.timestamp || 0,
        active: 1,
        grants: body.grants,
      };
      const result = userModel.loginUser(user);
      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          body.grants.forEach((element) => {
            if (!result.grants.includes(element)) result.grants.push(element);
          });
          let resultado = new userPojo(result);
          resultado.message = messageUser.user_msg_addgrants;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

const profileData = (req, res, next) => {
  console.log("---> userController:profileData");
  try {
    const body = req.body;

    if (!body.username || !body.profiledata) {
      next(HttpError(400, { message: messageapp.parameter_not_especified }));
    } else {
      const user = {
        username: body.username,
        timestamp: body.timestamp || 0,
        profiledata: body.profiledata,
      };
      const result = userModel.loginUser(user);
      if (result === undefined) {
        next(HttpError(400, { message: messageapp.user_error_login }));
      } else {
        if (result.active == 0) {
          next(HttpError(400, { message: messageapp.user_error_login }));
        } else {
          result.profiledata = user.profiledata;
          let resultado = new userPojo(result);
          resultado.profiledata = user.profiledata;
          resultado.message = messageUser.user_msg_addprofiledata;
          res.status(200).json(resultado);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  _delete,
  active,
  getUser,
  getFullUser,
  newPass,
  getGrants,
  deleteGrants,
  updateGrants,
  profileData,
};
