# main.py
from flask import Flask, jsonify, request,send_file,render_template
from folium import CircleMarker, PolyLine
import folium
import os
from flask_cors import CORS
import bcrypt
from datetime import datetime

app = Flask(__name__)

app.config['CORS_ORIGIN_ALLOW_ALL'] = True

cors = CORS(app)

from google.cloud.sql.connector import Connector
import pymysql

db_user = os.environ.get('CLOUD_SQL_USERNAME')
db_password = os.environ.get('CLOUD_SQL_PASSWORD')
db_name = os.environ.get('CLOUD_SQL_DATABASE_NAME')
db_connection_name = os.environ.get('CLOUD_SQL_CONNECTION_NAME')

# initialize Connector object
connector = Connector()



#-----------------------------------------------------
# Hash and salt the password during registration
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

# Check the password during login
def check_password(entered_password, stored_hashed_password):
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hashed_password.encode('utf-8'))

#---------------------------------------------------------

def open_connection():
    try:
        if os.environ.get('GAE_ENV') == 'standard':
            conn = connector.connect(
                db_connection_name,'pymysql',user=db_user,password=db_password,db=db_name               
            )
            return conn
    except pymysql.MySQLError as e:
        print(e)
        return e


def get():
    conn = open_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        result = cursor.execute('SELECT * FROM Users LIMIT 10;')
        try:
            if result>0:
                users = cursor.fetchall()
                got_users = jsonify(users)
            else:
                got_users = 'None Found'
            return got_users
        except pymysql.MySQLError as e:
            print(e)
            raise

@app.route('/signup', methods=['POST'])
def signup():
    conn = open_connection()
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    hashed_password = hash_password(password)

    if not all([first_name, last_name, email, password]):
        return jsonify({'error': 'All fields are required'}), 400

    try:
        # Use the existing cursor created by open_connection
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Users WHERE Email = %s", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email already taken'}), 400


        # Store new user information and then commit
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO Users(First_Name, Last_Name, Email, Password) VALUES(%s, %s, %s, %s)",
                           (first_name, last_name, email, hashed_password))
        conn.commit()
        return jsonify({'message': 'SignUp successful'}), 200

    except pymysql.MySQLError as e:
        # Print or log the error for debugging
        print(e)
        return jsonify({'error': 'Database error'}), 500  # Internal Server Error


@app.route('/login', methods=['POST'])
def login(): 
    conn = open_connection()
    data = request.get_json()
    email = data.get('email')
    entered_password = data.get('password')
    if email is None or entered_password is None:
        return jsonify({'error': 'Missing email or password'}), 400
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM Users WHERE Email = %s", (email,))
            user_data = cursor.fetchone()
        if user_data:
            stored_hashed_password = user_data.get('password')
            if check_password(entered_password, stored_hashed_password):
                return jsonify({'message': 'Login successful'}), 200
            else:
                return jsonify({'error': 'Invalid password'}), 400
        else:
            return jsonify({'error': 'User not found'}), 400

    except pymysql.MySQLError as e:
        # Handle database errors
        print(e)
        return jsonify({'error': 'Database error'}), 500


    

@app.route('/update_password', methods=['POST'])
def update_password():
    data = request.get_json()

    # Extract data from the request
    email = data.get('email')
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    # Open a database connection
    conn = open_connection()

    try:
        with conn.cursor() as cursor:
            # Fetch the user's data
            cursor.execute("SELECT * FROM Users WHERE Email = %s", (email,))
            user_data = cursor.fetchone()

            # Check if the user exists
            if user_data:
                stored_hashed_password = user_data[-1]
                # Check if the entered old password matches the stored password
                if check_password(old_password, stored_hashed_password):
                    # Hash the new password
                    hashed_new_password = hash_password(new_password)

                    # Update the password in the database
                    cursor.execute("UPDATE Users SET Password = %s WHERE Email = %s",
                                    (hashed_new_password, email))
                    conn.commit()

                    return jsonify({'message': 'Password updated successfully'}), 200
                else:
                    return jsonify({'error': 'Invalid old password'}), 400
            else:
                return jsonify({'error': 'User not found'}), 400

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


from pymysql import IntegrityError

