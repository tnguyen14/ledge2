output "sa_email" {
  value = google_service_account.github_actions.email
}

output "sa_creds" {
  value = google_service_account.github_actions.private_key
}
