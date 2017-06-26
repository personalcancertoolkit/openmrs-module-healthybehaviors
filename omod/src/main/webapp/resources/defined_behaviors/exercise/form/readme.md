Creating and using `simpleform` is... simple - and highly customizable. Simple form takes care of validating your inputs, passing your inputs to the server, and saving your inputs as openmrs encounters+observations on the server. It even has a feature which enables the user to automatically generate all required concepts, which the user can define by any unique string they want.

## Usage
1. Developer creates html containing the form they wish to submit
    - The html has a few rules, all of which are there to help the `simple_form_submission_handler` object generate the `json` which will be sent to the server and saved on the database
    - Rules:
        - the form should be wrapped with a `<simpleform encounter_type = "">...</simpleform>` tag. 
        - all questions should be wrapped with `<simplequestion concept="unique_identifier_string">..</simplequestion>` tag.
            - note that this tag requires a "unique_identifier_string", which it will use when finding the openmrs conceptid related to this string
        - all answers should be wrapped with `<simplequestion> ... <simpleanswer>..</simpleanswer> ... </simplequestion>`
            - note that answers need to be wrapped inside of questions
        - there should be a button which calls the `simple_form_submission_handler.submit_encounter(encounter_id)` method when form is ready to be submitted
            - note that the `simple_form_submission_handler` needs to be loaded onto the page first
2. Developer is finished working. Everything now works.


## Conceptual Overview
1. Developer creates html
2. `simple_form_submission_handler` crawls the form, scrapes all of the user inputs w/ concept ids and creates a json that contains all nessesary data to record the encounter and observations
3. server side handler receives json through async request from `simple_form_submission_handler`. handler records all data into database

### Concept Loader
The concept loader is a bit seperate but essential to simple managment of concepts and encounter types. The concept loader comes with an api to which a json object consisting of a structure resembling the following example is given. Note, it will safely ignore any additional keys you pass with the concept objects and only requires that `unique_identifier` and  `datatype` are defined. 
    - `unique_identifier` is a customizable string that is unique among all concepts you use in your applications
    - `datatyle` is an HL7 identifier for datatypes. e.g., 'BIT', 'DT', 'ST', etc.
    ```
    [
        {
            "unique_identifier" : "...",
            "datatype" : "..."
        },
        ...
        {
            "unique_identifier" : "...",
            "datatype" : "..."
        }
    ]
    ```

## Examples