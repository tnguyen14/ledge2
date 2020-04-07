variable "gcp_project" {
  default = "ledge-tridnguyen-com"
}

variable "gcp_region" {
  default = "us-central1"
}

variable "github_token" {
  description = "Token to authenticate with Github (to set up secrets)"
}

variable "github_repo" {
  default = "tnguyen14/ledge"
}
