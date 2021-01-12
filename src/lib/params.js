"use strict";

var params = {
  general: {
    title: "Dorcas Installer",
    install_output_folder: "dorcas-business",
    http_scheme: "http",
    host: "127.0.0.1",
    port: 18030,
    path_core_oauth_setup: "setup",
    path_core_user_register: "register",
    path_hub_admin_login: "login",
    default_domain: "dorcas-demo.test"
  },
  versions: {
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
      ]
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
        "reloader"
      ]
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
        image: "dorcashub/dorcas-core-business:dev",
        working_dir: "/var/www/dorcas-business-core"
      },
      core_web: {
        name: "business_core_web",
        port: 18032
      },
      hub_php: {
        name: "business_hub_php",
        port: 18033
      },
      hub_web: {
        name: "business_hub_web",
        port: 18034
      },
      mysql: {
        name: "business_mysql",
        port: 18035,
        host: "127.0.0.1",
        user: "root",
        password: "P@sSW0rD",
        db_core: "dorcas",
        db_hub: "dorcas_hub"
      },
      redis: {
        name: "business_redis",
        port: 18036
      },
      smtp: {
        name: "business_smtp",
        port: 18037
      },
      reloader: {
        name: "business_reloader",
        port: 18038
      }
    }
  }
};

module.exports = params;
