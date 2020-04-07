terraform {
  backend "remote" {
    organization = "tridnguyen"

    workspaces {
      name = "ledge"
    }
  }
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}

resource "google_service_account" "github_actions" {
  account_id   = "github-actions"
  display_name = "Github Actions"
  description  = "Used by Github Actions to deploy Cloud Run"
}

resource "google_service_account_key" "github_actions" {
  service_account_id = google_service_account.github_actions.name
}

provider "github" {
  token        = var.github_token
  organization = "tnguyen14"
  individual   = false
}

resource "github_actions_secret" "gcp_project" {
  repository      = var.github_repo
  secret_name     = "GCP_PROJECT"
  plaintext_value = var.gcp_project
}

resource "github_actions_secret" "gcp_sa_email" {
  repository = var.github_repo
  secret_name = "GCP_SA_EMAIL"
  plaintext_value = google_service_account.github_actions.email
}

resource "github_actions_secret" "gcp_sa_creds" {
  repository = var.github_repo
  secret_name = "GCP_SA_CREDENTIALS"
  plaintext_value = google_service_account_key.github_actions.private_key
}
