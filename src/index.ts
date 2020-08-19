
import { TasklueApp } from './app';

const app = new TasklueApp();
app.server.listen(3000, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Server running in port 3000');
});
