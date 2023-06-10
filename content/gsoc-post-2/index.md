+++
title = "Getting started with GSoC@PostgreSQL"
description = "First Bi-weekly post on my work during GSoC "
date = 2023-06-08
draft=false

[taxonomies]
categories = ["gsoc","postgresql","tech","open-source"]
+++

Hi all, Hope you are doing great!

This is the first biweekly post of my learning and understanding about PostgreSQL and the community alongside working on my proposal. My project is about creating an extension in Postgres that captures statistics and helps in monitoring of a running server.
During the community bonding period(3th May,23 - 28th May,23), I spent most of my time understanding about the features on an high level, to look forward of what could be exactly important with respect to my project.

It wasn't late that I understood that there isn't anything in Postgres that doesn't need monitoring. Every single SQL queries creates lots of changes internally to produce the desired result. PostgreSQL collects a number of statistics but what it doesn't do is what [pg_statviz](https://github.com/vyruss/pg_statviz) tries to fulfill. Provide cumulative statistics over timerange to analyze changes overtime.

## Modules Increase

There were multiple tables/views which I found that could provide valuable insights if queried over long time. Analysis on some of them are:

### Uptime

Having an uptime statistics is useful to know the count of server crashes in that time interval. 

The `pg_postmaster_start_time()` function in psql helps to fetch the time when Postgres started, which can be easily utlilized to fetch the uptime.

### Locks

Postgres offers [8 types](https://www.postgresql.org/docs/current/explicit-locking.html#:~:text=Table%2DLevel%20Lock%20Modes) of locks on tables. Each lock has it's utility and level of blocking access to different SQL queries. 

High number of concurrent locks can be a reason of high response time of DML SQL queries. As the avg number of locks increases, more the queries need to wait to be processed. 

The internal postgres view `pg_locks` provides details of every lock currently applied on every table in the database.

While `mode` column in `pg_locks` tells which type of lock is applied, the `pid` tells the pid of the connection creating that lock.

But what if a table wants an Exclusive lock on a table which the another lock is already imposed?

In that case the connection needs to first wait to obtain that lock causing delays. A false value `granted` column indicates that lock is needed but isn't granted , meaning connection waiting for lock, and the `waitstart` tells the start time for the wait of lock. This is pretty useful to observe incases the wait time exceeds a lot.


### User Tables and Indexes

It's pretty fascinating to understand what goes behind the scene of DDL and DML queries on tables. Inserting rows does not imply data is written instantly to disk and deleting doesn't mean the row is permanently lost. 

[MVCC](https://www.postgresql.org/docs/current/mvcc.html) or Multi-Value Concurrency control is a feature in Postgres which handles multiple values accross various transactions. A values getting deleting from one transaction doesnt mean getting wiped off from others, kudos to MVCC. 

The `pg_stat_user_tables` and `pg_statio_user_tables` provide statistical information about the tables created by a user, and similar views exist for index too.

The `*_blks_hit` refer to the rows which needed to be fetched from the disk and `*_blks_read` refer to fetching from the cache. This value helps in understanding the cache hit/ read ratio which indicated how many times the cursor needed to go to the disk to fetch a row. Higher the value, more the query response time.

An important column is the `n_dead_tuple` which indicated the rows which have been updated or deleted and are no longer needed by any running transactions. The next time vacuum runs, these rows are permanently removed from the server.

Similar views exist for table which help in getting to know how many times an index was utlized over a seq scan on that table. Incase the index is less utilized, it is an appropriate time to understand and tune the table indexes and constraints on which indexes are built. 

# Testing over platforms

Since the views have been developed slowly over the years, there is a high chance that every view might not be available in all the latest version. Hence Testing over all readily maintained version of Postgres was needed.

To implement that, I created a Github Action that checks the extension over all major versions (>=10) parallely in matrix formation. 
To do this I too help of the [PGXN Tool Docker Image](https://hub.docker.com/r/pgxn/pgxn-tools) which builds and starts a Postgres cluster in a docker container. 
Post the Cluster is started, the extension is installed and Regression tests are run to check the working. The Github Action for my tests can be found [here](https://github.com/rajivharlalka/pg_statviz/blob/master/.github/workflows/main.yml).

<br/>


Understanding the utility of these views, I created respective modules utilizing these views/tables which can be more explored in this [Pull Request](https://github.com/vyruss/pg_statviz/pull/6).

Have also been active on multiple platforms such as Slack, Reddit and mailing lists of PostgreSQL trying to understand people's queries and answering a few. 

Also have been trying to maintain an readily updated [public Gist](https://gist.github.com/rajivharlalka/f9a54c95eeafeef58734e2006f957fed) with my findings, readings and learning these days. Would be happy to answer any queries over any media and am open to suggestions to ideas if any :). 

Fin.