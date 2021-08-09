use postgres::{Client, NoTls};
use chrono::{Utc, TimeZone};
use super::auth;
use crypto::pbkdf2;
use postgres::error::Error;

pub fn get_database_connection() -> Client {
    Client::connect("postgresql://maxroach@localhost:26257/fir", NoTls)
        .expect("Failed to create database connection")
}

pub fn setup_database_tables() {
    let mut client = get_database_connection();

    client
        .execute(
                "CREATE TABLE IF NOT EXISTS users(
                    id SERIAL PRIMARY KEY,
                    email STRING NOT NULL UNIQUE,
                    password_hash STRING NOT NULL,
                    role STRING NOT NULL,
                    name STRING NOT NULL)",
                &[],
        )
        .expect("Failed to create users table");

    client
        .execute(
            "CREATE TABLE IF NOT EXISTS offences(
                id INT PRIMARY KEY,
                offence_name STRING NOT NULL,
                ipc_section STRING NOT NULL,
                detail STRING)",
            &[],
        )
        .expect("Failed to create ofences table");

    client
        .execute(
            "CREATE TABLE IF NOT EXISTS case_details(
                case_no SERIAL PRIMARY KEY,
                fir_date DATE NOT NULL,
                complaint_by STRING NOT NULL,
                address STRING NOT NULL,
                phone INT NOT NULL,
                statement STRING NOT NULL,
                offence_type INT REFERENCES offences(id) ON UPDATE CASCADE,
                case_status STRING NOT NULL,
                updated_by SERIAL NOT NULL REFERENCES users(id) ON UPDATE CASCADE)",
            &[],
        )
        .expect("Failed to create case_details table");

    client
        .execute(
            "CREATE TABLE IF NOT EXISTS accused(
                Name STRING NOT NULL,
                Age INT,
                case_id SERIAL REFERENCES case_details(case_no) ON UPDATE CASCADE ON DELETE CASCADE)",
            &[],
        )
        .expect("Failed to create accused table");
}

pub fn query_user(user: &auth::LoginForm) -> Option<auth::User> {
    let mut client = get_database_connection();
    let email = user.email.to_lowercase();
    let row: Vec<postgres::Row> = client
        .query(
            "SELECT id, password_hash, role, name from users where email = $1",
            &[&email]
        ).expect("Failed to query for given email");
    if row.len() == 0 {
        None
    } else {
        let row: &postgres::Row = &row[0];
        let id = row.get(0);
        let password_hash = row.get(1);
        let role = row.get(2);
        let user_name = row.get(3);
        Some(auth::User { id: id, email: email, name: user_name, password_hash: password_hash, role: role})
    }
}

pub fn insert_user(user: &auth::RegisterForm) -> Result<u64, Error> {
    let password_hash =  pbkdf2::pbkdf2_simple(&user.password, 100000).unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, $3, $4)",
                &[&user.email, &password_hash, &user.role, &user.name],
            )
}

pub fn insert_offence(offence: &auth::AddOffenceForm) -> Result<u64, Error> {
    let id = offence.id.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "INSERT INTO offences (id, offence_name, ipc_section, detail) VALUES ($1, $2, $3, $4)",
            &[&id, &offence.offence_name, &offence.ipc_section, &offence.detail],
        )
}

pub fn insert_case(case: &auth::CaseDetailsForm, id: i64, date: chrono::DateTime<Utc>) -> Result<u64, Error> {
    let offence_type = case.offence_type.parse::<i64>().unwrap();
    let phone = case.phone.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "INSERT INTO case_details (complaint_by, address, phone, statement, offence_type, case_status, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            &[&case.complaint_by, &case.address, &phone, &case.statement, &offence_type, &case.case_status, &id],
        )
}

pub fn insert_accused(accused: &auth::AccusedForm) -> Result<u64, Error> {
    let case_no = accused.case_no.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "INSERT INTO accused (Name, Age, case_id) VALUES ($1, $2, $3)",
            &[&accused.name, &accused.age, &case_no],
        )
}

pub fn update_case(case: &auth::UpdateCaseForm) -> Result<u64, Error> {
    let case_no = case.case_no.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "UPDATE case_details SET case_status='closed' WHERE case_no=$1",
            &[&case_no],
        )
}

pub fn update_user(user: &auth::ChangePasswordForm, id: i64 ) -> Result<u64, Error> {
    let new_password_hash = pbkdf2::pbkdf2_simple(&user.new_password, 100000).unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "UPDATE users SET password_hash=$1 WHERE id=$2",
            &[&new_password_hash, &id],
        )
}

 pub fn update_offence(offence: &auth::AddOffenceForm) -> Result<u64, Error> {
     let id = offence.id.parse::<i64>().unwrap();
     let mut client = get_database_connection();
     client
         .execute(
             "UPDATE offences SET (offence_name, ipc_section, detail) = ($1, $2, $3) WHERE id=$4",
             &[&offence.offence_name, &offence.ipc_section, &offence.detail, &id],
         )
 }

pub fn update_accused(accused: &auth::AccusedUpdateForm) -> Result<u64, Error> {
    let case_no = accused.case_no.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "UPDATE accused SET (Name, Age) = ($1, $2) WHERE Name=$3 and Age=$4 and case_id=$5",
            &[&accused.new_name, &accused.new_age, &accused.old_name, &accused.old_age, &case_no],
        )
}

pub fn delete_accused(accused: &auth::Accused) -> Result<u64, Error> {
    let case_no = accused.case_no.parse::<i64>().unwrap();
    let mut client = get_database_connection();
    client
        .execute(
            "DELETE FROM accused WHERE Name=$1 and Age=$2 and case_id=$3",
            &[&accused.name, &accused.age, &case_no],
        )
}

