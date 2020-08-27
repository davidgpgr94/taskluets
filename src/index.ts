
require('dotenv').config();
import { TasklueApp } from './app';

const app = new TasklueApp({});
app.listen();
