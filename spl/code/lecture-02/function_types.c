/* Lecture 2: the four types of functions, by arguments and return value. */
#include <stdio.h>

void greet(void);               /* type 1: no arguments, no return value */
void printSquare(int n);        /* type 2: arguments, no return value */
int readNumber(void);           /* type 3: no arguments, return value */
int max(int a, int b);          /* type 4: arguments and return value */

int main(void)
{
    greet();
    printSquare(4);
    int n = readNumber();
    printf("Larger of %d and 10 is %d\n", n, max(n, 10));
    return 0;
}

void greet(void)
{
    printf("Hello from a function.\n");
}

void printSquare(int n)
{
    printf("%d squared is %d\n", n, n * n);
}

int readNumber(void)
{
    int n;
    printf("Enter a number: ");
    if (scanf("%d", &n) != 1)
    {
        return 0;
    }
    return n;
}

int max(int a, int b)
{
    return (a > b) ? a : b;
}
