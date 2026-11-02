/* Lecture 2: local and global variables. */
#include <stdio.h>

int total = 100;                /* global: visible to every function below */

void show(void)
{
    int local = 1;              /* local: exists only while show() runs */
    printf("global = %d, local = %d\n", total, local);
}

int main(void)
{
    int local = 7;              /* a different variable from the one in show() */
    show();
    printf("main: local = %d\n", local);
    return 0;
}
