#include <stdio.h>

static int is_leap(int year)
{
    return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
}

static int days_in(int year, int month)
{
    if (month == 2)
        return is_leap(year) ? 29 : 28;
    if (month == 4 || month == 6 || month == 9 || month == 11)
        return 30;
    return 31;
}

int main(void)
{
    int year, month;
    printf("Enter year and month (in numbers): ");
    if (scanf("%d %d", &year, &month) != 2 || month < 1 || month > 12)
    {
        fprintf(stderr, "Invalid input: month must be 1-12.\n");
        return 1;
    }
    int days = days_in(year, month);
    /* 2^31 overflows int; unsigned long long holds up to 2^63. */
    unsigned long long total_organisms = 1ULL << days;
    printf("Number of days in month: %d\n", days);
    printf("Projected total number of organisms: %llu\n", total_organisms);
    return 0;
}
