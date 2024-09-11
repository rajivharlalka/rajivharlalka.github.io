---
title:  "Start With Passion: GSoC'23 under PostgreSQL"
description: "My selection journey for GSoC'23 for PostgreSQL org"
publishDate: "2023-05-26"
draft: false

tags: ["gsoc","postgresql","tech","student","open-source"]
coverImage:
    src: "./img1.png"
    alt: "GSoC with PostgreSQL Logo"
---

This post is about my journey from reading about DBMS and Relational databases to actually getting to work on them. Recently Google Open Source Team released the GSoC'23 results and I am glad to be selected to contribute for the prestigious [PostgreSQL](https://postgresql.org) org. 

My journey with the love of databases all started from when [Shubham Mishra](https://grapheo12.in), my college senior, gave me the task of presenting a [15-min talk on Database Management System](https://slides.rajivharlalka.in/DBMS/index.html) as a part of [KOSS](https://kossiitkgp.org) interview process. That 1 week of learning made me inspire to what I would get to do for the next few months.

## The start of all of it

### Why Open-Source

Because Community is what makes you better. Open Source is all about working about working in public and indulging in arguments on why not this. It's easier to accept someone else's idea than finding a better solution to it. This is where community plays a pivotal role, where people of all mindset come together to argue on nitty-gritties of software engineering. 

I believe it might be easier to build out something in the corner but what if nobody actually uses it. Having a community also helps in getting constant feedback on the demand of people who are actually in the same domain. 

Also the joy of helping others doesn't go un-counted.

### Why GSoC

I believe I had the motivation of trying GSoC mainly because of three reasons:
- Great way to spend summer working in public and develop a great project.
- Get to meet new people from the community and having understand their journey.
- Money

### Why PostgreSQL

I had been greatly curious in understanding the internals of how databases work. and any simple google search in relevant topic would pop up one of postgresql's as the top search result. This motivated me more towards reading about PostgreSQL in general and it's manual became my Gita for database, a goto place for all my queries. 

Looking at the list of proposed projects for GSoC'23 , I found pg_statviz very interesting and hence I went for working on a proposal for it.

## More about my project

[pg_statviz](https://github.com/vyruss/pg_statviz) is a modular and minimal PostgreSQL extension that captures cumulative dynamic as well as static statistics about a running PostgreSQL server. Time Series analysis on stored statistics would provide invaluable information in solving bottleneck issues and tuning performance of the server.
A python command line tool would help in generating graphs to help these statistics visually. 

This project would help me understand better about the different internal tables and understanding postgresql's working.


I would thank my seniors especially [Shivam Kumar Jha](https://github.com/thealphadollar) and [Yash Sharma](https://github.com/yashrsharma44) for being my constant source of motivation throughout my Proposal period. Hope I get learn a lot from this opportunity as a mentee for PostgreSQL under GSoC'23 
