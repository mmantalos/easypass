Το RESTful API μας υποστηρίζει 5 διαχειριστικά endpoints και 5 λειτουργικά enpoints.
## Διαχειριστικά endpoints
- *{baseURL}/admin/healthcheck*
    **Method**: GET
    **Περιγραφή:** Ελέγχει αν είναι δυνατή η σύνδεση με τη βάση.
- *{baseURL}/admin/resetpasses*
    **Method**: POST
    **Περιγραφή:** Διαγράφει από τη βάση όλα τα passes.
- *{baseURL}/admin/resetvehicles*
    **Method**: POST
    **Περιγραφή:** Διαγράφει από τη βάση όλα τα vehicles και στη συνέχεια προσθέτει στη βάση
    τα vehicles που βρίσκονται στο αρχείο: backend/sampledata01/sampledata01_vehicles100.csv.
- *{baseURL}/admin/resetstations*
    **Method**: POST
    **Περιγραφή:** Διαγράφει από τη βάση τα stations και στη συνέχεια προσθέτει στη βάση
    τα stations που βρίσκονται στο αρχείο: backend/sampledata01/sampledata01_stations.csv.
- *{baseURL}/admin/CommitPasses*
    **Method**: POST
    **Περιγραφή:** Προσθέτει στη βάση τα passes που βρίσκονται σε αρχείο csv, το οποίο επισυνάπτεται
    στο body του POST request σε πεδίο με όνομα 'passes.csv' και mimetype 'multipart/form-data'.

## Λειτουργικά endpoints
- *{baseURL}/PassesPerStation/:stationID/:date_from/:date_to?format={json|csv}*
    **Method**: GET
    **Περιγραφή:** Επιστρέφει τα passes του σταθμού *:stationID* από την ημερομηνία *:date_from* έως την ημερομηνία *:date_to*.
- *{baseURL}/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to?format={json|csv}&settle={true, false}*
    **Method**: GET
    **Περιγραφή:** Επιστρέφει τα passes οχημάτων με pass του διαχειριστή *:op1_ID* από σταθμούς του διαχειριστή *:op2_ID* από την ημερομηνία *:date_from* μέχρι την ημερομηνία *:date_to*.
- *{baseURL}/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to*
    **Method**: GET
    **Περιγραφή:** Επιστρέφεται ο αριθμός των γεγονότων διέλευσης που πραγματοποιήθηκαν με tag του *:op2_ID* σε σταθμούς του *:op1_ID*, καθώς και το κόστος τους, δηλαδή το ποσό που ο *:op2_ID* οφείλει στον *:op1_ID* από την ημερομηνία *:date_from* μέχρι την ημερομηνία *:date_to*.
- *{baseURL}/ChargesBy/:op_ID/:date_from/:date_to*
    **Method**: GET
    **Περιγραφή:** Υπολογίζει όλες τις χρεώσεις σε σταθμούς του διαχειριστή *op_ID* από οχήματα άλλων διαχειριστών από την ημερομηνία *date_from* έως την ημερομηνία *date_to*.
- *{baseURL}/SetSettlement/:op1_ID/:op2_ID/:date_from/:date_to*
    **Method**: POST
    **Περιγραφή:** Θέτει ως settled τα passes από οχήματα του διαχειριστή *op1_ID* σε σταθμούς του διαχειριστή *op2_ID* από την ημερομηνία *date_from* έως την ημερομηνία *date_to*.
