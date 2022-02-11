#!/usr/bin/env python3

import mysql.connector
import sys
from tqdm import tqdm
def init_providers():
    try:
        db = mysql.connector.connect(
                user     = "admin",
                passwd   = "freepasses4all",
                database = "easy_pass"
                )

        cursor = db.cursor()
        cursor.execute("DELETE FROM passes")
        cursor.execute("DELETE FROM vehicles")
        cursor.execute("DELETE FROM stations")
        cursor.execute("DELETE FROM providers")
        queries=[
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("aodos","AO","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("egnatia","EG","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("gefyra","GF","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("kentriki_odos","KO","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("moreas","MO","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("nea_odos","NE","1")""",
        """INSERT INTO providers(provider_name, provider_abbr, is_active) VALUES("olympia_odos","OO","1")"""
        ]
        print("Inserting providers:")
        for q in tqdm(queries):
            cursor.execute(q)

        print("Providers inserted.\n")
        db.commit()

        cursor.close()
        db.close()
        #sys.exit(0)

    except mysql.connector.Error as err:
        print(err)
        cursor.close()
        db.close()
        sys.exit(1)
if __name__=="__main__":
    init_providers()
