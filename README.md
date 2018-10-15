# PowerGrade

An app for creating and sharing social events.

### Deployment

[Live app](https://powergrade-client.herokuapp.com/)

[Client-side repo]()


### Tech-Stack

Front-end                      | Back-end
_______________________________|_________________________________
 HTML                          |  Node/Express
 CSS                           |  Mocha/Chai
 React                         |  MongoDB/mongoose
 Redux                         |  JSON Webtoken
 React-Router                  |  Bcrypt.js
 Redux-Form                    |  Passport.js
 Enzyme/Jest                   |  Continuous Integration (Travis)
 Continuous Deployment (Heroku)|  Continuous Deployment (Heroku)                 |  
                               
### API Documentation

##### Authorization

###### GET a JSON Web Token (Login)

* Type: `POST`

* URL: `https://powergrade-client.herokuapp.com/login`

* Required Request Headers: ```{
  Content-Type: `application/json`
}```

* Required Request JSON Body: ```{
  username: UsernameStringGoesHere,
  password: PasswordStringGoesHere
}```

* Response Body will be a JSON Web Token: ```{
  authToken: 'theTokenWillBeHereAsAString'
}```

* Note - Web Token is valid for 7 days from the issue date


##### Class Data

###### GET all classes

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://powergrade-client.herokuapp.com/classes`

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be an array of classes: ```[
    {
        "students": [
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555500",
                    "555555555555555555555501",
                    "555555555555555555555502",
                    "555555555555555555555503"
                ],
                "firstName": "Keith",
                "lastName": "Byers",
                "id": "111111111111111111111100"
            },
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555504",
                    "555555555555555555555505",
                    "555555555555555555555506",
                    "555555555555555555555507"
                ],
                "firstName": "Rachel",
                "lastName": "Gangemi",
                "id": "111111111111111111111101"
            },
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555508",
                    "555555555555555555555509",
                    "555555555555555555555510",
                    "555555555555555555555511"
                ],
                "firstName": "Melissa",
                "lastName": "Ralston",
                "id": "111111111111111111111102"
            }
        ],
        "assignments": [
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555500",
                    "555555555555555555555504",
                    "555555555555555555555508"
                ],
                "name": "Math Homework",
                "date": "2018-09-10",
                "userId": "000000000000000000000000",
                "categoryId": "444444444444444444444400",
                "id": "333333333333333333333300"
            },
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555501",
                    "555555555555555555555505",
                    "555555555555555555555509"
                ],
                "name": "Math Quiz",
                "date": "2018-09-12",
                "userId": "000000000000000000000000",
                "categoryId": "444444444444444444444402",
                "id": "333333333333333333333301"
            },
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555502",
                    "555555555555555555555506",
                    "555555555555555555555510"
                ],
                "name": "Math Test",
                "date": "2018-09-14",
                "userId": "000000000000000000000000",
                "categoryId": "444444444444444444444403",
                "id": "333333333333333333333302"
            },
            {
                "classes": [
                    "222222222222222222222200"
                ],
                "grades": [
                    "555555555555555555555503",
                    "555555555555555555555507",
                    "555555555555555555555511"
                ],
                "name": "Math Classwork",
                "date": "2018-09-20",
                "userId": "000000000000000000000000",
                "categoryId": "444444444444444444444401",
                "id": "333333333333333333333303"
            }
        ],
        "name": "Math",
        "userId": {
            "firstName": "John",
            "lastName": "Teacher",
            "username": "JohnTeach",
            "id": "000000000000000000000000"
        },
        "id": "222222222222222222222200"
    }...
]```


###### GET a single class

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://powergrade-client.herokuapp.com/classes`
* Example: `https://powergrade-client.herokuapp.com/classes/222222222222222222222201`

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be a single class: ```{
    "students": [
        "111111111111111111111103",
        "111111111111111111111104",
        "111111111111111111111105"
    ],
    "assignments": [
        "333333333333333333333304",
        "333333333333333333333305",
        "333333333333333333333306",
        "333333333333333333333307"
    ],
    "name": "Science",
    "userId": "000000000000000000000000",
    "id": "222222222222222222222201"
}```

##### Assignment Data

###### GET all assignments

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://powergrade-client.herokuapp.com/assignments`
* Example: ``

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be an array of assignments: ```[
    {
        "classes": [
            "222222222222222222222200"
        ],
        "grades": [
            "555555555555555555555500",
            "555555555555555555555504",
            "555555555555555555555508"
        ],
        "name": "Math Homework",
        "date": "2018-09-10",
        "userId": "000000000000000000000000",
        "categoryId": "444444444444444444444400",
        "id": "333333333333333333333300"
    },
    {
        "classes": [
            "222222222222222222222200"
        ],
        "grades": [
            "555555555555555555555501",
            "555555555555555555555505",
            "555555555555555555555509"
        ],
        "name": "Math Quiz",
        "date": "2018-09-12",
        "userId": "000000000000000000000000",
        "categoryId": "444444444444444444444402",
        "id": "333333333333333333333301"
    }...
]```

###### GET a single assignment

* Requires valid JSON Webtoken

* Type: `GET`

* URL: `https://powergrade-client.herokuapp.com/assignments`
* Example: `https://powergrade-client.herokuapp.com/assignments/333333333333333333333309`

* Required Headers: ```{
  Authorization: `Bearer JSONWebToken`
}```

* Response Body will be a single assignment: ```{
        "classes": [
            "222222222222222222222202"
        ],
        "grades": [
            "555555555555555555555525",
            "555555555555555555555529",
            "555555555555555555555533"
        ],
        "name": "English Quiz",
        "date": "2018-09-12",
        "userId": "000000000000000000000000",
        "categoryId": "444444444444444444444402",
        "id": "333333333333333333333309"
    }```