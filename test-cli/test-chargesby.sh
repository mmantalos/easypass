printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test1 - This test should display results in json format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 chargesby --format json --op1 egnatia --datefrom 20200115 --dateto 20210115
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test2 - This test should display results in csv format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 chargesby --format csv --op1 gefyra --datefrom 20190115 --dateto 20210115
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test3 - This test should display an error'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 chargesby --format json --op1 egnatia --datefrom 20200115 --dateto wrongdate
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test4 - This test should give no data'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 chargesby --format json --op1 egnatia --datefrom 20250115 --dateto 20260115