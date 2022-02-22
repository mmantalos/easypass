#!/usr/bin/env python3

import mysql.connector
import csv
import sys
from tqdm import tqdm

import json
config = json.load(open('config.json', 'r'))


def init_stations(file):
    try:
        with open(file, 'r') as csv_file:
            db = mysql.connector.connect(
                user=config['user'],
                passwd=config['password'],
                database=config['database']
            )

            cursor = db.cursor()
            cursor.execute("DELETE FROM stations;")

            csv_reader = csv.DictReader(csv_file, delimiter=';')

            table = [[f'"{word}"' for word in line.values()]
                     for line in csv_reader]
            print("Inserting stations:")
            for record in tqdm(table):
                query = "INSERT INTO stations(station_id,station_provider,station_name) VALUES(" + \
                    ",".join(record) + ");"
                cursor.execute(query)
                db.commit()

            print('Stations inserted.\n')
            cursor.close()
            db.close()
            # sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)


if __name__ == "__main__":
    init_stations(sys.argv[1])
