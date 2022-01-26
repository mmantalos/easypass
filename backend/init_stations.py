#!/usr/bin/python3

import mysql.connector
import csv
import sys

try:
    with open(sys.argv[1], 'r') as csv_file:
        db = mysql.connector.connect(
                user     = "admin",
                passwd   = "freepasses4all",
                database = "easy_pass"
                )

        cursor = db.cursor()
        cursor.execute("DELETE FROM stations;")

        csv_reader = csv.DictReader(csv_file, delimiter=';')

        table = [[f'"{word}"' for word in line.values()] for line in csv_reader]

        for record in table:
            query = "INSERT INTO stations VALUES(" + ",".join(record) + ");"
            cursor.execute(query)
            db.commit()

        print('Everything is OK.')
        cursor.close()
        db.close()
        sys.exit(0)

except mysql.connector.Error as err:
    print(err)
    cursor.close()
    db.close()
    sys.exit(1)
