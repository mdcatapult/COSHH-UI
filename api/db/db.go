package db

import (
	"fmt"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
	"gitlab.mdcatapult.io/informatics/software-engineering/coshh/chemical"
)

var db *sqlx.DB

func Connect() error {
	const (
		host     = "db"
		port     = 5432
		user     = "postgres"
		password = "postgres"
		dbname   = "coshh"
		retries  = 3
	)

	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	var err error
	for i := 1; i < retries; i++ {
		db, err = sqlx.Connect("postgres", psqlInfo)
		if err == nil {
			break
		}

		fmt.Println("Failed to connect to DB, retrying in 5 seconds...")
		time.Sleep(5 * time.Second)
	}

	return err
}

func SelectAllChemicals() ([]chemical.Chemical, error) {
	var chemicals []chemical.Chemical
	query := `
		SELECT 
			c.cas_number,
			c.chemical_name,
			c.photo_path,
			c.matter_state,
			c.quantity,
			c.added,
			c.expiry,
			c.safety_data_sheet,
			c.coshh_link,
			c.lab_location,
			c.storage_temp,
			c.is_archived,
			string_agg(CAST(c2h.hazard AS VARCHAR(255)), ',') AS hazards 
		FROM chemical c 
		JOIN chemical_to_hazard c2h ON c.id = c2h.id 
		GROUP BY c.id`

	if err := db.Select(&chemicals, query); err != nil {
		return nil, err
	}

	for i := range chemicals {
		if chemicals[i].DBHazards != nil {
			chemicals[i].Hazards = strings.Split(*chemicals[i].DBHazards, ",")
		}
	}

	return chemicals, nil
}

func UpdateChemical(chemical chemical.Chemical) error {
	query := `
	UPDATE chemical 
	SET 
		chemical_name = :chemical_name,
		photo_path = :photo_path,
		matter_state = :matter_state,
		quantity = :quantity,
		added = :added,
		expiry = :expiry,
		safety_data_sheet = :safety_data_sheet,
		coshh_link = :coshh_link,
		lab_location = :lab_location,
		storage_temp = :storage_temp,
		is_archived = :is_archived
	WHERE cas_number = :cas_number
`

	_, err := db.NamedExec(query, chemical)
	return err
}

func InsertChemical(chemical chemical.Chemical) error {

	tx, err := db.Beginx()
	if err != nil {
		return err
	}

	id, err := insertChemical(tx, chemical)
	if err != nil {
		return err
	}

	if err := insertHazards(tx, chemical, id); err != nil {
		return err
	}

	return tx.Commit()
}

func insertChemical(tx *sqlx.Tx, chemical chemical.Chemical) (id int64, err error) {
	query := `INSERT INTO chemical (
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
	)VALUES (
		:cas_number,
		:chemical_name,
		:photo_path,
		:matter_state,
		:quantity,
		:added,
		:expiry,
		:safety_data_sheet,
		:coshh_link,
		:lab_location,
		:storage_temp,
		:is_archived
	) RETURNING id`

	rows, err := tx.NamedQuery(query, chemical)
	if err != nil {
		return
	}

	rows.Next()
	if err := rows.Scan(&id); err != nil {
		return 0, err
	}

	if err := rows.Close(); err != nil {
		return 0, err
	}

	return

}

func insertHazards(tx *sqlx.Tx, chemical chemical.Chemical, id int64) error {
	// chemicalToHazard represents a row in chemical_to_hazard
	type chemicalToHazard struct {
		Id     int64  `db:"id"`
		Hazard string `db:"hazard"`
	}

	chemicalToHazards := make([]chemicalToHazard, 0)

	query := `INSERT INTO chemical_to_hazard (id, hazard) VALUES (:id, :hazard)`

	for _, hazard := range chemical.Hazards {
		chemicalToHazards = append(chemicalToHazards, chemicalToHazard{
			Id:     id,
			Hazard: hazard,
		})
	}

	_, err := tx.NamedExec(query, chemicalToHazards)
	return err
}
