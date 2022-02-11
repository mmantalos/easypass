printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
echo 'Test'
printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
`dirname $0`/../cli/se2162 admin --passesupd --source `dirname $0`/../backend/sampledata01/sampledata01_passes100_8000.csv