pub fn get_user_from_id(id: i64) -> Option<auth::User> {
    let mut client = get_database_connection();
    let row: Vec<postgres::Row> = client
        .query(
            "SELECT email, password_hash, role, name from users where id = $1",
            &[&id]
        ).expect("Failed to query for given id");
    if row.len() == 0 {
        None
    } else {
        let row: &postgres::Row = &row[0];
        let email = row.get(0);
        let password_hash = row.get(1);
        let role = row.get(2);
        let user_name = row.get(3);
        Some(auth::User { id: id, email: email, name: user_name, password_hash: password_hash, role: role})
    }
}

pub fn get_accused() -> Vec<auth::Accused> {
    let mut accused = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select * from accused",
        &[]
    ).expect("Failed to query for offences");
    for row in rows {
        let name = row.get(0);
        let age = row.get(1);
        let case_no: i64 = row.get(2);
        let accused_info = auth::Accused {name, age, case_no: case_no.to_string()};
        accused.push(accused_info);
    }
    accused
}

pub fn get_accused_with_caseno(case_no: i64) -> Vec<auth::Accused> {
    let mut accused = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select * from accused where case_id = $1",
        &[&case_no]
    ).expect("Failed to query for offences");
    for row in rows {
        let name = row.get(0);
        let age = row.get(1);
        let case_no: i64 = row.get(2);
        let accused_info = auth::Accused {name, age, case_no: case_no.to_string()};
        accused.push(accused_info);
    }
    accused
}

pub fn get_firs(id: i64) -> Vec<auth::CaseDetailsWithOffence> {
    let mut firs = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select case_no, fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail from offences o, case_details c where o.id = c.offence_type and c.updated_by = $1",
        &[&id]
    ).expect("Failed to query for cases");
    for row in rows {
        let case_no: i64 = row.get(0);
        let date_to_str: chrono::NaiveDate = row.get(1);
        let fir_date = date_to_str.format("%a %b %e %Y").to_string();
        let complaint_by = row.get(2);
        let address = row.get(3);
        let phone = row.get(4);
        let statement = row.get(5);
        let case_status = row.get(6);
        let offence_name = row.get(7);
        let ipc_section = row.get(8);
        let detail = row.get(9);
        let user_cases = auth::CaseDetailsWithOffence {case_no: case_no.to_string(), fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail};
        firs.push(user_cases);
    }
    firs
}

pub fn get_firs_admin() -> Vec<auth::CaseDetailsWithOffence> {
    let mut firs = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select case_no, fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail from offences o, case_details c where o.id = c.offence_type and c.case_status = 'open'",
        &[]
    ).expect("Failed to query for cases");
    for row in rows {
        let case_no: i64 = row.get(0);
        let date_to_str: chrono::NaiveDate = row.get(1);
        let fir_date = date_to_str.format("%a %b %e %Y").to_string();
        let complaint_by = row.get(2);
        let address = row.get(3);
        let phone = row.get(4);
        let statement = row.get(5);
        let case_status = row.get(6);
        let offence_name = row.get(7);
        let ipc_section = row.get(8);
        let detail = row.get(9);
        let user_cases = auth::CaseDetailsWithOffence {case_no: case_no.to_string(), fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail};
        firs.push(user_cases);
    }
    firs
}
pub fn get_firs_with_caseno_admin(case_no: i64) -> Vec<auth::CaseDetailsWithOffence> {
    let mut firs = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select case_no, fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail from offences o, case_details c where o.id = c.offence_type and c.case_no = $1",
        &[&case_no]
    ).expect("Failed to query for cases");
    for row in rows {
        let case_no: i64 = row.get(0);
        let date_to_str: chrono::NaiveDate = row.get(1);
        let fir_date = date_to_str.format("%a %b %e %Y").to_string();
        let complaint_by = row.get(2);
        let address = row.get(3);
        let phone = row.get(4);
        let statement = row.get(5);
        let case_status = row.get(6);
        let offence_name = row.get(7);
        let ipc_section = row.get(8);
        let detail = row.get(9);
        let user_cases = auth::CaseDetailsWithOffence {case_no: case_no.to_string(), fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail};
        firs.push(user_cases);
    }
    firs
}

pub fn get_firs_with_caseno(id: i64, case_no: i64) -> Vec<auth::CaseDetailsWithOffence> {
    let mut firs = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select case_no, fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail from offences o, case_details c where o.id = c.offence_type and c.updated_by = $1 and c.case_no = $2",
        &[&id, &case_no]
    ).expect("Failed to query for cases");
    for row in rows {
        let case_no: i64 = row.get(0);
        let date_to_str: chrono::NaiveDate = row.get(1);
        let fir_date = date_to_str.format("%a %b %e %Y").to_string();
        let complaint_by = row.get(2);
        let address = row.get(3);
        let phone = row.get(4);
        let statement = row.get(5);
        let case_status = row.get(6);
        let offence_name = row.get(7);
        let ipc_section = row.get(8);
        let detail = row.get(9);
        let user_cases = auth::CaseDetailsWithOffence {case_no: case_no.to_string(), fir_date, complaint_by, address, phone, statement, case_status, offence_name, ipc_section, detail};
        firs.push(user_cases);
    }
    firs
}

pub fn get_offences() -> Vec<auth::Offences> {
    let mut offences = Vec::new();
    let mut client = get_database_connection();
    let rows = client.query(
        "select * from offences",
        &[]
    ).expect("Failed to query for offences");
    for row in rows {
        let id = row.get(0);
        let offence_name = row.get(1);
        let ipc_section = row.get(2);
        let detail = row.get(3);
        let offence = auth::Offences {id, offence_name, ipc_section, detail};
        offences.push(offence);
    }
    offences
}
