/* Lecture 1: selection statements. Read an integer and print Even or Odd. */
#include <stdio.h>

int main(void)
{
    int n;
    printf("Enter an integer: ");
    if (scanf("%d", &n) != 1)
    {
        fprintf(stderr, "Invalid input.\n");
        return 1;
    }
    if (n % 2 == 0)
        printf("Even\n");
    else
        printf("Odd\n");
    return 0;
}
