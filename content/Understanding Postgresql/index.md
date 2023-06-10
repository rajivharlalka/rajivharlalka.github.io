+++
title = "Understanding PostgreSQL"
description = "This is a brief writeup of my understanding PostgreSQL on a high level"
date = 2023-06-06
draft=false

[taxonomies]
categories = ["postgresql","tech","open-source"]
+++

Hi all, Hope everyone is doing fine.

During my recent calls with my GSoC Mentors to discuss on my project, I was quite often asked to understand all moving parts of PostgreSQL atleast from a high level. In this writeup I would briefly discuss what I learnt and understood and maybe posts respective to each topic might follow-on later.

The main places where I had been acquiring knowledge were blogs by depesz , PostgreSQL documentation and watching conferences on Youtube. Examining the different features which PostgreSQL offers, it was quite remarkable to see that how the SOLID principles apply here. Seperability of Concern was something quite visible, each part has it's own function and it is best at doing it's job without interfering others. Below are some of them which I found quite Interesting to talk

## GUC: Grand Unified Configuration 

GUC or Grand Unified Configuration are some configuration parameters in PostgreSQL which control the working of every other part. There are 350+ GUC stored in `$PGDATA/postgresql.conf` that can be tuned. Every GUC has a different function and the .conf file has been seperated nicely as per the category in their function is.

Properties such as `work_mem`, `shared_buffers` control the memory usage of the server , while `seq_page_cost`, `random_page_cost` help the query planner undestand a better plan to find the data.

Configurations around Logging, Replication, Vacuuming are all present in the same configuration file segmented out in parts to be used as necessary. The conf file also allows `include` directives incase someone wishes to have seperate files for every Segment. Such cases are helpful when one wishes to have different configuration quite often, such as a `vacuum.conf.day` and `vacuum.conf.night` soft linked to `vacuum.conf` as per need. This even helps in easy knowing which configuration is currently used by just checking the file which the main config is linked to (using `ls -la`).  

There are multiple interepretation of anomalies happening due to incorrect values of GUC's. For example: A large number of temporary tables being created indicates less `work_mem` as data is spilled to disk and temporary tables are created to sort, and anaylze rows.

## Logging

PostgreSQL offers varieties of option to configure Logging. Apart from an `stdout`,  logging as a csv, json and syslog are available. 

Apart from the other granular details, one important thing to use and notice is log rotation. Once set, the file in which log is to be written changes automatically. This is useful in cases if logs of specific day and time is to be visualized. 

## WAL: Write Ahead Log

This is another type of log but not exactly log. Wal files help in event of crash to rewind and restore the database. It also helps in reducing the number of disl writes sync making the queries faster. There is an another process running that cleans up these WAL files and flushes data to disk once transactions related to them are complete.

Configuring the value of `max_wal_size` and `checkpoint_timeout` one can change how fast or slow checkpointers are going to flush the value in disk. Frequent checkpoints help in faster recovery incase of crashes but it comes at a cost [1]. Very frequent checkpoints can cause higher wal production, resulting in a unexpected i/o.

## pg_dump and pg_basebackup

There are various cases where data from a server needs to be shifted/copied to anther location/server. Postgres provides two major ways of doing it.
1. pg_dump (Logical Replication)
2. pg_basebackup (Physical Replication)

In case of pg_dump or Logical Replication, Postgres generates a SQL file that if replayed in another new Postgres server, would generate the exact same data. It flushes all the rows ,tables and users necessary to create the replica of the server. Indexes need to be created again since pg_dump generates the SQL that can create the same index again. This is a disadvantage as it might take hours to generate everything back again.

A workaround for this is replicating using basebackup , which does physical replication. The replicated instance is ready to be up and running in seconds.

> So, why even do a pg_dump? <br/>
> >Physical Replication are more error prone in case the system configurations do not match. OS versions, Locale settings are soemething that needs to be checked in such cases [2]


This would be it for this post, would be reading more about each part individually and soon try to write seperate posts for them.

Fin.

---

[1]: https://www.postgresql.org/docs/current/wal-configuration.html#:~:text=Reducing%20checkpoint_timeout%20and,disk%20I/O.pg
[2]: https://wiki.postgresql.org/wiki/Locale_data_changes