#!/usr/bin/env python3

import mysql.connector
import csv
import sys

try:
    db = mysql.connector.connect(
            user     = "admin",
            passwd   = "freepasses4all",
            database = "easy_pass"
            )

    cursor = db.cursor()


    with open(sys.argv[1], 'r') as csv_file:
        cursor.execute("DELETE FROM vehicles;")

        csv_reader = csv.DictReader(csv_file, delimiter=';')

        table = [[f'"{word}"' for word in line.values()] for line in csv_reader]
        for record in table:
            query = "INSERT INTO vehicles VALUES(" + ",".join(
                    [record[0], record[2], record[1], record[4]]) + ");"
            cursor.execute(query)
            db.commit()

        print('Everything is OK')
        cursor.close()
        db.close()
        sys.exit(0)

except mysql.connector.Error as err:
    print(err)
    cursor.close()
    db.close()
    sys.exit(1)



