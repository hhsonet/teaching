---
layout: page
title: Project
nav_order: 5
description: Team project that applies structures, functions and file handling.
---

# Project

Teams of three students design and build a C program that addresses a practical, real-world scenario. The project integrates structures, functions and file handling in a single application. It carries 20 marks, including a 5-mark viva.

## Overview

- **Team size:** three students per team. Submit one set of files listing all three names.
- **Scenario:** a practical problem that involves records to be stored, searched and updated.
- **Schedule:** team formation and scenario approval by class 5, before the midterm. Design in week 10. Implementation, submission and demonstration in week 11.

## Scenario options

- **Hostel room allocation:** rooms, residents, bed assignments and vacancy reports, with allocations saved to a file
- **Campus lost and found:** reported items, finder and owner details, claim status, and search by category or date
- **Community tool library:** neighbours borrow tools such as drills and ladders, with due dates, late fees and damage notes
- **Farm harvest and market tracker:** crop records, yield per plot, selling prices by week, and profit or loss per crop
- **Prepaid electricity meter billing:** customer accounts, meter readings, units consumed, bill calculation and payment history
- **Courier parcel tracker:** parcels, sender and receiver records, status updates along the route, and delivery reports
- **Canteen meal-plan ledger:** prepaid student balances, meal purchases, top-ups and a monthly spending summary

Teams may propose an alternative scenario. It must be approved before development begins.

## Technical requirements

1. **Structures:** at least two struct types, one nested within the other, and an array of structs to hold the records.
2. **Functions:** at least eight functions, each with a single responsibility. Use parameters and return values, and include at least one function that modifies data through a pointer parameter.
3. **File handling:** read and write at least one file using fopen, fclose, and either fprintf and fscanf or fwrite and fread. Stored data must persist between program executions.
4. **Menu-driven interface:** a main menu, presented in a loop, with options such as add, view, update, delete, search and save.
5. **Input validation and error handling:** invalid input is rejected, and file-open failures are reported without terminating the program unexpectedly.

Organise the implementation into modules, for example a main program file, a records module and a file-handling module, each with a corresponding header file.

## Team roles

Each member is assigned a primary responsibility, which also supports CO4:

- **Member 1, data structures:** defines the structs and implements the add, update and delete functions.
- **Member 2, file handling:** implements the load and save functions and prepares the sample data file.
- **Member 3, interface and testing:** implements the menu, designs the test cases and leads the report.

All members review the final code together before submission.

## Deliverables

- Source code (.c and .h files), with a header comment and a comment for every function
- A sample data file, with representative test input and the expected output
- A project report of 2 to 4 pages, covering the scenario, the structures and functions, compilation and execution instructions, and a table of individual contributions
- A demonstration in week 11, in which each member explains their own component

## Assessment (20 marks)

| Criterion | Marks |
|---|---|
| Working menu and features | 3 |
| Correct use of structures | 3 |
| Modular functions | 3 |
| File handling and data persistence | 3 |
| Code style, comments and input validation | 1 |
| Report | 2 |
| Viva: individual explanation of each member's component | 5 |
| **Total** | **20** |

## Rules

- All code must be the team's own work. Copied code, whether from other teams or external sources, receives zero marks.
- Each member must be able to explain and modify their own component during the viva. Individual viva marks depend on this.

See the [syllabus](syllabus.md) for the full course assessment breakdown.
