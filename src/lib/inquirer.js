const path = require("path");
const params = require(path.join(__dirname, "./params.js"));

exports.inquiries = [
  {
    name: "template",
    type: "list",
    message: "What version of the Business Edition do you wish to install? ",
    choices: ["production", "development"],
    default: "production"
  },
  {
    name: "firstname",
    type: "input",
    message: "Please enter your First Name",
    when: answers =>
      answers.template === "production" || answers.template === "development",
    validate: function(value) {
      if (value.length) {
        return true;
      } else {
        return "Required! Please enter your First Name ";
      }
    }
  },
  {
    name: "lastname",
    type: "input",
    message: "Please enter your Last Name ",
    when: answers =>
      answers.template === "production" || answers.template === "development",
    validate: function(value) {
      if (value.length) {
        return true;
      } else {
        return "Required! Please enter your First Name ";
      }
    }
  },
  {
    name: "email",
    type: "input",
    message:
      "Please enter your Email Address (will be used as Admin/Login account) ",
    validate: function(value) {
      if (value.length) {
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            value
          )
        ) {
          return true;
        } else {
          return "Check! Please enter a valid Email Address ";
        }
      } else {
        return "Required! Please enter your Email Address ";
      }
    }
  },

  {
    name: "password",
    type: "password",
    message: "Please enter your Login Password (8 characters minimum)",
    validate: function(value) {
      if (value.length && value.length >= 8) {
        return true;
      } else {
        return "Required! Please enter your Login Password (8 characters minimum)";
      }
    }
  },
  {
    name: "company",
    type: "input",
    message: "Enter your Company or Business Name?",
    when: answers => answers.template === "production",
    validate: function(value) {
      if (value.length) {
        return true;
      } else {
        return "Required! Enter your Company or Business Name";
      }
    }
  },
  {
    name: "domain",
    type: "input",
    message: "Enter a Domain Name for this installation",
    when: answers =>
      answers.template === "production" || answers.template === "development",
    default: params.general.default_domain,
    validate: function(value) {
      if (value.length) {
        return true;
      } else {
        return "Required! Enter a Domain Name for this installation";
      }
    }
  },
  {
    name: "phone",
    type: "input",
    message: "Please enter your Phone Number ",
    when: answers =>
      answers.template === "production" || answers.template === "development",
    validate: function(value) {
      if (value.length && value.length >= 8 && value.length < 14) {
        return true;
      } else {
        return "Required! Please enter your Phone Number (8 - 14 characters)";
      }
    }
  },
  {
    name: "feature_select",
    type: "list",
    message: "Please select your needed features",
    default: "all",
    when: answers => answers.template === "production",
    choices: [
      {
        name: "All Features",
        value: "all"
      },
      {
        name: "Payroll Features",
        value: "payroll"
      },
      {
        name: "Sales and ECommerce Features",
        value: "selling_online"
      }
    ],
    default: "all"
  }
];
