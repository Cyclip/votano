#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

extern crate ureq;
extern crate fastrand;
extern crate lazy_static;
extern crate regex;

pub mod constants;

#[tauri::command]
/// Search a query (given a URL) and return a pure string of
/// Youtube data. Data should be managed in React.
fn search_query(url: String) -> Result<String, String> {
    let body = match get_html(url) {
        Ok(x) => x,
        Err(x) => {
            return Err(x.to_string());
        }
    };

    let json_str = constants::REGEX_SEARCH.captures(&body[..]);
    match json_str {
        Some(x) => {
            let cap = match x.get(1) {
                Some(y) => y.as_str(),
                None => {return Err("failed to find capture".to_string());}
            };

            Ok(format!("{{{cap}}}", cap=cap))
        },
        None => {
            return Err("couldn't capture any regex".to_string());
        }
    }
}

#[tauri::command]
fn get_direct_url(id: String) -> Result<String, String> {
    let body = match get_html(format!("http://www.youtube.com/watch?v={}", id)) {
        Ok(x) => x,
        Err(x) => {
            panic!("{}", x.to_string());
        }
    };

    let mut captures = constants::REGEX_VID.captures_iter(&body[..]);
    captures.next();

    for cap in captures {
        let url = remove_quot(&cap[0])
            .replace(r"\u0026", "&")
            .replace(r"%2F", "/");

        if url.contains("mime=audio/mp4") {
            return Ok(url);
        }
        
    };

    Err("no audio found".to_string())
}

/// Remove quotations from a string (assuming its start and end char)
fn remove_quot(s: &str) -> &str {
    let mut iter = s.chars();
    iter.next();
    iter.next_back();
    iter.as_str()
}

/// 
fn get_html(url: String) -> Result<String, ureq::Error> {
    let body: String = ureq::get(&url[..])
        .set("User-Agent", random_user_agent())
        .call()?
        .into_string()?;

    Ok(body)
}

fn random_user_agent() -> &'static str {
    let i = fastrand::usize(..constants::USER_AGENTS.len());

    constants::USER_AGENTS[i]
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![search_query, get_direct_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
