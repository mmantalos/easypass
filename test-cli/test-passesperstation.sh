printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test1 - This test should display results in json format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passesperstation --format json --station AO01 --datefrom 20200101 --dateto 20200131
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test2 - This test should display results in csv format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passesperstation --format csv --station EG03 --datefrom 20200201 --dateto 20200229
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
