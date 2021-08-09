#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;

use crypto::pbkdf2;
use rocket_contrib::serve::StaticFiles;
use rocket::http::{Cookie, Cookies};
use rocket::http::SameSite;
use rocket_contrib::json::Json;
use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions, AllowedHeaders};
use chrono::{Utc, TimeZone};

mod auth;
mod db;

use auth::AddOffenceResponse;
use auth::ChangePasswordResponse;
use auth::LoginResponse;
use auth::RegisterResponse;

fn login_failed(email: &str) -> LoginResponse {
    LoginResponse { status_code: 401, email: email.to_string(), error_message: "Incorrect username/password".to_string(), user_name: String::new(), role: String::new() }
}

fn login_success(email: &str, user_name: &str, role: &str) -> LoginResponse {
    LoginResponse { status_code: 200, email: email.to_string(), error_message: String::new(), user_name: user_name.to_string(), role: role.to_string() }
}

fn register_success() -> RegisterResponse{
    RegisterResponse{ status_code: 200, error_message: String::new() }
}

fn register_failed_user_exists() -> RegisterResponse{
    RegisterResponse{ status_code: 401, error_message: "Email Already Registered".to_string() }
 }

fn register_failed(error_message: String) -> RegisterResponse{
    RegisterResponse{ status_code: 500, error_message: error_message }
}

fn offence_success() -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 200, error_message: String::new() }
}

fn offence_failed_id_exists() -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 401, error_message: "Id Already Exists".to_string() }
 }

fn offence_failed(error_message: String) -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 500, error_message: error_message }
}

fn password_change_success() -> ChangePasswordResponse{
    ChangePasswordResponse{ status_code: 200, error_message: String::new() }
}

fn password_change_failed(error_message: String) -> ChangePasswordResponse{
    ChangePasswordResponse{ status_code: 500, error_message: error_message }
}

fn register_case_success() -> RegisterResponse{
    RegisterResponse{ status_code: 200, error_message: String::new() }
}

fn register_case_failed(error_message: String) -> RegisterResponse{
    RegisterResponse{ status_code: 500, error_message: error_message }
}

fn case_update_success() -> RegisterResponse{
    RegisterResponse{ status_code: 200, error_message: String::new() }
}

fn case_update_failed(error_message: String) -> RegisterResponse{
    RegisterResponse{ status_code: 500, error_message: error_message }
}

fn accused_success() -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 200, error_message: String::new() }
}

fn accused_failed(error_message: String) -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 500, error_message: error_message }
}

fn accused_update_success() -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 200, error_message: String::new() }
}

fn accused_update_failed(error_message: String) -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 500, error_message: error_message }
}

fn accused_delete_success() -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 200, error_message: String::new() }
}

fn accused_delete_failed(error_message: String) -> AddOffenceResponse{
    AddOffenceResponse{ status_code: 500, error_message: error_message }
}


#[post("/file_firs", format="json", data="<file_firs_form_data>")]
fn file_firs(mut cookies: Cookies, file_firs_form_data: Json<auth::CaseDetailsForm>) -> Json<RegisterResponse> {
    let form = file_firs_form_data.into_inner();
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let dt = chrono::offset::Utc::now();
            let case_struct = db::insert_case(&form, id, dt);
            match case_struct {
                Ok(case_struct) => Json(register_case_success()),
                Err(case_struct) =>
                    Json(register_case_failed(case_struct.to_string()))
            }
        },
        None => Json(register_case_failed("Not logged in".to_string()))
    }
}

#[post("/case_update", format="json", data="<case_update_form_data>")]
fn case_update(mut case_update_form_data: Json<auth::UpdateCaseForm>) ->Json<RegisterResponse> {
    let form = case_update_form_data.into_inner();
    let case = db::update_case(&form);
    match case {
        //case updated successfully registered
        Ok(case) => Json(case_update_success()),
        Err(case) =>
                //some other error
                Json(case_update_failed(case.to_string()))

    }
}

