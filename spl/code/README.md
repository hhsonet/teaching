# SPL code

Example code shared in class for Structured Programming Language. One folder per lecture.

## Layout

```
code/
  lecture-01/   Review on ICS, Loop and Basic Function
  lecture-02/   Function, Loop
  ...
```

Each lecture folder has a `README.md` listing its files, and the `.c` files shown in class. Solutions to problem sets are not stored here. They are released after the deadline.

## Compile and run

```bash
gcc -Wall -o sum_1_to_n sum_1_to_n.c
./sum_1_to_n
```

On Windows, run `sum_1_to_n.exe`.

## Contributing code

Share your own code or fixes through a pull request.

1. Fork the repository and create a branch.
2. Add your file in the folder of the matching lecture, for example `spl/code/lecture-01/my_name_sum.c`.
3. Keep one program per file and add a comment at the top with your name and what it does.
4. Check that it compiles with `gcc -Wall` without warnings.
5. Open a pull request.
