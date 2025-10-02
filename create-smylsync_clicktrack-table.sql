DROP TABLE IF EXISTS smylsync_clicktrack;

CREATE TABLE IF NOT EXISTS smylsync_clicktrack (
	id SERIAL PRIMARY KEY, 
	user_id VARCHAR(100) NOT NULL, 
	click_timestamp VARCHAR(100) NOT NULL, 
	relative_timestamp VARCHAR(100) NOT NULL, 
	tag_name VARCHAR(10) NOT NULL, 
	element_id VARCHAR(100) NOT NULL, 
	to_url VARCHAR(255) NOT NULL, 
	from_url VARCHAR(255) NOT NULL, 
	user_agent VARCHAR(255) NOT NULL, 
	viewport_width INT NOT NULL, 
	viewport_height INT NOT NULL, 
	do_not_track BOOLEAN NOT NULL
);

SELECT * FROM smylsync_clicktrack;