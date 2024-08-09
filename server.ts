import cors from "cors";
import express, { json } from "express";
import { postgresDataSource } from "./configure";
import AuthorApi from "./author/authorApi";
import PublisherApi from "./publisher/publisherApi";
import BookApi from "./book/bookApi";
import CustomerApi from "./customer/customerApi";
import OrderApi from "./order/orderApi";
import OrderItemApi from "./orderitem/orderitemApi";
import ReviewApi from "./review/reviewApi";

(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  const datasource = await postgresDataSource.initialize();

  new AuthorApi(datasource, app);
  new PublisherApi(datasource, app);
  new BookApi(datasource, app);
  new CustomerApi(datasource, app);
  new OrderApi(datasource, app);
  new OrderItemApi(datasource, app);
  new ReviewApi(datasource, app);

  app.get("/", (_, res) => {
    return res.send("welcome to my book store.");
  });

  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));
