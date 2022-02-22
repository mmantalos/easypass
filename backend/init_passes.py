#!/usr/bin/env python3

import mysql.connector
import csv
import sys
import re
from tqdm import tqdm
# import datetime to get the right format for the database
from datetime import datetime

import json
config = json.load(open('config.json', 'r'))

def init_passes(file, reset = True):
    try:
        with open(file, 'r') as csv_file:
            db = mysql.connector.connect(
                user=config['user'],
                passwd=config['password'],
                database=config['database']
            )

            cursor = db.cursor()
            if reset:
                cursor.execute("DELETE FROM passes;")

            csv_reader = csv.DictReader(csv_file, delimiter=';')

            table = [[f'"{word}"' for word in line.values()]
                     for line in csv_reader]
            print("Inserting passes:")

            for record in tqdm(table):
                # The attributes in the csv are in different order
                # rearrange them before inserting to database
                # in database->(pass_id, vehicle_ref, station_ref, timestamp, charge)
                # in csv-> (pass_id, timestamp, stationRef, vehicleRef, charge)

                # The attribute timestamp in the csv does not have seconds,
                # set them arbitrarily to 00s
                date_string = record[1][1:-1]+':00'
                timestamp = datetime.strptime(
                    date_string, "%d/%m/%Y %H:%M:%S").strftime("%Y-%m-%d %H:%M:%S")
                timestamp = '"'+timestamp+'"'
                # print(timestamp)
                query = "INSERT INTO passes(pass_id,timestamp,station_ref,vehicle_ref,charge) VALUES(" + ",".join(
                        [record[0], timestamp, record[2], record[3], record[4]]) + ");"
                # print(query)
                cursor.execute(query)
                db.commit()

            print('Passes inserted.\n')
            cursor.close()
            db.close()
            # sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)


if __name__ == "__main__":
    init_passes(sys.argv[1])
