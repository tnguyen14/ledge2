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

resource "google_project_iam_member" "cloud_run_admin" {
  project = var.gcp_project
  role    = "roles/run.admin"
  member  = google_service_account.github_actions.email
}

resource "google_project_iam_member" "cloud_build_editor" {
  project = var.gcp_project
  role    = "roles/cloudbuild.builds.editor"
  member  = google_service_account.github_actions.email
}

resource "google_project_iam_member" "cloud_build_service_account" {
  project = var.gcp_project
  role    = "roles/cloudbuild.builds.builder"
  member  = google_service_account.github_actions.email
}

resource "google_project_iam_member" "viewer" {
  project = var.gcp_project
  role    = "roles/viewer"
  member  = google_service_account.github_actions.email
}

resource "google_project_iam_member" "service_account_user" {
  project = var.gcp_project
  role    = "roles/iam.serviceAccountUser"
  member  = google_service_account.github_actions.email
}
/*
* github provider is not supporting individual accounts currently
* https://github.com/terraform-providers/terraform-provider-github/issues/45
* https://github.com/terraform-providers/terraform-provider-github/pull/322
*
* not creating actions secrets here for now,
* manually creating them

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

*/
