from time import gmtime, strftime
from datetime import datetime, timedelta
from random import randint


current_max_encounter_id = False;
def initial_max_encounter_id(initial_value):
    global current_max_encounter_id;
    current_max_encounter_id = initial_value;
def return_new_encounter_id():
    global current_max_encounter_id;
    if(current_max_encounter_id == False): 
        raise Exception("Please ensure you initialize the current maximum id");
    current_max_encounter_id += 1;
    return current_max_encounter_id;


def return_date_x_days_ago(days_to_subtract):
    d = (datetime.today() - timedelta(days=days_to_subtract)).strftime('%Y-%m-%d %H:%M:%S')
    return d;

def return_total_domain_for_metrics(metric_domains, concept_identifiers, map_concept_name_to_metric_group_function):
    ## generate statistics for user comfort
    metric_concepts_count = dict();
    for metric in sorted(metric_domains.keys()):
        metric_concepts_count[metric] = 0;
    for concept in concept_identifiers:
        metric = map_concept_name_to_metric_group_function(concept[0]);
        metric_concepts_count[metric] += 1;
    total_metric_domains = dict();
    for metric in sorted(metric_domains.keys()):
        this_metric_domain = metric_domains[metric];
        number_of_concepts = metric_concepts_count[metric];
        total_metric_domains[metric] = (this_metric_domain[0] * number_of_concepts, this_metric_domain[1] * number_of_concepts);
    return total_metric_domains;

def create_trend_line(start_val, fin_val, deviation_magnitude, n_points, min_val = False, max_val = False):
    vals = [];
    basic_slope = (fin_val - start_val)/float(n_points-1);
    for i in range(n_points):
        base_value = i * basic_slope + start_val;
        center_shift = deviation_magnitude/float(2);
        if(i == 0):
            #first point is special, can only deviate up
            deviation = randint(int(center_shift), deviation_magnitude);
        elif(i == n_points-1):
            # last point special, only deviate down
            deviation = randint(0, int(center_shift));
        else:
            deviation = randint(0, deviation_magnitude);
            
        value = int(base_value - center_shift + deviation);
        
        if(min_val != False and value < min_val): value = min_val;
        if(max_val != False and value > max_val): value = max_val;
            
        vals.append(value);
        
    return vals;