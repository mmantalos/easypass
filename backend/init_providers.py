#!/usr/bin/env python

import mysql.connector
import sys

try:
    db = mysql.connector.connect(
            user     = "admin",
            passwd   = "freepasses4all",
            database = "easy_pass"
            )

    cursor = db.cursor()

    cursor.execute("DELETE FROM providers")
    cursor.execute("""INSERT INTO providers VALUES("aodos","AO","1")""")
    cursor.execute("""INSERT INTO providers VALUES("egnatia","EG","1")""")
    cursor.execute("""INSERT INTO providers VALUES("gefyra","GF","1")""")
    cursor.execute("""INSERT INTO providers VALUES("kentriki_odos","KO","1")""")
    cursor.execute("""INSERT INTO providers VALUES("moreas","MO","1")""")
    cursor.execute("""INSERT INTO providers VALUES("nea_odos","NE","1")""")
    cursor.execute("""INSERT INTO providers VALUES("olympia_odos","OO","1")""")

    db.commit()

    cursor.close()
    db.close()
    sys.exit(0)

except mysql.connector.Error as err:
    print(err)
    cursor.close()
    db.close()
    sys.exit(1)
