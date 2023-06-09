-- _________Afstand berekeken van fietsen_________
select    sum(distance /1000) from activity 
where     activity_type = 'CYCLING' 


-- -- _________sql view voor statistieken oude afstandsstatistieken_________
-- select    
-- 		  sum(activity.distance /1000) as distance
-- ,		  sum(DATE_PART('day', activity.end_time - activity.start_time) * 24 + 
--           DATE_PART('hour', activity.end_time - activity.start_time)) as timediff		  		  
-- , 		  activity.activity_type
-- from activity, waypoint


-- where     activity.id = waypoint.activity_id and

--  		  ST_Intersects(waypoint.location, ST_SetSRID(ST_MakeBox2D(ST_Point(5.170724, 51.607036),
-- 		  ST_Point(5.711809 , 51.845797)),4326)) 

-- group by activity.activity_type

-- union 

-- select    
-- 		  sum(activity.distance /1000) as distance
-- ,		  sum(DATE_PART('day', activity.end_time - activity.start_time) * 24 + 
--           DATE_PART('hour', activity.end_time - activity.start_time)) as timediff
-- , 		  activity.activity_type
-- from activity, transit


-- where     activity.id = transit.activity_id and

--  		  ST_Intersects(transit.location, ST_SetSRID(ST_MakeBox2D(ST_Point(5.170724, 51.607036),
-- 		  ST_Point(5.711809 , 51.845797)),4326)) 

-- group by activity.activity_type


-- _________selecteer alle aanwezige activity types_________
select distinct activity_type from activity 


--_________activiteiten in lijnen _________
select * from ( -- subquery activity_lines_view
	
-- selectie die walking en running vermijdt omdat deze worden gegroepeerd
select 
	     activity.id as activity_id
,	     activity.activity_type	as activity_type  
, 	     ST_Makeline(waypoint.location order by waypoint.activity_id) as routes 
	
from     waypoint, activity

where    activity.id = waypoint.activity_id and activity.activity_type not in ('WALKING','RUNNING')

group by activity.id, activity.activity_type	

union

-- selectie die de activity_type WALKING en RUNNING samenvoegd	
select 
	     activity.id as activity_id
,	     'WALKING'	as activity_type  
, 	     ST_Makeline(waypoint.location order by waypoint.activity_id) as routes 

from     waypoint, activity

where    activity.id = waypoint.activity_id and activity.activity_type in ('WALKING','RUNNING')

group by activity.id, activity.activity_type
	
union

-- selectie die alle activity_types in de transit tabel samenvoegd naar OV 
select 
	     activity.id as activity_id
,	     'OV'	as activity_type     
, 	     ST_Makeline(transit.location order by transit.activity_id) as routes 

from     transit, activity

where    activity.id = transit.activity_id and activity_type in ('IN_TRAIN', 'IN_BUS', 'IN_METRO', 'IN_FERRY' )

group by activity.id, activity.activity_type
	
	
) as tab
where activity_type ='WALKING'



	-- _________sql view voor statistieken_________

	select activity_type, sum(distance) as distance, to_char(sum(proportion * total_timediff), 'HH24:MI:SS') as timediff   from 
		(	 
			select	  activity_lines_view.activity_type,
				sum(ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point(5.4577351, 51.8738396),
				ST_Point(6.27347, 52.0502718)),4326))::geography)/1000) as distance
				
		,		   sum(activity.end_time - activity.start_time) as total_timediff
		,	      (ST_Length(ST_Intersection(routes, ST_SetSRID(ST_MakeBox2D(ST_Point(5.4577351, 51.8738396),
				ST_Point(6.27347, 52.0502718)),4326))) / ST_Length(routes)) as proportion
				
				from activity_lines_view, activity

		where     ST_Intersects(routes, ST_SetSRID(ST_MakeBox2D(ST_Point(5.4577351, 51.8738396),
				ST_Point(6.27347, 52.0502718)),4326)) and
				
				activity.id = activity_lines_view.activity_id
				
				
				
		group by  activity_lines_view.activity_type, proportion

		) as tab 

		group by activity_type


--  SQL VIEW voor activtiy_points_view

select 
	     activity.start_time
,	     activity.id as activity_id
,	     activity.activity_type	as activity_type  
, 	     waypoint.location
	
from     waypoint, activity

where    activity.id = waypoint.activity_id and activity.activity_type not in ('WALKING','RUNNING')

group by activity.id, activity.activity_type, waypoint.location, activity.start_time	

union

-- selectie die de activity_type WALKING en RUNNING samenvoegd	
select 
	     activity.start_time
,		 activity.id as activity_id
,	     'WALKING'	as activity_type  
, 	     waypoint.location 

from     waypoint, activity

where    activity.id = waypoint.activity_id and activity.activity_type in ('WALKING','RUNNING')

group by activity.id, activity.activity_type, waypoint.location, activity.start_time
	
union

-- selectie die alle activity_types in de transit tabel samenvoegd naar OV 
select 
		 activity.start_time
,	     activity.id as activity_id
,	     'OV'	as activity_type     
, 	     transit.location 

from     transit, activity

where    activity.id = transit.activity_id and activity_type in ('IN_TRAIN', 'IN_BUS', 'IN_METRO', 'IN_FERRY' )

group by activity.id, activity.activity_type, transit.location, activity.start_time 
	
order by start_time