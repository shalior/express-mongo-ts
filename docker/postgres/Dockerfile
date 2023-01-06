FROM postgres:14
EXPOSE 5432

COPY init.sql /docker-entrypoint-initdb.d
COPY create_test_db.sql /docker-entrypoint-initdb.d
