-- versie 1
select    
		  sum(activity.distance /1000) as distance
,		  sum(DATE_PART('day', activity.end_time - activity.start_time) * 24 + 
                   DATE_PART('hour', activity.end_time - activity.start_time)) as timediff
, 		  activity.activity_type
from activity, waypoint


where     activity.id = waypoint.activity_id and

 		  ST_Intersects(waypoint.location, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326)) 

group by activity.activity_type

union 

select    
		  sum(activity.distance /1000) as distance
,		  sum(DATE_PART('day', activity.end_time - activity.start_time) * 24 + 
                   DATE_PART('hour', activity.end_time - activity.start_time)) as timediff
, 		  activity.activity_type
from activity, transit


where     activity.id = transit.activity_id and

 		  ST_Intersects(transit.location, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%' , '%ry%')),4326)) 

group by activity.activity_type




-- versie 2 gefixte afstand
select activity_type, sum(distance) as distance, sum(proportion * total_timediff) as timediff   from 
(	 
	select	  activity_lines_view.activity_type,
		  sum(ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326))::geography)/1000) as distance
		  
,		   sum(activity.end_time - activity.start_time) as total_timediff
,	      (ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326))) / ST_Length(routes)) as proportion
		  
		  from activity_lines_view, activity

where     ST_Intersects(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326)) and
		  
		  activity.id = activity_lines_view.activity_id
		  
		  
		  
group by  activity_lines_view.activity_type, proportion

) as tab 

group by activity_type




select 
		  activity_type 
,		  sum(distance) as distance, sum(proportion * total_timediff) as timediff   from 
(	 
select	  
		  activity_lines_view.activity_type
,		  sum(ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326))::geography)/1000) as distance
		  
,		  sum(DATE_PART('day', activity.end_time - activity.start_time) * 24 + 
           	  DATE_PART('hour', activity.end_time - activity.start_time))  as total_timediff
																			
,	      (ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326))) / ST_Length(routes)) as proportion
		  
		  from activity_lines_view, activity

where     ST_Intersects(routes, ST_SetSRID(ST_MakeBox2D(ST_Point('%lx%', '%ly%'),
		  ST_Point('%rx%', '%ry%')),4326)) and
		  
		  activity.id = activity_lines_view.activity_id
		  
		  
		  
group by  activity_lines_view.activity_type, proportion

) as tab 

group by activity_typ