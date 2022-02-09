#!/usr/bin/env python3

import mysql.connector
import csv
import sys
import re
from tqdm import tqdm #
from datetime import datetime #import datetime to get the right format for the database
def init_passes(path='./sampledata01/sampledata01_passes100_8000.csv'):
    try:
        with open(path, 'r') as csv_file:
            db = mysql.connector.connect(
                    user     = "admin",
                    passwd   = "freepasses4all",
                    database = "easy_pass"
                    )

            cursor = db.cursor()
            cursor.execute("DELETE FROM passes;")

            csv_reader = csv.DictReader(csv_file, delimiter=';')

            table = [[f'"{word}"' for word in line.values()] for line in csv_reader]
            print("Inserting passes:")

            for record in tqdm(table):
                #The attributes in the csv are in different order
                #rearrange them before inserting to database
                #in database->(pass_id, vehicle_ref, station_ref, timestamp, charge)
                #in csv-> (pass_id, timestamp, stationRef, vehicleRef, charge)

                #The attribute timestamp in the csv does not have seconds,
                #set them arbitrarily to 00s
                date_string= record[1][1:-1]+':00'
                timestamp=datetime.strptime(date_string,"%d/%m/%Y %H:%M:%S").strftime("%Y-%m-%d %H:%M:%S")
                timestamp='"'+timestamp+'"'
                #print(timestamp)
                query = "INSERT INTO passes VALUES(" + ",".join(
                        [record[0], record[3], record[2], timestamp, record[4], 'FALSE', 'FALSE']) + ");"
                #print(query)
                cursor.execute(query)
                db.commit()

            print('Passes inserted.\n')
            cursor.close()
            db.close()
            #sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)
if __name__=="__main__":
    if len(sys.argv)==1:
        init_passes()
    else:
        init_passes(path=sys.argv[1])
