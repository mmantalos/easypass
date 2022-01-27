#!/usr/bin/env python

import mysql.connector
import csv
import sys
from tqdm import tqdm
def init_stations(argv):
    try:
        with open(argv[1], 'r') as csv_file:
            db = mysql.connector.connect(
                    user     = "admin",
                    passwd   = "freepasses4all",
                    database = "easy_pass"
                    )

            cursor = db.cursor()
            cursor.execute("DELETE FROM stations;")

            csv_reader = csv.DictReader(csv_file, delimiter=';')

            table = [[f'"{word}"' for word in line.values()] for line in csv_reader]
            print("Inserting stations:")
            for record in tqdm(table):
                query = "INSERT INTO stations VALUES(" + ",".join(record) + ");"
                cursor.execute(query)
                db.commit()

            print('Stations inserted.\n')
            cursor.close()
            db.close()
            #sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)
if __name__=="__main__":
    init_stations(sys.argv)
