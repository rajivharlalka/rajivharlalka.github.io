+++
title = "Spending Winter in an ideal Way"
description = "My experience in help improving search experience"
date = 2022-01-10
draft=false

[taxonomies]
categories = ["intern","felvin","tech"]
+++

Good search results are one of the most basic tasks that a search engine performs. Google is famous for this ability and hence is the **most** used search engine. But it is afterall the world of technology where things dont stay constant forever. As technology evolves , new and better alternatives emerge.

[Felvin](https://felvin.com) is such of this kind. Since Felvin consumes search data from different search engines, it provides a cherry on top what they provide. Providing a better search experience is what Felvin looks forward to . 

## Topic of Work and Motivation behind it

Looking for code syntax, implemenations and snippets are the daily needs of any developer. This becomes a lot tedious a lot when this simple task requires the user to jump between sites to find relevant data. Making an instant app for `Reference Implementation of Code Snippets` was the topic that I took up as my project.

## Implementation of my work

There exists various open source project where algorithms in various languages have been compiled. Two of them were [Rosetta code](http://www.rosettacode.org/wiki/Rosetta_Code) and [The Algorithm](https://the-algorithms.com/). Their code snippets was kept in well maintained directory structure which I used to compile a single json using a js script. After the json was made , much of the task was done.

 A simple API service which took the query string and parsing the algorithm and language was enough to look for the specific code snippet. This code snippet was sent over over to the React app(or [instant app](https://github.com/felvin-search/instant-apps) in Felvin's terminology) where the input was passed down to the [Monaco editor](https://github.com/suren-atoyan/monaco-react) component which rendered on the user's screen. The main benefit of using the Monaco Editor rather than custom styling a textbox was the inbuilt vscode feature it provides, Code Suggestions 

Demo:

Sample Query :[here](https://sandbox.felvin.com/search?q=breadth%20first%20search%20in%20javascript)

<img width="100%" src="./intern.gif"/>

In short , I spend my winter learning , breaking stuff and building connections with new people around. Thanks to [Harsh](https://hargup.in/) for providing this opportunity and being a great mentor along the way and [Sahil](https://sahil-shubham.in/) for the consistent much-needed help during the whole time.