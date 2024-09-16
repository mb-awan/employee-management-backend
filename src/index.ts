import { app } from "./server";
import { env } from "./common/utils/envConfig";
app.listen(env.PORT, () => {
  console.log(`Server running at http://localhost:${env.PORT}/`);
});
