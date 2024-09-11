---
title: "Recursive Macros in vim"
description: "Optimizing Vim Macro usage using Recursions"
publishDate: "10 June 2023"
draft: false

tags: ["tech","vim"]
---

We all know about Recursions, right?

> Google defines Recursions as: 
>> A process or a concept that involves repeating items in a self-similar way.

Recursions is considered a quite complex topic when it comes to programming in C. 
Even NASA prohibits the use of recursive functions in their code.[1]

But what if that very recursion can help in code formatting blazingllllly fast.

## Abstract

Since the past few months, I have been trying to adapt myself with the vim (yes ik NeoVim is better) ecosystem. To start with it, I chose not to directly jump with using Nvim but use the VScode Extension Vim , that provides most vim features inside VScode itself. This has helped me learn the bindings better without going through the pain of writing my own NVim dotfiles first. 

Hence I have two workflows at the moment:
1. Use Vscode with Vim Extension: When need to do things fast.
2. Use NVim with my less understood config: When I can take time writing code and finding better keymaps of doing things faster.

## Problem

Recently I was migrating an old Python2 script to Python3, and the main pain came when I needed to convert all `print string` to `print(string)`. There were around 120 of such converions.

```python
#Small snippet of code
def load(self, program_description):
  proc_id = self.new_process()
  tmp = program_description.split(':')
  if len(tmp) != 2:
    print 'Bad description (%s): Must be number <x:y>' % program_description
    print 'where X is the number of instructions'
    print 'and Y is the percent change that an instruction is CPU not IO'
    exit(1)

```

Macros looked the best way to do this the fastest. So a simple `qqqqqwd$i(<Esc>pq` macro when the cursor is on the print word.

Explaining the macro:

- `qqq` - Clear the q register.
- `qq` - start recording macro on q registor
- `wd$` - delete and store everything in line except the (<Enter>` before starting the macro did the work.)print(word) 
- `i(<Esc>` - Enter the insert mode, add the opening braces and go back to normal mode.
- `pq` - Paste the content to be inside braces and end recording the macro.

This macro was ready to be used using `@q`. 

## A Better solution

What suddenly popped into my mind was if I used the macro to even call itself. A simple append change in the macro and making it
`qqqqqwd$i(<Esc>pn@qq` and triggering a search using `/print` before starting the macro.

What the extra `n@q` does is automatically move to the next find of the _print_ keyword and start the macro again. 

But here starts the doom. With having a basic idea of how search using / works in vim, it is understandable that this would not stop ever. 

Once the cursor reaches the end of last _print_ in the file, it starts to find the keyword again from the start of file and will execute the macro again on the already formatted lines. This can lead to variety of abnormalities depending how you file was structured.

## Solution to Problem

So a basic intution is to see how to stop the macro from running once it reaches end of file. 

Another point to be noted is macros stop running if any command in the macro fails. So we need to redesign the macro such that it detects end of file. Have not yet found a very brilliant solution to this yet, would update when have one.

Was referred to a solution of using this vim command `:g/print/normal f'i(^[f'a)` where `^[` is Escape character on [reddit](https://www.reddit.com/r/vim/comments/1464f34/help_with_writing_a_macro/?utm_source=share&utm_medium=web2x&context=3) but this doesn't solve the issue completly too. 


## Exceptions

I too ended up in few exceptional cases which I had to fix manually in the end. Some of them were,
- Lines ending with a `,` . This made it terrible as some lines had `,` in the middle too and splitting only from the end was pain.
- Strings having `print` too. This was the most frustrating exception. The line string truncated again from the middle and threw things haphazard. Though a solution of this could have been made by always moving to next line and then to the first word, but yes I got lazy. 

Would like to know if anyone has any solution to this problem. :)

Fin.


--- 

[1]: https://craftofcoding.wordpress.com/2021/03/08/why-does-nasa-not-allow-recursion/#:~:text=NASA%20is%20not%20the%20only%20company%20to%20negate,indirectly%20%28i.e.%20recursion%20shall%20not%20be%20allowed%29%20%E2%80%9D.