#[post("/change_password", format="json", data="<change_password_form_data>")]
fn change_password(mut cookies: Cookies, change_password_form_data: Json<auth::ChangePasswordForm>) -> Json<ChangePasswordResponse> {
    let form = change_password_form_data.into_inner();
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let user_struct = db::update_user(&form, id);
            match user_struct {
                Ok(user_struct) => Json(password_change_success()),
                Err(user_struct) =>
                    Json(password_change_failed(user_struct.to_string()))
            }
        },
        None => Json(password_change_failed("Not logged in".to_string()))
    }
}

#[post("/accused_add", format="json", data="<accused_form_data>")]
fn accused_add(mut accused_form_data: Json<auth::AccusedForm>) ->Json<AddOffenceResponse> {
    let form = accused_form_data.into_inner();
    let accused = db::insert_accused(&form);
    match accused {
        //accused successfully registered
        Ok(accused) => Json(accused_success()),
        Err(accused) =>
                //some other error
                Json(accused_failed(accused.to_string()))
    }
}

#[post("/accused_update", format="json", data="<accused_update_form_data>")]
fn accused_update(mut accused_update_form_data: Json<auth::AccusedUpdateForm>) ->Json<AddOffenceResponse> {
    let form = accused_update_form_data.into_inner();
    let accused = db::update_accused(&form);
    match accused {
        //offence successfully registered
        Ok(accused) => Json(accused_update_success()),
        Err(accused) =>
                //some other error
                Json(accused_update_failed(accused.to_string()))
    }
}

#[post("/accused_delete", format="json", data="<accused_delete_form_data>")]
fn accused_delete(mut accused_delete_form_data: Json<auth::Accused>) ->Json<AddOffenceResponse> {
    let form = accused_delete_form_data.into_inner();
    let accused = db::delete_accused(&form);
    match accused {
        //offence successfully registered
        Ok(accused) => Json(accused_delete_success()),
        Err(accused) =>
                //some other error
                Json(accused_delete_failed(accused.to_string()))
    }
}

#[post("/register", format="json", data="<register_form_data>")]
fn register(mut register_form_data: Json<auth::RegisterForm>) ->Json<RegisterResponse> {
    let form = register_form_data.into_inner();
    let user = db::insert_user(&form);
    match user {
        //user successfully registered
        Ok(user) => Json(register_success()),
        Err(user) =>
            if user.to_string().contains("duplicate") {
                //if user already exists
                Json(register_failed_user_exists())
            }
            else {
                //some other error
                Json(register_failed(user.to_string()))
            }

    }
}

#[post("/offences_add", format="json", data="<offence_form_data>")]
fn offences_add(mut offence_form_data: Json<auth::AddOffenceForm>) ->Json<AddOffenceResponse> {
    let form = offence_form_data.into_inner();
    let offence = db::insert_offence(&form);
    match offence {
        //offence successfully registered
        Ok(offence) => Json(offence_success()),
        Err(offence) =>
            if offence.to_string().contains("duplicate") {
                //if id already exists
                Json(offence_failed_id_exists())
            }
            else {
                //some other error
                Json(offence_failed(offence.to_string()))
            }

    }
}

#[post("/offences_update", format="json", data="<offence_form_data>")]
fn offences_update(mut offence_form_data: Json<auth::AddOffenceForm>) ->Json<AddOffenceResponse> {
    let form = offence_form_data.into_inner();
    let offence = db::update_offence(&form);
    match offence {
        //offence successfully registered
        Ok(offence) => Json(offence_success()),
        Err(offence) =>
                //some other error
                Json(offence_failed(offence.to_string()))

    }
}

#[get("/offences")]
fn offences(mut cookies: Cookies) -> Json<Vec<auth::Offences>> {
    let offences = db::get_offences();
    Json(offences)
}

#[get("/accused")]
fn accused(mut cookies: Cookies) -> Json<Vec<auth::Accused>> {
    let accused = db::get_accused();
    Json(accused)
}

#[get("/fir_views")]
fn fir_views(mut cookies: Cookies) -> Json<Vec<auth::CaseDetailsWithOffence>> {
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let firs = db::get_firs(id);
            Json(firs)
        },
        None => Json(Vec::new())
    }
}

