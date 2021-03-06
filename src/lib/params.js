"use strict";

var params = {
  general: {
    title: "Dorcas",
    title_full: "Dorcas Framework",
    install_output_folder: "dorcas-business",
    deploy_output_folder: "dorcas-business",
    http_scheme: "http",
    host: "127.0.0.1",
    port: 18030,
    path_core_oauth_setup: "setup",
    path_core_user_register: "register",
    path_hub_admin_login: "login",
    default_domain_production: "dorcas-prod.test",
    default_domain_development: "dorcas-dev.test",
    iaac_repo: "hostvilleng/iaac"
  },
  versions: {
    deploy: {
      services: [
        "proxy",
        "core_php",
        "core_web",
        "hub_php",
        "hub_web",
        "mysql",
        "redis",
        "smtp"
      ],
      git_repo_core: "dorcas-io/core-business",
      git_branch_core: "dev",
      git_repo_hub: "dorcas-io/hub-business",
      git_branch_hub: "dev"
    },
    production: {
      services: [
        "proxy",
        "core_php",
        "core_web",
        "hub_php",
        "hub_web",
        "mysql",
        "redis",
        "smtp"
      ],
      git_repo_core: "dorcas-io/core-business",
      git_branch_core: "dev",
      git_repo_hub: "dorcas-io/hub-business",
      git_branch_hub: "dev"
    },
    development: {
      services: [
        "proxy",
        "core_php",
        "core_web",
        "hub_php",
        "hub_web",
        "mysql",
        "redis",
        "smtp",
        "reloader-core",
        "reloader-hub"
      ],
      git_repo_core: "dorcas-io/core-business",
      git_branch_core: "dev",
      git_repo_hub: "dorcas-io/hub-business",
      git_branch_hub: "dev"
    }
  },
  docker: {
    services: {
      proxy: {
        name: "business_proxy",
        port: 18030,
        image: "jwilder/nginx-proxy"
      },
      core_php: {
        name: "business_core_php",
        port: 18031,
        image: "dorcashub/dorcas-core-business",
        working_dir: "/var/www/dorcas-business-core",
        env_file: "./app/env_core_",
        volumes_env: "/var/www/dorcas-business-core/.env",
        volumes_php_ini: "./app/local.ini:/usr/local/etc/php/conf.d/local.ini",
        src_dir: "./src/core",
        app_dir: "./app"
      },
      core_web: {
        subdomain: "core",
        name: "business_core_web",
        port: 18032
      },
      hub_php: {
        name: "business_hub_php",
        port: 18033,
        image: "dorcashub/dorcas-hub-business",
        working_dir: "/var/www/dorcas-business-hub",
        env_file: "./app/env_hub_",
        volumes_env: "/var/www/dorcas-business-hub/.env",
        volumes_php_ini: "./app/local.ini:/usr/local/etc/php/conf.d/local.ini",
        src_dir: "./src/hub",
        app_dir: "./app"
      },
      hub_web: {
        subdomain: "hub",
        name: "business_hub_web",
        port: 18034
      },
      mysql: {
        subdomain: "mysql",
        name: "business_mysql",
        port: 18035,
        host: "127.0.0.1",
        user: "root",
        password: "P@sSW0rD",
        db_core: "dorcas_core",
        db_hub: "dorcas_hub"
      },
      redis: {
        subdomain: "redis",
        name: "business_redis",
        port: 18036,
        image: "redis:5.0-alpine"
      },
      smtp: {
        subdomain: "smtp",
        name: "business_smtp",
        port: 18037,
        port_2: 18038,
        image: "mailhog/mailhog:latest"
      },
      reloader: {
        name: "business_reloader",
        port: 18039,
        image: "apogiatzis/livereloading"
      }
    }
  }
};

module.exports = params;