@app.route('/update_user_info', methods=['POST'])
def update_email():
    conn = open_connection()
    data = request.get_json()
    old_email = data.get('email')
    new_email = data.get('new_email')

    try:
        with conn.cursor() as cursor:
            # Check if the email exists in the database
            cursor.execute("SELECT * FROM Users WHERE email = %s", (old_email,))
            user_data = cursor.fetchone()

            if user_data:
                # Check if the new email is already taken
                cursor.execute("SELECT * FROM Users WHERE email = %s", (new_email,))
                if cursor.fetchone():
                    return jsonify({'error': 'Email already taken'}), 400

                # Update the user's name and email
                cursor.execute("UPDATE Users SET email = %s WHERE email = %s",
                               (new_email, old_email))
                conn.commit()

                return jsonify({'message': 'User information updated successfully'}), 200
            else:
                return jsonify({'error': 'User not found'}), 400

    except IntegrityError as e:
        # Handle unique constraint violation
        print(e)
        return jsonify({'error': 'Email already taken'}), 400

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500



        
@app.route('/get_user_details', methods=['POST'])
def get_user_details():
    conn = open_connection()
    data = request.get_json()
    email = data.get('email')

    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        # Retrieve user details excluding the password
        cursor.execute("SELECT first_name, last_name, email FROM Users WHERE email = %s", (email,))
        user_data = cursor.fetchone()

        if user_data:
            return jsonify(user_data)
        else:
            return jsonify({'error': 'User not found'}), 400
        
#----------------------------------------------------------------------------
@app.route('/feedback', methods=['POST'])
def get_feedback():
    data = request.get_json()
    email = data.get('email')
    conn = open_connection()

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Fetch user_id based on email
            cursor.execute("SELECT user_id FROM Users WHERE email = %s", (email,))
            user_data = cursor.fetchone()

            if user_data:
                user_id = user_data['user_id']

                # Fetch feedback details based on user_id
                cursor.execute("SELECT * FROM Feedback WHERE user_id = %s", (user_id,))
                feedback_list = cursor.fetchall()

                return jsonify(feedback_list)
            else:
                return jsonify({'error': 'User not found'}), 404

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


@app.route('/add_feedback', methods=['POST'])
def add_feedback():
    data = request.get_json()
    trip_id = data.get('trip_id')
    feedback_text = data.get('feedback')
    email = data.get('email')

    conn = open_connection()

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Fetch user_id based on email
            cursor.execute("SELECT user_id FROM Users WHERE email = %s", (email,))
            user_data = cursor.fetchone()

            if user_data:
                user_id = user_data['user_id']

                # Insert feedback using user_id
                cursor.execute("INSERT INTO Feedback(trip_id, feedback, user_id) VALUES(%s, %s, %s)", 
                               (trip_id, feedback_text, user_id))
                
                conn.commit()


                return jsonify({'new_feedback':feedback_text,'message': 'Feedback Successfully Added!'}), 200
            else:
                return jsonify({'error': 'User not found'}), 404

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


@app.route('/edit_feedback', methods=['POST'])
def edit_feedback():
    #TODO - get feedback_id and feedback as jason {feedback_id,feedback_text}
    data = request.get_json()
    feedback_id=data.get('feedback_id')
    feedback_text = data.get('feedback_text')
    conn = open_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE Feedback SET feedback = %s WHERE feedback_id = %s",
                            (feedback_text, feedback_id))
        conn.commit()
        return jsonify({'message': 'Feedback updated successfully'})

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500
    

@app.route('/delete_feedback', methods=['POST'])
def Delete_Feedback():
    # Open a database connection
    conn = open_connection()
    data = request.get_json()
    feedback_id = data.get('feedback_id')
    # Use a cursor to execute SQL queries
    with conn.cursor() as cursor:
        # Execute an SQL DELETE query to remove feedback from the database
        cursor.execute("DELETE FROM Feedback WHERE feedback_id = %s", 
                       (feedback_id,))
    
    # Commit the changes to the database
    conn.commit()


    # Return a JSON response indicating success
    return jsonify({'message': 'Feedback Deleted!'})

