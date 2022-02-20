printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test1 - This test should display results in json format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passesanalysis --format json --op1 aodos --op2 olympia_odos --datefrom 20200101 --dateto 20200131
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test2 - This test should display results in csv format'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 passesanalysis --format csv --op1 aodos --op2 kentriki_odos --datefrom 20200301 --dateto 20200331
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
