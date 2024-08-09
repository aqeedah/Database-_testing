## Programme: Database Testing [SENG8075]

## Section:3

## Submitted to: Andy Chow

## Project Partners:
1. Akida Laliwala[8975812]
2. Prachi Thakral[8973781]
3. Divtej Pal Singh[8962715]

## Duties of team members:

-- Creation of tables and Insertion till 'book' table is done by Divtej Pal Singh.

-- Insertion into remaining table and CRUD operation / DDL & DML is done by Prachi Thakral.

--Creation of Typescipt, restfulAPI, Unit test is done by Akida Laliwala.

## server.ts by that we can know that our port is running

## index.ts by that we can know the entry point of the application 

## configure.ts by that we can manage configration settings

## PersistenceService.ts by that we can handle database operations


## -- Creation of table 
We create auther.ts file

We create publisher.ts file

We create book.ts file

We create customer.ts file

We create orders.ts file

We create order_item.ts file

We create review.ts file


## -- Creation of restAPI
We create autherAPI.test file

We create publisherAPI.test file

We create bookAPI.test file

We create customerAPI.test file

We create orderAPI.test file

We create order_itemAPI.test file

We create reviewAPI.test file


## -- Creation of Persistence

We create authorPersistence.ts file

We create publisherPersistence.ts file

We create bookPersistence.ts file

We create customerPersistence.ts file

We create orderPersistence.ts file

We create orderItemPersistence.ts file

We create reviewPersistence.ts file


## -- Creation of file for Unit test
We create authorAPI.test.ts file

We create publisherAPI.test.ts file

We create bookAPI.test.ts file

We create customerAPI.test.ts file

We create orderAPI.test.ts file

We create orderItemAPI.test.ts file

We create reviewAPI.test.ts file


## -- CRUD Operation is done in postgres environment

-- Creation of database

   create database sample_db;


## -- List of tables:

| Schema | Name       | Type  | Owner    |
|--------|------------|-------|----------|
| public | author     | table | postgres |
| public | book       | table | postgres |
| public | customer   | table | postgres |
| public | order      | table | postgres |
| public | order_item | table | postgres |
| public | publisher  | table | postgres |
| public | review     | table | postgres |
| public | student    | table | postgres |

## --Insertion into table of auther: 

| author_id | first_name | last_name, | email_address        |
|-----------|------------|------------|----------------------|
| 1         | Emily      | Johnson    | emily@author.com     |
| 2         | Rebecca    | Yarros     | rebros@author.com    |
| 3         | Katherine  | Paterson   | katherin@author.com  |
| 4         | Kristin    | Hannah     | weintra@stmartin.com |
| 5         | Ashley     | Elston     | rstevenson@prh.com   |

## -- Insertion into table of publisher table

|publisher_id  | publisher_name                 |
|--------------|--------------------------------|
| 1            | Penguin Publishing Group       |
| 2            | Red Tower Book                |
| 3            | HarperCollins                  |
| 4            | St. Martins Press              |
| 5            | Pamela Dorman Book            |

## -- Insertion into table of book table

| book_id | book_title                | book_genre         | book_type     | publication_date | price | author_id | Publisher_id | isbn           |
|---------|---------------------------|--------------------|---------------|------------------|-------|-----------|--------------|----------------|
| 1       | Funny Story               | Romance            | physical      | publication_date | 4.31  | 1         | 1            | 978-0593441282 |
| 2       | Fourth Wing               | Fantasy            | physical      | 2022-01-01       | 24.00 | 2         | 2            | 9781649374042  |
| 3       | Bridge to Terabithia      | Fiction            | audio book    | 2023-05-02       | 10.00 | 3         | 3            | 9780064401845  |
| 4       | The Women                 | Historical Fiction | e-book        | 2017-05-02       | 28.00 | 4         | 4            | 1250178630     |
| 5       | First Lie Wins            | Thriller           | e-book        | 2024-02-06       | 16.00 | 5         | 5            | 0593492919     |

## --Insertion into table of customer

| customer_id | first_name | last_name | contact_number | address                        | total_spent_amount | registration_date |
|:-----------:|:----------:|:---------:|:--------------:|:------------------------------:|:------------------:|:-----------------:|
| 101         | Akida      | Aazam     | 437-9632145    | 41,king street,waterloo,ON     | 700.70               2010-01-25        |
| 102         | Prachi     | Thakral   | 437-1236985    | 48,erb street,waterloo,ON      | 500.50             | 2011-02-20        |
| 103         | Divtej     | Singh     | 752-1239687    | 56,philip street,waterloo,ON   | 300.30             | 2012-03-27        |
| 104         | Swati      | Sansarwal | 720-1254789    | 125,queen street,waterloo,ON   | 450.30             | 2013-05-19        |
| 105         | Mayank     | Sharma    | 778-9875463    | 78,lester street,waterloo,ON   | 235.40             | 2014-06-15        |

