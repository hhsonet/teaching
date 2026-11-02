/* Lecture 2: a static local variable keeps its value between calls. */
#include <stdio.h>

void counter(void)
{
    static int count = 0;       /* set up once, kept for the whole program */
    count++;
    printf("%d ", count);
}

int main(void)
{
    counter();
    counter();
    counter();
    printf("\n");
    return 0;
}
