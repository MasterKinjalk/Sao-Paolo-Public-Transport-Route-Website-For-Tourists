# main.py
from flask import Flask, jsonify, request,send_file
from folium import CircleMarker, PolyLine
import folium
import json
import os
from flask_cors import CORS
import bcrypt


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

    finally:
        conn.close()

    

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

    finally:
        # Close the database connection
        conn.close()


@app.route('/update_user_info', methods=['POST'])
def update_email():
    conn = open_connection()
    data = request.get_json()
    old_email = data.get('email')
    new_email = data.get('new_email')

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            # Check if the email exists in the database
            cursor.execute("SELECT * FROM Users WHERE Email = %s", (old_email,))
            user_data = cursor.fetchone()

            if user_data:
                # Check if the new email is already taken
                cursor.execute("SELECT * FROM Users WHERE Email = %s", (new_email,))
                if cursor.fetchone():
                    return jsonify({'error': 'Email already taken'}), 400

                # Update the user's name and email
                cursor.execute("UPDATE Users SET Email = %s WHERE Email = %s",
                               (new_email, old_email))
                conn.commit()

                return jsonify({'message': 'User information updated successfully'})
            else:
                return jsonify({'error': 'User not found'}), 400

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500

    finally:
        conn.close()

        
@app.route('/get_user_details', methods=['POST'])
def get_user_details():
    conn = open_connection()
    data = request.get_json()
    email = data.get('email')

    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        # Retrieve user details excluding the password
        cursor.execute("SELECT first_name, last_name, email FROM Users WHERE Email = %s", (email,))
        user_data = cursor.fetchone()

        if user_data:
            return jsonify(user_data)
        else:
            return jsonify({'error': 'User not found'}), 400
        
#----------------------------------------------------------------------------
@app.route('/feedback/', methods=['POST'])
def get_feedback():
    data = request.get_json()
    email = data.get('email')
    conn = open_connection()
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT * FROM Feedback WHERE Email = %s", (email,))
        feedback_list = cursor.fetchall()
    conn.close()  # Close the connection after fetching data
    return jsonify(feedback_list)


@app.route('/add_feedback', methods=['POST'])
def add_feedback():
    data = request.get_json()
    trip_id = data.get('trip_id')
    feedback_text = data.get('feedback')
    email = data.get('email')  # Assuming the email is provided in the JSON data

    conn = open_connection()

    with conn.cursor() as cursor:
        cursor.execute("INSERT INTO Feedback(trip_id, feedback, Email) VALUES(%s, %s, %s)", 
                       (trip_id, feedback_text, email))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Feedback Successfully Added!'}), 200

@app.route('/edit_feedback/feedback_id', methods=['POST'])
def edit_feedback():
    #TODO - get feedback_id and feedback as jason {feedback_id,feedback_text}
    data = request.get_json()
    feedback_id=data.get('feedback_id')
    feedback_text = data.get('feedback_text')
    conn = open_connection()
    try:
        feedback_json = request.get_json()
        feedback_text = feedback_json.get(feedback_id,'Nothing Found, Empty String....')
        with conn.cursor() as cursor:
            cursor.execute("UPDATE Feedback SET feedback = %s WHERE feedback_id = %s",
                            (feedback_text, feedback_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Feedback updated successfully'})

    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500
    

@app.route('/delete_feedback/feedback_id')
def Delete_Feedback(feedback_id):
    # Open a database connection
    conn = open_connection()

    # Use a cursor to execute SQL queries
    with conn.cursor() as cursor:
        # Execute an SQL DELETE query to remove feedback from the database
        cursor.execute("DELETE FROM Feedback WHERE feedback_id = %s", 
                       (feedback_id,))
    
    # Commit the changes to the database
    conn.commit()

    # Close the database connection
    conn.close()

    # Return a JSON response indicating success
    return jsonify({'message': 'Feedback Deleted!'})

#--------------------------------------------------------------- 

@app.route('/my_trips', methods=['GET',])
def My_Trips():
    data = request.get_json()
    email_id = data.get('email')
    conn = open_connection()
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM Books WHERE email = %s", email_id)
            trips_list = cursor.fetchall()
        conn.close()
        return jsonify(trips_list)
    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500
    
@app.route('/add_trip', methods=['POST'])
def Add_Trip():
    data = request.get_json()
    trip_id = data.get('trip_id')
    email_id = data.get('email_id')
    conn = open_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO Books VALUES(%s, %s)", 
                   (email_id, trip_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Trip Added!'})
    
    except pymysql.MySQLError as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500

@app.route('/delete_trip')
def Delete_Trip():
    data = request.get_json()
    trip_id = data.get('trip_id')
    email_id = data.get('email_id')
    conn = open_connection()
    with conn.cursor() as cursor:
        cursor.execute("DELETE FROM Books WHERE email = %s AND trip_id = %s", 
                   (email_id, trip_id))
    conn.commit()
    conn.close()
    return  jsonify({'message': 'Trip Deleted!'}), 200


# --------
@app.route('/posible_trips_stats/<stop_id1>/<stop_id2>', methods=['GET'])
def find_poss_trip_sequence(stop_id1, stop_id2):
    # data = {'stop_id1': 301573, 'stop_id2':  301771}
    starting_stop_id = stop_id1  # data.get('stop_id1')
    ending_stop_id = stop_id2  # data.get('stop_id2')
    conn = open_connection()
    
    with conn.cursor() as cursor:
        cursor.execute('SELECT A.trip_id, A.stop_sequence, B.stop_sequence FROM Has A JOIN Has B ON A.trip_id = B.trip_id WHERE A.stop_id = %s AND B.stop_id = %s', 
                       (starting_stop_id, ending_stop_id))
        result = cursor.fetchone()

    if result is None:
        return jsonify({'message': 'No Trip possible!'})

    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        if result[1] < result[2]:
            cursor.execute('SELECT * FROM Has WHERE trip_id = %s AND stop_sequence >= %s AND stop_sequence <= %s ORDER BY stop_sequence', 
                           (result[0], result[1], result[2]))
        else:
            cursor.execute('SELECT * FROM Has WHERE trip_id = %s AND stop_sequence >= %s AND stop_sequence <= %s ORDER BY stop_sequence DESC', 
                           (result[0], result[2], result[1]))
        
    conn.close()
    value_returned_to_frontend = cursor.fetchall()  # now we know the sequence of stops with stop name for a given trip - we will only print these stops on the map.

    return jsonify(value_returned_to_frontend)




@app.route("/", methods=["GET"])
def get_topuser() -> jsonify:
    """Returns a JSON response with the users from the database."""
    try:
        users = get()
        return users
    except Exception as e:
        return jsonify({"error": str(e)})

# Create a route to display the map
@app.route('/all_stops',methods=["GET"])
def all_stops():
    try:
        conn = open_connection()
        with conn.cursor() as cursor:
            # Fetch stop information from the database
            cursor.execute("SELECT stop_id, stop_name, stop_lat, stop_lon FROM Stops")
            stops_data = cursor.fetchall()
        conn.close()

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

@app.route('/trip/<trip_id>', methods=["GET"])
def show_trip_on_map(trip_id):
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

    finally:
        if conn:
            conn.close()

@app.route('/city_public_transit_stops', methods=['GET'])
def allstops():
    # Assuming 'map.html' is in the same directory as your Flask app
    file_path = 'map.html'

    # Use Flask's send_file function to send the file
    return send_file(file_path)


if __name__ == '__main__':
    app.run(debug=True)
