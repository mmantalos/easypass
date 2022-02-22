#!/usr/bin/env python3

import mysql.connector
import csv
import sys
from tqdm import tqdm

import json
config = json.load(open('config.json', 'r'))


def init_vehicles(file):
    try:
        db = mysql.connector.connect(
            user=config['user'],
            passwd=config['password'],
            database=config['database']
        )

        cursor = db.cursor()

        with open(file, 'r') as csv_file:
            cursor.execute("DELETE FROM vehicles;")

            csv_reader = csv.DictReader(csv_file, delimiter=';')

            table = [[f'"{word}"' for word in line.values()]
                     for line in csv_reader]
            print("Inserting vehicles:")
            for record in tqdm(table):
                query = "INSERT INTO vehicles(vehicle_id,tag_id,tag_provider,license_year) VALUES(" + ",".join(
                        [record[0], record[1], record[2], record[4]]) + ");"
                cursor.execute(query)
                db.commit()

            print('Vehicles inserted.\n')
            cursor.close()
            db.close()
            # sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)


if __name__ == "__main__":
    init_vehicles(sys.argv[1])
