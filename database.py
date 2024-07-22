import psycopg2
import psycopg2.extras

hostname = 'localhost'
database = 'QuantumSudoku'
username = 'postgres'
pwd = 'mcsplashbro'
port_id = 5432
conn = None

inputUser = None
inputPass = None

try:
    with psycopg2.connect(
        host = hostname,
        dbname = database,
        user = username,
        password = pwd,
        port = port_id) as conn:
        
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:

            cur.execute('DROP TABLE IF EXISTS authenticate')

            create_script = ''' CREATE TABLE IF NOT EXISTS authenticate (
                                id          int PRIMARY KEY,
                                username    varchar(40) NOT NULL,
                                password    varchar(40) NOT NULL,
                                email       varchar(40),
                                phonenumber varchar(10))
            '''
            cur.execute(create_script)

            insert_script = 'INSERT INTO authenticate (id, username, password, email, phonenumber) VALUES (%s, %s, %s, %s, %s)'
            insert_values = [(1, 'GucciGoola23', 'SecretPassword', 'email@email.com', '9123212166'),
                            (2, 'RizzskiBidness', 'fluffyBunny19', 'email2@outlook.com', '8529992039'),
                            (3, 'MegaKaren', '!BigPassC0de!', 'email3@gmail.com', '4129920808'),
                            (4, 'slimeBoss555', 'slimy9420', 'email4@yahoo.com', '1234567890'),
                            (5, 'GenericPigeon', '7qwerty#Security', 'email5@hotmail.com', '9902498573')]

            for record in insert_values:
                cur.execute(insert_script, record)
            

            #Not sure if any of these work
            update_script = 'UPDATE authenticate SET username=(%s) password = (%s)'
            update_values = (['GucciGoola24','SecretPasscode2'])

            delete_script = 'DELETE _ FROM authenticate WHERE username = %s'
            delete_values = ('GucciGoola23')


            cur.execute('SELECT * FROM authenticate')

            for record in cur.fetchall():
                print(record['username']) #You can do by index or by column name!

    
except Exception as error:
    print(error)
finally:
    if conn is not None:
        conn.close()