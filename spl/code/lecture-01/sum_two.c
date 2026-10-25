/* Lecture 1: input and output. Read two integers and print their sum. */
#include <stdio.h>

int main(void)
{
    int a, b;
    printf("Enter two integers: ");
    if (scanf("%d %d", &a, &b) != 2)
    {
        fprintf(stderr, "Invalid input.\n");
        return 1;
    }
    printf("%d\n", a + b);
    return 0;
}
