import os
import datetime
import json

# veranderen working directory
os.chdir(r'D:\geert\HAS Hogeschool\GM4407-09 Engineer 20_21 - Geert - Geert\Google_timeline_proj\Database\data', )

# bijbehorende activiteit: https://www.google.nl/maps/timeline?hl=nl&authuser=0&ei=1eOTX56oHsTVkwWBm6D4Cg%3A42&ved=1t%3A17706&pb=!1m2!1m1!1s2020-06-02

#checken van activiteitdatum 
starttime = datetime.datetime.fromtimestamp(int(1591115665077) // 1000.0)
# print(starttime)

# Importeren van json bestand
with open('2020_JUNE.json') as json_file : 
    data = json.load(json_file)

points = []
feature_list = data['timelineObjects']
for feature in feature_list :
    if 'activitySegment' in feature:
        if 'waypointPath' in feature['activitySegment'] :
            waypoints = feature['activitySegment']['waypointPath']['waypoints']
            # print(waypoints)
            for waypoint in waypoints : 
                latE7 = waypoint['latE7']
                lat = latE7/1E7 
                
                lonE7 = waypoint['lngE7']
                lon = lonE7/1E7 

                points.append(lonE7)

print(len(points))
print(points)