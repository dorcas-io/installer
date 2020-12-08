exports.inquiries =  [
          {
              name: "template",
              type: "list",
              message: "Please Select Dorcas Version ",
              choices: ["business", "developer"],
              default: "service"
            },
            {
              name: "firstname",
              type: "input",
              message: "Please Provide Your First name",
              when: answers => answers.template === "business" || answers.template === "developer"  ,
              validate: function(value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter your first name";
                }
              }
            },
            {
              name: "lastname",
              type: "input",
              message: "Please Provide Your Last name",
              when: answers => answers.template === "business" || answers.template === "developer"  ,
              validate: function(value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter your laest nam";
                }
              }
            },
            {
              name: "email",
              type: "input",
              message: "Create Your Login Email Address",
              validate: function(value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter your email address";
                }
              }
            },
            
            {
              name: "password",
              type: "password",
              message: "Create Your Login Password",
              validate: function(value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter your email address";
                }
              }
            },
            {
              name: "company",
              type: "input",
              message: "Please Provide Your company name",
              when: answers => answers.template === "business" || answers.template === "developer"  ,
              validate: function(value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter your company name";
                }
              }
            },
            {
              name: "phone",
              type: "input",
              message: "Please Provide Your phone  number",
              when: answers => answers.template === "business" || answers.template === "developer"  ,
              validate: function (value) {
                if (value.length) {
                  return true;
                } else {
                  return "Please enter a valid phone number";
                }
              }
            },
              {
              name: "feature_select",
              type: "list",
              message: "Please Select The  Business Features Do You Need?",
                  choices: [
                      {
                  name: "Everything!",
                    value: "all"
                  },
                      {
                  name: "Payroll",
                    value: "payroll"
                  },
                      {
                  name: "Selling Online",
                    value: "selling_online"
                  },
                ],
              default: "service"
            },
            
        
      ];