#[get("/fir_views_admin")]
fn fir_views_admin(mut cookies: Cookies) -> Json<Vec<auth::CaseDetailsWithOffence>> {
            let firs = db::get_firs_admin();
            Json(firs)
}

#[post("/login", format="json", data="<login_form_data>")]
fn login(mut cookies: Cookies, login_form_data: Json<auth::LoginForm>) -> Json<LoginResponse> {
    let form = login_form_data.into_inner();
    let user = db::query_user(&form);
    match user {
        Some(user) =>
            if pbkdf2::pbkdf2_check(&form.password, &user.password_hash).expect("Failed to check password in pbkdf2_simple") {
                // email/password is correct, login success
                let mut auth_cookie = Cookie::build("user_id", user.id.to_string())
                    //.domain("localhost")
                    //.http_only(false)
                    //.secure(false)
                        .finish();
                //auth_cookie.set_same_site(SameSite::None);
                cookies.add_private(auth_cookie);
                Json(login_success(&user.email, &user.name, &user.role))
            } else {
                // Password didn't match the hashed password, login failure
                Json(login_failed(&form.email))
            },
        // The user input email was not found in the database, login failure
        None => Json(login_failed(&form.email))
    }
}

#[post("/logout")]
fn logout(mut cookies: Cookies) -> &'static str {
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let user_struct = db::get_user_from_id(id);
            match user_struct {
                Some(user) => {
                    println!("Logged out user {}", user.email);
                    cookies.remove_private(Cookie::named("user_id"));
                    "Logged out successfully"
                },
                None => "Invalid cookie, user not logged in"
            }
        },
        None => "Not logged in"
    }
}

#[get("/logout_get")]
fn logout_get(mut cookies: Cookies) -> &'static str {
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let user_struct = db::get_user_from_id(id);
            match user_struct {
                Some(user) => {
                    println!("Logged out user {}", user.email);
                    cookies.remove_private(Cookie::named("user_id"));
                    "Logged out successfully"
                },
                None => "Invalid cookie, user not logged in"
            }
        },
        None => "Not logged in"
    }
}

#[get("/search_accused/<case_no>")]
fn search_accused(case_no: i64) -> Json<Vec<auth::Accused>> {
            let accused_search = db::get_accused_with_caseno(case_no);
            Json(accused_search)
}

#[get("/search_user_fir/<case_no>")]
fn search_user_fir(mut cookies: Cookies, case_no: i64) -> Json<Vec<auth::CaseDetailsWithOffence>> {
    let user_id = cookies.get_private("user_id");
    match user_id {
        Some(value) => {
            let id = value.value().parse::<i64>().expect("Failed to parse i64 from cookie");
            let firs = db::get_firs_with_caseno(id, case_no);
            Json(firs)
        },
        None => Json(Vec::new())
    }
}

#[get("/search_fir/<case_no>")]
fn search_fir(case_no: i64) -> Json<Vec<auth::CaseDetailsWithOffence>> {
            let firs = db::get_firs_with_caseno_admin(case_no);
            Json(firs)
}

fn main() {
    println!("Starting webserver");
    println!("Creating tables if it doesn't exists");
    db::setup_database_tables();
    println!("Done creating database");
    //let cors = CorsOptions::default()
        //.allowed_origins(AllowedOrigins::all())
        //.allowed_methods(
            //vec![Method::Get, Method::Post, Method::Patch]
            //.into_iter()
            //.map(From::from)
            //.collect(),
        //)
        //.allowed_headers(AllowedHeaders::all())
        //.allow_credentials(true);

        rocket::ignite()//.attach(cors.to_cors().unwrap())
        .mount("/", routes![login, logout, logout_get, register, change_password, offences, offences_add, offences_update, file_firs, case_update, fir_views, fir_views_admin, accused_add, accused_update, accused_delete, accused, search_user_fir, search_accused, search_fir])
        .mount("/build", StaticFiles::from("/home/vidya/demo/simple-app/build"))
        .launch();
    }
