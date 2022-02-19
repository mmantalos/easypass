printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test1 - This test should display results in json format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passescost --format json --op1 egnatia --op2 gefyra --datefrom 20200101 --dateto 20200131
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test2 - This test should display results in csv format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passescost --format csv --op1 egnatia --op2 gefyra --datefrom 20200201 --dateto 20200229
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -