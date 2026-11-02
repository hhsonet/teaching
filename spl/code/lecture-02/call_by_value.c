/* Lecture 2: call by value. The function changes a copy, not the original. */
#include <stdio.h>

void doubleIt(int x)
{
    x = x * 2;
    printf("inside: %d\n", x);
}

int main(void)
{
    int n = 5;
    doubleIt(n);
    printf("outside: %d\n", n);
    return 0;
}
