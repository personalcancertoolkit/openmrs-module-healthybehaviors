import openmrs_classes;
import utilities;

## define identifiers for encounter_type and releveant concepts
encounter_type_identifier = ("exercise_form", "20")
concept_identifiers = [ ## note, the id's of the concepts may change from DB to DB depending on when first the concepts were created - make sure that you double check.
    ("RAPA1_q1", "163163"),
    ("RAPA1_q2", "163164"),
    ("RAPA1_q3", "163165"),
    ("RAPA1_q4", "163166"),
    ("RAPA1_q5", "163167"),
    ("RAPA1_q6", "163168"),
    ("RAPA1_q7", "163169"),
    ("RAPA2", "163170")
];
metric_domains = dict({
    "RAPA0" : (0, 0), ## skipped parts of RAPA1, ignored when setting value since this enables propper mapping
    "RAPA1" : (0, 1),
    "RAPA2" : (0, 4),
})
time_interval_in_days = 30;
    

def map_concept_name_to_metric_group(concept_name):
    metric_group_parts = concept_name.split("_");
    base_part = metric_group_parts[0];                     # q1 = 0, q2=q3, q4=q5,  q6=q7
    if(base_part == "RAPA1" and (metric_group_parts[1]) in ["q1","q2", "q4", "q6"]): return "RAPA0"; ## dont use these to calculate total value since they map to "q"+str(i+1)
                                                                                                          ## see exercise/encounter/class.js for more info
    return base_part;

def print_total_domains():
    total_domains = utilities.return_total_domain_for_metrics(metric_domains, concept_identifiers, map_concept_name_to_metric_group);
    for metric in sorted(total_domains.keys()):
        print(metric + " : " + str(total_domains[metric]));

def return_encounter_with_metrics_for_user(RAPA1_value, RAPA2_value, days_ago, patient = False, creator = False):

    ## build encounter_type
    encounter_type = openmrs_classes.Encounter_Type(name=encounter_type_identifier[0], db_id=encounter_type_identifier[1]);

    ## build zero valued observations from concept_identifiers
    observations = [];
    for i, concept in enumerate(concept_identifiers):
        metric = map_concept_name_to_metric_group(concept[0]);
        domain = metric_domains[metric];
        if(metric == "RAPA2"): 
            data_type = int;
        else:
            data_type = bool;
        concept = openmrs_classes.Concept(name=concept[0], hb_metric_group=metric, db_id=concept[1], data_type = data_type, domain=domain);
        obs = openmrs_classes.Observation(concept, 0);
        observations.append(obs);
        
    ## retreive date
    encounter_date = utilities.return_date_x_days_ago(days_ago);

    ## scale values
    if(RAPA2_value > 1): RAPA2_value = RAPA2_value + 1;  ## skips 2, since both 2 and one are mapped to underactive
    ## note, rapa1 value is currently scaled using RAPA0 "hack". would be more legible if it were explicitly mapped here as well. TODO
    
    ## build encounter 
    encounter = openmrs_classes.Encounter(encounter_type, observations, encounter_date, utilities.return_new_encounter_id(), patient = patient, creator = creator);
    encounter.set_total_value_of_metric_to("RAPA1", RAPA1_value);
    encounter.set_total_value_of_metric_to("RAPA2", RAPA2_value); 
    return encounter;

