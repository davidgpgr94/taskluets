import BaseController from "./base-controller"
import LoginController from './login-controller';
import HomeController from "./home-controller";

const CONTROLLERS: Array<BaseController> = [
  new LoginController(),
  new HomeController(),
]

export default CONTROLLERS;
