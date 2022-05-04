Run the etl with `python3 etl.py <spreadsheetName> <dbConnectionString>.
For example:

python3 etl/etl.py /mnt/c/Users/alex.whitehorn/MDC\ Chemical\ inventory.xlsx "host=localhost port=5432 user=postgres password=postgres dbname=coshh sslmode=disable"