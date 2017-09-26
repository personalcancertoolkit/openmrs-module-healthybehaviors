from data_formatting import exercise;
from data_formatting import nutrition;
from data_formatting import openmrs_classes
from data_formatting import utilities
from random import randint
#from data_formatting import exercise

## initialize maximum encounter id
initial_max_encounter_id = 44;
utilities.initial_max_encounter_id(initial_max_encounter_id);



'''
user_id : user
----------------
48 : patient
7 : friend
32 : friend
45 : friend
'''

users = dict({
    "patient": dict({
        "patient_id" : 48,
        "creator_id" : 37,
    }),
    "friend1": dict({
        "patient_id" : 7,
        "creator_id" : 1,
    }),
    "friend2": dict({
        "patient_id" : 32,
        "creator_id" : 1,
    }),
    "friend3": dict({
        "patient_id" : 45,
        "creator_id" : 1,
    }),
})

#################################################################################################
## Build encounters 
#################################################################################################
encounters = [];


#############################################################
## exercise  history
##############################################################
values_keyed_by_user = dict();
values_keyed_by_user["patient"] = [ ## upward trajectory for patient
    (0, 0),
    (0, 1),
    (1, 2),
    (2, 1),
    (2, 1),
    (3, 2),
    (3, 3),
];
values_keyed_by_user["friend1"] = [ ## downward trajectory for this guy
    (3, 3),
    (3, 2),
    (2, 2),
    (1, 2),
    (2, 1),
    (1, 1),
    (1, 2),
];
values_keyed_by_user["friend2"] = [ ## half trajectory for this guy
    (2, 1),
    (3, 1),
    (2, 0),
    (3, 1),
    (2, 1),
    (1, 1),
];
values_keyed_by_user["friend3"] = [ ## mixed trajectory for this guy
    (0, 1),
    (1, 1),
    (3, 2),
    (3, 3),
    (1, 0),
    (1, 1),
];
for user_key in values_keyed_by_user.keys():
    patient = openmrs_classes.User(users[user_key]["patient_id"]);
    creator = openmrs_classes.User(users[user_key]["creator_id"]);
    values = values_keyed_by_user[user_key];
    values.reverse(); ## important, otherwise trend will be backwardsf
    for index, value_pair in enumerate(values):
        variant_days_ago = (exercise.time_interval_in_days)*index - 5 + randint(0, 10);  
        encounter = exercise.return_encounter_with_metrics_for_user(value_pair[0], value_pair[1], variant_days_ago, patient = patient, creator = creator); ## add date_time
        encounters.append(encounter);
        encounter.print_out_all_values();
    
#############################################################
## nutrition  history
##############################################################
values_keyed_by_user = dict();

## patient has upward trajectory
this_user = "patient";
upward_fv = utilities.create_trend_line(0, 35, 5, 10, min_val = 0, max_val = 35);
upward_ms = utilities.create_trend_line(60, 10, 10, 10, min_val = 0, max_val = 75);
values_keyed_by_user[this_user] = [];
for i in range(len(upward_fv)):
    values_keyed_by_user[this_user].append((upward_fv[i], upward_ms[i]));
    
## friend1 has downward trajectory
this_user = "friend1";
upward_fv = utilities.create_trend_line(35, 0, 10, 6, min_val = 0, max_val = 35);
upward_ms = utilities.create_trend_line(10, 60, 10, 6, min_val = 0, max_val = 75);
values_keyed_by_user[this_user] = [];
for i in range(len(upward_fv)):
    values_keyed_by_user[this_user].append((upward_fv[i], upward_ms[i]));
    
## friend2 has mixed trajectory
this_user = "friend2";
upward_fv = utilities.create_trend_line(10, 20, 20, 18, min_val = 0, max_val = 35);
upward_ms = utilities.create_trend_line(40, 20, 40, 18, min_val = 0, max_val = 75);
values_keyed_by_user[this_user] = [];
for i in range(len(upward_fv)):
    values_keyed_by_user[this_user].append((upward_fv[i], upward_ms[i]));
    
    
## friend3 has parabolic trajectory (smile sloped)
this_user = "friend3";
upward_fv = [];
upward_fv.extend(utilities.create_trend_line(25, 5, 10, 6, min_val = 0, max_val = 35));
upward_fv.extend(utilities.create_trend_line(5, 35, 5, 6, min_val = 0, max_val = 35));
upward_ms = [];
upward_ms.extend(utilities.create_trend_line(10, 60, 10, 6, min_val = 0, max_val = 50));
upward_ms.extend(utilities.create_trend_line(65, 5, 5, 6, min_val = 0, max_val = 50));
values_keyed_by_user[this_user] = [];
for i in range(len(upward_fv)):
    values_keyed_by_user[this_user].append((upward_fv[i], upward_ms[i]));
    
    
for user_key in values_keyed_by_user.keys():
    patient = openmrs_classes.User(users[user_key]["patient_id"]);
    creator = openmrs_classes.User(users[user_key]["creator_id"]);
    values = values_keyed_by_user[user_key];
    values.reverse(); ## important, otherwise trend will be backwardsf
    for index, value_pair in enumerate(values):
        variant_days_ago = (nutrition.time_interval_in_days)*index - 1 + randint(0, 3);  
        encounter = nutrition.return_encounter_with_metrics_for_user(value_pair[0], value_pair[1], variant_days_ago, patient = patient, creator = creator); ## add date_time
        encounters.append(encounter);
        encounter.print_out_all_values();
    
    
    
###############################################################
## output sql
###################################################################
sql = [];
for encounter in encounters:
    sql.extend(encounter.return_sql_to_record_encounter());
with open("results/add_history.sql", "w+") as f:
    f.write("DELETE FROM `obs` WHERE `encounter_id` > "+str(initial_max_encounter_id)+"; DELETE FROM `encounter` WHERE `encounter_id` > "+str(initial_max_encounter_id)+";\n")
    for line in sql:
        #print(line + "\n");
        f.write(line + "\n");
    f.write("\n");
## NOTE - user must find maximum encounter id on their own and define it. 