import psycopg2

hostname = 'localhost'
database = 'QuantumSudoku'
username = 'postgres'
#Not sure if I remember my password but here goes I guess
pwd = 'mcsplashbro'
port_id = 5432
cur = None
conn = None

try:
    conn = psycopg2.connect(
        host = hostname,
        dbname = database,
        user = username,
        password = pwd,
        port = port_id
    )
    cur = conn.cursor()

    create_script = ''' CREATE TABLE IF NOT EXISTS authenticate (
                        id          int PRIMARY KEY,
                        username    varchar(40) NOT NULL,
                        password    varchar(40) NOT NULL,
                        email       varchar(40),
                        phonenumber int)
    '''

    cur.execute(create_script)
    conn.commit()

    
except Exception as error:
    print(error)
finally:
    if cur is not None:
        cur.close()
    if conn is not None:
        conn.close()