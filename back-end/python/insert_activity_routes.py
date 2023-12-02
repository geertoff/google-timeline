import os 
import requests
import json
import psycopg2
from osgeo import ogr
import time

# Openen van database
conn = psycopg2.connect("host=localhost dbname=google_timeline user=postgres password=postgres")
# Cursor maken
cur = conn.cursor()

# functie om tijd in te stellen
def set_time(activity_type) :
    print(activity_type, ': ik ga nu 60 sec wachten')
    time.sleep(60)

# verwijden informatie in database
sql_delete = 'truncate route cascade'
cur.execute(sql_delete)

# extraheren van de activiteiten met pgadmin query

# bouwen van cql statement
cqlText = '(%27IN_PASSENGER_VEHICLE%27%2C%27WALKING%27%2C%27CYCLING%27)'

url = 'https://gmd.has.nl/geoserver/engineer_2021_540231185/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=engineer_2021_540231185:waypoint&outputFormat=application%2Fjson&CQL_FILTER=activity_type%20in%20' + cqlText
auth = ('540231185', '5smQ8cWH7hQH4Kaw')

headers =  {
    'Accept': 'application/json'
}
# response van de link
response_geoserver = requests.post(url, headers=headers, auth=auth)

if response_geoserver.status_code == 200 :
    print('Geoserver request ok')
    data = response_geoserver.json()['features']

    i = 0
    j = 0
    routeCoords = []
    
    
    for feature in data:      
        # eerste activity ID defineren
        if i == 0 :
            activity_id = feature['properties']['activity_id']

        if activity_id == feature['properties']['activity_id'] :
            coord = feature['geometry']['coordinates']
            # toevoegen aan array van coordinaten
            routeCoords.append(coord)

            activity_type = feature['properties']['activity_type'].strip()
            activity_id_old = feature['properties']['activity_id']

        else : 
            # checken of de route bestaat uit meerdere punten
            if len(routeCoords) >= 2 :

                # select statement om te checken of de id erin zit



                # opbouwen van route
                body = {"coordinates": routeCoords }
                print(routeCoords)

                # headers van request
                headers = {
                    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                    'Authorization': '5b3ce3597851110001cf62483c392c6c859141bfbb7984054b39d14e',
                    'Content-Type': 'application/json; charset=utf-8'
                }

                if activity_type == 'IN_PASSENGER_VEHICLE' :
                    
                    if j < 40 :
                        response_driving = requests.post('https://api.openrouteservice.org/v2/directions/driving-car/geojson', json=body, headers=headers)
                        print('car', response_driving.status_code)
                        j = j + 1 
                        print(j)
                    else :
                        # tijd aanpassen
                        set_time('car')
                        j = 0

                    if response_driving.status_code == 200 :
                        
                        # data 
                        data = response_driving.json()['features'][0]
                    
                        # indexeren van coordinaten
                        coords = data['geometry']['coordinates']

                        # activity van feature
                        activity = 'IN_PASSENGER_VEHICLE'

                        line = ogr.Geometry(ogr.wkbLineString)
                        
                        for coord in coords : 
                            x  = coord[0]
                            y = coord[1]
                        
                            line.AddPoint(x, y)
                    
                        lineWKT = line.ExportToWkt()
            
                        # opbouwen sql statement
                        sql = 'insert into route (geom, activity_type, activity_id) values (ST_FORCE2D(ST_SETSRID(ST_GeomFromText(%s), 4326)), %s, %s)' 
                        # naar database
                        cur.execute(sql, (lineWKT, activity, activity_id_old))
                        # comitten
                        conn.commit()
                        print('car activity inserted')

                        # als het max quoata reached    
                    if response_driving.status_code == 403 :
                        # database sluiten
                        conn.close()
                        break
                    else : 
                        print(str(response_driving.status_code))

                if activity_type == 'CYCLING' :
                    
                    if j < 40 :
                        response_cycling = requests.post('https://api.openrouteservice.org/v2/directions/cycling-regular/geojson', json=body, headers=headers)
                        print('cycle', response_cycling.status_code)
                        j = j + 1
                        print(j)
                    else : 
                        # minuut wachten
                        set_time('cycle')
                        j = 0
             
                    if response_cycling.status_code == 200 :     
                        # data 
                        data = response_cycling.json()['features'][0]
                    
                        # indexeren van coordinaten
                        coords = data['geometry']['coordinates']
                        
                        # activity van feature
                        activity = 'CYCLING'
                        line = ogr.Geometry(ogr.wkbLineString)
   
                        for coord in coords : 
                            x  = coord[0]
                            y = coord[1]
                        
                            line.AddPoint(x, y)
                
                        lineWKT = line.ExportToWkt()

                        # opbouwen sql statement
                        try :
                            sql = 'insert into route (geom, activity_type, activity_id) values (ST_FORCE2D(ST_SETSRID(ST_GeomFromText(%s), 4326)), %s, %s)' 
                            # naar database
                            cur.execute(sql, (lineWKT, activity, activity_id_old))

                            # comitten
                            conn.commit()
                            print('cycle route inserted')  

                        except :
                            conn.rollback() 

                    # als het max quoata reached    
                    if response_cycling.status_code == 403 :                        
                        # database sluiten
                        conn.close()
                        break
                    else : 
                        print(str(response_cycling.status_code))

                if activity_type == 'WALKING' :
                
                    if j < 40 : 
                        response_walking = requests.post('https://api.openrouteservice.org/v2/directions/foot-walking/geojson', json=body, headers=headers)
                        print('walk', response_walking.status_code)
                        j = j + 1
                        print(j)
                    else : 
                        # minuut wachten
                        set_time('walking')
                        j = 0

                    if response_walking.status_code == 200 :

                        # data 
                        data = response_walking.json()['features'][0]
                    
                        # indexeren van coordinaten
                        coords = data['geometry']['coordinates']
                        
                        # activity van feature
                        activity = 'WALKING'
                        line = ogr.Geometry(ogr.wkbLineString)

                        for coord in coords : 
                            x  = coord[0]
                            y = coord[1]
                        
                            
                            line.AddPoint(x, y)
                    
                        lineWKT = line.ExportToWkt()

                        # opbouwen sql statement
                        sql = 'insert into route (geom, activity_type, activity_id) values (ST_FORCE2D(ST_SETSRID(ST_GeomFromText(%s), 4326)), %s, %s)' 
                        # naar database
                        cur.execute(sql, (lineWKT, activity, activity_id_old))

                        # comitten
                        conn.commit()
                        print('walk route inserted')                    

                        # als het max quoata reached    
                    if response_walking.status_code == 403 :          
                        # database sluiten
                        conn.close()
                        break
            # Naar volgende ActivityID en array van coordinaten leegmaken
            activity_id = feature['properties']['activity_id']
            routeCoords = []       
        
        # optellen van teller die de features afgaat
        i = i + 1
                
else:
    print('Geoserver Request failed with error ' + str(response_geoserver.status_code))

