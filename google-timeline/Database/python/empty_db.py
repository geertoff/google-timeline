import os
import json
import psycopg2

# Openen van database
conn = psycopg2.connect("host=localhost dbname=google_timeline user=postgres password=postgres")

# Cursor maken
cur = conn.cursor()

# verwijden informatie in database
sql_delete = 'truncate activity, waypoint, transit, placevisit cascade'
cur.execute(sql_delete)

#comitten 
conn.commit()
# conn.rollback()

print('data uit tabel verwijdert')

conn.close()