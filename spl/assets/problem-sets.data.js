/*
 * C Programming Problem Sets - content manifest.
 * Edit this file to add or change problem sets; the page reads everything from here.
 *
 * ProblemSet: id, number, title, description, topics[], difficulty ("Beginner"|"Intermediate"|"Advanced"),
 *   problemCount, fileType ("pdf"|"document"|"online"), fileSize?, downloadUrl?, publishedAt, updatedAt?,
 *   resources?[{ label, fileType, fileSize?, url }], objectives?[], problems[]
 * Problem: number, title, statement (wrap inline code in backticks), code?, inputFormat?, outputFormat?,
 *   sampleInput?, sampleOutput?, constraints?[]
 *
 * File links (downloadUrl, resources[].url) are relative to assets/problem-sets/. The page checks that each
 * file exists and hides the ones that do not, so a set without its file shows "not yet available".
 */
window.PS_DATA = {
  SITE: { courseTitle: "Structured Programming Language", courseShort: "SPL", author: "Hamudi Hasan Sonet", year: 2026 },
  PROBLEM_SETS: [
    {
      id: "ps-01", number: 1,
      title: "Introduction to C and Basic Input/Output",
      description: "Write your first C programs: program structure, printf format specifiers, reading values with scanf and using escape sequences.",
      topics: ["Basics & I/O"], difficulty: "Beginner", problemCount: 5, fileType: "pdf", fileSize: "5.2 KB",
      downloadUrl: "materials/ps-01.pdf", publishedAt: "2026-07-14",
      objectives: ["Recognise the structure of a C program", "Print text and values with printf", "Read integers, reals and words with scanf", "Use escape sequences in output"],
      problems: [
        { number: 1, title: "Hello, Course", statement: "Write a program that prints the line `Hello, ICS!` followed by a newline.", outputFormat: "A single line of text.", sampleOutput: "Hello, ICS!" },
        { number: 2, title: "Echo an Integer", statement: "Read one integer from standard input and print it back in the format `You entered: N`.", inputFormat: "A single integer N.", outputFormat: "One line: You entered: N", sampleInput: "42", sampleOutput: "You entered: 42", constraints: ["-10^9 <= N <= 10^9"] },
        { number: 3, title: "Formatted Receipt", statement: "Read an item name (a single word), a quantity and a unit price. Print the item, the quantity and the total cost formatted to exactly two decimal places.", inputFormat: "A word, an integer and a real number separated by spaces.", outputFormat: "Three lines as shown in the sample.", sampleInput: "pencil 3 12.5", sampleOutput: "Item: pencil\nQty: 3\nTotal: 37.50", constraints: ["1 <= quantity <= 1000", "The item name has at most 30 characters"] },
        { number: 4, title: "Escape Sequences", statement: "Print exactly the three lines shown in the sample output. Use the escape sequences `\\\"`, `\\\\` and `\\t` rather than typing special characters directly. The third line begins with a tab.", outputFormat: "Three lines of text.", sampleOutput: "She said \"C is fun\".\nPath: C:\\ics\\lab1\n\tTabbed line" },
        { number: 5, title: "Predict the Output", statement: "Without running it, write down the exact output of the program below. Then compile and run it to check your answer, and explain any difference between `7 / 2` and `7 / 2.0`.", code: "#include <stdio.h>\n\nint main(void) {\n    printf(\"%d %d\\n\", 7 / 2, 7 % 2);\n    printf(\"%.1f\\n\", 7 / 2.0);\n    return 0;\n}" }
      ]
    },
    {
      id: "ps-02", number: 2,
      title: "Variables, Data Types, and Operators",
      description: "Declare variables of the right type, apply arithmetic and assignment operators, and understand integer versus real division.",
      topics: ["Variables & Operators"], difficulty: "Beginner", problemCount: 5, fileType: "pdf", fileSize: "5.3 KB",
      downloadUrl: "materials/ps-02.pdf", publishedAt: "2026-07-21",
      objectives: ["Choose between int, float, double and char", "Apply arithmetic, modulus and assignment operators", "Convert between types safely", "Inspect type sizes with sizeof"],
      problems: [
        { number: 1, title: "Rectangle Area and Perimeter", statement: "Read the width and height of a rectangle and print its area and perimeter.", inputFormat: "Two integers W and H.", outputFormat: "Two lines: Area and Perimeter.", sampleInput: "4 7", sampleOutput: "Area: 28\nPerimeter: 22", constraints: ["1 <= W, H <= 10^4"] },
        { number: 2, title: "Temperature Conversion", statement: "Read a temperature in degrees Celsius and print it in degrees Fahrenheit using `F = C * 9 / 5 + 32`. Make sure the division is not performed on integers.", inputFormat: "A real number C.", outputFormat: "F rounded to two decimal places.", sampleInput: "36.6", sampleOutput: "97.88" },
        { number: 3, title: "Swap Two Numbers", statement: "Read two integers a and b, swap their values using a temporary variable, then print them.", inputFormat: "Two integers a and b.", outputFormat: "a = X, b = Y", sampleInput: "3 9", sampleOutput: "a = 9, b = 3" },
        { number: 4, title: "Seconds to Time", statement: "Read a number of seconds and convert it to hours, minutes and seconds using `/` and `%`.", inputFormat: "A single integer S.", outputFormat: "One line in the format shown.", sampleInput: "3725", sampleOutput: "1 hour(s), 2 minute(s), 5 second(s)", constraints: ["0 <= S <= 86399"] },
        { number: 5, title: "Sizes of Data Types", statement: "Run the program below on your machine and record the output. In two or three sentences, explain why the size of `int` can differ between systems while `char` is always 1 byte.", code: "#include <stdio.h>\n\nint main(void) {\n    printf(\"char:   %zu bytes\\n\", sizeof(char));\n    printf(\"int:    %zu bytes\\n\", sizeof(int));\n    printf(\"double: %zu bytes\\n\", sizeof(double));\n    return 0;\n}" }
      ]
    },
    {
      id: "ps-03", number: 3,
      title: "Conditional Statements",
      description: "Make decisions with if, else if, else and switch, using relational and logical operators.",
      topics: ["Conditionals"], difficulty: "Beginner", problemCount: 5, fileType: "pdf", fileSize: "4.8 KB",
      downloadUrl: "materials/ps-03.pdf", publishedAt: "2026-07-28",
      objectives: ["Write if / else if / else chains", "Combine conditions with && and ||", "Use switch for discrete choices"],
      problems: [
        { number: 1, title: "Even or Odd", statement: "Read an integer and report whether it is even or odd.", inputFormat: "A single integer N.", outputFormat: "N is even / N is odd", sampleInput: "17", sampleOutput: "17 is odd" },
        { number: 2, title: "Largest of Three", statement: "Read three integers and print the largest one.", inputFormat: "Three integers.", outputFormat: "The largest value.", sampleInput: "4 19 7", sampleOutput: "19" },
        { number: 3, title: "Leap Year", statement: "A year is a leap year if it is divisible by 4 and not by 100, or if it is divisible by 400. Read a year and print whether it is a leap year.", inputFormat: "A single integer Y.", outputFormat: "Leap year / Not a leap year", sampleInput: "2024", sampleOutput: "Leap year", constraints: ["1 <= Y <= 9999"] },
        { number: 4, title: "Grade Calculator", statement: "Read a score and print the letter grade: 80 and above is A+, 70-79 is A, 60-69 is B, 50-59 is C, 40-49 is D and below 40 is F. Print `Invalid score` for values outside 0-100.", inputFormat: "A single integer score.", outputFormat: "The letter grade.", sampleInput: "73", sampleOutput: "A" },
        { number: 5, title: "Vowel or Consonant", statement: "Read a single lowercase letter and use a `switch` statement to print whether it is a vowel or a consonant.", inputFormat: "One character.", outputFormat: "Vowel / Consonant", sampleInput: "e", sampleOutput: "Vowel" }
      ]
    },
    {
      id: "ps-04", number: 4,
      title: "Nested Conditions and Decision Making",
      description: "Structure multi-step decisions with nested conditions, validate input first and handle edge cases explicitly.",
      topics: ["Conditionals"], difficulty: "Intermediate", problemCount: 4, fileType: "pdf", fileSize: "4.9 KB",
      downloadUrl: "materials/ps-04.pdf", publishedAt: "2026-08-04", updatedAt: "2026-08-06",
      objectives: ["Validate input before processing", "Nest conditions without losing readability", "Handle boundary and error cases"],
      problems: [
        { number: 1, title: "Triangle Classification", statement: "Read three side lengths. First check that they form a valid triangle (the sum of any two sides must be greater than the third). If valid, classify it as Equilateral, Isosceles or Scalene.", inputFormat: "Three positive integers.", outputFormat: "Equilateral / Isosceles / Scalene / Not a triangle", sampleInput: "5 5 8", sampleOutput: "Isosceles" },
        { number: 2, title: "Quadrant Finder", statement: "Read the coordinates of a point and print the quadrant it lies in. Points on an axis should print `On the x-axis` or `On the y-axis`, and (0, 0) should print `Origin`.", inputFormat: "Two integers x and y.", outputFormat: "One line.", sampleInput: "-3 4", sampleOutput: "Quadrant II" },
        { number: 3, title: "Electricity Bill", statement: "Units are charged in tiers: the first 100 units at 5.00 per unit, the next 100 units at 7.50 per unit, and every unit beyond 200 at 10.00 per unit. If the total exceeds 1500.00, add a 5% surcharge. Read the units consumed and print the final bill.", inputFormat: "A single integer U.", outputFormat: "Total: X with two decimal places.", sampleInput: "250", sampleOutput: "Total: 1837.50", constraints: ["0 <= U <= 10^5"] },
        { number: 4, title: "Simple Calculator", statement: "Read an expression of the form `a op b`, where op is one of `+ - * / %`. Print the integer result. If the operation is division or modulus by zero, print `Error: division by zero`. For any other operator print `Unknown operator`.", inputFormat: "An integer, an operator character and an integer.", outputFormat: "The result or an error message.", sampleInput: "12 / 4", sampleOutput: "3" }
      ]
    },
    {
      id: "ps-05", number: 5,
      title: "Loops and Repetition",
      description: "Repeat work with for, while and do-while loops, including counters, accumulators and sentinel-controlled input.",
      topics: ["Loops"], difficulty: "Beginner", problemCount: 5, fileType: "pdf", fileSize: "5.7 KB",
      downloadUrl: "materials/ps-05.pdf", publishedAt: "2026-08-11",
      objectives: ["Choose between for, while and do-while", "Use counters and accumulators", "Process input until a sentinel value"],
      problems: [
        { number: 1, title: "Sum from 1 to N", statement: "Read N and print the sum 1 + 2 + ... + N using a loop. Use a type that will not overflow for the largest input.", inputFormat: "A single integer N.", outputFormat: "The sum.", sampleInput: "10", sampleOutput: "55", constraints: ["1 <= N <= 10^6"] },
        { number: 2, title: "Multiplication Table", statement: "Read an integer n and print its multiplication table from 1 to 10.", inputFormat: "A single integer n.", outputFormat: "Ten lines in the format shown.", sampleInput: "7", sampleOutput: "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70" },
        { number: 3, title: "Count Digits", statement: "Read a non-negative integer and print how many digits it has. Note that 0 has one digit.", inputFormat: "A single integer N.", outputFormat: "The number of digits.", sampleInput: "90210", sampleOutput: "5", constraints: ["0 <= N <= 2 * 10^9"] },
        { number: 4, title: "Reverse a Number", statement: "Read a positive integer and print its digits in reverse order as a number (leading zeros are dropped).", inputFormat: "A single integer N.", outputFormat: "The reversed number.", sampleInput: "1230", sampleOutput: "321" },
        { number: 5, title: "Sentinel Average", statement: "Read integers until the value -1 is entered. Print the average of the values read, not counting the -1. If no values were entered, print `No data`.", inputFormat: "A sequence of integers ending with -1.", outputFormat: "The average with two decimal places.", sampleInput: "4 8 15 16 23 42 -1", sampleOutput: "18.00" }
      ]
    },
    {
      id: "ps-06", number: 6,
      title: "Nested Loops and Pattern Printing",
      description: "Use nested loops to control rows and columns and print star, number and character patterns of any size.",
      topics: ["Loops", "Patterns"], difficulty: "Intermediate", problemCount: 5, fileType: "pdf", fileSize: "6.0 KB",
      downloadUrl: "materials/ps-06.pdf", publishedAt: "2026-08-18",
      resources: [{ label: "Starter template", fileType: "code", fileSize: "353 B", url: "materials/ps-06-starter.c" }],
      objectives: ["Relate the outer loop to rows and the inner loop to columns", "Derive spaces and symbols per row from the row number", "Print symmetric patterns"],
      problems: [
        { number: 1, title: "Right Triangle", statement: "Read n and print a right-angled triangle of stars with n rows.", inputFormat: "A single integer n.", outputFormat: "n lines.", sampleInput: "4", sampleOutput: "*\n**\n***\n****", constraints: ["1 <= n <= 50"] },
        { number: 2, title: "Number Pyramid", statement: "Read n and print a centred pyramid where row i counts up from 1 to i and back down to 1.", inputFormat: "A single integer n.", outputFormat: "n lines, padded with leading spaces.", sampleInput: "4", sampleOutput: "   1\n  121\n 12321\n1234321", constraints: ["1 <= n <= 9"] },
        { number: 3, title: "Hollow Square", statement: "Read n and print an n x n square whose border is made of stars and whose inside is filled with spaces.", inputFormat: "A single integer n.", outputFormat: "n lines.", sampleInput: "5", sampleOutput: "*****\n*   *\n*   *\n*   *\n*****", constraints: ["2 <= n <= 50"] },
        { number: 4, title: "Floyd's Triangle", statement: "Read n and print Floyd's triangle with n rows: consecutive integers starting from 1, with row i containing i numbers.", inputFormat: "A single integer n.", outputFormat: "n lines, numbers separated by single spaces.", sampleInput: "4", sampleOutput: "1\n2 3\n4 5 6\n7 8 9 10" },
        { number: 5, title: "Diamond", statement: "Read n and print a diamond of stars whose widest row has 2n - 1 stars.", inputFormat: "A single integer n.", outputFormat: "2n - 1 lines.", sampleInput: "3", sampleOutput: "  *\n ***\n*****\n ***\n  *", constraints: ["1 <= n <= 25"] }
      ]
    },
    {
      id: "ps-07", number: 7,
      title: "Number-Based Problems",
      description: "Classic number problems - primes, Armstrong, perfect and palindrome numbers, GCD and LCM - built on digit extraction and loops.",
      topics: ["Number Problems", "Loops"], difficulty: "Intermediate", problemCount: 5, fileType: "pdf", fileSize: "5.1 KB",
      downloadUrl: "materials/ps-07.pdf", publishedAt: "2026-08-25",
      objectives: ["Extract digits with % and /", "Test divisibility efficiently", "Search a range for numbers with a property"],
      problems: [
        { number: 1, title: "Prime Check", statement: "Read N and print whether it is prime. Only test divisors up to the square root of N.", inputFormat: "A single integer N.", outputFormat: "Prime / Not prime", sampleInput: "29", sampleOutput: "Prime", constraints: ["1 <= N <= 10^9"] },
        { number: 2, title: "Armstrong Numbers in a Range", statement: "A three-digit Armstrong number equals the sum of the cubes of its digits. Read two integers a and b and print every Armstrong number in [a, b].", inputFormat: "Two integers a and b.", outputFormat: "The numbers separated by spaces.", sampleInput: "100 500", sampleOutput: "153 370 371 407", constraints: ["100 <= a <= b <= 999"] },
        { number: 3, title: "GCD and LCM", statement: "Read two positive integers and print their greatest common divisor and least common multiple. Use the Euclidean algorithm for the GCD.", inputFormat: "Two integers.", outputFormat: "Two lines.", sampleInput: "12 18", sampleOutput: "GCD: 6\nLCM: 36" },
        { number: 4, title: "Palindrome Number", statement: "Read a non-negative integer and print whether it reads the same forwards and backwards.", inputFormat: "A single integer N.", outputFormat: "Palindrome / Not palindrome", sampleInput: "12321", sampleOutput: "Palindrome" },
        { number: 5, title: "Perfect Numbers up to N", statement: "A perfect number equals the sum of its proper divisors. Read N and print all perfect numbers from 1 to N.", inputFormat: "A single integer N.", outputFormat: "The numbers separated by spaces.", sampleInput: "1000", sampleOutput: "6 28 496", constraints: ["1 <= N <= 10^4"] }
      ]
    },
    {
      id: "ps-08", number: 8,
      title: "Mathematical and Logical Problems",
      description: "Sequences, series, factorials, powers and bitwise operators - with attention to overflow and floating-point output.",
      topics: ["Math & Logic"], difficulty: "Intermediate", problemCount: 5, fileType: "pdf", fileSize: "5.0 KB",
      downloadUrl: "materials/ps-08.pdf", publishedAt: "2026-09-01",
      objectives: ["Compute sequences iteratively", "Detect and avoid integer overflow", "Use bitwise operators"],
      problems: [
        { number: 1, title: "Fibonacci Terms", statement: "Read n and print the first n Fibonacci numbers, starting with 0 and 1.", inputFormat: "A single integer n.", outputFormat: "n numbers separated by spaces.", sampleInput: "8", sampleOutput: "0 1 1 2 3 5 8 13", constraints: ["1 <= n <= 90"] },
        { number: 2, title: "Factorial with Overflow Guard", statement: "Read n and print n! using `unsigned long long`. If n is greater than 20 the result does not fit, so print `Too large` instead.", inputFormat: "A single integer n.", outputFormat: "n! or Too large", sampleInput: "10", sampleOutput: "3628800", constraints: ["0 <= n <= 100"] },
        { number: 3, title: "Power Without pow()", statement: "Read a base and a non-negative exponent and compute the power with a loop, without using the math library.", inputFormat: "Two integers base and exp.", outputFormat: "The result.", sampleInput: "2 10", sampleOutput: "1024", constraints: ["0 <= exp <= 30"] },
        { number: 4, title: "Alternating Series", statement: "Read n and compute the sum of the first n terms of 1 - 1/2 + 1/3 - 1/4 + ...", inputFormat: "A single integer n.", outputFormat: "The sum with four decimal places.", sampleInput: "4", sampleOutput: "0.5833" },
        { number: 5, title: "Bitwise Operations", statement: "Read two non-negative integers a and b and print the results of `a & b`, `a | b` and `a ^ b`.", inputFormat: "Two integers a and b.", outputFormat: "Three lines.", sampleInput: "12 10", sampleOutput: "AND: 8\nOR: 14\nXOR: 6" }
      ]
    },
    {
      id: "ps-09", number: 9,
      title: "Functions and Modular Programming",
      description: "Break programs into functions with clear parameters and return values, including recursion and pass-by-pointer.",
      topics: ["Functions"], difficulty: "Intermediate", problemCount: 4, fileType: "pdf", fileSize: "4.8 KB",
      downloadUrl: "materials/ps-09.pdf", publishedAt: "2026-09-08", updatedAt: "2026-09-12",
      resources: [{ label: "Starter template", fileType: "code", fileSize: "430 B", url: "materials/ps-09-starter.c" }],
      objectives: ["Declare prototypes and define functions", "Return values versus modifying through pointers", "Write a simple recursive function"],
      problems: [
        { number: 1, title: "Primes in a Range", statement: "Implement the function below and use it to print every prime number in [a, b].", code: "int is_prime(int n);   /* returns 1 if n is prime, 0 otherwise */", inputFormat: "Two integers a and b.", outputFormat: "The primes separated by spaces.", sampleInput: "10 30", sampleOutput: "11 13 17 19 23 29", constraints: ["1 <= a <= b <= 10^5"] },
        { number: 2, title: "Recursive Factorial", statement: "Write a recursive function `long long factorial(int n)` and use it to print n!.", inputFormat: "A single integer n.", outputFormat: "n!", sampleInput: "5", sampleOutput: "120", constraints: ["0 <= n <= 20"] },
        { number: 3, title: "Swap Through Pointers", statement: "Write `void swap(int *a, int *b)` that exchanges two integers. Read two values, call the function and print them.", inputFormat: "Two integers.", outputFormat: "The two values after swapping.", sampleInput: "3 9", sampleOutput: "9 3" },
        { number: 4, title: "Menu-Driven Converter", statement: "Write one function per conversion: 1 = km to miles, 2 = kg to pounds, 3 = Celsius to Fahrenheit. Read pairs of `choice value` and print each result until the choice 0 is read.", inputFormat: "Lines containing a choice and a value, ending with 0.", outputFormat: "One line per conversion with two decimal places.", sampleInput: "1 10\n3 100\n0", sampleOutput: "6.21 miles\n212.00 F", constraints: ["Use 1 km = 0.621371 miles and 1 kg = 2.20462 lb"] }
      ]
    },
    {
      id: "ps-10", number: 10,
      title: "Arrays and String Processing",
      description: "Store and process collections with one- and two-dimensional arrays, and work with character arrays and null-terminated strings.",
      topics: ["Arrays", "Strings"], difficulty: "Advanced", problemCount: 6, fileType: "document", fileSize: "2.4 KB",
      downloadUrl: "materials/ps-10.txt", publishedAt: "2026-09-15",
      resources: [{ label: "Starter template", fileType: "code", fileSize: "348 B", url: "materials/ps-10-starter.c" }],
      objectives: ["Traverse and update arrays with loops", "Read whole lines with fgets", "Process strings character by character", "Work with 2D arrays"],
      problems: [
        { number: 1, title: "Array Statistics", statement: "Read N integers into an array and print the minimum, the maximum and the average.", inputFormat: "N on the first line, then N integers.", outputFormat: "Three lines.", sampleInput: "5\n3 9 -2 7 4", sampleOutput: "Min: -2\nMax: 9\nAverage: 4.20", constraints: ["1 <= N <= 1000"] },
        { number: 2, title: "Reverse in Place", statement: "Read N integers and reverse the array in place, without using a second array, then print it.", inputFormat: "N, then N integers.", outputFormat: "The reversed array.", sampleInput: "6\n1 2 3 4 5 6", sampleOutput: "6 5 4 3 2 1" },
        { number: 3, title: "Second Largest", statement: "Read N integers and print the second largest distinct value. If it does not exist, print `None`.", inputFormat: "N, then N integers.", outputFormat: "The value or None.", sampleInput: "6\n4 9 2 9 7 1", sampleOutput: "7" },
        { number: 4, title: "Count Vowels", statement: "Read a full line of text with `fgets` and count its vowels (a, e, i, o, u in either case).", inputFormat: "One line of up to 200 characters.", outputFormat: "Vowels: N", sampleInput: "Introduction to Computer Systems", sampleOutput: "Vowels: 10" },
        { number: 5, title: "Palindrome String", statement: "Read a line and decide whether it is a palindrome when case and non-letter characters are ignored.", inputFormat: "One line of text.", outputFormat: "Palindrome / Not palindrome", sampleInput: "Never odd or even", sampleOutput: "Palindrome" },
        { number: 6, title: "Matrix Transpose", statement: "Read an R x C matrix and print its transpose.", inputFormat: "R and C, then R rows of C integers.", outputFormat: "C rows of R integers.", sampleInput: "2 3\n1 2 3\n4 5 6", sampleOutput: "1 4\n2 5\n3 6", constraints: ["1 <= R, C <= 20"] }
      ]
    },
    {
      id: "ps-11", number: 11,
      title: "Mixed Practice Problems",
      description: "Problems that combine conditions, loops, arrays and functions - closer to what you will see in lab tests.",
      topics: ["Mixed", "Arrays", "Loops"], difficulty: "Advanced", problemCount: 5, fileType: "pdf", fileSize: "6.0 KB",
      downloadUrl: "materials/ps-11.pdf", publishedAt: "2026-09-29",
      objectives: ["Decide which constructs a problem needs", "Combine arrays with counting and sorting", "Simulate a simple process from commands"],
      problems: [
        { number: 1, title: "Digit Frequency", statement: "Read N values between 0 and 9 and print how many times each value appears. Only print values that appear at least once, in increasing order.", inputFormat: "N, then N integers.", outputFormat: "value: count, one per line.", sampleInput: "8\n1 3 3 7 1 3 0 9", sampleOutput: "0: 1\n1: 2\n3: 3\n7: 1\n9: 1" },
        { number: 2, title: "Bubble Sort", statement: "Read N integers and sort them in ascending order with bubble sort. Stop early if a pass makes no swaps.", inputFormat: "N, then N integers.", outputFormat: "The sorted values.", sampleInput: "5\n5 1 4 2 8", sampleOutput: "1 2 4 5 8", constraints: ["1 <= N <= 1000"] },
        { number: 3, title: "Word Count", statement: "Read a line and count the words in it. Words are separated by one or more spaces, and the line may begin or end with spaces.", inputFormat: "One line of text.", outputFormat: "The number of words.", sampleInput: "  the quick  brown fox ", sampleOutput: "4" },
        { number: 4, title: "Decimal to Binary", statement: "Read a non-negative integer and print its binary representation.", inputFormat: "A single integer N.", outputFormat: "The binary digits.", sampleInput: "13", sampleOutput: "1101", constraints: ["0 <= N <= 10^9"] },
        { number: 5, title: "Bank Account", statement: "Process commands until `Q`: `D x` deposits x and `W x` withdraws x. After each command print the balance, or `Insufficient funds` if a withdrawal is larger than the balance. Finish with the final balance.", inputFormat: "One command per line.", outputFormat: "One line per command, then the final balance.", sampleInput: "D 500\nW 200\nW 400\nQ", sampleOutput: "Balance: 500\nBalance: 300\nInsufficient funds\nFinal balance: 300" }
      ]
    },
    {
      id: "ps-12", number: 12,
      title: "Exam Preparation and Revision",
      description: "Tracing, debugging and short programming questions in the style of the final exam. The printable PDF will be added before the revision class.",
      topics: ["Exam Prep", "Mixed"], difficulty: "Advanced", problemCount: 6, fileType: "pdf", publishedAt: "2026-10-06",
      objectives: ["Trace code by hand", "Find and explain common bugs", "Solve short problems under time pressure"],
      problems: [
        { number: 1, title: "Trace the Loop", statement: "Trace the fragment below by hand. Give the final values of `i` and `s` and the exact line it prints.", code: "int i, s = 0;\nfor (i = 1; i <= 10; i += 3) {\n    s += i;\n}\nprintf(\"%d %d\\n\", i, s);" },
        { number: 2, title: "Find the Bugs", statement: "The fragment below is meant to print the sum of the integers from 1 to n. Identify at least three bugs and explain how to fix each one.", code: "int n, sum;\nscanf(\"%d\", n);\nfor (int i = 1; i < n; i++)\n    sum += i;\nprintf(\"%d\\n\", sum);" },
        { number: 3, title: "Repeated Digit Sum", statement: "Read a positive integer and repeatedly replace it with the sum of its digits until a single digit remains. Print that digit.", inputFormat: "A single integer N.", outputFormat: "One digit.", sampleInput: "9875", sampleOutput: "2", constraints: ["1 <= N <= 2 * 10^9"] },
        { number: 4, title: "Alphabet Triangle", statement: "Read n and print n rows, where row i contains the first i capital letters.", inputFormat: "A single integer n.", outputFormat: "n lines.", sampleInput: "4", sampleOutput: "A\nAB\nABC\nABCD", constraints: ["1 <= n <= 26"] },
        { number: 5, title: "Rotate an Array", statement: "Read N integers and rotate the array to the left by K positions.", inputFormat: "N and K on the first line, then N integers.", outputFormat: "The rotated array.", sampleInput: "5 2\n1 2 3 4 5", sampleOutput: "3 4 5 1 2", constraints: ["1 <= N <= 1000", "0 <= K <= 10^6"] },
        { number: 6, title: "Short Answers", statement: "Explain each of the following in two or three sentences, with a short example:\n\n(a) the difference between `=` and `==`;\n(b) when a `do-while` loop behaves differently from a `while` loop;\n(c) why `swap(int a, int b)` cannot swap the caller's variables but `swap(int *a, int *b)` can." }
      ]
    }
  ]
};
