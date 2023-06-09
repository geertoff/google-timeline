import os
import json
import psycopg2
import datetime
import traceback

# working directory
wd = os.getcwd()

# veranderen working directory
os.chdir(r'D:\geert\HAS Hogeschool\GM4407-09 Engineer 20_21 - Geert - Geert\Google_timeline_proj\Database\data')


# Openen van database
conn = psycopg2.connect("host=localhost dbname=google_timeline user=postgres password=postgres")

# Cursor maken
cur = conn.cursor()

# Aanmaken van variabelen
files = []
list_items = os.listdir()

# print(list_items)

#Iterereer over meerdere bestanden
for single_file in list_items : 
    if single_file.endswith('.json') :
        with open(single_file) as json_file : 
            data = json.load(json_file)

        # naar features gaan
        data = data['timelineObjects'] 
        feature_list = data 

        for feature in feature_list : 
            # na activitysegment komt placevisit daarom expliciet aangeven
            if 'activitySegment' in feature :

                try :
                    distance = feature['activitySegment']['distance']
                except Exception as e : 
                    print('fout in activitySegment distance: ')
                    print(e)
                    print(traceback.format_exc())


                confidence = feature['activitySegment']['confidence']
                
                activityType = feature['activitySegment']['activityType']

                startTimestampMs = feature['activitySegment']['duration']['startTimestampMs']
                endTimestampMs = feature['activitySegment']['duration']['endTimestampMs']

                # converteren naar normale datum 
                # "//" zodat het wordt gedeeld zonder een float te creëeren
                starttime = datetime.datetime.fromtimestamp(int(startTimestampMs) // 1000.0)
                endtime = datetime.datetime.fromtimestamp(int(endTimestampMs) // 1000.0)

                try : 
                    startlonE7 = feature['activitySegment']['startLocation']['longitudeE7']
                    startlatE7 = feature['activitySegment']['startLocation']['latitudeE7']
                    endlonE7 = feature['activitySegment']['endLocation']['longitudeE7']
                    endlatE7 = feature['activitySegment']['endLocation']['latitudeE7']
    
                except Exception as e :
                    print('fout in activitysegments ophalen van start coordinaten: ')
                    print(e)
                    print(traceback.format_exc())

                    

                # omrekenen coördinaten
                startLon = startlonE7/1E7
                startLat = startlatE7/1E7
                endLon = endlonE7/1E7
                endLat = endlatE7/1E7
                

                user = 'Geert'
                

            sql_activity = 'insert into activity(start_location, end_location, start_time, end_time, distance, activity_type, confidence, "user") values(St_SetSRID(ST_makePoint(%s,%s),4326), St_SetSRID(ST_makePoint(%s,%s),4326), %s, %s, %s, %s, %s, %s) returning id' 

            activity_id = cur.execute(sql_activity, (startLon, startLat, endLon, endLat, starttime, endtime, distance, activityType, confidence, user))
            
            #print id die in de database zit
            activity_id = cur.fetchone()[0]

            if 'activitySegment' in feature :
                # cooördinaten pakken van de waypoint
                if 'waypointPath' in feature['activitySegment'] :
                    waypoint = feature['activitySegment']['waypointPath']['waypoints']

                    #waypoint is een list dus volgt er een for loop
                    for waypoints in waypoint:
                        try :
                            latE7 = waypoints['latE7']
                            lonE7 = waypoints['lngE7']
                        except Exception as e:
                            print('fout in het ophalen van coordianten waypoints: ')
                            print(e)
                            print(traceback.format_exc())


                        lat = latE7 / 1E7
                        lon = lonE7 / 1E7
                        

                        # insert statement in waypoint tabel
                        sql_waypoint ='insert into waypoint(location, activity_id, activity_type) values (St_SetSRID(ST_makePoint(%s,%s),4326), %s, %s)'
                        cur.execute(sql_waypoint, (lon, lat, activity_id, activityType))
                      

                # cooördinaten pakken van de transitpath
                if 'transitPath' in feature['activitySegment'] :
                    transitpoint = feature['activitySegment']['transitPath']['transitStops']
                    
                    for transitpoints in transitpoint :
                        try :    
                            latE7 = transitpoints['latitudeE7']
                            lonE7 = transitpoints['longitudeE7']
                        except Exception as e : 
                            print('fout in het ophalen van transitpoints: ')
                            print(e)
                            print(traceback.format_exc())

                        lat = latE7 / 1E7
                        lon = lonE7 / 1E7               
                        name = transitpoints['name']
                        # print(lon, lat, name)
                    
                        # insert statement in transit tabel
                        sql_transit = 'insert into transit(location, activity_id, name) values (St_SetSRID(ST_makePoint(%s,%s),4326), %s, %s)'
                        cur.execute(sql_transit, (lon, lat, activity_id, name))
                    
            # indexerene van variabelen binnen placevisit
            if 'placeVisit' in feature :
                try :
                    latE7 = feature['placeVisit']['location']['latitudeE7']
                    lonE7 = feature['placeVisit']['location']['longitudeE7']
                except Exception as e :
                    print('fout in placevisit ophalen coordinaten')
                    print(e)
                    print(traceback.format_exc())

                lat = latE7 / 1E7
                lon = lonE7 / 1E7

                # print(lat, lon)
                
                try :
                    name = feature['placeVisit']['location']['name']
                except Exception as e :
                    print('fout in placevisit ophalen van naam')
                    print(e)
                    print(traceback.format_exc())
                    
                startTimestampMs = feature['placeVisit']['duration']['startTimestampMs']
                endTimestampMs = feature['placeVisit']['duration']['endTimestampMs']
                
                #converteren naar normale datum
                starttime = datetime.datetime.fromtimestamp(int(startTimestampMs) // 1000.0)
                endtime = datetime.datetime.fromtimestamp(int(endTimestampMs) // 1000.0)
                
                confidence = feature['placeVisit']['placeConfidence']

                # sql statement voor placevisit
                sql_placevisit = 'insert into placevisit(location, start_time, end_time, name, confidence) values (St_SetSRID(ST_makePoint(%s,%s),4326), %s, %s, %s, %s)'
                cur.execute(sql_placevisit, (lon, lat, starttime, endtime, name, confidence))
            


# comitten 
conn.commit()

# close database
conn.close()