#--------------------------------------------------------------- 
@app.route('/my_trips', methods=['POST'])
def My_Trips():
    data = request.get_json()
    email = data.get('email')
    conn = open_connection()
    trip_info =[]
    try:
            # Fetch user_id based on email
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            user_data = cursor.fetchone()

        if user_data:
            user_id = user_data[0]

            # Fetch trips based on user_id
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM Books WHERE user_id = %s", (user_id,))
                trips_list = cursor.fetchall()
            trip_info = []
            if trips_list:
                for trip in trips_list:
                    # Assuming trips_list[1] and trips_list[2] are stop_ids
                    with conn.cursor() as cursor:
                        cursor.execute('SELECT stop_name FROM Stops WHERE stop_id IN (%s, %s)',
                                        (trip[1], trip[2]))
                        stops_info = cursor.fetchall()

                    if stops_info and len(stops_info) >= 2:
                        origin_info = stops_info[0]
                        destination_info = stops_info[1]
                        trip_info.append([origin_info,destination_info,trip[4],trip[0]])

                return trip_info          

            else:
                return [], 200
        else:
            return jsonify({'error': 'User not found'}), 400

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


    
@app.route('/add_trip', methods=['POST'])
def Add_Trip():
    data = request.get_json()
    trip_id = data.get('trip_id')
    origin_id = data.get('origin_id')
    destination_id = data.get('destination_id')
    booking_time = data.get('booking_time')
    email = data.get('email')
    conn = open_connection()

    try:
        # Fetch user_id based on email
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            user_data = cursor.fetchone()
        if user_data:
            user_id = user_data[0]

            # Insert trip using user_id
            with conn.cursor() as cursor:
                cursor.execute("INSERT INTO Books (user_id, trip_id, origin_id, destination_id, booking_time) VALUES (%s, %s, %s, %s,%s)", 
                               (user_id, trip_id, origin_id, destination_id, booking_time))
            
            conn.commit()
            return jsonify({'message': 'Trip Added!'}), 200
        else:
            return jsonify({'error': 'User not found'}), 400

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


# @app.route('/delete_trip', methods=['POST'])
# def Delete_Trip():
#     data = request.get_json()
#     trip_id = data.get('trip_id')
#     origin_id = data.get('origin_id')
#     destination_id = data.get('destination_id')
#     email = data.get('email')  # Assuming the email is provided in the JSON data

#     # Check if all required inputs are provided
#     if not (trip_id and origin_id and destination_id and email):
#         return jsonify({'error': 'Missing required inputs. Please provide trip_id, origin_id, destination_id, and email.'}), 400

#     conn = open_connection()

#     try:
#         # Fetch user_id based on email
#         with conn.cursor(pymysql.cursors.DictCursor) as cursor:
#             cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
#             user_data = cursor.fetchone()

#         if user_data:
#             user_id = user_data['user_id']

#             # Delete trip using user_id and trip_id
#             with conn.cursor() as cursor:
#                 cursor.execute("DELETE FROM Books WHERE user_id = %s AND trip_id = %s AND origin_id = %s AND destination_id = %s", 
#                                (user_id, trip_id, origin_id, destination_id))
            
#             conn.commit()
#             return jsonify({'message': 'Trip Deleted!'}), 200
#         else:
#             return jsonify({'error': 'User not found'}), 400

#     except pymysql.MySQLError as e:
#         print(e)
#         return jsonify({'error': 'Database error'}), 500


#-----------------------------------------------------
@app.route('/possible_trips_stats', methods=['POST'])
def find_trip_sequence():
    globalTripformaps = []
    data = request.get_json()
    starting_stop_id = data.get('origin_id')
    ending_stop_id = data.get('destination_id')
    
    conn = open_connection()
    
    try:
        with conn.cursor() as cursor:
            cursor.execute('''
                SELECT A.trip_id, A.stop_sequence, B.stop_sequence 
                FROM Has A 
                JOIN Has B ON A.trip_id = B.trip_id 
                WHERE A.trip_id LIKE %s AND A.stop_id = %s AND B.stop_id = %s
            ''', ('%1', starting_stop_id, ending_stop_id))
            result = cursor.fetchone()

        if result is None:
            return jsonify({'message': False})
        
        with conn.cursor() as cursor:
            if result[1] < result[2]:
                cursor.execute('''
                    SELECT * 
                    FROM Has 
                    WHERE trip_id = %s AND stop_sequence >= %s AND stop_sequence <= %s 
                    ORDER BY stop_sequence
                ''', (result[0], result[1], result[2]))
            else:
                cursor.execute('''
                    SELECT * 
                    FROM Has 
                    WHERE trip_id = %s AND stop_sequence >= %s AND stop_sequence <= %s 
                    ORDER BY stop_sequence DESC
                ''', (result[0], result[2], result[1]))

            value_returned_to_frontend = cursor.fetchall()

        # Extract the arrival times from the JSON
        arrival_times = [stop[2] for stop in value_returned_to_frontend]  # Assuming arrival_time is at index 2

        # Use the calculate_time_difference function to find the time difference
        time_taken_for_trip = calculate_time_difference(arrival_times[0], arrival_times[-1])
        
        stopList = [[stop[1], stop[4]] for stop in value_returned_to_frontend]

        with conn.cursor() as cursor:
            for s in stopList:
                cursor.execute('SELECT stop_name, stop_lat, stop_lon FROM Stops WHERE stop_id = %s', (s[0],))
                r = cursor.fetchone()
                s[0] = r[0]
                globalTripformaps.append(r)

        return jsonify({
            'trip_id': result[0],
            'time_taken': time_taken_for_trip,
            'seq_of_stop_names': stopList,
            'message': True,
            'globalTripformaps': globalTripformaps
        })

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


