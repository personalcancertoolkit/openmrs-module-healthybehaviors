from data_formatting import exercise
from data_formatting import openmrs_classes
#from data_formatting import exercise

user = openmrs_classes.User("7");
#exercise.print_total_domains();
encounter = exercise.return_encounter_with_metrics_for_user(3, 2, user); ## add date_time
print(encounter.return_total_value_of("RAPA1"))
print(encounter.return_total_value_of("RAPA2"))

