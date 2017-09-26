import openmrs_classes;
import utilities;

## define identifiers for encounter_type and releveant concepts
encounter_type_identifier = ("nutrition_form", "21")
concept_identifiers = [ ## note, the id's of the concepts may change from DB to DB depending on when first the concepts were created - make sure that you double check.
    ("NUTRI_FV_q1", "163141"),
    ("NUTRI_FV_q2", "163142"),
    ("NUTRI_FV_q3", "163143"),
    ("NUTRI_FV_q4", "163144"),
    ("NUTRI_FV_q5", "163145"),
    ("NUTRI_FV_q6", "163146"),
    ("NUTRI_FV_q7", "163147"),
    ("NUTRI_MS_q1", "163148"),
    ("NUTRI_MS_q2", "163149"),
    ("NUTRI_MS_q3", "163150"),
    ("NUTRI_MS_q4", "163151"),
    ("NUTRI_MS_q5", "163152"),
    ("NUTRI_MS_q6", "163153"),
    ("NUTRI_MS_q7", "163154"),
    ("NUTRI_MS_q8", "163155"),
    ("NUTRI_MS_q9", "163156"),
    ("NUTRI_MS_q10", "163157"),
    ("NUTRI_MS_q11", "163158"),
    ("NUTRI_MS_q12", "163159"),
    ("NUTRI_MS_q13", "163160"),
    ("NUTRI_MS_q14", "163161"),
    ("NUTRI_MS_q15", "163162"),
];
metric_domains = dict({
    "FV" : (0, 5),
    "MS" : (0, 5),
})
time_interval_in_days = 7;
    

def map_concept_name_to_metric_group(concept_name):
    metric_group_parts = concept_name.split("_");
    base_part = metric_group_parts[1];                     
    return base_part;

def print_total_domains():
    total_domains = utilities.return_total_domain_for_metrics(metric_domains, concept_identifiers, map_concept_name_to_metric_group);
    for metric in sorted(total_domains.keys()):
        print(metric + " : " + str(total_domains[metric]));

def return_encounter_with_metrics_for_user(FV_value, MS_value, days_ago, patient = False, creator = False):

    ## build encounter_type
    encounter_type = openmrs_classes.Encounter_Type(name=encounter_type_identifier[0], db_id=encounter_type_identifier[1]);

    ## build zero valued observations from concept_identifiers
    observations = [];
    for i, concept in enumerate(concept_identifiers):
        metric = map_concept_name_to_metric_group(concept[0]);
        domain = metric_domains[metric];
        concept = openmrs_classes.Concept(name=concept[0], hb_metric_group=metric, db_id=concept[1], data_type = int, domain=domain);
        obs = openmrs_classes.Observation(concept, 0);
        observations.append(obs);
        
    ## retreive date
    encounter_date = utilities.return_date_x_days_ago(days_ago);

    ## build encounter 
    encounter = openmrs_classes.Encounter(encounter_type, observations, encounter_date, utilities.return_new_encounter_id(), patient = patient, creator = creator);
    encounter.set_total_value_of_metric_to("FV", FV_value);
    encounter.set_total_value_of_metric_to("MS", MS_value); 
    return encounter;