def calculate_time_difference(start_time, end_time):
    # Convert time strings to datetime objects
    format_str = '%H:%M:%S'
    start_datetime = datetime.strptime(start_time, format_str)
    end_datetime = datetime.strptime(end_time, format_str)

    # Calculate time difference
    if start_datetime < end_datetime:
        time_difference = end_datetime - start_datetime
    else:
        time_difference = start_datetime - end_datetime

    # Extract hours, minutes, and seconds
    hours, remainder = divmod(time_difference.seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    # Format the time difference
    formatted_time_difference = f"{hours:02}:{minutes:02}:{seconds:02}"

    return formatted_time_difference

#-------------------------------------------------------------------------
# Section for procedures using advanced query

@app.route('/get_routemode_ids', methods=['POST'])
def get_routemode_ids():
    data = request.get_json()
    route_type = data.get('route_type')
    conn = open_connection()
    try:
        # Call the stored procedure
        with conn.cursor() as cursor:
            cursor.execute('CALL GetTripIdsByRouteType(%s, @out_route_id, @out_route_long_name, @out_route_color, @out_trip_id)', (route_type,))
            result = cursor.fetchall()
            trip_data = []
            # Process the results as needed
            for row in result:
                trip_data.append({
                    'route_id': row[0],
                    'route_long_name': row[1],
                    'route_color': row[2],
                    'trip_id': row[3]
                })

        return jsonify({'trip_data': trip_data})

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


@app.route('/get_trip_id', methods=['POST'])
def show_map_for_chosen_route_type_trip():
    data = request.get_json()
    route_long_name = data.get('route_long_name')
    route_color = data.get('route_color')
    trip_id = data.get('trip_id')
    return show_sp_trip_on_map(trip_id,route_color,route_long_name)

@app.route('/headway_time',methods=['POST'])
def send_headway_time():
    data = request.get_json()
    trip_id = data.get('trip_id')
    conn = open_connection()
    try:
    # Call the stored procedure
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute('CALL GetheadwayInfo(%s)', (trip_id,))
            result = cursor.fetchall()

        return result

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500



#------------------------------------------------------------------------------------------------

# Create a route to display the map
@app.route('/all_stops',methods=["GET"])
def all_stops():
    try:
        conn = open_connection()
        with conn.cursor() as cursor:
            # Fetch stop information from the database
            cursor.execute("SELECT stop_id, stop_name, stop_lat, stop_lon FROM Stops")
            stops_data = cursor.fetchall()

        # Combine data into a dictionary
        result = {'stops_data': stops_data}
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)})


def make_circle(position, tooltip, color):
    return CircleMarker(
        position,
        tooltip=tooltip,
        color="#000",
        fill_color=color,
        fill_opacity=1,
        radius=8,
        weight=2,
        opacity=1,
    )

