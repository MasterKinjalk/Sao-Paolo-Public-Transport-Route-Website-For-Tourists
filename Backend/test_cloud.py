from flask import Flask, jsonify
import mysql.connector
import bcrypt

app = Flask(__name__)

# Open a database connection
cnx = mysql.connector.connect(user='deployment', password='test@12345', host='34.42.118.89', database='Transport')
cursor = cnx.cursor()

# Hash and salt the password during registration
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password

# Check the password during login
def check_password(entered_password, stored_hashed_password):
    return bcrypt.checkpw(entered_password.encode('utf-8'), stored_hashed_password.encode('utf-8'))

@app.route('/update_password/<op>/<np>', methods=['GET'])
def update_password(op, np):
    try:
        # Replace 'shivamxxx@gmail.com' with data.get('email')
        email = 'shivamxxx@gmail.com'
        
        # Fetch the user's data
        cursor.execute("SELECT * FROM Users WHERE Email = %s", (email,))
        user_data = cursor.fetchone()

        # Check if the user exists
        if user_data:
            # Replace -1 with the actual index of the password column in your database
            stored_hashed_password = user_data[-1]

            # Check if the entered old password matches the stored password
            if check_password(op, stored_hashed_password):
                # Hash the new password
                hashed_new_password = hash_password(np)
                print(hashed_new_password)
                # Update the password in the database
                cursor.execute("UPDATE Users SET Password = %s WHERE Email = %s",
                                (hashed_new_password, email))
                cnx.commit()

                return jsonify({'message': 'Password updated successfully'}), 200
            else:
                return jsonify({'error': 'Invalid old password'}), 400
        else:
            return jsonify({'error': 'User not found'}), 400

    except mysql.connector.Error as e:
        print(e)
        return jsonify({'error': 'Database error'}), 500

if __name__ == "__main__":
    app.run()
