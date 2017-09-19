class Encounter_Type:
    def __init__(self, name, db_id):
        self.name = name;
        self.id = db_id;
        
class Concept:
    def __init__(self, name, hb_metric_group, db_id, data_type, domain = None):
        assert(type(name) is str);
        assert(type(hb_metric_group) is str); ## concept type = for example "RAPA1", "RAPA2" - used in set_total_value_to(value, hb_metric_group) since each concept_type is plotted seperatly
        assert(type(db_id) is str);
        assert(data_type is int); # or data_type is boolean or ... 
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
        self.set_value(value);
        
    def set_value(self, value):
        assert(type(value) is self.concept.type or value == "__MAX__"); ## ensure value is same as datatype of concept
        ## for integer valued concepts
        if(self.concept.type is int):
            if(value == "__MAX__"):
                self.value = self.concept.domain[1];
            else:
                if(value < self.concept.domain[0]):
                    #print("value ("+str(value)+") was below min value ("+str(self.concept.domain[0])+"), updated to min value.")
                    value = self.concept.domain[0];
                elif(value > self.concept.domain[1]):
                    #print("value ("+str(value)+") was above max value ("+str(self.concept.domain[1])+"), updated to max value.")
                    value = self.concept.domain[1];
                self.value = value;
    
class User:
    def __init__(self, db_id):
        self.db_id = db_id;
        
class Encounter:
    def __init__(self, encounter_type, observations, user):
        assert isinstance(user, User); 
        assert isinstance(encounter_type, Encounter_Type); 
        assert(type(observations) is list);
        for obs in observations: assert(isinstance(obs, Observation));
            
        self.encounter_type = encounter_type;
        self.observations = observations;
        
    def set_total_value_of_metric_to(self, hb_metric_group, value):
        assert(type(value) is int); ## since we need to deal with ints. The rest of the code has been structured to be able to deal with other datatypes, however.
        remaining_value = value;
        for obs in self.observations: 
            if(obs.concept.hb_metric_group == hb_metric_group):
                obs.set_value(remaining_value);
                remaining_value -= obs.value;
                ## note, dont break out after none remaining so that we can lower values
        
    
    def return_total_value_of(self, hb_metric_group):
        total_value = 0;
        for obs in self.observations: 
            if(obs.concept.hb_metric_group == hb_metric_group):
                total_value += obs.value;
        return total_value;
    
    def return_sql_to_record_encounter(self):
        ## record encounter of encounter type
        ## record observations
        return True;
    