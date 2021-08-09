use serde::{Serialize, Deserialize};
//use chrono::{Utc, TimeZone};

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub password_hash: String,
    pub role: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Accused {
    pub case_no: String,
    pub age: i64,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct CaseDetailsWithOffence {
    pub case_no: String,
    pub fir_date: String,
    pub complaint_by: String,
    pub address: String,
    pub phone: i64,
    pub statement: String,
    pub case_status: String,
    pub offence_name: String,
    pub ipc_section: String,
    pub detail: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct Offences {
    pub id: i64,
    pub offence_name: String,
    pub ipc_section: String,
    pub detail: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct CaseDetailsForm {
    pub complaint_by: String,
    pub address: String,
    pub phone: String,
    pub statement: String,
    pub case_status: String,
    pub offence_type: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct LoginForm {
    pub email: String,
    pub password: String
}

//#[derive(Serialize, Deserialize, Debug, FromForm)]
//pub struct SearchForm {
//    pub case_no: String,
//}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct AccusedForm {
    pub case_no: String,
    pub age: i64,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct RegisterForm {
    pub email: String,
    pub password: String,
    pub role: String,
    pub name: String
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct AccusedUpdateForm {
    pub case_no: String,
    pub new_age: i64,
    pub new_name: String,
    pub old_age: i64,
    pub old_name: String
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct AddOffenceForm {
    pub id: String,
    pub offence_name: String,
    pub ipc_section: String,
    pub detail: String
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct ChangePasswordForm {
    pub new_password: String,
}

#[derive(Serialize, Deserialize, Debug, FromForm)]
pub struct UpdateCaseForm {
    pub case_no: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginResponse {
    pub status_code: u32,
    pub error_message: String,
    pub user_name: String,
    pub email: String,
    pub role: String
}
 #[derive(Serialize, Deserialize, Debug)]
 pub struct RegisterResponse {
     pub status_code: u32,
     pub error_message: String,
 }

#[derive(Serialize, Deserialize, Debug)]
 pub struct ChangePasswordResponse {
     pub status_code: u32,
     pub error_message: String,
 }

#[derive(Serialize, Deserialize, Debug)]
 pub struct AddOffenceResponse {
     pub status_code: u32,
     pub error_message: String,
 }
