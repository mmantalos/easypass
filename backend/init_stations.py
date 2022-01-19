#!/usr/bin/env python

import mysql.connector
import csv
import sys

mydb = mysql.connector.connect(
        user     = "admin",
        passwd   = "softeng2021",
        database = "easy_pass"
        )

mycursor = mydb.cursor()


with open(sys.argv[1], 'r') as csv_file:S
   mycursor.execute("DELETE FROM stations;")

   csv_reader = csv.DictReader(csv_file, delimiter=';')

   table = [[f'"{word}"' for word in line.values()] for line in csv_reader]
   for record in table:
       query = "INSERT INTO stations VALUES(" + ",".join(record) + ");"
       mycursor.execute(query)
       mydb.commit()

mycursor.close()
mydb.close()

