+++
title = "Magic with Generate Series in PostgreSQL"
description = "My experience with generate_series to generate test data in PostgreSQL for testing"
date = 2023-06-23
draft=false

[taxonomies]
categories = ["postgresql","gsoc","tech"]
+++

Hi everyone,

Recently I was pretty much involved in reading and understanding different parts of PostgreSQL, especially the cumulative and static statistics collector.
Even more, the concepts of wal, replication, and archiving being some of the building blocks of how PostgreSQL handles multiple transactions were fascinating.

To test different features, I needed data. And that too lots of data. I nearly filled my 1 Terabyte HDD generating test files to check out all types of queries, short-lived and long-running.

`generate_series` is a function in PostgreSQL which was my helper in all the tests. It's a simple function that takes 3 arguments, start - end, and interval, and generates rows in that range. Using multiple tweaks these simple functions can be used to generate a variety of data which can be extremely helpful in understanding PostgreSQL.

Here are some of the tricks I read/learned/used to generate sample data for lots of testing.

## Integer Series

```SQL
-- Simple generation of integers 1..10 and 1,3..17,19
select generate_series(1,10),generate_series(1,20,2);   -- https://dbfiddle.uk/7nzIxoc3

-- decreasing sequence
select generate_series(20,10,-1); -- https://dbfiddle.uk/VM6rK88I

-- series of random integers
select (random()*100)::integer from generate_series(1,10); -- https://dbfiddle.uk/h9GW9Kl2
```

## Character and Strings

```SQL
-- a sequence of characters
select chr(i) from generate_series(48,57) i; -- https://dbfiddle.uk/ts78-LdF
-- a sequence of repeating characters
select repeat('*',i) from generate_series(1,10) i; -- https://dbfiddle.uk/1KZ6GBDu
```

A bit complex query to generate names can be done using this:

```SQL
select (
    select string_agg(x, '')
    from (
        select arr[(random()* 31):: int % 10]
        FROM
          (
            SELECT
              '{AO, AB, MC, ED, OF, JE, NC, OQ, BN, KE}':: TEXT[] as arr
          ) as name_syll,
          -- three-syllable words
          generate_series(1, 3 + id*0)
      ) as name_syll(x)
  ) as name
from generate_series(1, 10) as id; -- https://dbfiddle.uk/5Nvx3xkw
```

The most important part here is the id\*0 which forces a new name to be generated on every iteration. It has zero contribution in calculating the value but it makes the string_aggregator run again for every new value of name.

## Timestamping Time

```SQL
-- days of a week
select generate_series(timestamp '2023-06-25', timestamp '2023-06-25' + interval '1 week', interval '1 day'); -- https://dbfiddle.uk/88f5ZQQ6
-- first and last days of every month of a year
select
  id,
  id + interval '1 month - 1 day'
from
  generate_series(
    timestamp '2023-01-01', timestamp '2023-12-01',
    interval '1 month'
  ) id; -- https://dbfiddle.uk/3VAuatDu
```

## Some fun Tweaks

#### Generate All IPv4 Addresses in CIDR Notation

```SQL
select
  (a::TEXT||'.'||b::TEXT||'.'||c::TEXT||'.'||d::TEXT):: CIDR from
(
  generate_series(0,255) a
            cross join
  generate_series(0,255) b
            cross join
  generate_series(0,255) c
            cross join
  generate_series(0,255) d
);
-- https://dbfiddle.uk/dgvEkDCW
```

Caution before executing this query: The number of rows would be 256^4 = 4,294,967,296 ~ 4.2 Billion and will take up lots of space. I tried this on my system with addresses starting with 0 (0.\*.\*.\*) and taking 5 minutes of execution, the table size was ~14 GB hence perform at its own risk.

#### A Normal Distribution

From PostgreSQL 16, a new function `random_normal` is being included in the core which will make this easy. Till then writing the functions manually is the best bet available.

```SQL
-- Referenced from https://stackoverflow.com/questions/53687946/beta-and-lognorm-distributions-in-postgresql
CREATE OR REPLACE FUNCTION norm(N INTEGER, mu FLOAT = 0, sigma FLOAT = 1)
RETURNS SET OF FLOAT AS
$BODY$
SELECT
    sigma*sqrt(-2.*ln(random()))*cos(2*pi()*random()) + mu
FROM
    generate_series(1, N) AS i;
$BODY$
LANGUAGE SQL;

select norm(10000);
```

#### Generating data with weights

Suppose we want our data to be generated as follows:

- 75% of data should be 1
- 15% of data should be 2
- 5% of data should be 3
- 3% of data should be 4
- Remaining 2% should be 5

After some trying and testing, could come up with a function that works this way:

```SQL
SELECT
    values. value
FROM (
    SELECT
    -- 10000 here are parts which represent 100 by extrapolated
        FLOOR(random() * 10000) AS random_value
    FROM
    -- Here the end is the number of values needed to generate.
        generate_series(1,1000000) i
    ) x,
    ( VALUES
        (1, 0, 7500),     (2, 7501, 9000),  (3, 9001, 9500),
        (4, 9501, 9800),  (5, 9801, 10000)
    ) AS values (value, strt, ending)
WHERE
    x.random_value BETWEEN values.strt AND values.ending;
```

This works in a way that it generates a random_value and for each such value checks which values.value fits in the range of start and end each weight.
The start and end are weights but extended from 100 to higher powers for more granular control.

To test this I performed a test to check the percentage of each value generated and here is the result:
| id |float8 |
|--|---|
|1 | 0.750275|
|2 |0.149736|
|3 | 0.05017|
|4 |0.029985|
|5 |0.019834|


Can try it out yourself at https://dbfiddle.uk/3yBKJYFz.

I also found another way of doing this after celebrating my joy of writing this function. It was a [ blogpost by Depesz](https://www.depesz.com/2022/11/30/picking-random-element-with-weights/) which uses a for loop to find random values in the range. Clever.

---

Most of the ideas originated while I found some articles/blogs/problems where a dataset was needed to understand and analyze the query better.
Ig that would be it for this one too.

Fin.