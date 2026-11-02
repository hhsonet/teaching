/* Lecture 2: declare, define and call a function. */
#include <stdio.h>

int sum(int a, int b);          /* 1. declaration (prototype) */

int main(void)
{
    int s = sum(5, 3);          /* 3. call: 5 and 3 are the arguments */
    printf("Sum = %d\n", s);
    return 0;
}

int sum(int a, int b)           /* 2. definition: a and b are the parameters */
{
    return a + b;
}
