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


with open(sys.argv[1], 'r') as csv_file:
   csv_reader = csv.DictReader(csv_file, delimiter=';')

   table = [[f'"{word}"' for word in line.values()] for line in csv_reader]
   for record in table:
       query = "INSERT INTO vehicles VALUES(" + ",".join(
               [record[0], record[2], record[1], record[4]]) + ");"
       mycursor.execute(query)
       mydb.commit()

mycursor.close()
mydb.close()

