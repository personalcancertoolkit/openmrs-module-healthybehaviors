import uuid

class Encounter_Type:
    def __init__(self, name, db_id):
        self.name = name;
        self.id = db_id;
        
class Concept:
    def __init__(self, name, hb_metric_group, db_id, data_type, domain = None):
        assert(type(name) is str);
        assert(type(hb_metric_group) is str); ## concept type = for example "RAPA1", "RAPA2" - used in set_total_value_to(value, hb_metric_group) since each concept_type is plotted seperatly
        assert(type(db_id) is str);
        assert(data_type is int or data_type is bool); ## we only handle booleans and ints right now 
        if(data_type is int):   ## for integers, ensure domain is tuple(min, max);
            assert(type(domain) is tuple)
            assert(type(domain[0]) is int and type(domain[1]) is int);
            assert(domain[0] <= domain[1] and len(domain) == 2)
        self.name = name;
        self.id = db_id;
        self.hb_metric_group = hb_metric_group;
        self.type = data_type;
        self.domain = domain;
        
class Observation:
    def __init__(self, concept, value):
        assert(isinstance(concept, Concept));
        self.concept = concept;
        self.set_value_as_int(value);
        self.uuid = str(uuid.uuid4());
        
    def set_value_as_int(self, value):
        if(self.concept.type is int): 
            if(value == "__MAX__"):
                self.set_value(self.concept.domain[1]); ## set to max
            else:
                return self.set_value(value);
            
        if(self.concept.type is bool):
            #print(self.concept.name + " -> " + str(value))
            if(value == False or value <= 0):
                self.set_value(False);
            else:
                self.set_value(True);
                
    def set_value(self, value):
        assert(type(value) is self.concept.type); ## ensure value is same as datatype of concept
        
        ## for integer valued concepts 
        if(self.concept.type is int):
            if(value < self.concept.domain[0]):
                #print("value ("+str(value)+") was below min value ("+str(self.concept.domain[0])+"), updated to min value.")
                value = self.concept.domain[0];
            elif(value > self.concept.domain[1]):
                #print("value ("+str(value)+") was above max value ("+str(self.concept.domain[1])+"), updated to max value.")
                value = self.concept.domain[1];
            self.value = value;
            
        ## for boolean valued concepts
        if(self.concept.type is bool):
            self.value = value; ## true or false;
    
class User:
    def __init__(self, db_id):
        self.id = str(db_id);
        
class Encounter:
    def __init__(self, encounter_type, observations, date, new_db_id, patient=False, creator=False):
        assert (type (date) is str); 
        assert isinstance(patient, User); 
        assert isinstance(creator, User); 
        assert isinstance(encounter_type, Encounter_Type); 
        assert(type(observations) is list);
        for obs in observations: assert(isinstance(obs, Observation));
            
        self.encounter_type = encounter_type;
        self.observations = observations;
        self.date = date;
        self.patient = patient;
        self.creator = creator;
        self.uuid = str(uuid.uuid4());
        self.id = str(new_db_id);
        
    def set_total_value_of_metric_to(self, hb_metric_group, value):
        assert(type(value) is int); ## values are set by ints
        remaining_value = value;
        for obs in self.observations: 
            if(obs.concept.hb_metric_group == hb_metric_group):
                obs.set_value_as_int(remaining_value);
                remaining_value -= obs.value;
                ## note, dont break out after none remaining so that we can lower values
        
    def print_out_all_values(self):
        for obs in self.observations: 
            print(obs.concept.name + " : " + str(obs.value));
        
        
        
    def return_total_value_of(self, hb_metric_group):
        total_value = 0;
        for obs in self.observations: 
            if(obs.concept.hb_metric_group == hb_metric_group):
                total_value += obs.value;
        return total_value;
    
    def return_sql_to_record_encounter(self):
        sql = [];
        
        ## record encounter of encounter type
        encounter_sql = "INSERT INTO `encounter` (`encounter_id`, `encounter_type`, `patient_id`, `location_id`, `form_id`, `encounter_datetime`, `creator`, `date_created`, `voided`, `voided_by`, `date_voided`, `void_reason`, `changed_by`, `date_changed`, `visit_id`, `uuid`) VALUES ('"+self.id+"', '"+self.encounter_type.id+"', '"+self.patient.id+"', NULL, NULL, '"+self.date+"', '"+self.creator.id+"', '"+self.date+"', '0', NULL, NULL, NULL, NULL, NULL, NULL, '"+self.uuid+"');";
        sql.append(encounter_sql);
        
        ## record observations
        for obs in self.observations:
            if(obs.concept.type is int):
                this_sql = "INSERT INTO `obs` (`obs_id`, `person_id`, `concept_id`, `encounter_id`, `order_id`, `obs_datetime`, `location_id`, `obs_group_id`, `accession_number`, `value_group_id`, `value_coded`, `value_coded_name_id`, `value_drug`, `value_datetime`, `value_numeric`, `value_modifier`, `value_text`, `value_complex`, `comments`, `creator`, `date_created`, `voided`, `voided_by`, `date_voided`, `void_reason`, `uuid`, `previous_version`, `form_namespace_and_path`) VALUES (NULL, '"+self.patient.id+"', '"+obs.concept.id+"', '"+self.id+"', NULL, '"+self.date+"', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '"+str(obs.value)+"', NULL, NULL, '"+self.creator.id+"', '"+self.date+"', '0', NULL, NULL, NULL, '"+obs.uuid+"', NULL, NULL);"
            if(obs.concept.type is bool):
                if(obs.value == True): concept_id = 1;
                if(obs.value == False): concept_id = 2;
                this_sql = "INSERT INTO `obs` (`obs_id`, `person_id`, `concept_id`, `encounter_id`, `order_id`, `obs_datetime`, `location_id`, `obs_group_id`, `accession_number`, `value_group_id`, `value_coded`, `value_coded_name_id`, `value_drug`, `value_datetime`, `value_numeric`, `value_modifier`, `value_text`, `value_complex`, `comments`, `creator`, `date_created`, `voided`, `voided_by`, `date_voided`, `void_reason`, `uuid`, `previous_version`, `form_namespace_and_path`) VALUES (NULL, '"+self.patient.id+"', '"+obs.concept.id+"', '"+self.id+"', NULL, '"+self.date+"', NULL, NULL, NULL, NULL, "+str(concept_id)+", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '"+self.creator.id+"', '"+self.date+"', '0', NULL, NULL, NULL, '"+obs.uuid+"', NULL, NULL);"
                
            sql.append(this_sql);
        
        ## record observations
        return sql;
    