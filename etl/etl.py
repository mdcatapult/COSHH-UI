import sys
import pandas as pd
import numpy as np
import psycopg2
import psycopg2.extras

def insert_chemical(data_frame_row, lab_location, header):

    photo = None
    sds = None
    if 'Photo' not in header:
        if 'SDS' not in header: 
             chemical_name, cas_number, state, quantity, date_added, expiry_date, hazards, coshh = data_frame_row
        else:
            chemical_name, cas_number, state, quantity, date_added, expiry_date, hazards, sds, coshh = data_frame_row
    else:
        chemical_name, photo, cas_number, state, quantity, date_added, expiry_date, hazards, sds, coshh = data_frame_row

    sql = """
        INSERT INTO chemical(
            cas_number,
            chemical_name,
            photo_path,
            matter_state,
            quantity,
            added,
            expiry,
            safety_data_sheet,
            coshh_link,
            lab_location,
            storage_temp,
            is_archived 
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """

    cur = conn.cursor()
    cur.execute(sql, (
        cas_number,
        chemical_name,
        photo,
        state if state is not None and str(state).strip().lower() != 'liq' else 'liquid',
        quantity,
        date_added,
        expiry_date,
        sds,
        coshh,
        lab_location,
        'Shelf',
        False,
    ))

    id = cur.fetchone()[0]

    if hazards is not None:
        insert_hazards(id, hazards)

    conn.commit()
    cur.close()

def insert_hazards(id, hazards):
    hazards = hazards.split(',')

    sql = "INSERT INTO chemical_to_hazard (id, hazard) VALUES %s"
  
    values = []
    for hazard in hazards:
        values.append((id, hazard.strip()))

    cur = conn.cursor()
    
    psycopg2.extras.execute_values (
    cur, sql, values, template=None, page_size=100
)


def insert_chemicals(file_path):
    excel = pd.ExcelFile(file_path)

    for sheet_name in excel.sheet_names:

        if 'Lab' not in sheet_name:
            continue

        df = pd.read_excel(excel, sheet_name=sheet_name)
        df = df.replace({np.nan: None})

        header = None

        for i, row in df.iterrows():
            # print(row[1])
            if i == 3: 
                header = row.values
            if i > 3 and row[0] is not None and row[0] is not pd.NaT: # skip headers; skip rows where chemical name is empty
                insert_chemical(row, sheet_name, header)

    conn.close()

file_path = sys.argv[1]
conn_string = sys.argv[2]
conn = None

try: 
    conn = psycopg2.connect(conn_string)
except (Exception) as error: 
    print(error)


insert_chemicals(file_path)