## -- Insertion into table of orders

| order_id | customer_id | order_date | bill_amount |
|:--------:|:-----------:|:----------:|:-----------:|
| 001      | 101         | 2023-01-25 | 100.11      |
| 002      | 102         | 2022-02-02 | 50.11       |
| 003      | 103         | 2021-03-14 | 120.10      |
| 004      | 104         | 2020-04-18 | 45.11       |
| 005      | 105         | 2019-05-12 | 70.17       |

## -- Insertion into order_item:

| order_item_id | order_id | book_id | quantity | price  |
|:-------------:|:--------:|:-------:|:--------:|:------:|
| 01            | 001      | 2       | 2        | 48.00  |
| 02            | 002      | 5       | 1        | 16.00  |
| 03            | 003      | 3       | 2        | 20.00  |
| 04            | 004      | 7       | 1        | 38.00  |
| 05            | 005      | 11      | 1        | 28.40  |

## -- Insertion into review

| review_id | customer_id | book_id | review_date | review_comment         | ratings |
| 1         | 101         | 2       | 2023-09-25  | Excellent Book!        | 4       |
| 2         | 102         | 5       | 2023-01-02  | Nice Book!             | 3       |
| 3         | 103         | 3       | 2022-05-15  | Quite slow!            | 2       |
| 4         | 104         | 7       | 2023-05-25  | Nice book to Recommend | 5       |
| 5         | 105         | 11      | 2022-09-22  | Fantastic story!       | 4       |

# -- DML Operations/ CRUD Operation

-- Insert into customer table

insert into customer (customer_id,first_name,last_name,contact_number,address,total_spent_amount,registration_date)  values (116,'Edward','Coolin',437-8574259,'41,Lenster street,waterloo,ON',50.70,'2024-05-25');  
-- Read from customer table

   select * from customer where customer_id = 105;

-- Update into customer table

   update customer 
	set total_spent_amount = 100
	where customer_id = 105;

-- Delete from customer table

  delete from customer where customer_id = 105;


  -- From this part, solution of asked requirements and Typescript Interface is done by Akida Laliwala.

-- Solution of asked Requirements        

-- 1.Details of auther of same genre book published in the last 10 years

```select a.author_id,a.first_name,a.last_name, count(book_id) as BookCount
from book b
join author a on b.author_id = a.author_id
where b.book_genre = 'Fantasy' and publication_date >= current_date - interval '10 years'
group by a.author_id,a.first_name,a.last_name
having count(b.book_id) > 0;```



-- 2.Loyal customer who has spent more than $51 in the last year

```select c.customer_id, c.first_name, c.last_name, sum(o.bill_amount) as TotalSpent
from customer c
join orders o on c.customer_id = o.customer_id
where o.order_date >= current_date - interval '1 year'
group by c.customer_id
having sum(o.bill_amount) > 51;```




-- 3.Book which have better user ratings than average

```select b.book_id, b.book_title, avg(r.ratings) as AvgRating
from Book b
join review r on b.book_id = r.book_id
group by b.book_id
having avg(r.ratings) > (select avg(ratings) from review);```

| Book ID | Book Title  | Average Rating   |
|---------|-------------|------------------|
| 4       | The Women   | 4000000000000000 |
| 2       | Fourth Wing | 4.50000000000000 |



-- 4.Most popular genre by sales

```select book_genre, sum(order_item.quantity) as total_sales
from book
join order_item on book.book_id = order_item.book_id
group by book_genre
order by total_sales desc
limit 5;```

| Book Genre         | Total Sales |
|--------------------|-------------|
| Fantasy            | 2           |
| Fiction            | 2           |
| Thriller           | 1           |
| Romance            | 1           |
| Historical Fiction | 1           |


-- 5.10 most recent review posted by customers

```select r.review_id, r.book_id, b.book_title, r.customer_id, c.first_name, r.ratings, r.review_comment, r.review_date
from review r
join book b on r.book_id = b.book_id
join customer c on r.customer_id = c.customer_id
order by r.review_date desc
limit 10;```

| Review ID | Book ID | Book Title           | Customer ID | First Name | Ratings | Review Comment         | Review Date |
|-----------|---------|----------------------|-------------|------------|---------|------------------------|-------------|
| 1         | 2       | Fourth Wing          | 101         | Akida      | 4       | Excellent Book!        | 25-09-2023  |
| 4         | 2       | Fourth Wing          | 104         | Swati      | 5       | Nice book to Recommend | 25-05-2023  |
| 2         | 5       | First Lie Wins       | 102         | Prachi     | 3       | Nice Book!             | 02-01-2023  |
| 5         | 4       | The Women            | 105         | Mayank     | 4       | Fantastic story!       | 22-09-2022  |
| 3         | 3       | Bridge to Terabithia | 103         | Divtej     | 2       | Quite slow!            | 15-05-2022  |


