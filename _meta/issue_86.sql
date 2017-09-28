## remove encounters from the last time increment for current user for exercise and nutrition

## test data selection:
SELECT encounter.encounter_id, encounter.encounter_type, encounter.patient_id, encounter.encounter_datetime, obs.obs_id, obs.encounter_id, obs.concept_id FROM `encounter`, `obs` WHERE ((`encounter`.`encounter_datetime` > DATE_SUB(NOW(), INTERVAL 31 day) AND `encounter`.`encounter_type` = 20) OR (`encounter`.`encounter_datetime` > DATE_SUB(NOW(), INTERVAL 8 day) AND `encounter`.`encounter_type` = 21)) AND `encounter`.`encounter_id` = `obs`.`encounter_id` AND `encounter`.`patient_id` = 48;

## conduct removal of the appropriate data
SET FOREIGN_KEY_CHECKS=0;
DELETE `obs`, `encounter` FROM `encounter` INNER JOIN `obs` WHERE ((`encounter`.`encounter_datetime` > DATE_SUB(NOW(), INTERVAL 31 day) AND `encounter`.`encounter_type` = 20) OR (`encounter`.`encounter_datetime` > DATE_SUB(NOW(), INTERVAL 8 day) AND `encounter`.`encounter_type` = 21)) AND `encounter`.`encounter_id` = `obs`.`encounter_id` AND `encounter`.`patient_id` = 48
SET FOREIGN_KEY_CHECKS=1;