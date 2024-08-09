import { DataSource } from "typeorm";
import { Author } from "./author/author";
import { Publisher } from "./publisher/publisher";
import { Book } from "./book/book";
import { Customer } from "./customer/customer";
import { Order } from "./order/order";
import { OrderItem } from "./orderitem/orderitem";
import { Review } from "./review/review";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'sample_db',
  entities: [Author, Publisher, Book, Customer, Order, OrderItem, Review],
  synchronize: true,
  logging: false,
});
