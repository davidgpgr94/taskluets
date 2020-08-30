import BaseController from "./base-controller"
import AuthController from './auth-controller';
import HomeController from "./home-controller";

const CONTROLLERS: Array<BaseController> = [
  new AuthController(),
  new HomeController(),
]

export default CONTROLLERS;
