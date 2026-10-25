/* Lecture 1: for loop. Read n and print the sum of 1 to n. */
#include <stdio.h>

int main(void)
{
    int n, sum = 0;
    printf("Enter n: ");
    if (scanf("%d", &n) != 1)
    {
        fprintf(stderr, "Invalid input.\n");
        return 1;
    }
    for (int i = 1; i <= n; i++)
    {
        sum += i;
    }
    printf("%d\n", sum);
    return 0;
}