@app.route('/trip', methods=["POST"])
def show_trip_on_map():
    data = request.get_json()
    trip_id = data,get('trip_id')
    try:
        # Fetch lat/long points for the trip path
        conn = open_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT shape_pt_lat, shape_pt_lon FROM Shapes WHERE shape_id IN (SELECT shape_id FROM Trips WHERE trip_id = %s) ORDER BY shape_pt_sequence", (trip_id,))
            path_data = cursor.fetchall()

        if not path_data:
            return jsonify({'error': 'No path data found for the specified trip_id'})

        path = [(float(lat), float(lon)) for lat, lon in path_data]

        # Fetch stops information for the trip
        with conn.cursor() as cursor:
            cursor.execute("SELECT Stops.stop_lat, Stops.stop_lon, Stops.stop_name FROM Stops JOIN Has ON Stops.stop_id = Has.stop_id WHERE Has.trip_id = %s ORDER BY Has.stop_sequence", (trip_id,))
            stops_data = cursor.fetchall()

        if not stops_data:
            return jsonify({'error': 'No stops data found for the specified trip_id'})

        # Creating map
        itinerary_map = folium.Map(
            location=path[len(path) // 2],  # initialize the map centered in the middle point of the trip
            tiles='cartodbpositron',
            zoom_start=11,
            control_scale=True
        )

        # Adding trip path
        PolyLine(
            locations=path
        ).add_to(itinerary_map)

        # First station
        first_row = stops_data[0]
        make_circle([float(first_row[0]), float(first_row[1])], first_row[2], 'green').add_to(itinerary_map)

        # Last station
        last_row = stops_data[-1]
        make_circle([float(last_row[0]), float(last_row[1])], last_row[2], 'red').add_to(itinerary_map)

        # Intermediary stations
        for row in stops_data[1:-1]:
            make_circle([float(row[0]), float(row[1])], row[2], '#ccc').add_to(itinerary_map)

        # Save the map to an HTML file
        map_html_content = itinerary_map.get_root().render()

        return map_html_content

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500



@app.route('/trip_booked', methods=["POST"])
def show_trip_on_map_booked():

    # Fetch lat/long points for the trip path
    data = request.get_json()
    globalTripformaps = data.get('globalTripformaps')
    path = [(float(info[1]), float(info[2])) for info in globalTripformaps]

    # Creating map
    itinerary_map = folium.Map(
        location=path[len(path) // 2],  # initialize the map centered in the middle point of the trip
        tiles='cartodbpositron',
        zoom_start=11,
        control_scale=True
    )

    # Adding trip path
    PolyLine(
        locations=path
    ).add_to(itinerary_map)

    # First station
    first_row = globalTripformaps[0]
    make_circle([float(first_row[1]), float(first_row[2])], first_row[0], 'green').add_to(itinerary_map)

    # Last station
    last_row = globalTripformaps[-1]
    make_circle([float(last_row[1]), float(last_row[2])], last_row[0], 'red').add_to(itinerary_map)

    # Intermediary stations
    for row in globalTripformaps[1:-1]:
        make_circle([float(row[1]), float(row[2])], row[0], '#ccc').add_to(itinerary_map)

    # Save the map to an HTML file
    map_html_content = itinerary_map.get_root().render()

    return map_html_content

def show_sp_trip_on_map(trip_id,route_color,route_long_name):
    try:
        # Fetch lat/long points for the trip path
        conn = open_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT shape_pt_lat, shape_pt_lon FROM Shapes WHERE shape_id IN (SELECT shape_id FROM Trips WHERE trip_id = %s) ORDER BY shape_pt_sequence", (trip_id,))
            path_data = cursor.fetchall()

        if not path_data:
            return jsonify({'error': 'No path data found for the specified trip_id'})

        path = [(float(lat), float(lon)) for lat, lon in path_data]

        # Fetch stops information for the trip
        with conn.cursor() as cursor:
            cursor.execute("SELECT Stops.stop_lat, Stops.stop_lon, Stops.stop_name FROM Stops JOIN Has ON Stops.stop_id = Has.stop_id WHERE Has.trip_id = %s ORDER BY Has.stop_sequence", (trip_id,))
            stops_data = cursor.fetchall()

        if not stops_data:
            return jsonify({'error': 'No stops data found for the specified trip_id'})

        # Creating map
        itinerary_map = folium.Map(
            location=path[len(path) // 2],  # initialize the map centered in the middle point of the trip
            tiles='cartodbpositron',
            zoom_start=25,
            control_scale=True
        )

        # Adding trip path
        PolyLine(
            locations=path,
            color = route_color
        ).add_to(itinerary_map)

        # First station
        first_row = stops_data[0]
        make_circle([float(first_row[0]), float(first_row[1])], first_row[2], 'green').add_to(itinerary_map)

        # Last station
        last_row = stops_data[-1]
        make_circle([float(last_row[0]), float(last_row[1])], last_row[2], 'red').add_to(itinerary_map)

        # Intermediary stations
        for row in stops_data[1:-1]:
            make_circle([float(row[0]), float(row[1])], row[2], 'route_color').add_to(itinerary_map)

        # Add a legend
        legend_html = '''
            <div style="position: fixed; bottom: 50px; left: 50px; width: 150px; height: 90px; border:2px solid grey; z-index:9999; font-size:14px;">
            &nbsp;<b>''' + route_long_name + '''</b><br>
            &nbsp;Route Color: <i class="fa fa-circle fa-1x" style="color:''' + route_color + '''"></i>
            </div>
            '''
        itinerary_map.get_root().html.add_child(folium.Element(legend_html))


        # Save the map to an HTML file
        map_html_content = itinerary_map.get_root().render()

        return map_html_content

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500


@app.route('/city_public_transit_stops.html', methods=['GET'])
def allstopsmap():
    # Assuming 'map.html' is in the same directory as your Flask app
    file_path = 'map.html'

    # Use Flask's send_file function to send the file
    return send_file(file_path)


if __name__ == '__main__':
    app.run(debug=True)
